/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import { Users, BarChart, Zap, Bot, ShieldCheck, CheckCircle2, ArrowRight, MessageSquare, LineChart, Globe } from 'lucide-react';
import Card from '../../components/ui/Card';

// Updated Section Component for Visual Storytelling
const FeatureSection = ({ title, description, items, icon: Icon, image, isReversed }) => (
    <section className={`py-20 ${isReversed ? 'bg-slate-50 dark:bg-slate-900/30' : ''}`}>
        <div className={`container mx-auto px-5 max-w-7xl grid md:grid-cols-2 gap-16 items-center ${isReversed ? 'md:flex-row-reverse' : ''}`}>
            <div className={isReversed ? 'md:order-2' : ''}>
                <div className="w-12 h-12 bg-accent-start/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="text-accent-start" size={28} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
                <p className="text-lg text-text-secondary dark:text-dark-text-secondary mb-8 leading-relaxed">
                    {description}
                </p>
                <ul className="space-y-4">
                    {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                            <span className="font-medium text-text-primary dark:text-dark-text-primary">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={`relative ${isReversed ? 'md:order-1' : ''}`}>
                <div className="absolute -inset-4 bg-gradient-to-tr from-accent-start/20 to-accent-end/20 blur-2xl rounded-3xl opacity-50"></div>
                <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden bg-white dark:bg-dark-card-bg">
                    {/* Placeholder for specific feature screenshots */}
                    <div className="bg-slate-100 dark:bg-slate-800 aspect-video flex items-center justify-center">
                        <span className="text-slate-400 font-bold italic text-sm text-center px-10">
                            [Screenshot of {title} Interface]
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const FeaturesPage = () => {
    const navigate = useNavigate();

    return (
        <PublicLayout>
            {/* HERO SECTION */}
            <div className="container mx-auto px-5 py-24 max-w-5xl text-center">
                <span className="bg-accent-start/10 text-accent-start px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-6 inline-block">
                    The Platform
                </span>
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                    Everything you need to <br />
                    <span className="bg-gradient-to-r from-accent-start to-accent-end text-transparent bg-clip-text">run your empire solo.</span>
                </h1>
                <p className="text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto leading-relaxed">
                    Entruvi eliminates the "app-switching" fatigue by unifying the four pillars of a successful business into a single, intelligent workspace.
                </p>
            </div>

            {/* FEATURE SECTIONS */}
            <FeatureSection 
                icon={Users}
                title="CRM & Sales Intelligence"
                description="Never let a lead go cold again. Our CRM is designed for speed, giving you a bird's-eye view of your entire sales pipeline."
                items={[
                    "Drag-and-drop lead management",
                    "Automated follow-up reminders",
                    "Client communication history in one place",
                    "Pipeline value forecasting"
                ]}
            />

            <FeatureSection 
                icon={BarChart}
                isReversed={true}
                title="Finance & Cash Flow"
                description="Manage your money without the headache of complex accounting software. Built for consultants and creators."
                items={[
                    "Professional invoice generator",
                    "Integrated Stripe payments",
                    "Real-time expense tracking",
                    "Automatic tax-ready reports"
                ]}
            />

            <FeatureSection 
                icon={Bot}
                title="Your AI Co-Pilot"
                description="Entruvi doesn't just store data; it helps you work. Our AI assistant analyzes your business health and suggests next steps."
                items={[
                    "Business Health Score analytics",
                    "AI-generated email drafts",
                    "Document & meeting summarization",
                    "Smart task prioritization"
                ]}
            />

            <FeatureSection 
                icon={Globe}
                isReversed={true}
                title="Marketing & Social"
                description="Stay visible without staying glued to your phone. Plan and execute your content strategy directly from Entruvi."
                items={[
                    "Visual content calendar",
                    "AI-powered caption generation",
                    "Campaign performance tracking",
                    "Multi-channel scheduling"
                ]}
            />

            {/* FINAL CTA */}
            <section className="py-24 container mx-auto px-5 text-center">
                <div className="bg-slate-900 dark:bg-dark-card-bg rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent-start/20 to-transparent opacity-50"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to simplify your business?</h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                            Join founders who have saved an average of 15 hours a week by switching to Entruvi.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={() => navigate('/auth')} className="bg-accent-start hover:bg-accent-end text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-xl">
                                Start Free Trial
                            </button>
                            <button onClick={() => navigate('/contact')} className="bg-white/10 hover:bg-white/20 text-white font-bold px-10 py-4 rounded-2xl transition-all backdrop-blur-sm">
                                Talk to Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
};

export default FeaturesPage;