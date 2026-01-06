import React from 'react';
import PublicLayout from './PublicLayout';
import { Zap, Shield, Heart, Target, Users2, Trophy } from 'lucide-react';

const AboutPage = () => {
    return (
        <PublicLayout>
            {/* Hero Section */}
            <div className="container mx-auto px-5 py-24 max-w-5xl text-center">
                <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                    We built Entruvi for the <br />
                    <span className="bg-gradient-to-r from-accent-start to-accent-end text-transparent bg-clip-text">Visionaries & Hustlers.</span>
                </h1>
                <p className="text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto leading-relaxed">
                    Every entrepreneur knows the struggle: endless admin stealing time from creativity. 
                    Entruvi was born in Lagos to solve one problem—to give African founders a world-class 
                    virtual COO that manages the busywork automatically.
                </p>
            </div>

            {/* Mission Section - High Contrast */}
            <div className="bg-slate-900 text-white py-24 rounded-[3rem] md:rounded-[5rem] mx-4 md:mx-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-accent-start/20 blur-[100px] rounded-full"></div>
                <div className="container mx-auto px-5 max-w-7xl relative z-10 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Our Mission</h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            To empower 10,000 African entrepreneurs by 2027 with self-driving business operations. 
                            We believe that when a founder is freed from admin, they can change the world.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                <h4 className="text-3xl font-black text-accent-start mb-1">100%</h4>
                                <p className="text-sm text-slate-400">Locally Optimized</p>
                            </div>
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                <h4 className="text-3xl font-black text-accent-start mb-1">24/7</h4>
                                <p className="text-sm text-slate-400">AI Assistance</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: <Zap />, t: "Simplicity", d: "No complex jargon." },
                            { icon: <Heart />, t: "Empowerment", d: "Time is your asset." },
                            { icon: <Target />, t: "Innovation", d: "Proactive AI." },
                            { icon: <Shield />, t: "Trust", d: "Sacred Data." }
                        ].map((v, i) => (
                            <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors">
                                <div className="text-accent-start mb-3">{v.icon}</div>
                                <h4 className="font-bold mb-1">{v.t}</h4>
                                <p className="text-xs text-slate-500">{v.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default AboutPage;