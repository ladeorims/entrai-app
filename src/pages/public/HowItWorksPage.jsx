// src/pages/public/HowItWorksPage.jsx

import React from 'react';
import PublicLayout from './PublicLayout';
import { Zap, LayoutDashboard, Rocket, UserPlus } from 'lucide-react';

const Step = ({ icon, title, children, number }) => (
    <div className="flex items-start gap-6">
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-card-bg dark:bg-dark-card-bg border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm">
                {icon}
            </div>
            <div className="w-px h-24 bg-slate-200 dark:bg-slate-700 my-4"></div>
        </div>
        <div>
            <p className="text-sm font-bold text-accent-start dark:text-dark-accent-mid">STEP {number}</p>
            <h3 className="text-2xl font-bold mt-1">{title}</h3>
            <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">{children}</p>
        </div>
    </div>
);

const HowItWorksPage = ({ setActiveView, onLaunchApp, onStartTrial }) => {
    return (
        <PublicLayout activeView="HowItWorks" setActiveView={setActiveView} onLaunchApp={onLaunchApp} onStartTrial={onStartTrial}>
            <div className="container mx-auto px-5 py-20 max-w-4xl text-center">
                <h1 className="text-4xl md:text-6xl font-bold">From sign-up to success in 4 simple steps.</h1>
                 <p className="mt-4 text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                    Entrai is designed to be intuitive from day one, helping you streamline your business without a steep learning curve.
                </p>
            </div>

            <div className="container mx-auto px-5 max-w-2xl">
                <Step icon={<UserPlus size={28} />} number={1} title="Sign Up & Personalize">
                    Create your account in seconds. During a brief onboarding, you’ll tell us about your business—like whether you sell services or goods—so we can tailor your workspace from the start.
                </Step>
                 <Step icon={<LayoutDashboard size={28} />} number={2} title="See Your All-in-One Dashboard">
                    Once inside, your dashboard gives you a complete picture of your business health. Sales, finance, marketing, and tasks are no longer in separate silos; they're at your fingertips.
                </Step>
                 <Step icon={<Zap size={28} />} number={3} title="Let Smart Automations Guide You">
                    As you work, Entrai proactively helps you. Close a deal, and a "Smart Prompt" will ask if you want to create an onboarding task. Add a new client, and it will suggest a follow-up. This is your virtual COO in action.
                </Step>
                <Step icon={<Rocket size={28} />} number={4} title="Grow With Ease & Focus">
                    With administrative tasks automated and your business data unified, you can finally stop juggling and start focusing on what truly matters: your vision, your clients, and your growth.
                </Step>
            </div>

             <div className="text-center py-20">
                <button onClick={onStartTrial} className="bg-gradient-to-r from-accent-start to-accent-end text-white font-semibold px-8 py-4 rounded-xl transition shadow-lg hover:opacity-90 text-lg">
                    See Entrai in Action
                </button>
            </div>
        </PublicLayout>
    );
};

export default HowItWorksPage;