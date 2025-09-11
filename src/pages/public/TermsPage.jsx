// src/pages/public/TermsPage.jsx

import React from 'react';
import PublicLayout from './PublicLayout';

const TermsPage = ({ setActiveView, onLaunchApp, onStartTrial }) => {
    return (
        <PublicLayout activeView="Terms" setActiveView={setActiveView} onLaunchApp={onLaunchApp} onStartTrial={onStartTrial}>
            <div className="container mx-auto px-5 py-20 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                 <div className="prose dark:prose-invert max-w-none space-y-6">
                    <p>By using the Entruvi service, you agree to these terms. Please read them carefully.</p>
                    
                    <h2 className="text-2xl font-bold">Account Responsibilities</h2>
                    <p>You are responsible for maintaining the security of your account and password. Entruvi cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>

                    <h2 className="text-2xl font-bold">Subscription & Payment</h2>
                    <p>A valid payment method is required for paid plans. You will be billed in advance on a monthly or annual basis. All plans come with a 14-day free trial.</p>

                     <h2 className="text-2xl font-bold">Limitation of Liability</h2>
                    <p>The service is provided "as is". In no event shall Entruvi be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the materials on our website.</p>
                </div>
            </div>
        </PublicLayout>
    );
};

export default TermsPage;