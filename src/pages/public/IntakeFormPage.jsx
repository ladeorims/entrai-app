import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import AnimatedLogo from '../../components/AnimatedLogo';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid text-text-primary dark:text-dark-text-primary";
// const formTextareaClasses = `${formInputClasses} h-24`;

export const IntakeFormPage = () => {
    const [form, setForm] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [responses, setResponses] = useState({});
    const [clientDetails, setClientDetails] = useState({ name: '', email: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const getFormIdFromUrl = () => {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1];
    };

    const fetchForm = useCallback(async () => {
        const formId = getFormIdFromUrl();
        if (!formId) {
            setError("Form ID not found in URL.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/intake-form/${formId}`);
            if (!response.ok) throw new Error("Could not load the form. The link may be invalid.");
            const data = await response.json();
            setForm(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchForm();
    }, [fetchForm]);

    const handleResponseChange = (questionText, value) => {
        setResponses(prev => ({ ...prev, [questionText]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/intake-form/${form.id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    responses,
                    client_name: clientDetails.name,
                    client_email: clientDetails.email
                })
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "There was an issue submitting your form.");
            }
            setIsSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" size={32} /></div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen"><p className="text-red-500">{error}</p></div>;
    }

    if (isSuccess) {
        return (
             <div className="flex items-center justify-center h-screen bg-primary-bg dark:bg-dark-primary-bg p-4">
                <Card className="text-center">
                    <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                    <h1 className="text-2xl font-bold">Thank You!</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-2">Your responses have been submitted successfully.</p>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-primary-bg dark:bg-dark-primary-bg p-4 md:p-8 flex flex-col items-center">
            <header className="w-full max-w-2xl mb-8 flex items-center gap-2">
                <AnimatedLogo />
                <h1 className="text-2xl font-bold">Client Intake Form</h1>
            </header>
            <Card className="w-full max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <p className="text-text-secondary dark:text-dark-text-secondary">Please provide your details and answer the questions below.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Your Name</label>
                            <input type="text" value={clientDetails.name} onChange={(e) => setClientDetails({...clientDetails, name: e.target.value})} className={formInputClasses} required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Your Email</label>
                            <input type="email" value={clientDetails.email} onChange={(e) => setClientDetails({...clientDetails, email: e.target.value})} className={formInputClasses} required />
                        </div>
                    </div>

                    <hr className="border-slate-200 dark:border-slate-700"/>

                    {form.questions.map((q, index) => (
                        <div key={index}>
                            <label className="block text-sm font-semibold mb-2">{q.text}</label>
                            <textarea
                                value={responses[q.text] || ''}
                                onChange={(e) => handleResponseChange(q.text, e.target.value)}
                                className={`${formInputClasses} h-28`}
                                required
                            />
                        </div>
                    ))}
                     <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-accent-start to-accent-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Form'}
                    </button>
                </form>
            </Card>
        </div>
    );
};

// export default IntakeFormPage;

