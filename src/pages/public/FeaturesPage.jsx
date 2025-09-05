// src/pages/public/FeaturesPage.jsx
import React from 'react';
import PublicLayout from './PublicLayout';
import { Users, BarChart, Zap, Bot, ShieldCheck } from 'lucide-react';
import Card from '../../components/ui/Card';

const FeatureCard = ({ icon, title, children }) => (
    <Card className="flex flex-col items-start gap-4">
        <div className="p-3 bg-slate-100 dark:bg-dark-primary-bg rounded-lg">
            {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-text-secondary dark:text-dark-text-secondary">{children}</p>
    </Card>
);

const FeaturesPage = ({ setActiveView, onLaunchApp, onStartTrial }) => {
    return (
        <PublicLayout activeView="Features" setActiveView={setActiveView} onLaunchApp={onLaunchApp} onStartTrial={onStartTrial}>
            <div className="container mx-auto px-5 py-16 max-w-5xl text-center">
                <h1 className="text-4xl md:text-6xl font-bold">Run your business on autopilot.</h1>
                <p className="mt-4 text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
                    Entrai brings CRM, finance, marketing, and automation into one intelligent platform — so you spend less time on admin and more time on vision.
                </p>
                <button onClick={onStartTrial} className="mt-8 bg-gradient-to-r from-accent-start to-accent-end text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg hover:opacity-90">
                    Start Free Trial
                </button>
            </div>

            <div className="bg-slate-100/50 dark:bg-dark-primary-bg/50 py-20">
                <div className="container mx-auto px-5 max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                        <FeatureCard icon={<Users className="text-accent-start dark:text-dark-accent-mid" size={28}/>} title="CRM & Sales">
                            Track leads, manage clients, and close deals faster with a simple drag-and-drop pipeline. Keep all client history — notes, invoices, emails — in one view.
                        </FeatureCard>
                        <FeatureCard icon={<BarChart className="text-accent-start dark:text-dark-accent-mid" size={28}/>} title="Finance">
                            Create and send invoices, log transactions, and monitor cash flow in real time. Get paid faster with integrated Stripe payments.
                        </FeatureCard>
                        <FeatureCard icon={<Zap className="text-accent-start dark:text-dark-accent-mid" size={28}/>} title="Automation & Insights">
                            Entrai doesn’t just store your data — it thinks with you. Smart prompts guide your workflow, while AI-powered insights highlight opportunities and risks.
                        </FeatureCard>
                        <FeatureCard icon={<Bot className="text-accent-start dark:text-dark-accent-mid" size={28}/>} title="Virtual Assistant">
                            A task manager that works for you. From summarizing documents to scheduling meetings, Entrai suggests your next steps before you even ask.
                        </FeatureCard>
                        <FeatureCard icon={<ShieldCheck className="text-accent-start dark:text-dark-accent-mid" size={28}/>} title="Marketing">
                             Plan and track campaigns, manage your content calendar, and generate post ideas with AI. Share directly to your socials with one click.
                        </FeatureCard>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default FeaturesPage;