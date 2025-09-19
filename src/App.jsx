/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Search, LayoutDashboard, DollarSign, Bot, Megaphone, Briefcase, Settings, LogOut, ChevronLeft, ChevronRight, Sun, Star, Moon, Bell, XCircle, ShieldCheck, Users, Menu, BarChart3, Loader2 } from 'lucide-react';
import { AuthContext, useAuth } from './AuthContext';

import WaitlistPage from './pages/WaitlistPage'; 
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
import BrandedLoader from './components/BrandedLoader';
import TeamPage from './pages/TeamPage';

// =========================================================================
// AuthProvider for global state management
// =========================================================================
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);
    const [authMessage, setAuthMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsLoading(false);
        navigate('/');
    }, [navigate]);

    const fetchUserProfile = useCallback(async (currentToken) => {
        if (!currentToken) {
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, { headers: { 'Authorization': `Bearer ${currentToken}` } });
            if (response.ok) {
                const profileData = await response.json();
                setUser(profileData);
                if (['/', '/auth', '/pricing', '/features', '/how-it-works'].includes(location.pathname)) {
                    navigate('/dashboard');
                }
            } else {
                handleLogout();
            }
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            handleLogout();
        } finally {
            setIsLoading(false);
        }
    }, [location.pathname, navigate, handleLogout]);

    useEffect(() => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
            try {
                const decodedToken = jwtDecode(currentToken);
                if (decodedToken.exp * 1000 < Date.now()) {
                    handleLogout();
                } else {
                    setToken(currentToken);
                    if (!user) fetchUserProfile(currentToken);
                }
            } catch (error) {
                console.error("Invalid token found:", error);
                handleLogout();
            }
        } else {
            setIsLoading(false);
        }
    }, [user, fetchUserProfile, handleLogout]);

    const handleLogin = async (credentials) => {
        setIsLoading(true);
        setAuthMessage({ type: '', text: '' });
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            if (response.ok && data.token) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                fetchUserProfile(data.token);
                navigate('/dashboard');
            } else {
                setAuthMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            console.error('Network error during login:', error);
            setAuthMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (authData) => {
        setIsLoading(true);
        setAuthMessage({ type: '', text: '' });
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authData)
            });
            const data = await response.json();
            if (response.ok) {
                setAuthMessage({ type: 'success', text: data.message });
                navigate('/auth');
            } else {
                setAuthMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            console.error('Network error during signup:', error);
            setAuthMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        token,
        isLoading,
        authMessage,
        setAuthMessage,
        handleLogin,
        handleSignup,
        handleLogout,
        fetchUserProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


// =========================================================================
// Private Layout
// =========================================================================
const PrivateLayout = ({ children }) => {
    const { user, handleLogout, token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationRef = useRef(null);
    const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
 
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode]);
 
    const fetchNotifications = useCallback(async () => {
        if (!token) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }, [token]);
 
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);
 
    const getInitial = (u) => {
        if (!u) return 'A';
        if (u.profilePictureUrl) return null;
        if (u.name) return u.name.charAt(0).toUpperCase();
        if (u.email) return u.email.charAt(0).toUpperCase();
        return 'A';
    };
 
    const sidebarContent = (
        <>
            <div className="flex items-center p-4 h-[89px] border-b border-slate-200 dark:border-slate-800">
                <a href="/dashboard" className="flex items-center gap-2 w-full">
                    <AnimatedLogo isCollapsed={isSidebarCollapsed} />
                </a>
            </div>
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                    <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" isCollapsed={isSidebarCollapsed} />
                    <NavItem icon={Users} label="CRM" to="/crm" isCollapsed={isSidebarCollapsed} />
                    <NavItem icon={DollarSign} label="Sales" to="/sales" isCollapsed={isSidebarCollapsed} />
                    <NavItem icon={Bot} label="Assistant" to="/assistant" isCollapsed={isSidebarCollapsed} />
                    <NavItem icon={Megaphone} label="Marketing" to="/marketing" isCollapsed={isSidebarCollapsed} />
                    <NavItem icon={Briefcase} label="Finance" to="/finance" isCollapsed={isSidebarCollapsed} />
                    <NavItem icon={BarChart3} label="Profitability" to="/profitability" isCollapsed={isSidebarCollapsed} />
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
                        <NavItem icon={ShieldCheck} label="Admin" to="/admin" isCollapsed={isSidebarCollapsed} />
                    )}
                    {user && user.planType === 'team' && (
                        <NavItem icon={Users} label="Team" to="/team" isCollapsed={isSidebarCollapsed} />
                    )}
                    <NavItem icon={Settings} label="Settings" to="/settings" isCollapsed={isSidebarCollapsed} />
                    <NavItem icon={LogOut} label="Logout" to="#" onClick={handleLogout} isCollapsed={isSidebarCollapsed} />
                </ul>
            </div>
        </>
    );
 
    return (
        <div className={`flex h-screen font-sans bg-primary-bg text-text-primary dark:bg-dark-primary-bg dark:text-dark-text-primary`}> 
            {isUpgradeModalVisible && <UpgradeModal onClose={() => setIsUpgradeModalVisible(false)} />}
            {user && user.is_onboarded === false && <OnboardingModal user={user} />}
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
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors`}>
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
                                            <div key={notif.id} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer border-b border-slate-200 dark:border-slate-800">
                                                <p className="font-semibold text-sm">{notif.title}</p>
                                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">Due on {new Date(notif.dueDate).toLocaleDateString()}</p>
                                            </div>
                                        )) : <p className="text-center text-text-secondary py-8">No new notifications.</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                        <a href="/profile" className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end flex items-center justify-center text-white font-bold transition-transform transform hover:scale-110">
                            {user?.profilePictureUrl ? (<img src={user.profilePictureUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />) : (getInitial(user))}
                        </a>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
 
// =========================================================================
// App Component with conditional rendering
// =========================================================================
const App = () => {
  const isPublicFormPath = window.location.pathname.startsWith('/form/');
  
  if (isPublicFormPath) {
    return (
      <Routes>
        <Route path="/form/:formId" element={<IntakeFormPage />} />
        <Route path="*" element={<p className="text-center p-8">404 Not Found</p>} />
      </Routes>
    );
  }

  // All other routes are wrapped in the AuthProvider
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};
 
const AppRoutes = () => {
    const { token, isLoading, user } = useAuth();
 
    if (isLoading) {
      return (
        <div className="fixed inset-0 bg-primary-bg dark:bg-dark-primary-bg flex items-center justify-center">
          <BrandedLoader />
        </div>
      );
    }
    
    const isAuthenticated = !!token && !!user;
    
    return (
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/waitlist" element={<WaitlistPage />} />
          <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/features" element={isAuthenticated ? <Navigate to="/dashboard" /> : <FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/how-it-works" element={isAuthenticated ? <Navigate to="/dashboard" /> : <HowItWorksPage />} />
          <Route path="/about" element={isAuthenticated ? <Navigate to="/dashboard" /> : <AboutPage />} />
          <Route path="/careers" element={isAuthenticated ? <Navigate to="/dashboard" /> : <CareersPage />} />
          <Route path="/contact" element={isAuthenticated ? <Navigate to="/dashboard" /> : <ContactPage />} />
          <Route path="/privacy" element={isAuthenticated ? <Navigate to="/dashboard" /> : <PrivacyPage />} />
          <Route path="/terms" element={isAuthenticated ? <Navigate to="/dashboard" /> : <TermsPage />} />
          <Route path="/security" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SecurityPage />} />
 
          {/* Private Pages (accessible only if authenticated) */}
          <Route path="/dashboard" element={isAuthenticated ? <PrivateLayout><Dashboard /></PrivateLayout> : <Navigate to="/auth" />} />
          <Route path="/sales" element={isAuthenticated ? <PrivateLayout><SalesDashboard /></PrivateLayout> : <Navigate to="/auth" />} />
          <Route path="/crm" element={isAuthenticated ? <PrivateLayout><CRMDashboard /></PrivateLayout> : <Navigate to="/auth" />} />
          <Route path="/assistant" element={isAuthenticated ? <PrivateLayout><VirtualAssistantDashboard /></PrivateLayout> : <Navigate to="/auth" />} />
          <Route path="/marketing" element={isAuthenticated ? <PrivateLayout><MarketingDashboard /></PrivateLayout> : <Navigate to="/auth" />} />
          <Route path="/finance" element={isAuthenticated ? <PrivateLayout><FinanceDashboard /></PrivateLayout> : <Navigate to="/auth" />} />
          <Route path="/profile" element={isAuthenticated ? <PrivateLayout><ProfilePage /></PrivateLayout> : <Navigate to="/auth" />} />
          <Route path="/settings" element={isAuthenticated ? <PrivateLayout><SettingsPage /></PrivateLayout> : <Navigate to="/auth" />} />
          <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <PrivateLayout><AdminDashboard /></PrivateLayout> : <Navigate to="/auth" />} />
          <Route path="/profitability" element={isAuthenticated ? <PrivateLayout><ClientProfitabilityDashboard /></PrivateLayout> : <Navigate to="/auth" />} />
          <Route path="/team" element={isAuthenticated && user?.planType === 'team' ? <PrivateLayout><TeamPage /></PrivateLayout> : <Navigate to="/auth" />} />
          
          {/* Fallback route for authenticated users */}
          <Route path="*" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
        </Routes>
    );
};
 
export default App;