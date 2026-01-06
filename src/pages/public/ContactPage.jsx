import React from 'react';
import PublicLayout from './PublicLayout';
import { MessageSquare, Mail, MapPin, PhoneCall } from 'lucide-react';

const ContactPage = () => {
    return (
        <PublicLayout>
            <div className="container mx-auto px-5 py-24 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6">Let's talk <br />Business.</h1>
                        <p className="text-xl text-text-secondary mb-12">Have questions about scaling with Entruvi? Our local team is ready to help you onboard.</p>
                        
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-accent-start/10 rounded-2xl flex items-center justify-center text-accent-start"><Mail /></div>
                                <div><p className="text-sm text-text-secondary font-bold uppercase">Email Us</p><p className="text-lg font-bold">hello@entruvi.com</p></div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500"><MessageSquare /></div>
                                <div><p className="text-sm text-text-secondary font-bold uppercase">WhatsApp Support</p><p className="text-lg font-bold">Available 9am - 6pm WAT</p></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card-bg border border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] shadow-2xl relative">
                        <div className="absolute -top-6 -right-6 bg-accent-start text-white p-4 rounded-2xl rotate-12 shadow-lg font-bold">Quick Reply</div>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase ml-1">Full Name</label>
                                    <input type="text" placeholder="e.g. Tunde Balogun" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-accent-start" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase ml-1">Work Email</label>
                                    <input type="email" placeholder="tunde@business.com" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-accent-start" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase ml-1">Message</label>
                                <textarea placeholder="How can we help your business?" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-accent-start h-40"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-accent-start to-accent-end text-white font-black py-5 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default ContactPage;