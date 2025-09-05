// src/pages/public/PricingPage.jsx

import React from 'react';
import PublicLayout from './PublicLayout';
import { Check } from 'lucide-react';

const PricingCard = ({ plan, price, description, features, popular = false, onSelectPlan }) => (
    <div className={`p-[1px] rounded-2xl ${popular ? 'bg-gradient-to-br from-accent-start to-accent-end' : 'bg-slate-200 dark:bg-slate-800'}`}>
        <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-8 flex flex-col">
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <p className="text-text-secondary dark:text-dark-text-secondary mt-2">{description}</p>
            <div className="my-6">
                <span className="text-5xl font-extrabold">{price}</span>
                <span className="text-text-secondary dark:text-dark-text-secondary">/ month</span>
            </div>
            <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary mb-8 text-sm">
                {features.map(feature => (
                    <li key={feature} className="flex items-center gap-3">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <div className="flex-grow"></div>
            <button onClick={() => onSelectPlan(plan.id)} className={`w-full mt-4 font-semibold py-3 rounded-lg transition hover:opacity-90 ${popular ? 'bg-gradient-to-r from-accent-start to-accent-end text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                {plan.cta}
            </button>
        </div>
    </div>
);

const PricingPage = ({ setActiveView, onSelectPlan, onLaunchApp, onStartTrial }) => {
    const plans = [
        { id: 'Starter', name: 'Starter', price: '$0', cta: 'Start for Free', description: 'For freelancers getting started.', features: ['1 User', 'Dashboard & Assistant', '5 Invoices / month', '10 Deals / month', '20 AI Actions / month'] },
        { id: 'Solo', name: 'Growth', price: '$15', cta: 'Start Free Trial', description: 'For solopreneurs scaling up.', features: ['Up to 5 Users', 'Everything in Starter', 'Full Access to All Hubs', 'Unlimited Invoices & Deals', 'Native Automations & AI', '200 AI Actions / month'], popular: true },
        { id: 'Team', name: 'Business', price: '$45', cta: 'Start Free Trial', description: 'For growing startups.', features: ['Up to 20 Users', 'Everything in Growth', 'Collaboration Tools', 'Advanced Analytics', 'Priority Support', '600+ AI Actions / month'] }
    ];

    return (
        <PublicLayout activeView="Pricing" setActiveView={setActiveView} onLaunchApp={onLaunchApp} onStartTrial={onStartTrial}>
            <div className="container mx-auto px-5 py-20 max-w-7xl text-center">
                <h1 className="text-4xl md:text-6xl font-bold">Simple, transparent pricing.</h1>
                <p className="mt-4 text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                    Choose a plan that grows with you — no hidden fees, cancel anytime.
                </p>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {plans.map(plan => (
                        <PricingCard key={plan.id} plan={plan} price={plan.price} description={plan.description} features={plan.features} popular={plan.popular} onSelectPlan={onSelectPlan} />
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
};

export default PricingPage;