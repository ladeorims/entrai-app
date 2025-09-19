import React from 'react';
import PublicLayout from './PublicLayout';

const PrivacyPage = () => {
    return (
        <PublicLayout>
            <div className="container mx-auto px-5 py-20 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose dark:prose-invert max-w-none space-y-6">
                    <p>At Entruvi, we are committed to protecting your privacy and ensuring the security of your data. This policy outlines what information we collect, how we use it, and your rights regarding your data.</p>
                    
                    <h2 className="text-2xl font-bold">Data We Collect</h2>
                    <p>We collect information necessary to provide our service, including: account information (name, email), billing details (via Stripe), and business data you input (invoices, clients, tasks).</p>

                    <h2 className="text-2xl font-bold">How We Use Your Data</h2>
                    <p>Your data is used to deliver and improve our services, provide customer support, and offer personalized features like AI-powered insights. We do not sell your data to third parties.</p>

                    <h2 className="text-2xl font-bold">Third-Party Services</h2>
                    <p>We use trusted third-party services like Stripe for payments, SendGrid for emails, and OpenAI for AI features. Each service has its own robust privacy and security policies.</p>

                    <h2 className="text-2xl font-bold">Your Rights</h2>
                    <p>You have the right to access, update, or delete your data at any time through your account settings or by contacting our support team.</p>
                </div>
            </div>
        </PublicLayout>
    );
};

export default PrivacyPage;