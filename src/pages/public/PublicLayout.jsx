// /* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import AnimatedLogo from '../../components/AnimatedLogo';


const PublicHeader = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);
    const companyMenuRef = useRef(null);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        // Check localStorage first, otherwise default to Light (false)
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = savedTheme === 'dark';
        
        setIsDarkMode(prefersDark);
        if (prefersDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

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
                <button onClick={() => setIsCompanyMenuOpen(!isCompanyMenuOpen)} className="flex items-center gap-1 py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 w-full md:w-auto">
                    Company <ChevronDown size={16} />
                </button>
                {isCompanyMenuOpen && (
                    <div className="md:absolute top-full mt-2 w-full md:w-48 bg-card-bg dark:bg-dark-card-bg md:border border-slate-200 dark:border-slate-700 rounded-lg md:shadow-lg z-20">
                        <button onClick={(e) => handleLinkClick(e, '/about')} className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">About Us</button>
                        <button onClick={(e) => handleLinkClick(e, '/careers')} className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Careers</button>
                        <button onClick={(e) => handleLinkClick(e, '/contact')} className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Contact</button>
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
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <a href="/auth" onClick={(e) => handleLinkClick(e, '/auth')} className="bg-transparent border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 px-4 py-2 rounded-xl transition text-sm font-semibold">Sign in</a>
                    <a href="/auth" onClick={(e) => handleLinkClick(e, '/auth')} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-semibold px-4 py-2 rounded-xl transition shadow-lg hover:opacity-90 text-sm">Sign Up</a>
                </div>
                <div className="md:hidden flex items-center"><button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button></div>
            </div>
            {isMenuOpen && (
                <><div className="md:hidden absolute top-full left-0 w-full bg-card-bg dark:bg-dark-card-bg shadow-lg">
                    <nav className="flex flex-col items-start p-4 text-text-secondary dark:text-dark-text-secondary font-semibold">{navLinks}</nav>
                </div>
                   
                    <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={() => navigate('/auth')}
                            className="w-full py-3 text-center font-semibold text-text-primary dark:text-dark-text-primary"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/auth')}
                            className="w-full py-3 text-center font-bold text-white bg-gradient-to-r from-accent-start to-accent-end rounded-xl shadow-lg"
                        >
                            Get Started
                        </button>
                    </div></>
                
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
                        <h3 className="font-black text-lg mb-6 bg-gradient-to-r from-accent-start to-accent-end text-transparent bg-clip-text">Entruvi</h3>
                        <p className="text-text-secondary dark:text-dark-text-secondary text-sm max-w-xs">Your virtual COO. Less admin, more growth. Empowering visionaries to focus on what matters.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary text-sm">
                            <li><button onClick={(e) => handleLinkClick(e, '/features')} className="hover:text-accent-start dark:hover:text-dark-accent-start">Features</button></li>
                            <li><button onClick={(e) => handleLinkClick(e, '/pricing')} className="hover:text-accent-start dark:hover:text-dark-accent-start">Pricing</button></li>
                            <li><button onClick={(e) => handleLinkClick(e, '/how-it-works')} className="hover:text-accent-start dark:hover:text-dark-accent-start">How it works</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary text-sm">
                            <li><button onClick={(e) => handleLinkClick(e, '/about')} className="hover:text-accent-start dark:hover:text-dark-accent-start">About</button></li>
                            <li><button onClick={(e) => handleLinkClick(e, '/careers')} className="hover:text-accent-start dark:hover:text-dark-accent-start">Careers</button></li>
                            <li><button onClick={(e) => handleLinkClick(e, '/contact')} className="hover:text-accent-start dark:hover:text-dark-accent-start">Contact</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary text-sm">
                            <li><button onClick={(e) => handleLinkClick(e, '/privacy')} className="hover:text-accent-start dark:hover:text-dark-accent-start">Privacy</button></li>
                            <li><button onClick={(e) => handleLinkClick(e, '/terms')} className="hover:text-accent-start dark:hover:text-dark-accent-start">Terms</button></li>
                            <li><button onClick={(e) => handleLinkClick(e, '/security')} className="hover:text-accent-start dark:hover:text-dark-accent-start">Security</button></li>
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
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    useEffect(() => {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
        if (prefersDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="font-sans antialiased text-text-primary dark:text-dark-text-primary bg-primary-bg dark:bg-dark-primary-bg flex flex-col min-h-screen">
            <PublicHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <main className="flex-1">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
};

export default PublicLayout;