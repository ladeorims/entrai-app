/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Search, LayoutDashboard, DollarSign, Bot, Megaphone, Briefcase, Settings, LogOut, ChevronLeft, ChevronRight, Sun, Star, Moon, Bell, AlertTriangle, XCircle, ShieldCheck, Users } from 'lucide-react';
import NavItem from './components/layout/NavItem';
import AnimatedLogo from './components/AnimatedLogo';
import OnboardingModal from './components/OnboardingModal';
import UpgradeModal from './components/UpgradeModal';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PaymentPage from './pages/PaymentPage';
import Dashboard from './pages/Dashboard';
import SalesDashboard from './pages/SalesDashboard';
import VirtualAssistantDashboard from './pages/VirtualAssistantDashboard';
import MarketingDashboard from './pages/MarketingDashboard';
import FinanceDashboard from './pages/FinanceDashboard';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboard from './pages/AdminDashboard';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CRMDashboard from './pages/CRMDashboard'; // NEW: Import the CRM dashboard

const App = () => {
    const [activeView, setActiveView] = useState('Landing');
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(false);
    const [authMessage, setAuthMessage] = useState({ type: '', text: '' });
    const [notifications, setNotifications] = useState([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationRef = useRef(null);
    const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
    const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);
    const [isResetPasswordView, setIsResetPasswordView] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (window.location.pathname.includes('/reset-password') && urlParams.has('token')) {
            setIsResetPasswordView(true);
        } else if (urlParams.get('verified') === 'true') {
            setActiveView('Auth');
            setAuthMessage({ type: 'success', text: 'Email verified! You can now log in.' });
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);



    useEffect(() => {
        const root = window.document.documentElement;
        if (isLoggedIn) {
            if (isDarkMode) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode, isLoggedIn]);

    useEffect(() => {
        if (user && user.isOnboarded === false) {
            setIsOnboardingVisible(true);
        }
    }, [user]);

    const fetchNotifications = useCallback(async (currentToken) => {
        if (!currentToken) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications`, {
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }, []);
    
    useEffect(() => {
        const fetchUserProfile = async (currentToken) => {
            if (currentToken) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, { headers: { 'Authorization': `Bearer ${currentToken}` } });
                    if (response.ok) {
                        const profileData = await response.json();
                        setUser(profileData);
                        fetchNotifications(currentToken);
                    } else {
                        handleLogout();
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                    handleLogout();
                }
            }
        };

        const currentToken = localStorage.getItem('token');
        if (currentToken) {
            try {
                const decodedToken = jwtDecode(currentToken);
                if (decodedToken.exp * 1000 < Date.now()) {
                    handleLogout();
                } else {
                    setIsLoggedIn(true);
                    setToken(currentToken);
                    fetchUserProfile(currentToken);
                    if (activeView === 'Landing' || activeView === 'Auth') {
                        setActiveView('Dashboard');
                    }
                }
            } catch (error) { 
                console.error("Invalid token found:", error);
                handleLogout(); 
            }
        } else {
            if (activeView !== 'Landing' && activeView !== 'Auth') {
                setActiveView('Landing');
            }
        }
    }, [activeView, fetchNotifications]);

    const handleOnboardingComplete = (updatedUser) => {
        setUser(updatedUser);
        setIsOnboardingVisible(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
        setNotifications([]);
        setActiveView('Landing');
    };

    const handleToggleTheme = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        setIsDarkMode(newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
    };

    const handleLaunchApp = () => setActiveView('Auth');
    const handleStartTrial = () => setActiveView('Auth');

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        if (isLoggedIn) {
            setActiveView('Payment');
        } else {
            setActiveView('Auth');
        }
    };
    
    const handleAuth = async (authData, mode) => {
        setIsLoading(true);
        setAuthMessage({ type: '', text: '' });
        const url = mode === 'login' ? `${import.meta.env.VITE_API_BASE_URL}/api/login` : `${import.meta.env.VITE_API_BASE_URL}/api/signup`;
        try {
            const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(authData) });
            const data = await response.json();
            if (response.ok) {
                if (mode === 'login' && data.token) {
                    localStorage.setItem('token', data.token);
                    setToken(data.token);
                    setIsLoggedIn(true);
                    if (selectedPlan) {
                        setActiveView('Payment');
                    } else {
                        setActiveView('Dashboard');
                    }
                } else if (mode === 'signup') {
                    setAuthMessage({ type: 'success', text: data.message + " Please log in to continue." });
                }
            } else {
                setAuthMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            console.error('Network error during authentication:', error);
            setAuthMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const getInitial = (user) => {
        if (user && user.profilePictureUrl) return null;
        if (user && user.name) return user.name.charAt(0).toUpperCase();
        if (user && user.email) return user.email.charAt(0).toUpperCase();
        return 'A';
    };

    const renderView = () => {
        if (!isLoggedIn || !token) {
            switch (activeView) {
                case 'Auth': return <AuthPage onAuth={handleAuth} isLoading={isLoading} authMessage={authMessage} />;
                default: return <LandingPage onLaunchApp={handleLaunchApp} onStartTrial={handleStartTrial} onSelectPlan={handleSelectPlan} />;
            }
          } else {
            switch (activeView) {
                case 'Dashboard': return <Dashboard setActiveView={setActiveView} token={token} user={user} />;
                case 'Sales': return <SalesDashboard token={token} setActiveView={setActiveView} />;
                case 'CRM': return <CRMDashboard token={token} />; // NEW: Render the CRM dashboard
                case 'Virtual Assistant': return <VirtualAssistantDashboard token={token} />;
                case 'Marketing': return <MarketingDashboard token={token} />;
                case 'Finance': return <FinanceDashboard token={token} user={user} />;
                case 'Profile': return <ProfilePage user={user} setUser={setUser} token={token} setActiveView={setActiveView} onSelectPlan={handleSelectPlan} />;
                case 'Settings': return <SettingsPage user={user} />;
                case 'Payment': return <PaymentPage plan={selectedPlan} token={token} />; 
                case 'Admin': return <AdminDashboard token={token} />;
                default: return <Dashboard setActiveView={setActiveView} token={token} user={user} />;
            }
        }
    };

    if (isResetPasswordView) {
        return <ResetPasswordPage setActiveView={setActiveView} setAuthMessage={setAuthMessage} />;
    }


     if (isLoggedIn) {
            return (
            
            <div className={`flex h-screen font-sans bg-primary-bg text-text-primary dark:bg-dark-primary-bg dark:text-dark-text-primary`}> 
                    {isUpgradeModalVisible && <UpgradeModal onSelectPlan={handleSelectPlan} onClose={() => setIsUpgradeModalVisible(false)} />}                   
                     {isOnboardingVisible && <OnboardingModal user={user} token={token} onComplete={handleOnboardingComplete} />}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 blur-3xl"></div>
                    </div>
                <aside className={`flex flex-col bg-card-bg/80 dark:bg-dark-card-bg/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
                    <div className="flex items-center p-4 h-[89px] border-b border-slate-200 dark:border-slate-800">
                        <a href="#" onClick={() => setActiveView('Dashboard')} className="flex items-center gap-2 w-full">
                            <AnimatedLogo isCollapsed={isSidebarCollapsed} />                            
                            {/* {!isSidebarCollapsed && <h1 className="text-2xl font-bold font-logo hero-gradient-text tracking-wider whitespace-nowrap">Entrai</h1>} */}
                        </a>
                    </div>

                    <nav className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-2">
                           <NavItem icon={LayoutDashboard} label="Dashboard" view="Dashboard" activeView={activeView} isCollapsed={isSidebarCollapsed} setActiveView={setActiveView} />
                           <NavItem icon={Users} label="CRM" view="CRM" activeView={activeView} isCollapsed={isSidebarCollapsed} setActiveView={setActiveView} />
                           <NavItem icon={DollarSign} label="Sales" view="Sales" activeView={activeView} isCollapsed={isSidebarCollapsed} setActiveView={setActiveView} />
                           <NavItem icon={Bot} label="Assistant" view="Virtual Assistant" activeView={activeView} isCollapsed={isSidebarCollapsed} setActiveView={setActiveView} />
                           <NavItem icon={Megaphone} label="Marketing" view="Marketing" activeView={activeView} isCollapsed={isSidebarCollapsed} setActiveView={setActiveView} />
                           <NavItem icon={Briefcase} label="Finance" view="Finance" activeView={activeView} isCollapsed={isSidebarCollapsed} setActiveView={setActiveView} />
                        </ul>
                    </nav>

                    <div className="p-4">
                        {!isSidebarCollapsed && user && user.planType !== 'team' && (
                             <div className="p-4 mb-4 bg-slate-100 dark:bg-dark-primary-bg rounded-lg text-center">
                                 <h4 className="font-bold">Unlock More Power</h4>
                                 <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1 mb-3">Upgrade your plan to access premium features.</p>
                                 <button onClick={() => setIsUpgradeModalVisible(true)} className="w-full bg-gradient-to-r from-accent-start to-accent-end text-white font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:opacity-90">
                                    <Star size={14}/> Upgrade Now
                                 </button>
                             </div>
                        )}
                        <ul className="space-y-2">
                            {user && user.role === 'admin' && (
                                <NavItem icon={ShieldCheck} label="Admin" view="Admin" activeView={activeView} isCollapsed={isSidebarCollapsed} setActiveView={setActiveView} />
                            )}
                            <NavItem icon={Settings} label="Settings" view="Settings" activeView={activeView} isCollapsed={isSidebarCollapsed} setActiveView={setActiveView} />
                            <NavItem icon={LogOut} label="Logout" view="Logout" activeView={activeView} isCollapsed={isSidebarCollapsed} setActiveView={handleLogout} />
                        </ul>
                    </div>
                    <button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="absolute -right-3 top-8 bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white p-1.5 rounded-full shadow-lg hover:opacity-90 transition-opacity">
                        {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </aside>
                <main className="flex-1 flex flex-col overflow-hidden">
                    <header className={`flex items-center justify-between p-6 ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white/80 border-slate-200'} backdrop-blur-sm border-b`}>
                        <div className="relative w-1/3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
                            <input type="text" placeholder="Search deals, invoices, or tasks..." className={`w-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-slate-100 text-slate-900'} border-transparent rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}/>                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={handleToggleTheme} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-300/50'} transition-colors`}>
                                {/* CHANGE: Swapped Sun and Moon icons to reflect the CURRENT theme */}
                                {isDarkMode ? <Moon size={20} className="text-gray-200" /> : <Sun size={20} className="text-gray-700" />}
                            </button>
                            <div className="relative" ref={notificationRef}>
                                <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-300/50'} transition-colors`}>
                                    <Bell size={20} />
                                    {notifications.length > 0 && (
                                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-900" />
                                    )}
                                </button>
                                {isNotificationsOpen && (
                                    <div className={`absolute right-0 mt-2 w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg z-20`}>
                                        <div className="p-4 flex justify-between items-center">
                                            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                                            <button onClick={() => setIsNotificationsOpen(false)} className="text-gray-400 hover:text-white"><XCircle size={20} /></button>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map(notif => (
                                                    <div key={notif.id} onClick={() => { setActiveView('Virtual Assistant'); setIsNotificationsOpen(false); }} className={`px-4 py-3 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <AlertTriangle size={20} className={notif.type === 'overdue' ? 'text-red-400' : 'text-yellow-400'} />
                                                            <div>
                                                                <p className="text-sm font-medium">{notif.title}</p>
                                                                <p className="text-xs text-gray-400">{notif.type === 'overdue' ? 'Overdue' : 'Due Today'} - {new Date(notif.due_date).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-gray-400 py-4">No new notifications.</p>
                                            )}
                                        </div>
                                        <div className={`p-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <button onClick={() => setNotifications([])} className="text-sm text-purple-400 w-full text-center hover:text-purple-300">Mark all as read</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setActiveView('Profile')} className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold transition-transform transform hover:scale-110">
                                {user?.profilePictureUrl ? (
                                    <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    getInitial(user)
                                )}
                            </button>
                        </div>
                    </header>
                    <div className="flex-1 overflow-y-auto p-8">
                        {renderView()}
                    </div>
                </main>
                <style>{`  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');
                    .font-logo { font-family: 'Poppins', sans-serif; }.hero-gradient-text { background: linear-gradient(90deg, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`}</style>
            </div>
            
            
        );
    } else {
        return <>{renderView()}<style>
            {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); .font-sans { font-family: 'Inter', sans-serif; } .hero-gradient-text { background: linear-gradient(90deg, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }`}
            </style>
            </>;
    }
};

export default App;