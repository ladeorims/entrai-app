import React, { useState } from 'react';
import Card from '../ui/Card';
import BrandedLoader from '../BrandedLoader';
import { useAuth } from '../../AuthContext';
import { Wand2, XCircle, Sparkles } from 'lucide-react';

// Use the consistent form class definition
const formTextareaClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid text-text-primary dark:text-dark-text-primary h-24";

export const AskAIModal = ({ onClose }) => {
    const { token } = useAuth();
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAskAI = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        setIsLoading(true);
        setResponse('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ prompt })
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Failed to get response from AI.');
            }
            const data = await res.json();
            setResponse(data.response);
        } catch (error) {
            setResponse(`Sorry, an error occurred: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <Card className="max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2"><Wand2 size={24} className="text-accent-start dark:text-dark-accent-mid"/> Ask Entruvi AI</h2>
                    <button onClick={onClose}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                </div>
                <form onSubmit={handleAskAI} className="space-y-4">
                    <textarea 
                        placeholder="Ask anything... (e.g., 'Draft a follow-up email to a client who missed a payment', 'Give me 5 blog post ideas about financial planning for freelancers')" 
                        value={prompt} 
                        onChange={(e) => setPrompt(e.target.value)}
                        className={formTextareaClasses}
                        rows="4"
                    />
                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold flex items-center justify-center hover:opacity-90 disabled:opacity-50">
                        {isLoading ? <BrandedLoader text="Getting answer..." /> : <><Sparkles size={16} className="mr-2" /> Get Answer</>}
                    </button>
                </form>
                {response && (
                    <div className="bg-slate-100 dark:bg-dark-primary-bg p-4 rounded-lg mt-4 max-h-64 overflow-y-auto">
                        <h3 className="font-semibold mb-2">Response:</h3>
                        <p className="text-text-secondary dark:text-dark-text-secondary whitespace-pre-wrap">{response}</p>
                    </div>
                )}
            </Card>
        </div>
    );
};