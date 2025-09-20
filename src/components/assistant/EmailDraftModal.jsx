// src/components/assistant/EmailDraftModal.jsx
import React, { useState } from 'react';
import Card from '../ui/Card';
import BrandedLoader from '../BrandedLoader';
import { useAuth } from '../../AuthContext';
import { Mail, XCircle, Wand2, UserPlus, Users } from 'lucide-react';
import { SearchableClientDropdown } from '../ui/SearchableClientDropdown';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";
const formTextareaClasses = `${formInputClasses} h-24`;

const EmailDraftModal = ({ onClose, clients, onSuccess }) => {
    const { token } = useAuth();
    const [emailState, setEmailState] = useState({
        recipient: '',
        subject: '',
        prompt: '',
        generatedBody: '',
        isLoading: false,
        sendStatus: '',
        selectedClientId: null,
        isNewClient: false,
        newClientName: ''
    });

    const handleGenerateEmail = async () => {
        if (!emailState.prompt.trim()) return;
        setEmailState(prev => ({ ...prev, isLoading: true, generatedBody: '' }));
        
        let clientName = '';
        if(emailState.selectedClientId) {
            const client = clients.find(c => c.id === emailState.selectedClientId);
            clientName = client?.name;
        } else if (emailState.isNewClient) {
            clientName = emailState.newClientName;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/draft-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ prompt: emailState.prompt, clientName })
            });
            if (!response.ok) { const err = await response.json(); throw new Error(err.message); }
            const result = await response.json();
            setEmailState(prev => ({ ...prev, generatedBody: result.emailBody, isLoading: false }));
        } catch (error) {
            console.error("Error drafting email:", error);
            setEmailState(prev => ({ ...prev, generatedBody: `Error: ${error.message}`, isLoading: false }));
        }
    };

    const handleSendEmail = async () => {
        if (!emailState.recipient || !emailState.subject || !emailState.generatedBody) {
            setEmailState(prev => ({ ...prev, sendStatus: 'Please fill out all fields.' }));
            return;
        }

        setEmailState(prev => ({ ...prev, sendStatus: 'Sending...', isLoading: true }));
        try {
            const body = {
                recipientEmail: emailState.recipient,
                subject: emailState.subject,
                body: emailState.generatedBody,
                clientId: emailState.selectedClientId,
                newClientName: emailState.isNewClient ? emailState.newClientName : null,
            };
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(body)
            });
            if (!response.ok) { const err = await response.json(); throw new Error(err.message); }
            
            setEmailState(prev => ({ ...prev, sendStatus: 'Email sent successfully!', isLoading: false }));
            onSuccess(); // Trigger parent to re-fetch tasks
            setTimeout(onClose, 2000);
        } catch (error) {
            console.error("Error sending email:", error);
            setEmailState(prev => ({ ...prev, sendStatus: `Error: ${error.message}`, isLoading: false }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2"><Wand2 size={24} className="text-accent-start dark:text-dark-accent-mid"/> Draft an Email</h2>
                    <button onClick={onClose}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-center mb-4">
                        <button onClick={() => setEmailState(p => ({...p, isNewClient: false, newClientName: '', recipient: ''}))} className={`px-4 py-2 text-sm font-semibold rounded-l-lg transition-all ${!emailState.isNewClient ? 'bg-gradient-to-r from-accent-start to-accent-end text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700'}`}><Users size={16} className="inline-block mr-2"/>Existing Client</button>
                        <button onClick={() => setEmailState(p => ({...p, isNewClient: true, selectedClientId: null}))} className={`px-4 py-2 text-sm font-semibold rounded-r-lg transition-all ${emailState.isNewClient ? 'bg-gradient-to-r from-accent-start to-accent-end text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700'}`}><UserPlus size={16} className="inline-block mr-2"/>New Client</button>
                    </div>

                    {emailState.isNewClient ? (
                        <div className='flex gap-4'>
                            <input type="text" placeholder="New Client Name" value={emailState.newClientName} onChange={(e) => setEmailState(p => ({...p, newClientName: e.target.value}))} className={formInputClasses}/>
                            <input type="email" placeholder="Recipient's Email" value={emailState.recipient} onChange={(e) => setEmailState(p => ({...p, recipient: e.target.value}))} className={formInputClasses}/>
                        </div>
                    ) : (
                        <SearchableClientDropdown clients={clients} selectedClientId={emailState.selectedClientId} onSelect={(id) => { const client = clients.find(c=>c.id === id); setEmailState(p => ({...p, selectedClientId: id, recipient: client.email})); }} />
                    )}
                    
                    <input type="text" placeholder="Subject" value={emailState.subject} onChange={(e) => setEmailState(p => ({...p, subject: e.target.value}))} className={formInputClasses}/>
                    <textarea placeholder="Tell the AI what this email is about..." value={emailState.prompt} onChange={(e) => setEmailState(p => ({...p, prompt: e.target.value}))} rows="3" className={formTextareaClasses}/>
                    
                    <button onClick={handleGenerateEmail} disabled={emailState.isLoading || (!emailState.prompt && !emailState.selectedClientId)} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                        {emailState.isLoading ? <BrandedLoader text="Generating..." /> : 'Generate Draft'}
                    </button>

                    {emailState.generatedBody && (
                        <>
                            <textarea value={emailState.generatedBody} onChange={(e) => setEmailState(p => ({...p, generatedBody: e.target.value}))} rows="8" className={formTextareaClasses} />
                            <div className="flex gap-2">
                                <button onClick={handleSendEmail} disabled={emailState.isLoading} className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors flex items-center justify-center disabled:opacity-50">
                                    {emailState.isLoading ? <BrandedLoader text="Sending..." /> : <><Mail size={16} className="mr-2"/>Send Email</>}
                                </button>
                            </div>
                        </>
                    )}
                    {emailState.sendStatus && <p className="text-center text-sm mt-2">{emailState.sendStatus}</p>}
                </div>
            </Card>
        </div>
    );
};

export default EmailDraftModal;