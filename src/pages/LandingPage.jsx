import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from './public/PublicLayout';
import { Check } from 'lucide-react';
import Card from '../components/ui/Card';
// Ensure the path to your assets folder is correct based on your file structure
import dashboardImg from '../assets/dashboard-image.png';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <PublicLayout>
            <main className="container mx-auto px-5 max-w-7xl">
                {/* HERO SECTION */}
                <section className="grid md:grid-cols-[1.1fr,0.9fr] gap-12 items-center py-20 text-center md:text-left">
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-4">
                            Stop Juggling. <span className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-transparent bg-clip-text">Start Scaling.</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-text-secondary dark:text-dark-text-secondary mb-8 max-w-2xl mx-auto md:mx-0">
                            Entruvi is the all-in-one co-pilot for solo entrepreneurs. We integrate your sales, marketing, finance, and admin tasks into one intelligent platform, so you can focus on what you do best.
                        </p>
                        <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                            <button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-bold px-8 py-4 rounded-xl transition-transform transform hover:scale-105 shadow-lg">
                                Get Started Free
                            </button>
                            <a href="#demo" className="bg-slate-200 dark:bg-slate-800 text-text-primary dark:text-dark-text-primary font-semibold px-8 py-4 rounded-xl transition hover:bg-slate-300 dark:hover:bg-slate-700">
                                See It in Action
                            </a>
                        </div>
                    </div>

                    {/* DASHBOARD IMAGE WRAPPER */}
                    <div className="relative group">
                        {/* Background Glow Effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-accent-start/30 to-accent-end/30 blur-3xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                        
                        {/* Browser Frame Styling */}
                        <div className="relative bg-white dark:bg-dark-card-bg border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden scale-100 group-hover:scale-[1.02] transition-transform duration-500">
                            {/* Mock Browser Header Dots */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                            </div>
                            
                            {/* THE ACTUAL DASHBOARD IMAGE */}
                            <img 
                                src={dashboardImg} 
                                alt="Entruvi Dashboard Analytics" 
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </section>

                {/* FEATURES SECTION */}
                <section id="features" className="py-14">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-3">Your Entire Business, Unified</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary text-lg text-center mb-12 max-w-2xl mx-auto">One platform to manage the four pillars of your enterprise.</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-[1px] bg-gradient-to-br from-accent-start/50 to-accent-end/50 rounded-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5">
                                <span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Sales Hub</span>
                                <h3 className="text-xl font-bold my-2">CRM & Sales</h3>
                                <p className="text-text-secondary dark:text-dark-text-secondary text-sm leading-relaxed">Automate lead tracking, manage your pipeline, and get AI-powered insights to close deals faster.</p>
                            </div>
                        </div>
                        <div className="p-[1px] bg-gradient-to-br from-accent-start/50 to-accent-end/50 rounded-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5">
                                <span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Marketing Suite</span>
                                <h3 className="text-xl font-bold my-2">Marketing</h3>
                                <p className="text-text-secondary dark:text-dark-text-secondary text-sm leading-relaxed">Generate content, schedule social media posts, and analyze campaign performance effortlessly.</p>
                            </div>
                        </div>
                        <div className="p-[1px] bg-gradient-to-br from-accent-start/50 to-accent-end/50 rounded-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5">
                                <span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Finance Hub</span>
                                <h3 className="text-xl font-bold my-2">Finance</h3>
                                <p className="text-text-secondary dark:text-dark-text-secondary text-sm leading-relaxed">Track expenses, manage invoices, and get a clear, real-time view of your financial health.</p>
                            </div>
                        </div>
                        <div className="p-[1px] bg-gradient-to-br from-accent-start/50 to-accent-end/50 rounded-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5">
                                <span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Virtual Assistant</span>
                                <h3 className="text-xl font-bold my-2">Assistant</h3>
                                <p className="text-text-secondary dark:text-dark-text-secondary text-sm leading-relaxed">Delegate administrative tasks, manage your calendar, and automate repetitive workflows.</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* HOW IT WORKS SECTION */}
                <section id="how" className="py-14">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-3">How it Works</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary text-lg text-center mb-12 max-w-2xl mx-auto">From onboarding to automation — Entruvi keeps your business flowing.</p>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card><h3 className="text-xl font-bold mb-2">1. Onboard & Personalize</h3><p className="text-text-secondary dark:text-dark-text-secondary text-sm">Connect your tools, set your goals, and your workspace is tailored automatically.</p></Card>
                        <Card><h3 className="text-xl font-bold mb-2">2. Manage Everything</h3><p className="text-text-secondary dark:text-dark-text-secondary text-sm">Use the unified dashboard to see sales, cash flow, and tasks at a glance.</p></Card>
                        <Card><h3 className="text-xl font-bold mb-2">3. Automate the Busywork</h3><p className="text-text-secondary dark:text-dark-text-secondary text-sm">Win a deal → draft an invoice. Let the AI co-pilot handle repetitive tasks.</p></Card>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section id="faq" className="py-14">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4 md:items-start">
                        <Card><details className="group"><summary className="font-bold cursor-pointer list-none flex justify-between items-center">Do I need tech skills to use Entruvi? <span className="transition-transform group-open:rotate-180">▾</span></summary><p className="text-text-secondary dark:text-dark-text-secondary mt-2 text-sm">No. It’s built for busy entrepreneurs, not developers. The UI is simple, and the AI co-pilot helps at each step.</p></details></Card>
                        <Card><details className="group"><summary className="font-bold cursor-pointer list-none flex justify-between items-center">Can I invite my team? <span className="transition-transform group-open:rotate-180">▾</span></summary><p className="text-text-secondary dark:text-dark-text-secondary mt-2 text-sm">Yes. The Team plan includes up to 5 members with role‑based permissions.</p></details></Card>
                        <Card><details className="group"><summary className="font-bold cursor-pointer list-none flex justify-between items-center">How do payments work? <span className="transition-transform group-open:rotate-180">▾</span></summary><p className="text-text-secondary dark:text-dark-text-secondary mt-2 text-sm">Subscriptions are handled via Stripe. You can also accept Stripe payments for your invoices.</p></details></Card>
                        <Card><details className="group"><summary className="font-bold cursor-pointer list-none flex justify-between items-center">Is my data secure? <span className="transition-transform group-open:rotate-180">▾</span></summary><p className="text-text-secondary dark:text-dark-text-secondary mt-2 text-sm">We use industry‑standard security. Email is delivered via SendGrid, and payments via Stripe.</p></details></Card>
                    </div>
                </section>
                
                {/* DEMO SECTION */}
                <section id="demo" className="py-14 mb-20">
                    <h2 className="text-4xl lg:text-5xl font-bold text-center mb-3">See it in action</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary text-lg text-center mb-8">A 2-minute overview of the unified dashboard.</p>
                    <div className="p-[1px] bg-gradient-to-br from-accent-start/50 to-accent-end/50 dark:from-dark-accent-start/50 dark:to-dark-accent-end/50 rounded-xl max-w-5xl mx-auto">
                        <div className="aspect-video bg-card-bg dark:bg-dark-card-bg rounded-[11px] grid place-items-center text-center">
                            <div>
                                <div className="text-6xl leading-none cursor-pointer hover:scale-110 transition-transform">▶</div>
                                <div className="text-sm text-text-secondary dark:text-dark-text-secondary mt-2 font-medium">Click to Play Demo</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
};

export default LandingPage;