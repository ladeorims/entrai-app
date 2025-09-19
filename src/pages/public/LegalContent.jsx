// src/pages/public/LegalContent.jsx
import React from 'react';

export const TermsContent = () => (
    <div className="prose dark:prose-invert max-w-none space-y-6">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p>By using the Entruvi service, you agree to these terms. Please read them carefully.</p>
        
        <h2 className="text-xl font-bold">Account Responsibilities</h2>
        <p>You are responsible for maintaining the security of your account and password. Entruvi cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>

        <h2 className="text-xl font-bold">Subscription & Payment</h2>
        <p>A valid payment method is required for paid plans. You will be billed in advance on a monthly or annual basis. Paid plans are backed by our 60-day money-back guarantee.</p>

        <h2 className="text-xl font-bold">60-Day Money-Back Guarantee</h2>
        <p>You are eligible for a full refund for any paid plan if you cancel within the first 60 days of your initial subscription. This guarantee is void if your subscription lapses for any period of time during the 60-day period. Refunds are not available for subsequent billing cycles.</p>
        
        <h2 className="text-xl font-bold">Limitation of Liability</h2>
        <p>The service is provided "as is". In no event shall Entruvi be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the materials on our website.</p>
    </div>
);

export const PrivacyContent = () => (
    <div className="prose dark:prose-invert max-w-none space-y-6">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p>At Entruvi, we are committed to protecting your privacy and ensuring the security of your data. This policy outlines what information we collect, how we use it, and your rights regarding your data.</p>
        
        <h2 className="text-xl font-bold">Data We Collect</h2>
        <p>We collect information necessary to provide our service, including: account information (name, email), billing details (via Stripe), and business data you input (invoices, clients, tasks).</p>

        <h2 className="text-xl font-bold">How We Use Your Data</h2>
        <p>Your data is used to deliver and improve our services, provide customer support, and offer personalized features like AI-powered insights. We do not sell your data to third parties.</p>

        <h2 className="text-xl font-bold">Third-Party Services</h2>
        <p>We use trusted third-party services like Stripe for payments, SendGrid for emails, and OpenAI for AI features. Each service has its own robust privacy and security policies.</p>

        <h2 className="text-xl font-bold">Your Rights</h2>
        <p>You have the right to access, update, or delete your data at any time through your account settings or by contacting our support team.</p>
    </div>
);