import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import { Check, Star, ShieldCheck, Zap, Globe } from 'lucide-react';

const PricingPage = () => {
    const [isAnnual, setIsAnnual] = useState(false);
    const navigate = useNavigate();

    const pricing = [
        {
            name: 'Basic',
            priceMonthly: "7,000",
            priceAnnual: "70,000",
            description: 'Essential tools for emerging entrepreneurs.',
            features: [
                'Unlimited clients & deals',
                'Basic CRM & Sales Pipeline',
                'Naira Invoicing & Payments',
                '50 AI actions / month',
                'Standard Dashboards',
            ],
            isHighlighted: false,
        },
        {
            name: 'Premium',
            priceMonthly: "15,000",
            priceAnnual: "150,000",
            description: 'Advanced AI power for growing businesses.',
            features: [
                'All Basic Plan features',
                'Unlimited AI Assistant actions',
                'Smart Marketing Scheduler',
                'Automated Follow-ups',
                'Priority Local Support',
                '2 Months Free (Annual Only)',
            ],
            isHighlighted: true,
        },
        {
            name: 'Team',
            priceMonthly: "50,000",
            priceAnnual: "500,000",
            description: 'Collaborative hub for your whole squad.',
            features: [
                'All Premium Plan features',
                'Up to 5 team members',
                'Team Task Management',
                'Profitability Tracking',
                'Custom Permissions',
            ],
            isHighlighted: false,
        },
    ];

    const handleSelectPlan = () => {
        navigate('/auth');
    };

    return (
        <PublicLayout>
            <div className="bg-slate-100/50 dark:bg-dark-primary-bg transition-colors duration-500 min-h-screen">
                <div className="container mx-auto px-5 py-24 max-w-7xl text-center">
                    <span className="bg-accent-start/10 text-accent-start px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 inline-block">
                        Flexible Plans
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6">Built for the Nigerian Hustle.</h1>
                    <p className="mt-4 text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                        No dollar fluctuations. Simple Naira billing. <br className="hidden md:block"/> Start free for 14 days and scale your empire.
                    </p>

                    {/* Toggle Section */}
                    <div className="flex justify-center items-center my-12 space-x-6">
                        <span className={`text-lg font-bold ${!isAnnual ? 'text-text-primary' : 'text-text-secondary'}`}>Monthly</span>
                        <button 
                            onClick={() => setIsAnnual(!isAnnual)} 
                            className={`relative inline-flex items-center h-9 rounded-full w-16 transition-all shadow-inner ${isAnnual ? 'bg-accent-start' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                            <span className={`transform transition-transform duration-300 w-7 h-7 rounded-full bg-white shadow-md absolute ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${isAnnual ? 'text-text-primary' : 'text-text-secondary'}`}>Annually</span>
                            <span className="px-3 py-1 text-xs font-black text-white bg-emerald-500 rounded-full animate-pulse">Save ₦₦₦</span>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-3 gap-8 items-stretch">
                        {pricing.map((plan) => (
                            <div 
                                key={plan.name} 
                                className={`relative p-10 rounded-[3rem] flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                                    plan.isHighlighted 
                                    ? 'bg-slate-900 text-white shadow-2xl border-4 border-accent-start scale-105 z-10' 
                                    : 'bg-white dark:bg-dark-card-bg border border-slate-200 dark:border-slate-800 shadow-xl'
                                }`}
                            >
                                {plan.isHighlighted && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-start to-accent-end px-6 py-1.5 rounded-full text-sm font-black uppercase tracking-widest shadow-lg">
                                        Best Value
                                    </div>
                                )}
                                
                                <div className="text-left flex-1">
                                    <h2 className="text-3xl font-black mb-2">{plan.name}</h2>
                                    <p className={`text-sm ${plan.isHighlighted ? 'text-slate-400' : 'text-text-secondary'} mb-8`}>
                                        {plan.description}
                                    </p>
                                    
                                    <div className="flex items-baseline mb-10">
                                        <span className="text-5xl font-black">
                                            ₦{isAnnual ? plan.priceAnnual : plan.priceMonthly}
                                        </span>
                                        <span className={`text-lg ml-2 font-medium ${plan.isHighlighted ? 'text-slate-500' : 'text-text-secondary'}`}>
                                            {isAnnual ? '/yr' : '/mo'}
                                        </span>
                                    </div>

                                    <ul className="space-y-4">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.isHighlighted ? 'bg-accent-start' : 'bg-emerald-500/10'}`}>
                                                    <Check size={14} className={plan.isHighlighted ? 'text-white' : 'text-emerald-600'} />
                                                </div>
                                                <span className={`text-sm font-medium ${plan.isHighlighted ? 'text-slate-300' : 'text-text-secondary'}`}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={handleSelectPlan}
                                    className={`w-full mt-12 py-5 rounded-2xl font-black text-lg transition-all shadow-lg active:scale-95 ${
                                        plan.isHighlighted 
                                        ? 'bg-white text-slate-900 hover:bg-slate-100' 
                                        : 'bg-slate-900 dark:bg-accent-start text-white hover:opacity-90'
                                    }`}
                                >
                                    Choose {plan.name}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Trust Signals */}
                    <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-200 dark:border-slate-800 pt-16">
                        <div className="flex flex-col items-center gap-2">
                            <ShieldCheck className="text-accent-start" size={32} />
                            <p className="font-bold">Encrypted Data</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Zap className="text-amber-500" size={32} />
                            <p className="font-bold">Instant Setup</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Globe className="text-blue-500" size={32} />
                            <p className="font-bold">24/7 Support</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Star className="text-emerald-500" size={32} />
                            <p className="font-bold">14-Day Free Trial</p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default PricingPage;