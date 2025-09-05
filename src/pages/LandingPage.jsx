// /* eslint-disable no-irregular-whitespace */
import React from 'react';
// import { Sun, Moon, Menu, X, Check } from 'lucide-react';
import PublicLayout from './public/PublicLayout';
import AnimatedLogo from '../components/AnimatedLogo';

const LandingPage = ({ onLaunchApp, onStartTrial, onSelectPlan, setActiveView }) => {
   

    return (

      <PublicLayout 
            activeView="Landing" 
            setActiveView={setActiveView} 
            onLaunchApp={onLaunchApp} 
            onStartTrial={onStartTrial}
        >

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
                    <div className="p-[1px] bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl">
                        <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-6 flex flex-col">
                            <h3 className="text-2xl font-bold">Starter</h3>
                            <div className="text-5xl font-extrabold my-2 bg-gradient-to-r from-accent-start to-accent-end text-transparent bg-clip-text">$0<span className="text-lg font-medium text-text-secondary dark:text-dark-text-secondary"> / mo</span></div>
                            <p className="text-text-secondary dark:text-dark-text-secondary mb-4">For individuals getting started.</p>
                            <ul className="space-y-2.5 text-text-secondary dark:text-dark-text-secondary mb-6 text-sm">
                                <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/>Dashboard & Assistant</li>
                                <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/>5 Invoices / month</li>
                                <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/>10 Deals / month</li>
                                <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/>20 AI Actions / month</li>
                            </ul>
                            <div className="flex-grow"></div>
                            <button onClick={onStartTrial} className="w-full mt-4 bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-semibold py-3 rounded-lg transition hover:opacity-90">Get Started Free</button>
                        </div>
                    </div>
                    <div className="p-[1px] bg-gradient-to-br from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end rounded-2xl shadow-lg">
                        <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-6 flex flex-col">
                            <h3 className="text-2xl font-bold">Solo</h3>
                            <div className="text-5xl font-extrabold my-2">$15.99<span className="text-lg font-medium text-text-secondary dark:text-dark-text-secondary"> / mo</span></div>
                            <p className="text-text-secondary dark:text-dark-text-secondary mb-4">For solopreneurs running their business.</p>
                            <ul className="space-y-2.5 text-text-secondary dark:text-dark-text-secondary mb-6 text-sm">
                                <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/>Everything in Starter</li>
                                <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/>Full Access to All Hubs</li>
                                <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/>Unlimited Invoices & Deals</li>
                                <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/>Native Automations</li>
                                <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/>200 AI Actions / month</li>
                            </ul>
                            <div className="flex-grow"></div>
                            <button onClick={() => onSelectPlan('Solo')} className="w-full mt-4 bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-semibold py-3 rounded-lg transition hover:opacity-90">Choose Solo</button>
                        </div>
                    </div>
                    <div className="p-[1px] bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl">
                        <div className="bg-card-bg dark:bg-dark-card-bg rounded-[15px] h-full p-6 flex flex-col">
                            <h3 className="text-2xl font-bold">Team</h3>
                            <div className="text-5xl font-extrabold my-2">$25<span className="text-lg font-medium text-text-secondary dark:text-dark-text-secondary"> / user/mo</span></div>
                            <p className="text-text-secondary dark:text-dark-text-secondary mb-4">For small, collaborative teams.</p>
                            <ul className="space-y-2.5 text-text-secondary dark:text-dark-text-secondary mb-6 text-sm">
                                <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/>Everything in Solo</li>
                                <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/>Up to 5 Team Members</li>
                                <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/>Collaboration Features</li>
                                <li className="flex items-center gap-3"><Check size={16} className="text-green-500"/>600 AI Actions / month</li>
                            </ul>
                            <div className="flex-grow"></div>
                            <button onClick={() => onSelectPlan('Team')} className="w-full mt-4 bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-semibold py-3 rounded-lg transition hover:opacity-90">Choose Team</button>
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
      </PublicLayout>
    
     
  );
};

export default LandingPage;