// Simplified example for TermsPage.jsx - repeat similar for Privacy
import React from 'react';
import PublicLayout from './PublicLayout';

const TermsPage = () => {
    return (
        <PublicLayout>
            <div className="bg-slate-50/50 dark:bg-transparent min-h-screen">
                <div className="container mx-auto px-5 py-24 max-w-3xl">
                    <h1 className="text-5xl font-black mb-12">Terms of Service</h1>
                    <div className="bg-white dark:bg-dark-card-bg p-10 md:p-16 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 prose dark:prose-invert">
                        <h2 className="text-2xl font-bold mb-4">1. Billing & Currency</h2>
                        <p className="text-text-secondary mb-8">
                            Entruvi provides billing in Nigerian Naira (₦). By subscribing, you agree to recurring charges 
                            based on your chosen plan. We reserve the right to adjust pricing with 30 days notice.
                        </p>
                        <h2 className="text-2xl font-bold mb-4">2. 60-Day Guarantee</h2>
                        <p className="text-text-secondary mb-8">
                            New users are eligible for a full refund within 60 days of their first payment. 
                            This is part of our commitment to your success.
                        </p>
                        {/* ... more content */}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default TermsPage;