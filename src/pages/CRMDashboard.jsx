/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect, useCallback } from 'react';
import { Users, Loader2, ArrowLeft, Lightbulb, Save, Edit, FileText, DollarSign, StickyNote, Mail } from 'lucide-react';
import Card from '../components/ui/Card';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid text-text-primary dark:text-dark-text-primary";

const TimelineItem = ({ item }) => {
    const renderIcon = () => {
        switch (item.type) {
            case 'deal': return <DollarSign size={16} className="text-blue-500" />;
            case 'invoice': return <FileText size={16} className="text-green-500" />;
            case 'note': return <StickyNote size={16} className="text-yellow-500" />;
            case 'sent_email': return <Mail size={16} className="text-purple-500" />;
            default: return <StickyNote size={16} />;
        }
    };

    const renderContent = () => {
        switch (item.type) {
            case 'deal':
                return <p><strong>Deal:</strong> {item.name} - Stage changed to <span className="font-semibold">{item.stage}</span> for <span className="font-semibold">${Number(item.value).toLocaleString()}</span>.</p>;
            case 'invoice':
                return <p><strong>Invoice:</strong> {item.invoice_number} - Status updated to <span className="font-semibold capitalize">{item.status}</span> for <span className="font-semibold">${Number(item.total_amount).toLocaleString()}</span>.</p>;
            case 'note':
                return <div><p className="font-semibold">Note added to deal "{item.deal_name}":</p><p className="whitespace-pre-wrap mt-1">{item.note}</p></div>;
            case 'sent_email':
                return <div><p className="font-semibold">Email sent:</p><p className="whitespace-pre-wrap mt-1 text-sm">{item.content}</p></div>;
            default:
                return <p>{item.content}</p>;
        }
    };

    return (
        <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
                <div className="bg-slate-100 dark:bg-dark-primary-bg rounded-full p-2">
                    {renderIcon()}
                </div>
                <div className="w-px flex-grow bg-slate-200 dark:bg-slate-700 my-2"></div>
            </div>
            <div className="flex-1 pb-8">
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary mb-1">
                    {new Date(item.created_at).toLocaleString()}
                </p>
                <div className="p-3 bg-slate-100/50 dark:bg-dark-primary-bg/50 rounded-lg text-sm">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

const ClientDetailView = ({ clientData, onBack, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(clientData.details);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };
    
    const handleSave = () => {
        onSave(formData);
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

const CRMDashboard = ({ token }) => {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedClientId, setSelectedClientId] = useState(null);
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
        if (!selectedClientId) {
            fetchClients();
        }
    }, [fetchClients, selectedClientId]);

    const handleSelectClient = async (clientId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/crm/clients/${clientId}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Failed to fetch client details');
            const data = await response.json();
            setClientData(data);
            setSelectedClientId(clientId);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveClientDetails = async (updatedDetails) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/clients/${updatedDetails.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedDetails)
            });

            if (!response.ok) {
                throw new Error("Failed to save client details.");
            }
            
            const savedDetails = await response.json();
            
            // Update the local state with the successfully saved data from the server
            setClientData(prev => ({...prev, details: savedDetails}));
            fetchClients(); // Refresh the main list in case the name changed
        } catch (error) {
            console.error("Error saving client details:", error);
            // Optionally, you can add state here to show an error message to the user
        }
    };

    const filteredClients = clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (client.companyName && client.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-accent-start" size={32} /></div>;
    }

    if (selectedClientId && clientData) {
        return <ClientDetailView clientData={clientData} onBack={() => setSelectedClientId(null)} onSave={handleSaveClientDetails} token={token}/>;
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

