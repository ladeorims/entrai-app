import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from './public/PublicLayout';
import { Check, X, AlertCircle, Clock, Zap, ShieldCheck } from 'lucide-react';
import Card from '../components/ui/Card';
import dashboardImg from '../assets/dashboard-image.png';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <PublicLayout>
            <main className="container mx-auto px-5 max-w-7xl">
                {/* 1. HERO SECTION */}
                <section className="grid md:grid-cols-[1.1fr,0.9fr] gap-12 items-center py-20 text-center md:text-left">
                    <div className="animate-in fade-in slide-in-from-left duration-700">
                        <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6">
                            Stop Juggling. <br />
                            <span className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-transparent bg-clip-text">Start Scaling.</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-text-secondary dark:text-dark-text-secondary mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                            Entruvi is the all-in-one co-pilot for solo entrepreneurs. We unify your sales, marketing, and finance into one intelligent platform.
                        </p>
                        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                            <button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-accent-start to-accent-end text-white font-bold px-10 py-4 rounded-2xl transition-all transform hover:scale-105 hover:shadow-2xl shadow-lg text-lg">
                                Get Started Free
                            </button>
                            <a href="#demo" className="bg-slate-100 dark:bg-slate-800 text-text-primary dark:text-dark-text-primary font-bold px-8 py-4 rounded-2xl transition hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700">
                                See It in Action
                            </a>
                        </div>
                        <div className="mt-8 flex items-center gap-6 justify-center md:justify-start text-sm text-text-secondary font-medium">
                            <span className="flex items-center gap-1.5"><ShieldCheck size={18} className="text-emerald-500"/> Bank-level Security</span>
                            <span className="flex items-center gap-1.5"><Zap size={18} className="text-amber-500"/> No-code Setup</span>
                        </div>
                    </div>

                    <div className="relative group animate-in fade-in zoom-in duration-1000">
                        <div className="absolute -inset-10 bg-gradient-to-r from-accent-start/20 to-accent-end/20 blur-[100px] rounded-full opacity-50"></div>
                        <div className="relative bg-white dark:bg-dark-card-bg border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-transform duration-500 group-hover:scale-[1.01]">
                            <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 px-5 py-4 flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            </div>
                            <img src={dashboardImg} alt="Entruvi Dashboard" className="w-full h-auto" />
                        </div>
                    </div>
                </section>

                {/* 2. THE PROBLEM SECTION (NEW) */}
                <section className="py-20 border-y border-slate-100 dark:border-slate-800/50">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">The Cost of Business Chaos</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary text-lg">Most founders lose 20+ hours a week to "administrative friction."</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Clock className="text-red-500"/>, title: "Fragmented Data", desc: "Your leads are in one app, invoices in another, and tasks on a sticky note. Nothing talks to each other." },
                            { icon: <AlertCircle className="text-amber-500"/>, title: "Forgotten Follow-ups", desc: "60% of leads go cold because solo founders are too busy managing spreadsheets to send a simple email." },
                            { icon: <Check className="text-blue-500"/>, title: "Scaling Ceiling", desc: "You can't grow because you're the bottleneck for every invoice, social post, and calendar invite." }
                        ].map((item, i) => (
                            <div key={i} className="text-center p-8 rounded-3xl bg-slate-50/50 dark:bg-slate-800/20">
                                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">{item.icon}</div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. FEATURES SECTION (REFINED) */}
                <section id="features" className="py-24">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Your Entire Business, Unified</h2>
                            <p className="text-text-secondary dark:text-dark-text-secondary text-lg leading-relaxed">One platform to manage the four pillars of your enterprise. No integrations required.</p>
                        </div>
                        <button onClick={() => navigate('/features')} className="text-accent-start font-bold flex items-center gap-2 hover:gap-3 transition-all">Explore all features →</button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Sales Hub", title: "CRM & Sales", desc: "Automate lead tracking and close deals faster with AI-powered insights.", color: "from-blue-500/20" },
                            { label: "Marketing", title: "Marketing Suite", desc: "Generate content and schedule posts without leaving the dashboard.", color: "from-purple-500/20" },
                            { label: "Finance", title: "Finance Hub", desc: "Track cash flow and manage invoices with real-time financial health scores.", color: "from-emerald-500/20" },
                            { label: "AI Assistant", title: "Virtual Assistant", desc: "Delegate admin tasks to your AI co-pilot and focus on deep work.", color: "from-orange-500/20" }
                        ].map((f, i) => (
                            <div key={i} className={`p-[1px] bg-gradient-to-br ${f.color} to-transparent rounded-3xl transition-all hover:-translate-y-2`}>
                                <div className="bg-card-bg dark:bg-dark-card-bg rounded-[23px] h-full p-8 border border-slate-100 dark:border-slate-800/50 shadow-sm">
                                    <span className="text-xs font-bold uppercase tracking-widest text-accent-start mb-4 block">{f.label}</span>
                                    <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
                                    <p className="text-text-secondary dark:text-dark-text-secondary text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. COMPARISON SECTION (NEW) */}
                <section className="py-20 bg-slate-900 rounded-[3rem] text-white px-8 md:px-16 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent-start/20 blur-[120px] rounded-full"></div>
                    <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Replace 5+ Apps with One Subscription</h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">Stop paying for a CRM, an invoicing tool, a social scheduler, and a project manager. Entruvi does it all for a fraction of the cost.</p>
                            <ul className="space-y-4">
                                {["Save $150+/month in subscriptions", "Zero 'context-switching' between tabs", "Unified data means better AI insights"].map((text, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-200"><Check className="text-emerald-400" size={20}/> {text}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left pb-4 font-bold text-xl">Capability</th>
                                        <th className="text-center pb-4 text-accent-start font-bold">Entruvi</th>
                                        <th className="text-center pb-4 text-slate-500 font-bold">Others</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-300">
                                    {[
                                        { n: "Unified Dashboard", e: true, o: false },
                                        { n: "AI Co-pilot", e: true, o: false },
                                        { n: "Integrated Finance", e: true, o: true },
                                        { n: "Content Scheduler", e: true, o: false }
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-white/5">
                                            <td className="py-4 font-medium">{row.n}</td>
                                            <td className="py-4 text-center"><Check className="mx-auto text-emerald-400" /></td>
                                            <td className="py-4 text-center">{row.o ? <Check className="mx-auto text-slate-500" /> : <X className="mx-auto text-red-400/50" />}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 5. FINAL CTA (NEW) */}
                <section className="py-32 text-center">
                    <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-dark-card-bg border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent-start/10 blur-[80px] rounded-full"></div>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Ready to build your <br /><span className="text-accent-start">Lean Empire?</span></h2>
                        <p className="text-xl text-text-secondary dark:text-dark-text-secondary mb-10 max-w-xl mx-auto leading-relaxed">Join hundreds of founders who are reclaiming their time with Entruvi.</p>
                        <button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-accent-start to-accent-end text-white font-bold px-12 py-5 rounded-2xl hover:scale-105 transition-transform shadow-xl text-xl">
                            Get Started for Free
                        </button>
                        <p className="mt-6 text-sm text-text-secondary">No credit card required. 14-day free trial.</p>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
};

export default LandingPage;