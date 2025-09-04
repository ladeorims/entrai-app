// src/pages/ResetPasswordPage.jsx

import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { Loader2, KeyRound } from 'lucide-react';

const ResetPasswordPage = ({ setActiveView, setAuthMessage }) => {
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setMessage({ type: 'error', text: 'No reset token found. Please request a new link.' });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }
        setIsLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await fetch('${import.meta.env.VITE_API_BASE_URL}/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            setAuthMessage({ type: 'success', text: result.message });
            setActiveView('Auth');
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary-bg p-4">
            <Card className="max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-2">Set a New Password</h1>
                <p className="text-center text-text-secondary dark:text-dark-text-secondary mb-6">Please enter and confirm your new password below.</p>
                
                {message.text && (
                    <div className={`mb-4 text-center text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{message.text}</div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <KeyRound size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} className="form-input w-full pl-10" required />
                    </div>
                    <div className="relative">
                        <KeyRound size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="form-input w-full pl-10" required />
                    </div>
                    <button type="submit" disabled={isLoading || !token} className="w-full bg-gradient-to-r from-accent-start to-accent-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default ResetPasswordPage;