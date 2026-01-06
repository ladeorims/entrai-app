/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import AnimatedLogo from '../../components/AnimatedLogo';

const PublicHeader = ({ isDarkMode, toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);
    const companyMenuRef = useRef(null);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleLinkClick = (e, page) => {
        e.preventDefault();
        navigate(page);
        setIsMenuOpen(false);
        setIsCompanyMenuOpen(false);
    };

    const navLinks = (
        <>
            <button onClick={(e) => handleLinkClick(e, '/features')} className={`block md:inline-block py-2 px-3 rounded-md transition-colors ${pathname === '/features' ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Features</button>
            <button onClick={(e) => handleLinkClick(e, '/pricing')} className={`block md:inline-block py-2 px-3 rounded-md transition-colors ${pathname === '/pricing' ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Pricing</button>
            <button onClick={(e) => handleLinkClick(e, '/how-it-works')} className={`block md:inline-block py-2 px-3 rounded-md transition-colors ${pathname === '/how-it-works' ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>How It Works</button>
            <div className="relative" ref={companyMenuRef}>
                <button onClick={() => setIsCompanyMenuOpen(!isCompanyMenuOpen)} className="flex items-center gap-1 py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 w-full md:w-auto text-left">
                    Company <ChevronDown size={16} />
                </button>
                {isCompanyMenuOpen && (
                    <div className="md:absolute top-full mt-2 w-full md:w-48 bg-card-bg dark:bg-dark-card-bg md:border border-slate-200 dark:border-slate-700 rounded-lg md:shadow-lg z-20">
                        <button onClick={(e) => handleLinkClick(e, '/about')} className="block w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">About Us</button>
                        <button onClick={(e) => handleLinkClick(e, '/careers')} className="block w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Careers</button>
                        <button onClick={(e) => handleLinkClick(e, '/contact')} className="block w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Contact</button>
                    </div>
                )}
            </div>
        </>
    );

    return (
        <header className="sticky top-0 bg-card-bg/80 dark:bg-dark-card-bg/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
            <div className="container mx-auto px-5 py-3.5 flex items-center justify-between max-w-7xl">
                <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="flex items-center gap-2.5 font-extrabold tracking-wide text-xl">
                    <AnimatedLogo />
                </a>
                <nav className="hidden md:flex items-center gap-5 text-text-secondary dark:text-dark-text-secondary font-semibold">{navLinks}</nav>
                <div className="hidden md:flex items-center gap-5">
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <a href="/auth" onClick={(e) => handleLinkClick(e, '/auth')} className="bg-transparent border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 px-4 py-2 rounded-xl transition text-sm font-semibold">Sign in</a>
                    <a href="/auth" onClick={(e) => handleLinkClick(e, '/auth')} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-semibold px-4 py-2 rounded-xl transition shadow-lg hover:opacity-90 text-sm">Sign Up</a>
                </div>
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* UPDATED MOBILE MENU */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-card-bg dark:bg-dark-card-bg border-b border-slate-200 dark:border-slate-800 shadow-xl p-5 animate-in slide-in-from-top duration-300">
                    <nav className="flex flex-col gap-2 mb-6 text-text-secondary dark:text-dark-text-secondary font-semibold">
                        {navLinks}
                    </nav>
                    <div className="flex flex-col gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Appearance</span>
                            <button onClick={toggleTheme} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        </div>
                        <button onClick={() => navigate('/auth')} className="w-full py-3 text-center font-semibold border border-slate-200 dark:border-slate-700 rounded-xl text-text-primary dark:text-dark-text-primary">
                            Sign In
                        </button>
                        <button onClick={() => navigate('/auth')} className="w-full py-3 text-center font-bold text-white bg-gradient-to-r from-accent-start to-accent-end rounded-xl shadow-lg">
                            Get Started
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

const PublicFooter = () => {
    const navigate = useNavigate();
    const handleLinkClick = (e, page) => {
        e.preventDefault();
        navigate(page);
    };

    return (
        <footer className="border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-5 py-16 max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                    <div className="col-span-2 lg:col-span-2">
                        {/* UPDATED FOOTER TITLE COLOR */}
                        <h3 className="font-black text-2xl mb-6 text-text-primary dark:text-dark-text-primary">Entruvi</h3>
                        <p className="text-text-secondary dark:text-dark-text-secondary text-sm max-w-xs">Your virtual COO. Less admin, more growth. Empowering visionaries to focus on what matters.</p>
                    </div>
                    {/* ... (rest of the footer columns remain the same) */}
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary text-sm">
                            <li><button onClick={(e) => handleLinkClick(e, '/features')} className="hover:text-accent-start">Features</button></li>
                            <li><button onClick={(e) => handleLinkClick(e, '/pricing')} className="hover:text-accent-start">Pricing</button></li>
                            <li><button onClick={(e) => handleLinkClick(e, '/how-it-works')} className="hover:text-accent-start">How it works</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary text-sm">
                            <li><button onClick={(e) => handleLinkClick(e, '/about')} className="hover:text-accent-start">About</button></li>
                            <li><button onClick={(e) => handleLinkClick(e, '/careers')} className="hover:text-accent-start">Careers</button></li>
                            <li><button onClick={(e) => handleLinkClick(e, '/contact')} className="hover:text-accent-start">Contact</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary text-sm">
                            <li><button onClick={(e) => handleLinkClick(e, '/privacy')} className="hover:text-accent-start">Privacy</button></li>
                            <li><button onClick={(e) => handleLinkClick(e, '/terms')} className="hover:text-accent-start">Terms</button></li>
                            <li><button onClick={(e) => handleLinkClick(e, '/security')} className="hover:text-accent-start">Security</button></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-text-secondary dark:text-dark-text-secondary">
                    © {new Date().getFullYear()} Entruvi. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

const PublicLayout = ({ children }) => {
    // PERSISTENT THEME LOGIC
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark'; // Defaults to false (Light Mode) if nothing is saved
    });
    
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
        <div className="font-sans antialiased text-text-primary dark:text-dark-text-primary bg-primary-bg dark:bg-dark-primary-bg flex flex-col min-h-screen transition-colors duration-300">
            <PublicHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <main className="flex-1">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
};

export default PublicLayout;