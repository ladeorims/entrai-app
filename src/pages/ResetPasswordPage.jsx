import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import BrandedLoader from '../components/BrandedLoader';

// This is the consistent form input style definition
const formInputClasses = "w-full p-3 bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";

const ResetPasswordPage = () => {
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const { setAuthMessage } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Re-use the strong password regex from the backend logic
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{12,})/;

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tokenFromUrl = urlParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setMessage({ type: 'error', text: 'No reset token found. Please request a new link.' });
        }
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        // --- NEW: Client-side password complexity validation ---
        if (!strongPasswordRegex.test(password)) {
            setMessage({ type: 'error', text: 'Password must be at least 12 characters and include uppercase, lowercase, a number, and a symbol.' });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            
            // Set success message on the main Auth page
            setAuthMessage({ type: 'success', text: result.message });
            navigate('/auth');
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-primary-bg dark:bg-dark-primary-bg p-4">
                <Card className="max-w-md w-full">
                    <h1 className="text-2xl font-bold text-center mb-2">Invalid Reset Link</h1>
                    <p className="text-center text-text-secondary dark:text-dark-text-secondary mb-6">{message.text || 'The link you are using is invalid or has expired.'}</p>
                    <button onClick={() => navigate('/auth')} className="w-full bg-gradient-to-r from-accent-start to-accent-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center">
                        Return to Login
                    </button>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-primary-bg dark:bg-dark-primary-bg p-4">
            <Card className="max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-2">Set a New Password</h1>
                <p className="text-center text-text-secondary dark:text-dark-text-secondary mb-6">Please enter and confirm your new password below.</p>
                
                {message.text && (
                    <div className={`mb-4 text-center text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{message.text}</div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <KeyRound size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} className={`${formInputClasses} pl-10`} required />
                    </div>
                    <div className="relative">
                        <KeyRound size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={`${formInputClasses} pl-10`} required />
                    </div>
                    <button type="submit" disabled={isLoading || !token} className="w-full bg-gradient-to-r from-accent-start to-accent-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                        {isLoading ? <BrandedLoader text="Resetting..." /> : 'Reset Password'}
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default ResetPasswordPage;