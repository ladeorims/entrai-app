import React, { useState } from "react";
import { Mail, Lock } from 'lucide-react'; 
import Card from '../components/ui/Card';
import AnimatedLogo from "../components/AnimatedLogo";
import { useAuth } from '../AuthContext';
import BrandedLoader from '../components/BrandedLoader';
import LegalDocumentModal from '../components/LegalDocumentModal';
import { TermsContent, PrivacyContent } from './public/LegalContent';

// Shared form input styles
const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";
const formTextareaClasses = `${formInputClasses} h-24`;

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showLegalModal, setShowLegalModal] = useState(false);
    const [legalDocumentContent, setLegalDocumentContent] = useState(null);
    const [legalDocumentTitle, setLegalDocumentTitle] = useState("");

    const { handleLogin, handleSignup, isLoading, authMessage, setAuthMessage } = useAuth();
    const strongPasswordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{12,})");

    
    const openLegalModal = (title, contentComponent) => {
        setLegalDocumentTitle(title);
        setLegalDocumentContent(contentComponent);
        setShowLegalModal(true);
    };

    const validateForm = () => {
        if (!email || !password) {
            setAuthMessage({ type: 'error', text: 'Email and password are required.' });
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setAuthMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return false;
        }
        if (!isLoginMode) {
            if (!strongPasswordRegex.test(password)) {
                setAuthMessage({ type: 'error', text: 'Password must be at least 12 characters and include uppercase, lowercase, a number, and a symbol.' });
                return false;
            }
            if (password !== confirmPassword) {
                setAuthMessage({ type: 'error', text: 'Passwords do not match.' });
                return false;
            }
            if (!agreedToTerms) {
                setAuthMessage({ type: 'error', text: 'You must agree to the Terms of Service and Privacy Policy.' });
                return false;
            }
            if (!name) {
                setAuthMessage({ type: 'error', text: 'Full Name is required for signup.' });
                return false;
            }
            if (!company) {
                setAuthMessage({ type: 'error', text: 'Company Name is required for signup.' });
                return false;
            }
            if (!companyDescription) {
                setAuthMessage({ type: 'error', text: 'Business Description is required for signup.' });
                return false;
            }
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setAuthMessage({});
        if (!validateForm()) {
            return;
        }
        if (isLoginMode) {
            handleLogin({ email, password });
        } else {
            handleSignup({ email, password, name, company, phoneNumber, companyDescription });
        }
    };
    
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setAuthMessage({});
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/forgot-password`, {
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
            <div className="flex items-center justify-center min-h-screen bg-primary-bg dark:bg-dark-primary-bg p-4">
                <Card className="max-w-md w-full">
                    {/* <button onClick={() => setIsForgotPassword(false)} className="flex items-center gap-2 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary mb-4 hover:opacity-80">
                        <ArrowLeft size={16} /> Back to Login
                    </button> */}
                    <h1 className="text-2xl font-bold text-center mb-2">Reset Your Password</h1>
                    <p className="text-center text-text-secondary dark:text-dark-text-secondary mb-6">Enter your email and we'll send you a link to get back into your account.</p>
                    {authMessage.text && (<div className={`mb-4 text-center text-sm ${authMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{authMessage.text}</div>)}
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="relative">
                            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="email" placeholder="Email Address" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className={`${formInputClasses} pl-10`} required />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                            {isLoading ? <BrandedLoader text="Sending..." /> : 'Send Reset Link'}
                        </button>
                    </form>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary-bg dark:bg-dark-primary-bg p-4">
            {showLegalModal && (
                <LegalDocumentModal title={legalDocumentTitle} onClose={() => setShowLegalModal(false)}>
                    {legalDocumentContent}
                </LegalDocumentModal>
            )}

            <Card className="max-w-md w-full z-10 shadow-2xl shadow-slate-300/50 dark:shadow-black/30">
                <div className="flex justify-center items-center gap-2 mb-6">
                    <AnimatedLogo />
                </div>
                
                <div className="flex justify-center mb-6">
                    <button onClick={() => { setIsLoginMode(true); setAuthMessage({}); }} className={`px-4 py-2 text-sm font-semibold rounded-l-lg transition-all ${isLoginMode ? 'bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700 text-text-secondary dark:text-dark-text-secondary hover:bg-slate-300 dark:hover:bg-slate-600'}`}>Log In</button>
                    <button onClick={() => { setIsLoginMode(false); setAuthMessage({}); }} className={`px-4 py-2 text-sm font-semibold rounded-r-lg transition-all ${!isLoginMode ? 'bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700 text-text-secondary dark:text-dark-text-secondary hover:bg-slate-300 dark:hover:bg-slate-600'}`}>Sign Up</button>
                </div>
                {authMessage.text && (<div className={`mb-4 text-center text-sm ${authMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{authMessage.text}</div>)}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLoginMode && (
                        <>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className={formInputClasses} required />
                            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Name" className={formInputClasses} required />
                            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number (e.g., 123-456-7890)" className={formInputClasses} pattern="[0-9]{3}-?[0-9]{3}-?[0-9]{4}" />
                            <textarea value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} placeholder="Tell us about your business" className={formTextareaClasses} rows="3" required />
                        </>
                    )}
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={formInputClasses} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={formInputClasses} required />
                    {!isLoginMode && (
                        <>
                            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={formInputClasses} required />
                            <div className="flex items-start gap-2 pt-2">
                                <input 
                                    type="checkbox" 
                                    id="agree-to-terms" 
                                    checked={agreedToTerms} 
                                    onChange={(e) => setAgreedToTerms(e.target.checked)} 
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-accent-start dark:text-dark-accent-mid focus:ring-accent-start"
                                />
                                <label htmlFor="agree-to-terms" className="text-sm text-text-secondary dark:text-dark-text-secondary text-left">
                                    I agree to the{" "}
                                    <button type="button" onClick={() => openLegalModal("Terms of Service", <TermsContent />)} className="font-semibold underline text-accent-start dark:text-dark-accent-mid hover:opacity-80">
                                        Terms of Service
                                    </button>{" "}
                                    and{" "}
                                    <button type="button" onClick={() => openLegalModal("Privacy Policy", <PrivacyContent />)} className="font-semibold underline text-accent-start dark:text-dark-accent-mid hover:opacity-80">
                                        Privacy Policy
                                    </button>.
                                </label>
                            </div>
                        </>
                    )}
                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                        {isLoading ? <BrandedLoader text="Authenticating..." /> : (isLoginMode ? "Log In" : "Sign Up")}
                    </button>
                </form>
                {isLoginMode && (
                    <div className="mt-4 text-center text-sm">
                        <button type="button" onClick={() => setIsForgotPassword(true)} className="font-semibold text-accent-start dark:text-dark-accent-mid hover:opacity-80">Forgot Password?</button>
                    </div>
                )}
                <div className="mt-6 text-center text-sm text-slate-500 dark:text-dark-text-secondary">
                    {isLoginMode ? (<span>Don&apos;t have an account?{" "}<button type="button" onClick={() => setIsLoginMode(false)} className="font-semibold text-accent-start dark:text-dark-accent-mid hover:opacity-80">Sign Up</button></span>) : (<span>Already have an account?{" "}<button type="button" onClick={() => setIsLoginMode(true)} className="font-semibold text-accent-start dark:text-dark-accent-mid hover:opacity-80">Log In</button></span>)}
                </div>
            </Card>
        </div>
    );
};

export default AuthPage;