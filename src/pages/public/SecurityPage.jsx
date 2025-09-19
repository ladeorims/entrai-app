import React from 'react';
import PublicLayout from './PublicLayout';
import { ShieldCheck, DatabaseZap, Lock, KeyRound } from 'lucide-react';
import Card from '../../components/ui/Card';

const SecurityFeature = ({ icon, title, children }) => (
    <Card className="text-center flex flex-col items-center">
        <div className="p-4 bg-green-500/10 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-2 text-text-secondary dark:text-dark-text-secondary text-sm">{children}</p>
    </Card>
);

const SecurityPage = () => {
    return (
        <PublicLayout>
            <div className="container mx-auto px-5 py-20 max-w-4xl text-center">
                <h1 className="text-4xl md:text-6xl font-bold">Your business data, safeguarded.</h1>
                <p className="mt-6 text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
                    At Entruvi, security isn't an afterthought—it's built into every layer of our platform. We are committed to protecting your most valuable asset: your data.
                </p>
            </div>
            
            <div className="container mx-auto px-5 max-w-7xl pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <SecurityFeature icon={<Lock size={28} className="text-green-500"/>} title="Data Encryption">
                        All your data is encrypted at rest and in transit using industry-standard AES-256 encryption.
                    </SecurityFeature>
                    <SecurityFeature icon={<KeyRound size={28} className="text-green-500"/>} title="Secure Authentication">
                        Your account is protected with JWT-based authentication and secure password hashing.
                    </SecurityFeature>
                    <SecurityFeature icon={<ShieldCheck size={28} className="text-green-500"/>} title="Stripe Compliance">
                        All payment information is handled by Stripe, a PCI-DSS compliant payment processor. We never store your credit card details.
                    </SecurityFeature>
                    <SecurityFeature icon={<DatabaseZap size={28} className="text-green-500"/>} title="Secure Hosting">
                        Our infrastructure is hosted on Render and Vercel, platforms with world-class physical and network security.
                    </SecurityFeature>
                </div>
            </div>
        </PublicLayout>
    );
};

export default SecurityPage;