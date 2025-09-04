// src/pages/AuthPage.jsx

import React, { useState } from "react";
import { Mail, Lock, User, Briefcase, Phone, Loader2, ArrowLeft } from 'lucide-react';
import Card from '../components/ui/Card';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";
const formTextareaClasses = `${formInputClasses} h-24`;

const AuthPage = ({ onAuth, isLoading, authMessage, setAuthMessage }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAuth({ email, password, name, company, phoneNumber, companyDescription }, isLoginMode ? 'login' : 'signup');
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setAuthMessage({ type: '', text: '' });
        try {
            const response = await fetch('${import.meta.env.VITE_API_BASE_URL}/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            setAuthMessage({ type: 'success', text: result.message });
            setIsForgotPassword(false);
        } catch (err) {
            setAuthMessage({ type: 'error', text: err.message || 'Failed to send reset link.' });
        }
    };
    
    if (isForgotPassword) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-primary-bg p-4">
                <Card className="max-w-md w-full">
                    <button onClick={() => setIsForgotPassword(false)} className="flex items-center gap-2 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary mb-4 hover:opacity-80">
                        <ArrowLeft size={16} /> Back to Login
                    </button>
                    <h1 className="text-2xl font-bold text-center mb-2">Reset Your Password</h1>
                    <p className="text-center text-text-secondary dark:text-dark-text-secondary mb-6">Enter your email and we'll send you a link to get back into your account.</p>
                    {authMessage.text && (<div className={`mb-4 text-center text-sm ${authMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{authMessage.text}</div>)}
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="relative">
                            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="email" placeholder="Email Address" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className={`${formInputClasses} pl-10`} required />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                        </button>
                    </form>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary-bg p-4">
            <Card className="max-w-md w-full z-10 shadow-2xl shadow-slate-300/50 dark:shadow-black/30">
                <h1 className="text-3xl font-bold hero-gradient-text text-center mb-6">Entrai</h1>
                <div className="flex justify-center mb-6">
                    <button onClick={() => setIsLoginMode(true)} className={`px-4 py-2 text-sm font-semibold rounded-l-lg transition-all ${isLoginMode ? 'bg-gradient-to-r from-accent-start to-accent-end text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700 text-text-secondary dark:text-dark-text-secondary hover:bg-slate-300 dark:hover:bg-slate-600'}`}>Log In</button>
                    <button onClick={() => setIsLoginMode(false)} className={`px-4 py-2 text-sm font-semibold rounded-r-lg transition-all ${!isLoginMode ? 'bg-gradient-to-r from-accent-start to-accent-end text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700 text-text-secondary dark:text-dark-text-secondary hover:bg-slate-300 dark:hover:bg-slate-600'}`}>Sign Up</button>
                </div>
                {authMessage.text && (<div className={`mb-4 text-center text-sm ${authMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{authMessage.text}</div>)}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLoginMode && (
                        <>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className={formInputClasses} required />
                            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Name" className={formInputClasses} />
                            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" className={formInputClasses} />
                            <textarea value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} placeholder="Tell us about your business..." className={formTextareaClasses} rows="3" />
                        </>
                    )}
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={formInputClasses} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={formInputClasses} required />
                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">{isLoading ? <Loader2 className="animate-spin" /> : (isLoginMode ? "Log In" : "Sign Up")}</button>
                </form>
                {isLoginMode && (
                    <div className="mt-4 text-center text-sm">
                        <button onClick={() => setIsForgotPassword(true)} className="font-semibold text-accent-start dark:text-dark-accent-mid hover:opacity-80">Forgot Password?</button>
                    </div>
                )}
                <div className="mt-6 text-center text-sm text-slate-500">
                    {isLoginMode ? (<span>Don&apos;t have an account?{" "}<button type="button" onClick={() => setIsLoginMode(false)} className="font-semibold text-accent-start dark:text-dark-accent-mid hover:opacity-80">Sign Up</button></span>) : (<span>Already have an account?{" "}<button type="button" onClick={() => setIsLoginMode(true)} className="font-semibold text-accent-start dark:text-dark-accent-mid hover:opacity-80">Log In</button></span>)}
                </div>
            </Card>
        </div>
    );
};

export default AuthPage;