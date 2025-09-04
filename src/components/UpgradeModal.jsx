// src/components/UpgradeModal.jsx

import React from 'react';
import Card from './ui/Card';
import { XCircle, Check } from 'lucide-react';

const UpgradeModal = ({ onSelectPlan, onClose }) => {
    const soloFeatures = ["Unlimited Invoices & Deals", "Full Access to All Hubs", "Native Automations & AI", "200 AI Actions/month"];
    const teamFeatures = ["Everything in Solo", "Up to 5 Team Members", "Collaboration Features", "600 AI Actions/month"];

    const handleSelect = (plan) => {
        onSelectPlan(plan);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-4xl w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary dark:text-dark-text-secondary hover:opacity-70">
                    <XCircle />
                </button>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold">Upgrade Your Plan</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-2">Choose a plan that fits your needs and unlock powerful new features.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Solo Plan */}
                    <div className="p-[1px] bg-gradient-to-br from-accent-start to-accent-end rounded-2xl shadow-lg">
                        <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-6 flex flex-col">
                            <h3 className="text-2xl font-bold">Solo</h3>
                            <div className="text-5xl font-extrabold my-2">$15.99<span className="text-lg font-medium text-text-secondary dark:text-dark-text-secondary"> / mo</span></div>
                            <ul className="space-y-2.5 text-text-secondary dark:text-dark-text-secondary mb-6 mt-4">
                                {soloFeatures.map(feature => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <Check size={18} className="text-green-500" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex-grow"></div>
                            <button onClick={() => handleSelect('Solo')} className="w-full mt-4 bg-gradient-to-r from-accent-start to-accent-end text-white font-semibold py-3 rounded-lg transition hover:opacity-90">
                                Choose Solo
                            </button>
                        </div>
                    </div>
                    {/* Team Plan */}
                    <div className="p-[1px] bg-slate-200 dark:bg-slate-800 rounded-2xl">
                         <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-6 flex flex-col">
                            <h3 className="text-2xl font-bold">Team</h3>
                            <div className="text-5xl font-extrabold my-2">$25<span className="text-lg font-medium text-text-secondary dark:text-dark-text-secondary"> / mo</span></div>
                            <ul className="space-y-2.5 text-text-secondary dark:text-dark-text-secondary mb-6 mt-4">
                                {teamFeatures.map(feature => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <Check size={18} className="text-green-500" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex-grow"></div>
                            <button onClick={() => handleSelect('Team')} className="w-full mt-4 bg-gradient-to-r from-accent-start to-accent-end text-white font-semibold py-3 rounded-lg transition hover:opacity-90">
                                Choose Team
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UpgradeModal;