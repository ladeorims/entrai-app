// src/pages/CRMDashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Loader2, ArrowLeft, Lightbulb, Save, Edit, FileText, DollarSign, StickyNote, XCircle } from 'lucide-react';
import Card from '../components/ui/Card';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";

const ClientDetailView = ({ clientData, onBack, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(clientData.details);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };
    
    const handleSave = () => {
        // Here you would call an API to save the changes
        console.log("Saving data:", formData);
        onSave(formData); // Placeholder for actual save
        setIsEditing(false);
    };

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
                        <div className="space-y-6">
                            <div><h3 className="font-semibold flex items-center gap-2 mb-2"><DollarSign size={16}/> Deals</h3><div className="space-y-2">{clientData.deals.map(d => (<div key={d.id} className="p-3 bg-slate-100 dark:bg-dark-primary-bg rounded-lg">...</div>))}</div></div>
                            <div><h3 className="font-semibold flex items-center gap-2 mb-2"><FileText size={16}/> Invoices</h3><div className="space-y-2">{clientData.invoices.map(i => (<div key={i.id} className="p-3 bg-slate-100 dark:bg-dark-primary-bg rounded-lg">...</div>))}</div></div>
                            <div><h3 className="font-semibold flex items-center gap-2 mb-2"><StickyNote size={16}/> Notes</h3><textarea placeholder="Add a new note..." className={`${formInputClasses} h-20`}></textarea></div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const CRMDashboard = ({ token }) => {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientData, setClientData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchClients = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/crm/clients`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Failed to fetch clients');
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const handleSelectClient = async (clientId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/crm/clients/${clientId}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Failed to fetch client details');
            const data = await response.json();
            setClientData(data);
            setSelectedClient(clientId);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveClientDetails = (updatedDetails) => {
        // In a real app, we would make a PUT request to the server here
        setClientData(prev => ({...prev, details: updatedDetails}));
        fetchClients(); // Refresh the main list in case the name changed
    };

    const filteredClients = clients.filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-accent-start" size={32} /></div>;
    }

    if (selectedClient && clientData) {
        return <ClientDetailView clientData={clientData} onBack={() => setSelectedClient(null)} onSave={handleSaveClientDetails} token={token}/>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold">Client Relationship Manager</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-1">A unified view of every client relationship.</p>
            </header>
            <input type="text" placeholder="Search clients..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={formInputClasses} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map(client => (
                    <Card key={client.id} onClick={() => handleSelectClient(client.id)} className="cursor-pointer hover:border-accent-start dark:hover:border-dark-accent-mid transition-colors">
                        <h3 className="font-bold text-lg">{client.name}</h3>
                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{client.companyName}</p>
                        <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4 flex justify-between text-sm">
                            <span className="text-text-secondary dark:text-dark-text-secondary">{client.deal_count} Won Deals</span>
                            <span className="font-semibold text-green-500">${Number(client.total_value).toLocaleString()}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CRMDashboard;