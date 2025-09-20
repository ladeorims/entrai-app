// src/components/crm/ClientDetailView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../ui/Card';
import { useAuth } from '../../AuthContext';
import { Loader2, ArrowLeft, Lightbulb, Save, Edit } from 'lucide-react';
import TimelineItem from './TimelineItem'; // Import the new component

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid text-text-primary dark:text-dark-text-primary";

const ClientDetailView = ({ clientId, onBack }) => {
    const { token } = useAuth();
    const [clientData, setClientData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState('');

    const fetchClientData = useCallback(async () => {
        if (!token || !clientId) return;
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/crm/clients/${clientId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch client details.');
            const data = await response.json();
            setClientData(data);
            setFormData(data.details);
        } catch (err) {
            console.error("Error fetching client details:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [token, clientId]);

    useEffect(() => {
        fetchClientData();
    }, [fetchClientData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/clients/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save client details.');
            }
            await response.json();
            await fetchClientData();
            setIsEditing(false);
        } catch (err) {
            console.error("Error saving client details:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-accent-start" size={32} /></div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    if (!clientData) {
        return <div className="text-center text-text-secondary dark:text-dark-text-secondary">Client not found.</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex items-center gap-4">
                <button onClick={onBack} className="bg-slate-200 dark:bg-slate-700 p-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold">{clientData.details.name}</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1">{clientData.details.companyName}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Contact Details</h2>
                            <button onClick={() => setIsEditing(!isEditing)} className="text-sm font-semibold text-accent-start dark:text-dark-accent-mid hover:opacity-80">
                                {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div><label className="text-xs text-text-secondary dark:text-dark-text-secondary">Email</label>{isEditing ? <input type="email" name="email" value={formData.email} onChange={handleChange} className={formInputClasses} /> : <p>{formData.email}</p>}</div>
                            <div><label className="text-xs text-text-secondary dark:text-dark-text-secondary">Phone</label>{isEditing ? <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={formInputClasses} /> : <p>{formData.phoneNumber || 'N/A'}</p>}</div>
                        </div>
                        {isEditing && <button onClick={handleSave} className="w-full mt-6 bg-gradient-to-r from-accent-start to-accent-end text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"><Save size={16}/> Save Changes</button>}
                    </Card>
                    <Card className="bg-blue-500/10 border-blue-500/20">
                        <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-2"><Lightbulb /> Next Best Action</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary">{clientData.nextBestAction}</p>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <h2 className="text-xl font-semibold mb-4">Client History</h2>
                        <div className="relative">
                            <div className="absolute left-5 top-2 bottom-0 w-px bg-slate-200 dark:bg-slate-700"></div>
                            {clientData.timeline && clientData.timeline.length > 0 ? (
                                clientData.timeline.map((item, index) => <TimelineItem key={index} item={item} />)
                            ) : (
                                <p className="text-text-secondary dark:text-dark-text-secondary">No history found for this client.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ClientDetailView;