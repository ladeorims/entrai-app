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
                    <div className="hidden md:block bg-gradient-to-b from-slate-100 to-slate-200/50 dark:from-slate-800 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-dashed border-slate-300 dark:border-slate-700 mb-3">
                            <div className="flex gap-1.5"><i className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></i><i className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></i><i className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></i></div>
                            <div className="font-bold text-text-secondary dark:text-dark-text-secondary text-sm">Entruvi • Dashboard</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3.5">
                            <div className="bg-card-bg dark:bg-dark-card-bg border border-slate-200 dark:border-slate-700 rounded-xl p-3.5"><div className="text-sm text-text-secondary dark:text-dark-text-secondary">Business Health</div><div className="text-3xl font-extrabold mt-1">82<span className="text-sm font-semibold text-green-500">/100</span></div></div>
                            <div className="bg-card-bg dark:bg-dark-card-bg border border-slate-200 dark:border-slate-700 rounded-xl p-3.5"><div className="text-sm text-text-secondary dark:text-dark-text-secondary">This Week</div><div className="text-2xl font-bold mt-1 text-green-500">+$1,250</div></div>
                            <div className="bg-card-bg dark:bg-dark-card-bg border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 col-span-2"><div className="text-sm text-text-secondary dark:text-dark-text-secondary">AI Suggestion</div><div className="text-sm font-semibold text-text-primary dark:text-dark-text-primary mt-1.5 leading-snug">"Follow up with the 'Innovate Inc.' deal to keep momentum."</div></div>
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