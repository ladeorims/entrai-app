// src/pages/LandingPage.jsx

import React from 'react';
import PublicLayout from './public/PublicLayout';
import { Check } from 'lucide-react';

const LandingPage = ({ onLaunchApp, onStartTrial, onSelectPlan, setActiveView }) => {
    
    return (
        <PublicLayout 
            activeView="Landing" 
            setActiveView={setActiveView} 
            onLaunchApp={onLaunchApp} 
            onStartTrial={onStartTrial}
            onSelectPlan={onSelectPlan} // Ensure onSelectPlan is passed to the layout
        >
            <main className="container mx-auto px-5 max-w-7xl">
                {/* HERO */}
                <section className="grid md:grid-cols-[1.1fr,0.9fr] gap-8 items-center py-20 text-center md:text-left">
                    <div>
                         <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-4">
                            Stop Juggling. <span className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-transparent bg-clip-text">Start Scaling.</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-text-secondary dark:text-dark-text-secondary mb-8 max-w-2xl mx-auto md:mx-0">
                            Entrai is the all-in-one co-pilot for solo entrepreneurs. We integrate your sales, marketing, finance, and admin tasks into one intelligent platform, so you can focus on what you do best.
                        </p>
                        <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                            <button onClick={onStartTrial} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-bold px-6 py-3 rounded-xl transition-transform transform hover:scale-105 shadow-lg">Get Started Free</button>
                            <a href="#demo" className="bg-slate-200 dark:bg-slate-800 text-text-primary dark:text-dark-text-primary font-semibold px-6 py-3 rounded-xl transition hover:bg-slate-300 dark:hover:bg-slate-700">See It in Action</a>
                        </div>
                    </div>
                    <div className="hidden md:block bg-gradient-to-b from-slate-100 to-slate-200/50 dark:from-slate-800 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-dashed border-slate-300 dark:border-slate-700 mb-3">
                            <div className="flex gap-1.5"><i className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></i><i className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></i><i className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></i></div>
                            <div className="font-bold text-text-secondary dark:text-dark-text-secondary text-sm">Entrai • Dashboard</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3.5">
                            <div className="bg-card-bg dark:bg-dark-card-bg border border-slate-200 dark:border-slate-700 rounded-xl p-3.5"><div className="text-sm text-text-secondary dark:text-dark-text-secondary">Business Health</div><div className="text-3xl font-extrabold mt-1">82<span className="text-sm font-semibold text-accent-start dark:text-dark-accent-mid">/100</span></div></div>
                            <div className="bg-card-bg dark:bg-dark-card-bg border border-slate-200 dark:border-slate-700 rounded-xl p-3.5"><div className="text-sm text-text-secondary dark:text-dark-text-secondary">Automation Feed</div><div className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1.5 leading-snug">✓ Deal won → Invoice created<br/>✓ Follow‑up scheduled</div></div>
                            <div className="bg-card-bg dark:bg-dark-card-bg border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 col-span-2"><div className="text-sm text-text-secondary dark:text-dark-text-secondary">AI Suggestions</div><div className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1.5 leading-snug">• "Send check‑in to warm leads"<br/>• "Review cash flow for Q4"</div></div>
                        </div>
                    </div>
                </section>

                {/* All subsequent sections now use the correct, consistent styling */}
                <section id="features" className="py-14">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-3">Your Entire Business, Unified</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary text-lg text-center mb-12 max-w-2xl mx-auto">One platform to manage the four pillars of your enterprise.</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-[1px] bg-gradient-to-br from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end rounded-2xl transition-all duration-300 hover:-translate-y-1"><div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5"><span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Sales Hub</span><h3 className="text-xl font-bold my-2">Sales</h3><p className="text-text-secondary dark:text-dark-text-secondary">Automate lead tracking, manage your pipeline, and get AI-powered insights to close deals faster.</p></div></div>
                        <div className="p-[1px] bg-gradient-to-br from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end rounded-2xl transition-all duration-300 hover:-translate-y-1"><div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5"><span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Marketing Suite</span><h3 className="text-xl font-bold my-2">Marketing</h3><p className="text-text-secondary dark:text-dark-text-secondary">Generate content, schedule social media posts, and analyze campaign performance effortlessly.</p></div></div>
                        <div className="p-[1px] bg-gradient-to-br from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end rounded-2xl transition-all duration-300 hover:-translate-y-1"><div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5"><span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Finance Hub</span><h3 className="text-xl font-bold my-2">Finance Hub</h3><p className="text-text-secondary dark:text-dark-text-secondary">Track expenses, manage invoices, and get a clear, real-time view of your financial health.</p></div></div>
                        <div className="p-[1px] bg-gradient-to-br from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end rounded-2xl transition-all duration-300 hover:-translate-y-1"><div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5"><span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Virtual Assistant</span><h3 className="text-xl font-bold my-2">Virtual Assistant</h3><p className="text-text-secondary dark:text-dark-text-secondary">Delegate administrative tasks, manage your calendar, and automate repetitive workflows.</p></div></div>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
};

export default LandingPage;