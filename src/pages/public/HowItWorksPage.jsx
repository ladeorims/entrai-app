/* eslint-disable no-unused-vars */
import React from 'react';
import PublicLayout from './PublicLayout';
import { Zap, LayoutDashboard, Rocket, UserPlus, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StepSection = ({ icon: Icon, title, children, number, isReversed }) => (
    <div className={`flex flex-col md:flex-row items-center gap-12 py-16 ${isReversed ? 'md:flex-row-reverse' : ''}`}>
        {/* Visual Element */}
        <div className="flex-1 w-full">
            <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-accent-start/20 to-accent-end/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-64 md:h-80 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-inner">
                   <div className="flex flex-col items-center text-center p-8">
                        <div className="w-20 h-20 bg-white dark:bg-dark-card-bg rounded-3xl shadow-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500">
                            <Icon size={40} className="text-accent-start" />
                        </div>
                        <span className="text-4xl font-black text-slate-300 dark:text-slate-600">0{number}</span>
                   </div>
                </div>
            </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 text-left">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-start text-white font-bold mb-4 shadow-lg shadow-accent-start/30">
                {number}
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">{title}</h3>
            <div className="text-lg text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                {children}
            </div>
            <div className="mt-6 flex items-center gap-2 text-accent-start font-bold text-sm uppercase tracking-wider">
                <CheckCircle2 size={18} /> Instant Setup
            </div>
        </div>
    </div>
);

const HowItWorksPage = () => {
    const navigate = useNavigate();

    return (
        <PublicLayout>
            <div className="bg-slate-50/50 dark:bg-dark-primary-bg transition-colors duration-500">
                {/* Header */}
                <div className="container mx-auto px-5 py-24 max-w-4xl text-center">
                    <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                        From Sign-up to <br />
                        <span className="bg-gradient-to-r from-accent-start to-accent-end text-transparent bg-clip-text">Success in 4 Steps.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto leading-relaxed">
                        We’ve removed the complexity of business management. Entruvi works in the background so you can stay in your flow.
                    </p>
                </div>

                {/* Steps Journey */}
                <div className="container mx-auto px-5 max-w-6xl pb-24">
                    <StepSection 
                        icon={UserPlus} 
                        number={1} 
                        title="Personalized Onboarding"
                    >
                        Create your account in seconds. Tell us about your business—whether services or goods—and we’ll automatically configure your CRM and Finance hubs to match your specific industry.
                    </StepSection>

                    <StepSection 
                        icon={LayoutDashboard} 
                        number={2} 
                        isReversed={true}
                        title="The Unified Dashboard"
                    >
                        No more app-switching. Your sales, marketing, and cash flow are unified in one beautiful view. See your <strong>Business Health Score</strong> instantly and know exactly where you stand.
                    </StepSection>

                    <StepSection 
                        icon={Zap} 
                        number={3} 
                        title="AI-Guided Workflows"
                    >
                        As you work, Entruvi thinks ahead. Closed a deal? We’ll prompt you to send an invoice. New client added? We’ll suggest an AI-drafted welcome email. It’s like having a COO who never sleeps.
                    </StepSection>

                    <StepSection 
                        icon={Rocket} 
                        number={4} 
                        isReversed={true}
                        title="Scaling Your Empire"
                    >
                        With the busywork automated, you get your time back. Use our profitability tools to see which clients are actually making you money and focus your energy on what scales.
                    </StepSection>
                </div>

                {/* Final CTA Card */}
                <div className="container mx-auto px-5 pb-32">
                    <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-start/20 blur-[100px] rounded-full"></div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Ready to automate the hustle?</h2>
                        <button 
                            onClick={() => navigate('/auth')} 
                            className="bg-white text-slate-900 font-black px-12 py-5 rounded-2xl transition-transform hover:scale-105 shadow-xl text-xl"
                        >
                            Get Started Now — ₦0.00
                        </button>
                        <p className="mt-6 text-slate-400 font-medium">Join 500+ Nigerian entrepreneurs scaling with Entruvi.</p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default HowItWorksPage;