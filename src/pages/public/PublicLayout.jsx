/* eslint-disable no-irregular-whitespace */
// src/pages/public/PublicLayout.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import AnimatedLogo from '../../components/AnimatedLogo';

const PublicHeader = ({ activeView, setActiveView, onLaunchApp, onStartTrial, isDarkMode, toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);
    const companyMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (companyMenuRef.current && !companyMenuRef.current.contains(event.target)) {
                setIsCompanyMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLinkClick = (e, page) => {
        e.preventDefault();
        setActiveView(page);
        setIsMenuOpen(false);
        setIsCompanyMenuOpen(false);
    };

    const navLinks = (
        <>
            <a href="/features" onClick={(e) => handleLinkClick(e, 'Features')} className={`block md:inline-block py-2 px-3 rounded-md transition-colors ${activeView === 'Features' ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Features</a>
            <a href="/pricing" onClick={(e) => handleLinkClick(e, 'Pricing')} className={`block md:inline-block py-2 px-3 rounded-md transition-colors ${activeView === 'Pricing' ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Pricing</a>
            <a href="/how-it-works" onClick={(e) => handleLinkClick(e, 'HowItWorks')} className={`block md:inline-block py-2 px-3 rounded-md transition-colors ${activeView === 'HowItWorks' ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>How It Works</a>
            <div className="relative" ref={companyMenuRef}>
                <button onClick={() => setIsCompanyMenuOpen(!isCompanyMenuOpen)} className="flex items-center gap-1 py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 w-full md:w-auto">
                    Company <ChevronDown size={16} />
                </button>
                {isCompanyMenuOpen && (
                    <div className="md:absolute top-full mt-2 w-full md:w-48 bg-card-bg dark:bg-dark-card-bg md:border border-slate-200 dark:border-slate-700 rounded-lg md:shadow-lg z-20">
                        <a href="/about" onClick={(e) => handleLinkClick(e, 'About')} className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">About Us</a>
                        <a href="/careers" onClick={(e) => handleLinkClick(e, 'Careers')} className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Careers</a>
                        <a href="/contact" onClick={(e) => handleLinkClick(e, 'Contact')} className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Contact</a>
                    </div>
                )}
            </div>
        </>
    );
    
    return (
        <header className="sticky top-0 bg-card-bg/80 dark:bg-dark-card-bg/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
            <div className="container mx-auto px-5 py-3.5 flex items-center justify-between max-w-7xl">
                <a href="/" onClick={(e) => handleLinkClick(e, 'Landing')} className="flex items-center gap-2.5 font-extrabold tracking-wide text-xl">
                    <AnimatedLogo />
                </a>
                <nav className="hidden md:flex items-center gap-5 text-text-secondary dark:text-dark-text-secondary font-semibold">{navLinks}</nav>
                <div className="hidden md:flex items-center gap-5">
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={onLaunchApp} className="bg-transparent border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 px-4 py-2 rounded-xl transition text-sm font-semibold">Sign in</button>
                    <button onClick={onStartTrial} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-semibold px-4 py-2 rounded-xl transition shadow-lg hover:opacity-90 text-sm">Start Free Trial</button>
                </div>
                <div className="md:hidden flex items-center"><button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button></div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-card-bg dark:bg-dark-card-bg shadow-lg">
                    <nav className="flex flex-col items-start p-4 text-text-secondary dark:text-dark-text-secondary font-semibold">{navLinks}</nav>
                </div>
            )}
        </header>
    );
};

const PublicFooter = ({ setActiveView }) => {
    const handleLinkClick = (e, page) => {
        e.preventDefault();
        setActiveView(page);
    };

    return (
        <footer className="border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-5 py-16 max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                    <div className="col-span-2 lg:col-span-2">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-transparent bg-clip-text mb-3">Entruvi</h3>
                        <p className="text-text-secondary dark:text-dark-text-secondary text-sm max-w-xs">Your virtual COO. Less admin, more growth. Empowering visionaries to focus on what matters.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary text-sm">
                            <li><a href="/features" onClick={(e) => handleLinkClick(e, 'Features')} className="hover:text-accent-start dark:hover:text-dark-accent-start">Features</a></li>
                            <li><a href="/pricing" onClick={(e) => handleLinkClick(e, 'Pricing')} className="hover:text-accent-start dark:hover:text-dark-accent-start">Pricing</a></li>
                            <li><a href="/how-it-works" onClick={(e) => handleLinkClick(e, 'HowItWorks')} className="hover:text-accent-start dark:hover:text-dark-accent-start">How it works</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary text-sm">
                            <li><a href="/about" onClick={(e) => handleLinkClick(e, 'About')} className="hover:text-accent-start dark:hover:text-dark-accent-start">About</a></li>
                            <li><a href="/careers" onClick={(e) => handleLinkClick(e, 'Careers')} className="hover:text-accent-start dark:hover:text-dark-accent-start">Careers</a></li>
                            <li><a href="/contact" onClick={(e) => handleLinkClick(e, 'Contact')} className="hover:text-accent-start dark:hover:text-dark-accent-start">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary text-sm">
                            <li><a href="/privacy" onClick={(e) => handleLinkClick(e, 'Privacy')} className="hover:text-accent-start dark:hover:text-dark-accent-start">Privacy</a></li>
                            <li><a href="/terms" onClick={(e) => handleLinkClick(e, 'Terms')} className="hover:text-accent-start dark:hover:text-dark-accent-start">Terms</a></li>
                            <li><a href="/security" onClick={(e) => handleLinkClick(e, 'Security')} className="hover:text-accent-start dark:hover:text-dark-accent-start">Security</a></li>
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

const PublicLayout = ({ children, activeView, setActiveView, onLaunchApp, onStartTrial }) => {
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const handleToggleTheme = () => {
        const newIsDarkMode = !isDarkMode;
        setIsDarkMode(newIsDarkMode);
        if (newIsDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className="bg-primary-bg dark:bg-dark-primary-bg text-text-primary dark:text-dark-text-primary font-sans min-h-screen flex flex-col">
                <PublicHeader 
                    activeView={activeView} 
                    setActiveView={setActiveView} 
                    onLaunchApp={onLaunchApp} 
                    onStartTrial={onStartTrial} 
                    isDarkMode={isDarkMode}
                    toggleTheme={handleToggleTheme}
                />
                <main className="flex-grow">
                    {children}
                </main>
                <PublicFooter setActiveView={setActiveView} />
            </div>
        </div>
    );
};

export default PublicLayout;