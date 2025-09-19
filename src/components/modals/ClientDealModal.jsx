import React, { useState, useEffect } from 'react';
import { XCircle, Save, Loader2, UserPlus, Users } from 'lucide-react';
import Card from '../ui/Card';
import { SearchableClientDropdown } from '../ui/SearchableClientDropdown';
import { useAuth } from '../../AuthContext';
import CustomModal from '../ui/CustomModal';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid text-text-primary dark:text-dark-text-primary";
const salesStages = ['New Leads', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won'];

export const ClientDealModal = ({ clients, onClose, onSuccess, defaultToNewClient = false }) => {
    const { token } = useAuth();
    const [isCreatingClient, setIsCreatingClient] = useState(defaultToNewClient);
    const [newDeal, setNewDeal] = useState({ name: '', value: '', stage: 'New Leads', client_id: '' });
    const [newClient, setNewClient] = useState({ name: '', email: '', phoneNumber: '', companyName: '' });
    const [clientCheck, setClientCheck] = useState({ checked: false, exists: false, message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setIsCreatingClient(defaultToNewClient);
    }, [defaultToNewClient]);

    const handleClientEmailCheck = async () => {
        if (!newClient.email) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/clients/check?email=${encodeURIComponent(newClient.email)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.exists) {
                setClientCheck({
                    checked: true,
                    exists: true,
                    message: `This client already exists. Switch to "Select Existing" to add a deal for them.`
                });
            } else {
                setClientCheck({ checked: true, exists: false, message: '' });
            }
        } catch (error) {
            console.error("Error checking client email:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        if (isCreatingClient && clientCheck.exists) {
            setErrorMessage(clientCheck.message);
            setIsLoading(false);
            return;
        }

        try {
            let finalClientId = isCreatingClient ? null : newDeal.client_id;
            
            if (isCreatingClient) {
                const clientRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/clients`, { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
                    body: JSON.stringify(newClient) 
                });
                if (!clientRes.ok) {
                    const errorData = await clientRes.json();
                    throw new Error(errorData.message || 'Failed to create client.');
                }
                const result = await clientRes.json();
                finalClientId = result.client.id;
            }

            if (!finalClientId) {
                throw new Error('You must select or create a client.');
            }

            const dealPayload = { ...newDeal, client_id: finalClientId };
            const dealRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/deals`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
                body: JSON.stringify(dealPayload) 
            });
            if (!dealRes.ok) {
                const errorData = await dealRes.json();
                throw new Error(errorData.message || 'Failed to create deal.');
            }

            onSuccess();
            onClose();

        } catch (error) {
            console.error('Error in form submission:', error);
            setErrorMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            {errorMessage && (
                <CustomModal
                    title="Error"
                    message={errorMessage}
                    type="error"
                    confirmText="Okay"
                    onConfirm={() => setErrorMessage('')}
                />
            )}
            <Card className="max-w-xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Add New Deal</h2>
                    <button onClick={onClose}><XCircle size={24} className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                </div>
                <div className="flex justify-center mb-4">
                    <button 
                        type="button"
                        onClick={() => { setIsCreatingClient(true); setClientCheck({ checked: false, exists: false, message: '' }); }} 
                        className={`px-4 py-2 text-sm font-semibold rounded-l-lg transition-all flex items-center gap-2 ${isCreatingClient ? 'bg-gradient-to-r from-accent-start to-accent-end text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700 text-text-secondary dark:text-dark-text-secondary'}`}
                    >
                        <UserPlus size={16}/> Create New Client
                    </button>
                    <button 
                        type="button"
                        onClick={() => setIsCreatingClient(false)} 
                        className={`px-4 py-2 text-sm font-semibold rounded-r-lg transition-all flex items-center gap-2 ${!isCreatingClient ? 'bg-gradient-to-r from-accent-start to-accent-end text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700 text-text-secondary dark:text-dark-text-secondary'}`}
                    >
                        <Users size={16}/> Select Existing
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isCreatingClient ? (
                        <>
                            <input type="text" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className={formInputClasses} required placeholder="Client Name"/>
                            <div>
                                <input 
                                    type="email" 
                                    value={newClient.email} 
                                    onChange={(e) => {
                                        setNewClient({ ...newClient, email: e.target.value });
                                        setClientCheck({ checked: false, exists: false, message: '' });
                                    }} 
                                    onBlur={handleClientEmailCheck}
                                    className={formInputClasses} 
                                    required 
                                    placeholder="Client Email"
                                />
                                {clientCheck.exists && (
                                    <p className="text-sm text-red-500 mt-2">{clientCheck.message}</p>
                                )}
                            </div>
                            <input type="text" value={newClient.companyName} onChange={(e) => setNewClient({ ...newClient, companyName: e.target.value })} className={formInputClasses} required placeholder="Client Company"/>
                        </>
                    ) : (
                        <div>
                            <SearchableClientDropdown clients={clients} selectedClientId={newDeal.client_id} onSelect={(id) => setNewDeal({ ...newDeal, client_id: id })} />
                        </div>
                    )}
                    <hr className="border-slate-200 dark:border-slate-700"/>
                    <input type="text" value={newDeal.name} onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })} className={formInputClasses} required placeholder="Deal Name (e.g., Website Redesign)"/>
                    <input type="number" value={newDeal.value} onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })} className={formInputClasses} required placeholder="Deal Value ($)"/>
                    <select value={newDeal.stage} onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })} className={`${formInputClasses} form-select`} required>
                        {salesStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                    </select>
                    {errorMessage && <p className="text-sm text-red-500 text-center">{errorMessage}</p>}
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary px-4 py-2 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
                        <button type="submit" disabled={isLoading} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-50">
                            {isLoading ? <Loader2 className="animate-spin" /> : <Save size={16} />} Save Deal
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};