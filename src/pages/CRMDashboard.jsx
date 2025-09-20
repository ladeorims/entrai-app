import React, { useState, useEffect, useCallback } from 'react';
import { Users, Loader2, ArrowLeft, Lightbulb, Save, Edit, FileText, DollarSign, StickyNote, Mail } from 'lucide-react';
import Card from '../components/ui/Card';
import ClientDetailView from '../components/crm/ClientDetailView';
import { useAuth } from '../AuthContext';
import BrandedLoader from '../components/BrandedLoader';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid text-text-primary dark:text-dark-text-primary";

const CRMDashboard = () => {
    const { token } = useAuth();
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedClientId, setSelectedClientId] = useState(null);
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

    const filteredClients = clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (client.companyName && client.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><BrandedLoader /></div>;
    }

    if (selectedClientId) {
        return <ClientDetailView clientId={selectedClientId} onBack={() => { setSelectedClientId(null); fetchClients(); }} />;
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
                    <Card key={client.id} onClick={() => setSelectedClientId(client.id)} className="cursor-pointer hover:border-accent-start dark:hover:border-dark-accent-mid transition-colors">
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