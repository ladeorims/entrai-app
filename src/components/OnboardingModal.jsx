// src/components/OnboardingModal.jsx

import React, { useState, useRef } from 'react';
import Card from './ui/Card';
import { Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';

const OnboardingModal = ({ user, token, onComplete }) => {
    const [onboardingData, setOnboardingData] = useState({
        businessType: 'services',
        company: user.company || '',
        companyLogoUrl: user.companyLogoUrl || '',
        primaryGoal: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const logoInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOnboardingData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setOnboardingData(prev => ({ ...prev, companyLogoUrl: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile/onboarding`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(onboardingData),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            onComplete(result.user);
        } catch (error) {
            console.error("Onboarding save error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-xl w-full">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end rounded-full flex items-center justify-center">
                            <Sparkles size={32} className="text-white"/>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold">Welcome to Entruvi, {user.name}!</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-2 mb-6">Let's quickly personalize your workspace. (This will only take a minute)</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">1. What do you primarily sell?</label>
                        <select name="businessType" value={onboardingData.businessType} onChange={handleChange} className="form-select w-full">
                            <option value="services">Services (e.g., consulting, design, development)</option>
                            <option value="goods">Products / Goods (e.g., e-commerce, retail)</option>
                        </select>
                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">This helps us tailor your invoices and other features.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">2. What is your company name?</label>
                        <input type="text" name="company" placeholder="Your Company LLC" value={onboardingData.company} onChange={handleChange} className="form-input w-full" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold mb-2">3. Add your company logo (optional)</label>
                        <div className="flex items-center gap-4">
                            {onboardingData.companyLogoUrl ? (
                                <img src={onboardingData.companyLogoUrl} alt="Logo Preview" className="h-12 bg-slate-100 dark:bg-dark-primary-bg p-1 rounded-lg object-contain"/>
                            ) : (
                                <div className="h-12 w-12 bg-slate-100 dark:bg-dark-primary-bg rounded-lg flex items-center justify-center">
                                    <ImageIcon className="text-text-secondary dark:text-dark-text-secondary"/>
                                </div>
                            )}
                            <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                            <button type="button" onClick={() => logoInputRef.current.click()} className="bg-slate-200 dark:bg-slate-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600">
                                Upload Logo
                            </button>
                        </div>
                    </div>

                    <div>
                         <label className="block text-sm font-bold mb-2">4. What is your main goal with Entruvi?</label>
                         <select name="primaryGoal" value={onboardingData.primaryGoal} onChange={handleChange} className="form-select w-full">
                            <option value="" disabled>Select a goal...</option>
                            <option value="get_paid_faster">Get paid faster</option>
                            <option value="organize_sales">Organize my sales process</option>
                            <option value="save_time_admin">Save time on admin work</option>
                            <option value="understand_finances">Understand my business finances</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button onClick={handleSave} disabled={isLoading} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Save & Get Started"}
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default OnboardingModal;