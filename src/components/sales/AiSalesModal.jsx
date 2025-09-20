// src/components/sales/AiSalesModal.jsx
import React, { useState } from 'react';
import Card from '../ui/Card';
import BrandedLoader from '../BrandedLoader';
import { useAuth } from '../../AuthContext';
import { Wand2, XCircle, Copy, Mail, Save } from 'lucide-react';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";
const formSelectClasses = `${formInputClasses} form-select`;
const formTextareaClasses = `${formInputClasses} h-24`;

const AiSalesModal = ({ aiModalState, setIsAiModalVisible, salesPipeline, onSuccess }) => {
    const { token } = useAuth();
    const [localState, setLocalState] = useState(aiModalState);

    const handleAiDealSelect = (dealId) => {
        const deal = Object.values(salesPipeline).flat().find(d => d.id === parseInt(dealId));
        setLocalState(prev => ({ ...prev, selectedDeal: deal, generatedContent: '', saveStatus: '', sendStatus: '' }));
    };

    const handleGenerateAiContent = async () => {
        if (localState.type !== 'leads' && !localState.selectedDeal) {
            setLocalState(prev => ({ ...prev, generatedContent: 'Please select a deal first.' }));
            return;
        }

        setLocalState(prev => ({ ...prev, isLoading: true, generatedContent: '', saveStatus: '' }));
        let endpoint = '';
        const body = { clientName: localState.selectedDeal?.client_name, clientCompany: localState.selectedDeal?.client_company };

        if (localState.type === 'email') {
            endpoint = 'generate-email';
            body.emailType = localState.aiEmailType;
        } else if (localState.type === 'leads') {
            endpoint = 'generate-leads';
        } else if (localState.type === 'closing') {
            endpoint = 'generate-email';
            body.emailType = 'closing-sequence';
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(body)
            });
            if (!response.ok) throw new Error(`API error: ${response.statusText}`);
            const result = await response.json();
            if (localState.type === 'leads') {
                setLocalState(prev => ({ ...prev, generatedContent: result.leads.join('\n'), isLoading: false }));
            } else {
                setLocalState(prev => ({ ...prev, generatedContent: result.emailContent, isLoading: false }));
            }
        } catch (error) {
            console.error('AI content generation error:', error);
            setLocalState(prev => ({ ...prev, generatedContent: `Failed to connect to the AI service. Error: ${error.message}`, isLoading: false }));
        }
    };

    const handleSaveAiContent = async () => {
        const dealId = localState.selectedDeal?.id;
        if (!dealId) {
            setLocalState(prev => ({ ...prev, saveStatus: 'Error: No deal selected.' }));
            return;
        }
        setLocalState(prev => ({ ...prev, saveStatus: 'Saving...' }));
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/deals/${dealId}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ note: localState.generatedContent, type: localState.type })
            });
            if (!response.ok) throw new Error('Failed to save note.');
            setLocalState(prev => ({ ...prev, saveStatus: 'Saved successfully!' }));
            onSuccess();
        } catch (error) {
            console.error('Save AI content error:', error);
            setLocalState(prev => ({ ...prev, saveStatus: `Error: ${error.message}` }));
        }
    };

    const handleSendAiEmail = async () => {
        const deal = localState.selectedDeal;
        if (!deal) {
            setLocalState(prev => ({ ...prev, sendStatus: 'Error: No deal selected.' }));
            return;
        }
        setLocalState(prev => ({ ...prev, sendStatus: 'Sending email...' }));
        const emailSubject = `${localState.title.replace('Generate ', '')} for ${deal.name}`;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ clientEmail: deal.client_email, subject: emailSubject, body: localState.generatedContent, clientId: deal.client_id })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send email.');
            }
            setLocalState(prev => ({ ...prev, sendStatus: 'Email sent successfully!' }));
            onSuccess();
        } catch (error) {
            console.error('Error sending email:', error);
            setLocalState(prev => ({ ...prev, sendStatus: `Error sending email: ${error.message}` }));
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-3xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Wand2 size={24} className="text-accent-start dark:text-dark-accent-mid" />
                        {localState.title}
                    </h2>
                    <button onClick={() => setIsAiModalVisible(false)}>
                        <XCircle size={24} className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70" />
                    </button>
                </div>
                
                {localState.isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <BrandedLoader text="Generating..." />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {localState.type !== 'leads' && (
                            <div>
                                <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Select a Deal for Context</label>
                                <select onChange={(e) => handleAiDealSelect(e.target.value)} defaultValue="" className={formSelectClasses}>
                                    <option value="" disabled>Choose a deal...</option>
                                    {Object.values(salesPipeline).flat().map(deal => (
                                        <option key={deal.id} value={deal.id}>{deal.name} - ${parseFloat(deal.value).toLocaleString()}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        {localState.type === 'email' && (
                            <div className="flex justify-start gap-4 flex-wrap">
                                <label className="text-sm">
                                    <input type="radio" value="outreach" checked={localState.aiEmailType === 'outreach'} onChange={(e) => setLocalState(prev => ({ ...prev, aiEmailType: e.target.value, generatedContent: '' }))} className="mr-2 accent-accent-start dark:accent-dark-accent-mid" />
                                    Outreach
                                </label>
                                <label className="text-sm">
                                    <input type="radio" value="follow-up" checked={localState.aiEmailType === 'follow-up'} onChange={(e) => setLocalState(prev => ({ ...prev, aiEmailType: e.target.value, generatedContent: '' }))} className="mr-2 accent-accent-start dark:accent-dark-accent-mid" />
                                    Follow-up
                                </label>
                                <label className="text-sm">
                                    <input type="radio" value="value-added" checked={localState.aiEmailType === 'value-added'} onChange={(e) => setLocalState(prev => ({ ...prev, aiEmailType: e.target.value, generatedContent: '' }))} className="mr-2 accent-accent-start dark:accent-dark-accent-mid" />
                                    Value-added
                                </label>
                            </div>
                        )}
                        
                        {localState.generatedContent ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Review & Edit</label>
                                    <textarea
                                        value={localState.generatedContent}
                                        onChange={(e) => setLocalState({ ...localState, generatedContent: e.target.value })}
                                        rows="10"
                                        className={formTextareaClasses}
                                    />
                                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary text-center mt-3">✨ AI-generated content. Please review for accuracy and tone.</p>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    {localState.type !== 'leads' && (
                                        <button onClick={handleSendAiEmail} disabled={!localState.selectedDeal || localState.sendStatus.includes('Sending')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold w-full flex-1 disabled:opacity-50 flex items-center justify-center gap-2">
                                            <Mail size={16} /> Send Email
                                        </button>
                                    )}
                                    <button onClick={handleSaveAiContent} disabled={localState.saveStatus.includes('Saving')} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold w-full flex-1 disabled:opacity-50 flex items-center justify-center gap-2">
                                        <Save size={16} /> Save as Note
                                    </button>
                                    <button onClick={() => copyToClipboard(localState.generatedContent)} className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary py-2 px-4 rounded-lg text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-2">
                                        <Copy size={16} /> Copy
                                    </button>
                                </div>
                                {localState.saveStatus && <p className="text-sm text-center mt-2">{localState.saveStatus}</p>}
                                {localState.sendStatus && <p className="text-sm text-center mt-2">{localState.sendStatus}</p>}
                            </>
                        ) : (
                            <button onClick={handleGenerateAiContent} disabled={(localState.type !== 'leads' && !localState.selectedDeal) || localState.isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-4 py-3 rounded-lg font-semibold disabled:opacity-50">
                                {localState.isLoading ? <BrandedLoader text="Generating..." /> : `Generate ${localState.type === 'email' ? 'Email' : localState.type === 'leads' ? 'Leads' : 'Closing Email'}`}
                            </button>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AiSalesModal;