import React from 'react';
import PublicLayout from './PublicLayout';
import { ShieldCheck, DatabaseZap, Lock, KeyRound, Globe } from 'lucide-react';

const SecurityPage = () => {
    return (
        <PublicLayout>
            <div className="container mx-auto px-5 py-24 max-w-5xl text-center">
                <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">Your Data, <br />Bank-Grade Secure.</h1>
                <p className="text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto leading-relaxed">
                    Security is not an afterthought—it's the foundation of Entruvi. We protect your business 
                    information like it's our own, using world-class encryption and local compliance standards.
                </p>
            </div>
            
            <div className="container mx-auto px-5 max-w-7xl pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { icon: <Lock />, t: "AES-256 Encryption", d: "Your data is encrypted at rest and in transit. Not even our team can read your private business metrics." },
                        { icon: <ShieldCheck />, t: "Local Payment Compliance", d: "All payments are processed through PCI-DSS compliant Nigerian gateways. No card details ever hit our servers." },
                        { icon: <DatabaseZap />, t: "Secure Cloud Infrastructure", d: "Hosted on globally distributed, secure servers with 99.9% uptime and automatic daily backups." },
                        { icon: <KeyRound />, t: "JWT Authentication", d: "Multi-layered session security ensures only you and your invited team members can access your workspace." }
                    ].map((s, i) => (
                        <div key={i} className="p-10 rounded-[3rem] bg-slate-50/50 dark:bg-dark-card-bg border border-slate-200 dark:border-slate-800 hover:border-accent-start transition-colors">
                            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-accent-start mb-6">{s.icon}</div>
                            <h3 className="text-2xl font-black mb-3">{s.t}</h3>
                            <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed">{s.d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
};

export default SecurityPage;