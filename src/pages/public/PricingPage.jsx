import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import { Check, Star } from 'lucide-react';

const PricingPage = () => {
    const [isAnnual, setIsAnnual] = useState(false);
    const navigate = useNavigate();

    const pricing = [
        {
            name: 'Basic',
            priceMonthly: 15,
            priceAnnual: 150,
            description: 'For individuals and side projects.',
            features: [
                'Unlimited clients',
                'Unlimited invoices & deals',
                'Advanced dashboards & analytics',
                '50 AI actions / month',
                '60-day money-back guarantee',
            ],
            isHighlighted: false,
        },
        {
            name: 'Premium',
            priceMonthly: 22,
            priceAnnual: 220,
            description: 'For solopreneurs running a full-time business.',
            features: [
                'All Basic Plan features',
                'Unlimited AI actions',
                'Native automations',
                '60-day money-back guarantee',
                '2 months free with annual subscription',
            ],
            isHighlighted: true,
        },
        {
            name: 'Team',
            priceMonthly: 75,
            priceAnnual: 750,
            description: 'For small, collaborative teams.',
            features: [
                'All Premium Plan features',
                'Up to 5 team members',
                'Team collaboration tools',
                '60-day money-back guarantee',
                '2 months free with annual subscription',
            ],
            isHighlighted: false,
        },
    ];

    const handleSelectPlan = () => {
        navigate('/auth');
    };

    return (
        <PublicLayout>
            <div className="container mx-auto px-5 py-20 max-w-7xl text-center">
                <h1 className="text-4xl md:text-6xl font-bold">Simple, fair pricing</h1>
                <p className="mt-4 text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                    60-day money-back guarantee.
                </p>

                <div className="flex justify-center items-center my-10 space-x-4">
                    <span className="text-lg font-semibold">Monthly</span>
                    <button onClick={() => setIsAnnual(!isAnnual)} className={`relative inline-flex items-center h-8 rounded-full w-14 transition-colors ${isAnnual ? 'bg-gradient-to-r from-accent-start to-accent-end' : 'bg-slate-300 dark:bg-slate-700'}`}>
                        <span className={`transform transition-transform duration-300 w-6 h-6 rounded-full bg-white absolute ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                    <div className="flex items-center">
                        <span className="text-lg font-semibold">Annually</span>
                        <span className="ml-2 px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-full">2 Months Free</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-stretch">
                    {pricing.map((plan) => (
                        <div key={plan.name} className={`p-6 rounded-2xl flex flex-col ${plan.isHighlighted ? 'bg-gradient-to-br from-accent-start/30 to-accent-end/30 border border-accent-start/50 dark:border-dark-accent-mid/50' : 'bg-card-bg dark:bg-dark-card-bg border border-slate-200 dark:border-slate-800'}`}>
                            <div className="text-left flex-1">
                                {plan.isHighlighted && <span className="mb-2 inline-block px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-accent-start to-accent-end rounded-full">Most Popular</span>}
                                <h2 className="text-2xl font-bold mt-2">{plan.name}</h2>
                                <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">{plan.description}</p>
                                <div className="flex items-baseline mt-4">
                                    <span className="text-5xl font-extrabold">
                                        ${isAnnual ? plan.priceAnnual : plan.priceMonthly}
                                    </span>
                                    <span className="text-xl text-text-secondary dark:text-dark-text-secondary ml-1">
                                        {isAnnual ? '/yr' : '/mo'}
                                    </span>
                                </div>
                                <ul className="mt-6 space-y-3 text-sm">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <Check size={18} className="text-green-500 mr-2 flex-shrink-0" />
                                            <span className="text-text-secondary dark:text-dark-text-secondary text-left">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                onClick={() => handleSelectPlan(plan.name, isAnnual)}
                                className={`w-full mt-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 ${plan.isHighlighted ? 'bg-gradient-to-r from-accent-start to-accent-end' : 'bg-slate-800 dark:bg-white dark:text-slate-800'}`}
                            >
                                Choose {plan.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
};

export default PricingPage;