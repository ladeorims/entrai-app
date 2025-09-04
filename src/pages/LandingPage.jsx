/* eslint-disable no-irregular-whitespace */
import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import AnimatedLogo from '../components/AnimatedLogo';

const LandingPage = ({ onLaunchApp, onStartTrial, onSelectPlan }) => {
  // This hook handles smooth scrolling for anchor links and sets the footer year.
  useEffect(() => {
    // Smooth scroll for internal links
    const handleSmoothScroll = (e) => {
      const id = e.currentTarget.getAttribute('href');
      if (id && id.startsWith('#') && id.length > 1) {
        e.preventDefault();
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', handleSmoothScroll);
    });

    // Set dynamic year in the footer
    const yearEl = document.getElementById('yr');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    // Cleanup function to remove event listeners
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-primary-bg dark:bg-dark-primary-bg text-text-primary dark:text-dark-text-primary font-sans">
            <header className="sticky top-0 bg-card-bg/80 dark:bg-dark-card-bg/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
                <div className="container mx-auto px-5 py-3.5 flex items-center justify-between max-w-7xl">
                    <div className="flex items-center gap-2.5 font-extrabold tracking-wide">
                        <AnimatedLogo />                        
                    </div>
          <nav className="hidden md:flex items-center gap-5 text-text-secondary dark:text-dark-text-secondary font-semibold">
            <a href="#features" className="hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">Features</a>
            <a href="#how" className="hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-text-primary dark:hover:text-dark-text-primary transition-colors">FAQ</a>
            <button onClick={handleToggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button onClick={onLaunchApp} className="ml-2 bg-transparent border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-text-secondary dark:text-dark-text-secondary font-semibold px-4 py-2 rounded-xl transition">Sign in</button>
            <button onClick={onStartTrial} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-semibold px-4 py-2 rounded-xl transition shadow-lg hover:opacity-90">Start Free</button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-5 max-w-7xl">
        {/* HERO */}
        <section className="grid md:grid-cols-[1.1fr,0.9fr] gap-8 items-center py-16">
          <div>
            <span className="inline-block font-extrabold text-bg bg-gradient-to-r from-brand to-brand-2 px-3 py-1.5 rounded-full mb-3">New • AI Business OS</span>
            {/* --- CONTENT FROM YOUR OLD SITE --- */}
            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-4">
                                Stop Juggling. <span className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-transparent bg-clip-text">Start Scaling.</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted mb-6">
              Entrai is the all-in-one co-pilot for solo entrepreneurs. We integrate your sales, marketing, finance, and admin tasks into one intelligent platform, so you can focus on what you do best.
            </p>
            {/* --- END OF OLD CONTENT --- */}
            <div className="flex items-center gap-3 flex-wrap">
                <button onClick={onStartTrial} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-bold px-6 py-3 rounded-xl transition-transform transform hover:scale-105 shadow-lg">Get Started Free</button>
                {/* CHANGE: Restyled secondary button for better contrast and a more solid feel */}
                <a href="#demo" className="bg-slate-200 dark:bg-slate-800 text-text-primary dark:text-dark-text-primary font-semibold px-6 py-3 rounded-xl transition hover:bg-slate-300 dark:hover:bg-slate-700">See It in Action</a>
                <span className="text-sm text-text-secondary dark:text-dark-text-secondary">No credit card required</span>
            </div>

          </div>
          <div className="bg-gradient-to-b from-[#121828] to-[#0f1624] border border-[#2a3350] rounded-2xl shadow-lg shadow-black/30 p-4">
            <div className="flex items-center gap-2 pb-3 border-b border-dashed border-[#26304b] mb-3">
              <div className="flex gap-1.5">
                <i className="w-2.5 h-2.5 rounded-full bg-[#3b4664]"></i>
                <i className="w-2.5 h-2.5 rounded-full bg-[#3b4664]"></i>
                <i className="w-2.5 h-2.5 rounded-full bg-[#3b4664]"></i>
              </div>
              <div className="font-bold text-[#cbd7ec]">Entrai • Dashboard</div>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-[#0f1626] border border-[#28324b] rounded-xl p-3.5">
                <div className="text-sm text-[#a9b4c9]">Business Health</div>
                <div className="text-3xl font-extrabold mt-1">82<span className="text-sm font-semibold text-[#9fb7ff]">/100</span></div>
              </div>
              <div className="bg-[#0f1626] border border-[#28324b] rounded-xl p-3.5">
                <div className="text-sm text-[#a9b4c9]">Automation Feed</div>
                <div className="text-sm text-[#a9b4c9] mt-1.5 leading-snug">✓ Deal won → Invoice created<br/>✓ Follow‑up scheduled</div>
              </div>
              <div className="bg-[#0f1626] border border-[#28324b] rounded-xl p-3.5 col-span-2">
                <div className="text-sm text-[#a9b4c9]">AI Suggestions</div>
                <div className="text-sm text-[#a9b4c9] mt-1.5 leading-snug">• "Send check‑in to warm leads"<br/>• "Review cash flow for Q4"</div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-14">
                        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-3">Your Entire Business, Unified</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary text-lg text-center mb-12 max-w-2xl mx-auto">One platform to manage the four pillars of your enterprise.</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            
                            {/* CHANGE: Cards are now wrapped in a div with a gradient background to create a border effect. */}
                            <div className="p-[1px] bg-gradient-to-br from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end rounded-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5">
                                    <span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Sales Hub</span>
                                    <h3 className="text-xl font-bold my-2">Sales</h3> {/* Text updated */}
                                    <p className="text-text-secondary dark:text-dark-text-secondary">Automate lead tracking, manage your pipeline, and get AI-powered insights to close deals faster.</p>
                                </div>
                            </div>
                            
                            <div className="p-[1px] bg-gradient-to-br from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end rounded-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5">
                                    <span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Marketing Suite</span>
                                    <h3 className="text-xl font-bold my-2">Marketing</h3> {/* Text updated */}
                                    <p className="text-text-secondary dark:text-dark-text-secondary">Generate content, schedule social media posts, and analyze campaign performance effortlessly.</p>
                                </div>
                            </div>

                            <div className="p-[1px] bg-gradient-to-br from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end rounded-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5">
                                    <span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Finance Hub</span>
                                    <h3 className="text-xl font-bold my-2">Finance Hub</h3>
                                    <p className="text-text-secondary dark:text-dark-text-secondary">Track expenses, manage invoices, and get a clear, real-time view of your financial health.</p>
                                </div>
                            </div>

                            <div className="p-[1px] bg-gradient-to-br from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end rounded-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5">
                                    <span className="text-xs text-text-secondary dark:text-dark-text-secondary bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 inline-block">Virtual Assistant</span>
                                    <h3 className="text-xl font-bold my-2">Virtual Assistant</h3>
                                    <p className="text-text-secondary dark:text-dark-text-secondary">Delegate administrative tasks, manage your calendar, and automate repetitive workflows.</p>
                                </div>
                            </div>
                        </div>
                    </section>

        {/* HOW IT WORKS */}
                    <section id="how" className="py-14">
                        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-3">How it works</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary text-lg text-center mb-12">From onboarding to automation — Entrai keeps your business flowing.</p>
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* CHANGE: Applied gradient border card style */}
                            <div className="p-[1px] bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl">
                                <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5">
                                    <h3 className="text-xl font-bold mb-2">1) Onboard & Personalize</h3>
                                    <p className="text-text-secondary dark:text-dark-text-secondary">Connect your tools, set your goals, and your workspace is tailored automatically.</p>
                                </div>
                            </div>
                            <div className="p-[1px] bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl">
                                <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5">
                                    <h3 className="text-xl font-bold mb-2">2) Manage Everything</h3>
                                    <p className="text-text-secondary dark:text-dark-text-secondary">Use the unified dashboard to see sales, cash flow, and tasks at a glance.</p>
                                </div>
                            </div>
                            <div className="p-[1px] bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl">
                                <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-5">
                                    <h3 className="text-xl font-bold mb-2">3) Automate the Busywork</h3>
                                    <p className="text-text-secondary dark:text-dark-text-secondary">Win a deal → draft an invoice. Let the AI co-pilot handle repetitive tasks.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PRICING */}
                    <section id="pricing" className="py-14">
                        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-3">Simple, fair pricing</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary text-lg text-center mb-12">Start for free, and scale as you grow. No hidden fees.</p>
                        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
                            {/* Starter Plan */}
                            <div className="p-[1px] bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl">
                                <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-6 flex flex-col">
                                    <h3 className="text-2xl font-bold">Starter</h3>
                                    {/* CHANGE: Applied gradient to price text */}
                                    <div className="text-5xl font-extrabold my-2 bg-gradient-to-r from-accent-start to-accent-end text-transparent bg-clip-text">$0<span className="text-lg font-medium text-text-secondary dark:text-dark-text-secondary"> / mo</span></div>
                                    <p className="text-text-secondary dark:text-dark-text-secondary mb-4">Perfect for testing.</p>
                                    <ul className="space-y-2.5 text-text-secondary dark:text-dark-text-secondary mb-6">
                                      <li className="flex items-center"> All Core Features</li>

                                <li className="flex items-center"> Unlimited AI Generations</li>

                                <li className="flex items-center"> Advanced Analytics</li>

                                <li className="flex items-center"> Priority Support</li>
                                    </ul>
                                    <div className="flex-grow"></div>
                                    {/* Starter Plan Button */}
                                  <button onClick={onStartTrial} className="w-full mt-4 bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-semibold py-3 rounded-lg transition hover:opacity-90">
                                        Get Started Free
                                  </button>                               
                                   </div>
                            </div>
                            {/* Solo Plan (Most Popular) */}
                            <div className="p-[1px] bg-gradient-to-br from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end rounded-2xl shadow-lg">
                                <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-6 flex flex-col">
                                    <h3 className="text-2xl font-bold">Solo</h3>
                                    <div className="text-5xl font-extrabold my-2 bg-gradient-to-r from-accent-start to-accent-end text-transparent bg-clip-text">$15.99<span className="text-lg font-medium text-text-secondary dark:text-dark-text-secondary"> / mo</span></div>
                                    <p className="text-text-secondary dark:text-dark-text-secondary mb-4">Everything you need.</p>
                                    <ul className="space-y-2.5 text-text-secondary dark:text-dark-text-secondary mb-6">
                                      <li className="flex items-center"> Everything in Pro</li>

                                <li className="flex items-center"> Dedicated Account Manager</li>

                                <li className="flex items-center"> Custom Integrations</li>

                                <li className="flex items-center"> Team Collaboration Tools</li>
                                    </ul>
                                    <div className="flex-grow"></div>
                                    <button onClick={() => onSelectPlan('Solo')} className="w-full mt-4 bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-semibold py-3 rounded-lg transition hover:opacity-90">
                                      Choose Solo
                                    </button>
                                </div>
                            </div>
                            {/* Team Plan */}
                            <div className="p-[1px] bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl">
                                <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-6 flex flex-col">
                                    <h3 className="text-2xl font-bold">Team</h3>
                                    <div className="text-5xl font-extrabold my-2 bg-gradient-to-r from-accent-start to-accent-end text-transparent bg-clip-text">$25<span className="text-lg font-medium text-text-secondary dark:text-dark-text-secondary"> / mo</span></div>
                                    <p className="text-text-secondary dark:text-dark-text-secondary mb-4">For small teams.</p>
                                    <ul className="space-y-2.5 text-text-secondary dark:text-dark-text-secondary mb-6">...</ul>
                                    <div className="flex-grow"></div>
                                    <button onClick={() => onSelectPlan('Team')} className="w-full mt-4 bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-semibold py-3 rounded-lg transition hover:opacity-90">
                                          Choose Team
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
        {/* FAQ */}
        <section id="faq" className="py-14">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12">Frequently asked questions</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4 md:items-start">
            <div className="p-[1px] bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl">
              <details className="bg-card-bg dark:bg-dark-card-bg rounded-[11px] p-4 cursor-pointer">
              <summary className="font-bold">Do I need tech skills to use Entrai?</summary>
              <p className="text-text-secondary dark:text-dark-text-secondary mt-2">No. It’s built for busy entrepreneurs, not developers. The UI is simple, and the AI co-pilot helps at each step.</p>
              </details>
            </div>

            <div className="p-[1px] bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl">
              <details className="bg-card-bg dark:bg-dark-card-bg rounded-[11px] p-4 cursor-pointer">
              <summary className="font-bold">Can I invite my team?</summary>
              <p className="text-text-secondary dark:text-dark-text-secondary mt-2">Yes. The Team plan includes up to 5 members with role‑based permissions.</p>
              </details>
            </div>
            
            <div className="p-[1px] bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl">
              <details className="bg-card-bg dark:bg-dark-card-bg rounded-[11px] p-4 cursor-pointer">
              <summary className="font-bold">How do payments work?</summary>
              <p className="text-text-secondary dark:text-dark-text-secondary mt-2">Subscriptions are handled via Stripe. You can also accept Stripe payments for your invoices.</p>
            </details>
            </div>
            
            <div className="p-[1px] bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl">            
              <details className="bg-card-bg dark:bg-dark-card-bg rounded-[11px] p-4 cursor-pointer">
              <summary className="font-bold">Is my data secure?</summary>
              <p className="text-text-secondary dark:text-dark-text-secondary mt-2">We use industry‑standard security. Email is delivered via Gmail/SendGrid, and payments via Stripe.</p>
            </details>
            </div>

          </div>
        </section>

        {/* DEMO */}
                    <section id="demo" className="py-14">
                        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-3">See it in action</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary text-lg text-center mb-8">A 2-minute overview of the unified dashboard.</p>
                        {/* CHANGE: Applied gradient border to video placeholder */}
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

       <footer className="border-t border-slate-200 dark:border-slate-800 mt-14">
                    <div className="container mx-auto px-5 py-16 max-w-7xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {/* Column 1: About */}
                            <div className="md:col-span-1 lg:col-span-1">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-accent-start to-accent-end text-transparent bg-clip-text mb-3">Entrai</h3>
                                <p className="text-text-secondary dark:text-dark-text-secondary text-sm">Your virtual COO. Less admin, more growth.</p>
                            </div>
                            {/* Column 2: Product */}
                            <div>
                                <h4 className="font-semibold mb-4">Product</h4>
                                <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary">
                                    <li><a href="#features" className="hover:text-accent-start dark:hover:text-dark-accent-start">Features</a></li>
                                    <li><a href="#pricing" className="hover:text-accent-start dark:hover:text-dark-accent-start">Pricing</a></li>
                                    <li><a href="#how" className="hover:text-accent-start dark:hover:text-dark-accent-start">How it works</a></li>
                                </ul>
                            </div>
                            {/* Column 3: Company */}
                            <div>
                                <h4 className="font-semibold mb-4">Company</h4>
                                <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary">
                                    <li><a href="#" className="hover:text-accent-start dark:hover:text-dark-accent-start">About</a></li>
                                    <li><a href="#" className="hover:text-accent-start dark:hover:text-dark-accent-start">Careers</a></li>
                                    <li><a href="#" className="hover:text-accent-start dark:hover:text-dark-accent-start">Contact</a></li>
                                </ul>
                            </div>
                            {/* Column 4: Legal */}
                            <div>
                                <h4 className="font-semibold mb-4">Legal</h4>
                                <ul className="space-y-3 text-text-secondary dark:text-dark-text-secondary">
                                    <li><a href="#" className="hover:text-accent-start dark:hover:text-dark-accent-start">Privacy</a></li>
                                    <li><a href="#" className="hover:text-accent-start dark:hover:text-dark-accent-start">Terms</a></li>
                                    <li><a href="#" className="hover:text-accent-start dark:hover:text-dark-accent-start">Security</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-text-secondary dark:text-dark-text-secondary">
                            © 2025 Entrai. All rights reserved.
                        </div>
                    </div>
          </footer>
    </div>
    </div>
     
  );
};

export default LandingPage;