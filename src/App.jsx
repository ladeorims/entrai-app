// src/App.jsx

/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Search, LayoutDashboard, DollarSign, Bot, Megaphone, Briefcase, Settings, LogOut, ChevronLeft, ChevronRight, Sun, Star, Moon, Bell, AlertTriangle, XCircle, ShieldCheck, Users, Menu, BarChart3  } from 'lucide-react';
import NavItem from './components/layout/NavItem';
import AnimatedLogo from './components/AnimatedLogo';
import OnboardingModal from './components/OnboardingModal';
import UpgradeModal from './components/UpgradeModal';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import SalesDashboard from './pages/SalesDashboard';
import VirtualAssistantDashboard from './pages/VirtualAssistantDashboard';
import MarketingDashboard from './pages/MarketingDashboard';
import FinanceDashboard from './pages/FinanceDashboard';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboard from './pages/AdminDashboard';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CRMDashboard from './pages/CRMDashboard';
import ClientProfitabilityDashboard from './pages/ClientProfitabilityDashboard';
import FeaturesPage from './pages/public/FeaturesPage';
import PricingPage from './pages/public/PricingPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import AboutPage from './pages/public/AboutPage';
import CareersPage from './pages/public/CareersPage';
import ContactPage from './pages/public/ContactPage';
import PrivacyPage from './pages/public/PrivacyPage';
import TermsPage from './pages/public/TermsPage';
import SecurityPage from './pages/public/SecurityPage';
import { IntakeFormPage } from './pages/public/IntakeFormPage';

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
    const [publicPageView, setPublicPageView] = useState('Landing');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
    const [isPublicFormView, setIsPublicFormView] = useState(false);


    useEffect(() => {
        if (window.location.pathname.startsWith('/form/')) {
        setIsPublicFormView(true);
    }
        const urlParams = new URLSearchParams(window.location.search);
        if (window.location.pathname.includes('/reset-password') && urlParams.has('token')) {
            setIsResetPasswordView(true);
        } else if (urlParams.get('verified') === 'true') {
            setPublicPageView('Auth'); // Use public page view for auth
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
            // Public view respects system preference for dark mode
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
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
                    if (!user) fetchUserProfile(currentToken);
                    if (activeView === 'Landing' || activeView === 'Auth' || !isLoggedIn) {
                        setActiveView('Dashboard');
                    }
                }
            } catch (error) { 
                console.error("Invalid token found:", error);
                handleLogout(); 
            }
        }
    }, [activeView, fetchNotifications, user, isLoggedIn]);

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
        setPublicPageView('Landing');
        setActiveView('Landing');
    };

    const handleToggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleLaunchApp = () => setPublicPageView('Auth');
    const handleStartTrial = () => setPublicPageView('Auth');

   const handleSelectPlan = async (plan) => {
        if (!isLoggedIn) {
            setSelectedPlan(plan);
            setPublicPageView('Auth');
            return;
        }

    setIsCreatingCheckout(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subscriptions/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ planName: plan })
            });

            if (!response.ok) {
                throw new Error('Failed to create payment session.');
            }

            const session = await response.json();
            window.location.href = session.url; 
        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert("Could not initiate payment. Please try again later.");
            setIsCreatingCheckout(false);
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
                    // The unused 'decoded' variable has been removed from here.
                    const userProfile = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, { headers: { 'Authorization': `Bearer ${data.token}` } }).then(res => res.json());
                    setUser(userProfile);
                    setToken(data.token);
                    setIsLoggedIn(true);
                    if (selectedPlan) {
                        setActiveView('Payment');
                    } else {
                        setActiveView('Dashboard');
                    }
                } else if (mode === 'signup') {
                    setAuthMessage({ type: 'success', text: data.message });
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

    const handlePublicPageView = (page) => {
        setPublicPageView(page);
        window.scrollTo(0, 0);
    };

    const renderView = () => {
        if (isPublicFormView) {
        return <IntakeFormPage />;
    }

        if (isResetPasswordView) {
            return <ResetPasswordPage setActiveView={setPublicPageView} setAuthMessage={setAuthMessage} />;
        }

        if (!isLoggedIn) {
            switch (publicPageView) {
                case 'Features': return <FeaturesPage onStartTrial={handleStartTrial} onLaunchApp={handleLaunchApp} setActiveView={handlePublicPageView} />;
                case 'Pricing': return <PricingPage onSelectPlan={handleSelectPlan} onStartTrial={handleStartTrial} onLaunchApp={handleLaunchApp} setActiveView={handlePublicPageView} />;
                case 'HowItWorks': return <HowItWorksPage onStartTrial={handleStartTrial} onLaunchApp={handleLaunchApp} setActiveView={handlePublicPageView} />;
                case 'About': return <AboutPage onStartTrial={handleStartTrial} onLaunchApp={handleLaunchApp} setActiveView={handlePublicPageView} />;
                case 'Careers': return <CareersPage onStartTrial={handleStartTrial} onLaunchApp={handleLaunchApp} setActiveView={handlePublicPageView} />;
                case 'Contact': return <ContactPage onStartTrial={handleStartTrial} onLaunchApp={handleLaunchApp} setActiveView={handlePublicPageView} />;
                case 'Privacy': return <PrivacyPage onStartTrial={handleStartTrial} onLaunchApp={handleLaunchApp} setActiveView={handlePublicPageView} />;
                case 'Terms': return <TermsPage onStartTrial={handleStartTrial} onLaunchApp={handleLaunchApp} setActiveView={handlePublicPageView} />;
                case 'Security': return <SecurityPage onStartTrial={handleStartTrial} onLaunchApp={handleLaunchApp} setActiveView={handlePublicPageView} />;
                case 'Auth': return <AuthPage onAuth={handleAuth} isLoading={isLoading} authMessage={authMessage} setAuthMessage={setAuthMessage} setActiveView={handlePublicPageView} />;
                default: return <LandingPage onLaunchApp={handleLaunchApp} onStartTrial={handleStartTrial} onSelectPlan={handleSelectPlan} setActiveView={handlePublicPageView} />; // Ensure setActiveView is passed
            }
        } else {
            const sidebarContent = (
                <>
                    <div className="flex items-center p-4 h-[89px] border-b border-slate-200 dark:border-slate-800">
                        <a href="#" onClick={() => setActiveView('Dashboard')} className="flex items-center gap-2 w-full">
                            <AnimatedLogo isCollapsed={isSidebarCollapsed} />
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
                            <NavItem icon={BarChart3} label="Profitability" view="Profitability" activeView={activeView} isCollapsed={isSidebarCollapsed} setActiveView={setActiveView} />
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
                </>
            );
            
            let currentView;
            switch (activeView) {
                case 'Dashboard': currentView = <Dashboard token={token} user={user} />; break;
                case 'Sales': currentView = <SalesDashboard token={token} setActiveView={setActiveView} />; break;
                case 'CRM': currentView = <CRMDashboard token={token} />; break;
                case 'Virtual Assistant': currentView = <VirtualAssistantDashboard token={token} />; break;
                case 'Marketing': currentView = <MarketingDashboard token={token} />; break;
                case 'Finance': currentView = <FinanceDashboard token={token} user={user} />; break;
                case 'Profile': currentView = <ProfilePage user={user} setUser={setUser} token={token} setActiveView={setActiveView} onSelectPlan={handleSelectPlan} />; break;
                case 'Settings': currentView = <SettingsPage user={user} />; break;
                case 'Admin': currentView = <AdminDashboard token={token} />; break;
                case 'Profitability': currentView = <ClientProfitabilityDashboard token={token} />; break;
                default: currentView = <Dashboard token={token} user={user} />;
            }

            return (
                <div className={`flex h-screen font-sans bg-primary-bg text-text-primary dark:bg-dark-primary-bg dark:text-dark-text-primary`}> 
                    {isUpgradeModalVisible && <UpgradeModal onSelectPlan={handleSelectPlan} onClose={() => setIsUpgradeModalVisible(false)} />}
                    {isOnboardingVisible && <OnboardingModal user={user} token={token} onComplete={handleOnboardingComplete} />}
                    <aside className={`hidden md:flex flex-col bg-card-bg/80 dark:bg-dark-card-bg/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
                        {sidebarContent}
                        <button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="absolute -right-3 top-8 bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white p-1.5 rounded-full shadow-lg hover:opacity-90 transition-opacity hidden md:block">
                            {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </button>
                    </aside>

                    {isMobileMenuOpen && (
                        <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setIsMobileMenuOpen(false)}>
                            <aside className="fixed top-0 left-0 h-full w-64 flex flex-col bg-card-bg/95 dark:bg-dark-card-bg/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 z-50">
                                {sidebarContent}
                            </aside>
                        </div>
                    )}

                    <main className="flex-1 flex flex-col overflow-hidden">
                        <header className={`flex items-center justify-between p-6 bg-card-bg/80 dark:bg-dark-card-bg/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800`}>
                            <div className="flex items-center gap-4">
                                <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}><Menu /></button>
                                <div className="relative hidden sm:block">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
                                    <input type="text" placeholder="Search..." className={`w-full bg-slate-100 dark:bg-dark-primary-bg border-transparent rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-start`}/>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={handleToggleTheme} className={`p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors`}>
                                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                                </button>
                                <div className="relative" ref={notificationRef}>
                                    <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className={`p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors`}>
                                        <Bell size={20} />
                                        {notifications.length > 0 && (
                                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-dark-card-bg" />
                                        )}
                                    </button>
                                    {isNotificationsOpen && (
                                        <div className={`absolute right-0 mt-2 w-80 bg-card-bg dark:bg-dark-card-bg border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20`}>
                                            <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                                                <h3 className={`font-semibold`}>Notifications</h3>
                                                <button onClick={() => setIsNotificationsOpen(false)} className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"><XCircle size={20} /></button>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length > 0 ? notifications.map(notif => (
                                                    <div key={notif.id} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer border-b border-slate-200 dark:border-slate-800">...</div>
                                                )) : <p className="text-center text-text-secondary py-8">No new notifications.</p>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setActiveView('Profile')} className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end flex items-center justify-center text-white font-bold transition-transform transform hover:scale-110">
                                    {user?.profilePictureUrl ? (<img src={user.profilePictureUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />) : (getInitial(user))}
                                </button>
                            </div>
                        </header>
                        <div className="flex-1 overflow-y-auto p-8">
                            {currentView}
                        </div>
                    </main>
                </div>
            );
        }
    };

    return <>{isCreatingCheckout && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-[999]">
                    <Loader2 className="animate-spin text-white" size={48} />
                    <p className="text-white mt-4">Redirecting to secure payment...</p>
                </div>
            )}{renderView()}</>;
};

export default App;