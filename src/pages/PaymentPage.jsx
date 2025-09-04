// src/pages/PaymentPage.jsx

import React, {useState} from 'react';
import Card from '../components/ui/Card';
import { Lock, Loader2 } from 'lucide-react';

const PaymentPage = ({ plan, token }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoBack = () => {
        window.history.back();
    };

    const handleProceedToPayment = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('${import.meta.env.VITE_API_BASE_URL}/api/subscriptions/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ planName: plan })
            });

            if (!response.ok) {
                throw new Error('Failed to create payment session.');
            }

            const session = await response.json();
            window.location.href = session.url; // Redirect to Stripe
        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert("Could not initiate payment. Please try again later.");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary-bg text-text-primary p-4">
            <Card className="max-w-md w-full z-10 shadow-2xl shadow-slate-300/50 dark:shadow-black/30">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Upgrade to {plan || 'Solo Plan'}</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-2">
                        Complete your secure payment to unlock all features.
                    </p>
                </div>

                <div className="my-6">
                    <div className="p-4 bg-slate-100 dark:bg-dark-primary-bg rounded-lg space-y-3">
                        {/* This is a visual placeholder for the Stripe Elements form */}
                        <div className="w-full h-10 border border-slate-300 dark:border-slate-700 rounded-md animate-pulse"></div>
                        <div className="flex gap-3">
                            <div className="w-1/2 h-10 border border-slate-300 dark:border-slate-700 rounded-md animate-pulse"></div>
                            <div className="w-1/2 h-10 border border-slate-300 dark:border-slate-700 rounded-md animate-pulse"></div>
                        </div>
                    </div>
                     <p className="text-xs text-center text-text-secondary dark:text-dark-text-secondary mt-3">You will be redirected to Stripe's secure checkout.</p>
                </div>

                <div className="space-y-3">
                     <button 
                        onClick={handleProceedToPayment} 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Lock size={16} />}
                        {isLoading ? 'Redirecting to Stripe...' : 'Proceed to Payment'}
                    </button>
                    <button onClick={handleGoBack} className="w-full bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                        Go Back
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default PaymentPage;