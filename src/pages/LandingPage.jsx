import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from './public/PublicLayout';
import { Check, X, AlertCircle, Clock, Zap, ShieldCheck, TrendingUp } from 'lucide-react';
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
                            <span className="bg-gradient-to-r from-accent-start to-accent-end text-transparent bg-clip-text">Scale Your Business.</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-text-secondary dark:text-dark-text-secondary mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                            The all-in-one co-pilot for Nigerian entrepreneurs. Unify your sales, marketing, and finance. Focus on growth, not paperwork.
                        </p>
                        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                            <button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-accent-start to-accent-end text-white font-bold px-10 py-4 rounded-2xl transition-all transform hover:scale-105 hover:shadow-2xl shadow-lg text-lg">
                                Start Your Free Trial
                            </button>
                        </div>
                        <div className="mt-8 flex items-center gap-6 justify-center md:justify-start text-sm text-text-secondary font-medium">
                            <span className="flex items-center gap-1.5"><ShieldCheck size={18} className="text-emerald-500"/> Secure Naira Payments</span>
                            <span className="flex items-center gap-1.5"><TrendingUp size={18} className="text-blue-500"/> Built for Scale</span>
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

                {/* 2. THE PROBLEM SECTION (REFINED STYLING - LESS WHITE) */}
                <section className="py-24 my-10 bg-slate-100/80 dark:bg-slate-900/40 rounded-[3rem] px-8 md:px-16 border border-slate-200/50 dark:border-slate-800/50">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">The Cost of Business Chaos</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary text-lg max-w-2xl mx-auto">Running a business in Nigeria is hard enough. Why let messy admin slow you down?</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Clock className="text-red-500"/>, title: "Fragmented Data", desc: "Leads in WhatsApp, invoices in Excel, and notes everywhere. Nothing talks to each other." },
                            { icon: <AlertCircle className="text-amber-500"/>, title: "Forgotten Follow-ups", desc: "In the hustle of daily operations, 60% of cold leads never get a second call." },
                            { icon: <TrendingUp className="text-blue-500"/>, title: "The Growth Ceiling", desc: "You can't grow because you are manually doing everything from invoicing to social media." }
                        ].map((item, i) => (
                            <div key={i} className="group relative p-8 rounded-3xl bg-white dark:bg-dark-card-bg border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. PRICING SECTION (LOCALIZED NAIRA) */}
                <section id="pricing" className="py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">Simple, Local Pricing</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary">No dollar fluctuations. No hidden fees. Just pure growth.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { name: "Basic", price: "7,000", desc: "Perfect for solo founders starting out." },
                            { name: "Premium", price: "15,000", desc: "Advanced AI features for growing brands.", featured: true },
                            { name: "Team", price: "50,000", desc: "Scale your empire with up to 5 members." }
                        ].map((plan, i) => (
                            <div key={i} className={`p-8 rounded-[2.5rem] border ${plan.featured ? 'border-accent-start bg-slate-900 text-white shadow-2xl scale-105 relative' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card-bg'}`}>
                                {plan.featured && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-start text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase">Most Popular</span>}
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-3xl font-black">₦{plan.price}</span>
                                    <span className={`${plan.featured ? 'text-slate-400' : 'text-text-secondary'} text-sm`}>/month</span>
                                </div>
                                <p className={`${plan.featured ? 'text-slate-400' : 'text-text-secondary'} text-sm mb-8`}>{plan.desc}</p>
                                <ul className="space-y-4 mb-8">
                                    {["CRM & Sales", "Finance & Invoices", "AI Recommendations"].map((item, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm">
                                            <Check size={16} className="text-accent-start" /> {item}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.featured ? 'bg-accent-start hover:bg-accent-end text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>Choose {plan.name}</button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. COMPARISON SECTION (DARK BACKGROUND) */}
                <section className="py-24 bg-slate-900 rounded-[4rem] text-white px-8 md:px-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-start/10 blur-[150px] rounded-full"></div>
                    <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Built for the <br />Nigerian Hustle.</h2>
                            <p className="text-slate-400 text-lg mb-10 leading-relaxed">Stop paying for five different international apps in dollars. Entruvi is your unified hub, built to handle local business needs.</p>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-accent-start font-bold">₦</div>
                                    <p className="font-semibold">Billed in Naira — No bank limits or DCC issues.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-accent-start"><Zap /></div>
                                    <p className="font-semibold">Local Payment Integrations — Get paid via bank transfer & cards.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] p-10 border border-white/10 shadow-2xl">
                             <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10 text-sm">
                                        <th className="text-left pb-6 font-bold uppercase tracking-widest text-slate-500">Feature</th>
                                        <th className="text-center pb-6 text-accent-start font-bold uppercase tracking-widest">Entruvi</th>
                                        <th className="text-center pb-6 text-slate-600 font-bold uppercase tracking-widest">Global Apps</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-300">
                                    {[
                                        { n: "Naira Billing", e: true, o: false },
                                        { n: "AI Co-pilot", e: true, o: true },
                                        { n: "Unified Hub", e: true, o: false },
                                        { n: "Integrated Invoices", e: true, o: true }
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-white/5">
                                            <td className="py-5 font-medium">{row.n}</td>
                                            <td className="py-5 text-center"><Check className="mx-auto text-emerald-400" size={20} /></td>
                                            <td className="py-5 text-center">{row.o ? <Check className="mx-auto text-slate-600" size={20} /> : <X className="mx-auto text-red-500/30" size={20} />}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 5. FINAL CTA */}
                <section className="py-32">
                    <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[4rem] bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-dark-card-bg border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
                        <h2 className="text-4xl md:text-6xl font-black mb-6">Build Your Lean Empire.</h2>
                        <p className="text-xl text-text-secondary mb-10">Join the waitlist or start your trial today.</p>
                        <button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-accent-start to-accent-end text-white font-bold px-12 py-5 rounded-2xl hover:scale-105 transition-transform shadow-xl text-xl">
                            Get Started Free
                        </button>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
};

export default LandingPage;