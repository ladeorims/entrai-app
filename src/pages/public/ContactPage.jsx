import React from 'react';
import PublicLayout from './PublicLayout';
import Card from '../../components/ui/Card';

const ContactPage = () => {
    return (
        <PublicLayout>
            <div className="container mx-auto px-5 py-20 max-w-4xl text-center">
                <h1 className="text-4xl md:text-6xl font-bold">Let's talk.</h1>
                <p className="mt-4 text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                    Have questions about features, pricing, or anything else? We’re here to help.
                </p>
            </div>
            <div className="container mx-auto px-5 max-w-lg pb-20">
                <Card>
                    <p className="text-center text-text-secondary dark:text-dark-text-secondary mb-6">We typically reply within 24 hours.</p>
                    <form className="space-y-4">
                        <input type="text" placeholder="Your Name" className="form-input w-full" />
                        <input type="email" placeholder="Your Email" className="form-input w-full" />
                        <textarea placeholder="Your Message" className="form-textarea w-full" rows="6"></textarea>
                        <button type="submit" className="w-full bg-gradient-to-r from-accent-start to-accent-end text-white font-semibold py-3 rounded-lg transition hover:opacity-90">
                            Send Message
                        </button>
                    </form>
                </Card>
            </div>
        </PublicLayout>
    );
};

export default ContactPage;