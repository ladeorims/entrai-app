import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from './public/PublicLayout';
import { Check } from 'lucide-react';
import Card from '../components/ui/Card';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <PublicLayout>
            <main className="container mx-auto px-5 max-w-7xl">
                {/* HERO */}
                <section className="grid md:grid-cols-[1.1fr,0.9fr] gap-8 items-center py-20 text-center md:text-left">
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-4">
                            Stop Juggling. <span className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-transparent bg-clip-text">Start Scaling.</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-text-secondary dark:text-dark-text-secondary mb-8 max-w-2xl mx-auto md:mx-0">
                            Entruvi is the all-in-one co-pilot for solo entrepreneurs. We integrate your sales, marketing, finance, and admin tasks into one intelligent platform, so you can focus on what you do best.
                        </p>
                        <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                            <button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-bold px-6 py-3 rounded-xl transition-transform transform hover:scale-105 shadow-lg">Get Started</button>
                            <a href="#demo" className="bg-slate-200 dark:bg-slate-800 text-text-primary dark:text-dark-text-primary font-semibold px-6 py-3 rounded-xl transition hover:bg-slate-300 dark:hover:bg-slate-700">See It in Action</a>
                        </div>
                    </div>
                   <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-accent-start/20 to-accent-end/20 blur-2xl rounded-full opacity-50"></div>
                        <div className="relative bg-white dark:bg-dark-card-bg border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 scale-100 group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden">
                            {/* Mock Health Gauge */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Business Health</h3>
                                    <p className="text-2xl font-black text-green-500">84% - Excellent</p>
                                </div>
                                <div className="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-green-500 rotate-45 flex items-center justify-center">
                                    <span className="text-xs font-bold -rotate-45">84</span>
                                </div>
                            </div>

                            {/* Mock Income/Expense Cards */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-slate-50 dark:bg-dark-primary-bg rounded-xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-xs text-text-secondary uppercase">Income</p>
                                    <p className="text-lg font-bold text-accent-start">$12,450</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-dark-primary-bg rounded-xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-xs text-text-secondary uppercase">Expenses</p>
                                    <p className="text-lg font-bold text-red-500">$3,210</p>
                                </div>
                            </div>

                            {/* Mock AI Recommendations */}
                            <div className="space-y-3">
                                <div className="h-2 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                <div className="flex gap-2 mt-4">
                                    <div className="h-8 w-24 bg-accent-start/10 rounded-lg border border-accent-start/20"></div>
                                    <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURES SECTION */}
                <section id="features" className="py-14">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-3">Your Entire Business, Unified</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary text-lg text-center mb-12 max-w-2xl mx-auto">One platform to manage the four pillars of your enterprise.</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-[1px] bg-gradient-to-br from-accent-start/50 to-accent-end/50 rounded-2xl transition-all duration-300 hover:-translate-y-1"><div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5"><span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Sales Hub</span><h3 className="text-xl font-bold my-2">CRM & Sales</h3><p className="text-text-secondary dark:text-dark-text-secondary">Automate lead tracking, manage your pipeline, and get AI-powered insights to close deals faster.</p></div></div>
                        <div className="p-[1px] bg-gradient-to-br from-accent-start/50 to-accent-end/50 rounded-2xl transition-all duration-300 hover:-translate-y-1"><div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5"><span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Marketing Suite</span><h3 className="text-xl font-bold my-2">Marketing</h3><p className="text-text-secondary dark:text-dark-text-secondary">Generate content, schedule social media posts, and analyze campaign performance effortlessly.</p></div></div>
                        <div className="p-[1px] bg-gradient-to-br from-accent-start/50 to-accent-end/50 rounded-2xl transition-all duration-300 hover:-translate-y-1"><div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5"><span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Finance Hub</span><h3 className="text-xl font-bold my-2">Finance</h3><p className="text-text-secondary dark:text-dark-text-secondary">Track expenses, manage invoices, and get a clear, real-time view of your financial health.</p></div></div>
                        <div className="p-[1px] bg-gradient-to-br from-accent-start/50 to-accent-end/50 rounded-2xl transition-all duration-300 hover:-translate-y-1"><div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5"><span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Virtual Assistant</span><h3 className="text-xl font-bold my-2">Assistant</h3><p className="text-text-secondary dark:text-dark-text-secondary">Delegate administrative tasks, manage your calendar, and automate repetitive workflows.</p></div></div>
                    </div>
                </section>
                
                {/* HOW IT WORKS SECTION */}
                <section id="how" className="py-14">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-3">How it Works</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary text-lg text-center mb-12 max-w-2xl mx-auto">From onboarding to automation — Entruvi keeps your business flowing.</p>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card><h3 className="text-xl font-bold mb-2">1. Onboard & Personalize</h3><p className="text-text-secondary dark:text-dark-text-secondary">Connect your tools, set your goals, and your workspace is tailored automatically.</p></Card>
                        <Card><h3 className="text-xl font-bold mb-2">2. Manage Everything</h3><p className="text-text-secondary dark:text-dark-text-secondary">Use the unified dashboard to see sales, cash flow, and tasks at a glance.</p></Card>
                        <Card><h3 className="text-xl font-bold mb-2">3. Automate the Busywork</h3><p className="text-text-secondary dark:text-dark-text-secondary">Win a deal → draft an invoice. Let the AI co-pilot handle repetitive tasks.</p></Card>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section id="faq" className="py-14">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4 md:items-start">
                        <Card><details><summary className="font-bold cursor-pointer">Do I need tech skills to use Entruvi?</summary><p className="text-text-secondary dark:text-dark-text-secondary mt-2">No. It’s built for busy entrepreneurs, not developers. The UI is simple, and the AI co-pilot helps at each step.</p></details></Card>
                        <Card><details><summary className="font-bold cursor-pointer">Can I invite my team?</summary><p className="text-text-secondary dark:text-dark-text-secondary mt-2">Yes. The Team plan includes up to 5 members with role‑based permissions.</p></details></Card>
                        <Card><details><summary className="font-bold cursor-pointer">How do payments work?</summary><p className="text-text-secondary dark:text-dark-text-secondary mt-2">Subscriptions are handled via Stripe. You can also accept Stripe payments for your invoices.</p></details></Card>
                        <Card><details><summary className="font-bold cursor-pointer">Is my data secure?</summary><p className="text-text-secondary dark:text-dark-text-secondary mt-2">We use industry‑standard security. Email is delivered via SendGrid, and payments via Stripe.</p></details></Card>
                    </div>
                </section>
                
                {/* DEMO SECTION */}
                <section id="demo" className="py-14">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-3">See it in action</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary text-lg text-center mb-8">A 2-minute overview of the unified dashboard.</p>
                    <div className="p-[1px] bg-gradient-to-br from-accent-start/50 to-accent-end/50 dark:from-dark-accent-start/50 dark:to-dark-accent-end/50 rounded-xl max-w-5xl mx-auto">
                        <div className="aspect-video bg-card-bg dark:bg-dark-card-bg rounded-[11px] grid place-items-center text-center">
                            <div>
                                <div className="text-6xl leading-none">▶</div>
                                <div className="text-sm text-text-secondary dark:text-dark-text-secondary mt-2">Demo video placeholder</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
};

export default LandingPage;