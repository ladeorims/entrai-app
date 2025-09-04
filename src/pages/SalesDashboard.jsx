import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlusCircle, Edit, Trash2, XCircle, Save, Bot, Loader2, Wand2, Mail, Users, CheckCircle, FileText, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Card from "../components/ui/Card";

const salesStages = ['New Leads', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won'];
const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";
const formSelectClasses = `${formInputClasses} form-select`;

const SmartPromptModal = ({ deal, actions, onAction, onClose, successMessage, setActiveView }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end rounded-full flex items-center justify-center">
                        <Sparkles size={32} className="text-white"/>
                    </div>
                </div>
                
                {successMessage ? (
                    <div>
                        <h2 className="text-xl font-bold mb-2 text-green-500">Success!</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary mb-6">{successMessage.text}</p>
                        <button onClick={() => { setActiveView(successMessage.view); onClose(); }} className="w-full bg-slate-100 dark:bg-dark-primary-bg hover:bg-slate-200 dark:hover:bg-slate-800 p-3 rounded-lg font-semibold">
                           {successMessage.buttonLabel}
                        </button>
                         <button onClick={onClose} className="mt-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary hover:opacity-80">
                            Close
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Deal Won! What's next?</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary mb-6">You've closed the deal for <span className="font-semibold text-text-primary dark:text-dark-text-primary">{deal.name}</span>. Let's keep the momentum going.</p>
                        <div className="space-y-3">
                            {actions.map(action => (
                                <button key={action.type} onClick={() => onAction(action.type, deal)} className="w-full bg-slate-100 dark:bg-dark-primary-bg hover:bg-slate-200 dark:hover:bg-slate-800 p-3 rounded-lg font-semibold text-left">
                                   {action.label}
                                </button>
                            ))}
                        </div>
                        <button onClick={onClose} className="mt-6 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary hover:opacity-80">
                            I'll do this later
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

// /* eslint-disable-next-line no-unused-vars*/
const SalesDashboard = ({ token, setActiveView }) => {
    const [salesData, setSalesData] = useState([]);
    const [salesPipeline, setSalesPipeline] = useState({});
    const [clients, setClients] = useState([]);
    const [isDealFormVisible, setIsDealFormVisible] = useState(false);
    const [editingDeal, setEditingDeal] = useState(null);
    const [newDeal, setNewDeal] = useState({ name: '', value: '', stage: 'New Leads', client_id: '' });
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({ totalRevenue: 0, conversionRate: 0, avgDealSize: 0 });
    const [isAiModalVisible, setIsAiModalVisible] = useState(false);
    const [aiModalState, setAiModalState] = useState({ type: null, title: '', selectedDeal: null, generatedContent: '', aiEmailType: 'outreach', isLoading: false, saveStatus: '', sendStatus: '' });
    const draggedItem = useRef(null);
    const [dragOverStage, setDragOverStage] = useState(null);
    const [isCreatingClient, setIsCreatingClient] = useState(true);
    const [newClient, setNewClient] = useState({ name: '', email: '', phoneNumber: '', companyName: '' });
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [isPromptModalVisible, setIsPromptModalVisible] = useState(false);
    const [promptActions, setPromptActions] = useState([]);
    const [promptContext, setPromptContext] = useState(null);
    const [promptSuccessMessage, setPromptSuccessMessage] = useState(null);
    const [clientCheck, setClientCheck] = useState({ checked: false, exists: false, message: '' });

    const fetchSalesDeals = useCallback(async () => {
        if (!token) { setLoading(false); return; }
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/deals`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Failed to fetch sales data');
            const data = await response.json();
            const pipeline = salesStages.reduce((acc, stage) => {
                acc[stage] = data.filter(deal => deal.stage === stage);
                return acc;
            }, {});
            setSalesPipeline(pipeline);
            
            const closedWonDeals = data.filter(d => d.stage === 'Closed Won');
            setSalesData(closedWonDeals);
            
            const totalDeals = data.length;
            const totalRevenue = closedWonDeals.reduce((sum, deal) => sum + parseFloat(deal.value), 0);
            const conversionRate = totalDeals > 0 ? ((closedWonDeals.length / totalDeals) * 100).toFixed(1) : 0;
            const avgDealSize = closedWonDeals.length > 0 ? (totalRevenue / closedWonDeals.length).toFixed(0) : 0;
            setMetrics({ totalRevenue, conversionRate, avgDealSize });

        } catch (error) {
            console.error('Network error fetching sales data:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchClients = useCallback(async () => {
        if (!token) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/clients`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) {
                const clientData = await response.json();
                setClients(clientData);
            }
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        }
    }, [token]);

    useEffect(() => {
        fetchSalesDeals();
        fetchClients();
    }, [fetchSalesDeals, fetchClients]);

     const getChartDataForMonth = (month, deals) => {
        const year = month.getFullYear();
        const monthIndex = month.getMonth();
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        
        const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            return { name: day.toString(), revenue: 0 };
        });

        deals.forEach(deal => {
            const dealDate = new Date(deal.created_at);
            if (dealDate.getFullYear() === year && dealDate.getMonth() === monthIndex) {
                const dayOfMonth = dealDate.getDate();
                dailyData[dayOfMonth - 1].revenue += parseFloat(deal.value);
            }
        });

        return dailyData;
    };

    const chartData = getChartDataForMonth(selectedMonth, salesData);
    const handleMonthChange = (offset) => {
        setSelectedMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + offset);
            return newDate;
        });
    };

    // NEW: Function to check for an existing client when the email field loses focus
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
                    message: `This client already exists. Switch to the "Select Existing" tab to add a deal for them.`
                });
            } else {
                setClientCheck({ checked: true, exists: false, message: '' });
            }
        } catch (error) {
            console.error("Error checking client email:", error);
        }
    };

    const handleNewClientAndDealSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (isCreatingClient && clientCheck.exists) {
            alert(clientCheck.message);
            return;
        }
        try {
            let clientData = null;
            let nextActions = []; // NEW: Initialize nextActions array

            if (isCreatingClient) {
                const clientRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/clients`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(newClient) });
                if (!clientRes.ok) { const errorData = await clientRes.json(); throw new Error(errorData.message || 'Failed to create client.'); }
                
                const result = await clientRes.json();
                clientData = result.client;
                nextActions = result.next_actions || []; // NEW: Capture next_actions from the response
            } else {
                clientData = clients.find(c => c.id === parseInt(newDeal.client_id));
                if (!clientData) { throw new Error('Please select an existing client.'); }
            }
            
            const dealPayload = { ...newDeal, client_id: clientData.id, name: newDeal.name || clientData.company_name || clientData.name };
            const dealRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/deals`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(dealPayload) });
            if (!dealRes.ok) { const errorData = await dealRes.json(); throw new Error(errorData.message || 'Failed to create deal.'); }
            const newDealData = await dealRes.json();

            closeForm();
            fetchClients(); 
            fetchSalesDeals(); 

            // NEW: Trigger the Smart Prompt if there are next_actions
            if (nextActions.length > 0) {
                setPromptActions(nextActions);
                // The context for this prompt is the new client data
                setPromptContext({ ...newDealData, client_name: clientData.name });
                setPromptSuccessMessage(null);
                setIsPromptModalVisible(true);
            }

        } catch (error) {
            console.error('Error in form submission:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDeleteDeal = async (dealId) => {
        if (window.confirm('Are you sure?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/deals/${dealId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                if (response.ok) fetchSalesDeals();
            } catch (error) { console.error('Network error deleting deal:', error); }
        }
    };
    
    // const handleDrop = async (e, targetStage) => {
    //     e.preventDefault();
    //     setDragOverStage(null);
    //     const { deal, sourceStage } = draggedItem.current;
    //     if (!deal || sourceStage === targetStage) return;
    //     const updatedDealData = { ...deal, stage: targetStage };
    //     const newPipeline = { ...salesPipeline };
    //     newPipeline[sourceStage] = newPipeline[sourceStage].filter(d => d.id !== deal.id);
    //     newPipeline[targetStage].push(updatedDealData);
    //     setSalesPipeline(newPipeline);
    //     try {
    //         await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/deals/${deal.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(updatedDealData) });
    //         fetchSalesDeals();
    //     } catch (error) {
    //         console.error('Failed to update deal stage:', error);
    //         fetchSalesDeals();
    //     }
    // };

    const openForm = (deal = null) => {
        setEditingDeal(deal);
        if (deal) {
            setIsCreatingClient(false);
            setNewDeal({ name: deal.name, value: deal.value, stage: deal.stage, client_id: deal.client_id, client_email: deal.client_email });
        } else {
            setNewDeal({ name: '', value: '', stage: 'New Leads', client_id: '', client_email: '' });
            setIsCreatingClient(true);
            setNewClient({ name: '', email: '', phoneNumber: '', companyName: '' });
        }
        setIsDealFormVisible(true);
    };

    const closeForm = () => {
        setIsDealFormVisible(false);
        setEditingDeal(null);
    };

    const handleDragStart = (e, deal, sourceStage) => { draggedItem.current = { deal, sourceStage }; };
    const handleDragOver = (e) => e.preventDefault();

    const openAiModal = (type) => {
        let title = '';
        if (type === 'email') title = 'Generate Sales Email';
        else if (type === 'leads') title = 'Generate Lead Ideas';
        else if (type === 'closing') title = 'Draft Closing Email';
        setAiModalState({ type, title, selectedDeal: null, generatedContent: '', aiEmailType: 'outreach', isLoading: false, saveStatus: '', sendStatus: '' });
        setIsAiModalVisible(true);
    };

    const handleAiDealSelect = (dealId) => {
        const deal = Object.values(salesPipeline).flat().find(d => d.id === parseInt(dealId));
        setAiModalState(prev => ({ ...prev, selectedDeal: deal, generatedContent: '', saveStatus: '', sendStatus: '' }));
    };

    const handleGenerateAiContent = async () => {
        if (aiModalState.type !== 'leads' && !aiModalState.selectedDeal) { setAiModalState(prev => ({ ...prev, generatedContent: 'Please select a deal first.' })); return; }
        setAiModalState(prev => ({ ...prev, isLoading: true, generatedContent: '', saveStatus: '' }));
        let endpoint = '';
        const body = { clientName: aiModalState.selectedDeal?.client_name, clientCompany: aiModalState.selectedDeal?.client_company };
        if (aiModalState.type === 'email') { endpoint = 'generate-email'; body.emailType = aiModalState.aiEmailType; } 
        else if (aiModalState.type === 'leads') { endpoint = 'generate-leads'; } 
        else if (aiModalState.type === 'closing') { endpoint = 'generate-email'; body.emailType = 'closing-sequence'; }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
            if (!response.ok) throw new Error(`API error: ${response.statusText}`);
            const result = await response.json();
            if (aiModalState.type === 'leads') { setAiModalState(prev => ({ ...prev, generatedContent: result.leads.join('\n'), isLoading: false })); } 
            else { setAiModalState(prev => ({ ...prev, generatedContent: result.emailContent, isLoading: false })); }
        } catch (error) {
            console.error('AI content generation error:', error);
            setAiModalState(prev => ({ ...prev, generatedContent: `Failed to connect to the AI service. Error: ${error.message}`, isLoading: false }));
        }
    };

    const handleSaveAiContent = async () => {
        const dealId = aiModalState.selectedDeal?.id;
        if (!dealId) { setAiModalState(prev => ({...prev, saveStatus: 'Error: No deal selected.'})); return; }
        setAiModalState(prev => ({...prev, saveStatus: 'Saving...'}));
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/deals/${dealId}/notes`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ note: aiModalState.generatedContent, type: aiModalState.type }) });
            if (!response.ok) throw new Error('Failed to save note.');
            setAiModalState(prev => ({...prev, saveStatus: 'Saved successfully!'}));
        } catch (error) {
            console.error('Save AI content error:', error);
            setAiModalState(prev => ({...prev, saveStatus: `Error: ${error.message}`}));
        }
    };

    const handleSendAiEmail = async () => {
        const deal = aiModalState.selectedDeal;
        if (!deal) { setAiModalState(prev => ({ ...prev, sendStatus: 'Error: No deal selected.' })); return; }
        setAiModalState(prev => ({ ...prev, sendStatus: 'Sending email...' }));
        const emailSubject = `${aiModalState.title.replace('Generate ', '')} for ${deal.name}`;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/send-email`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ clientEmail: deal.client_email, subject: emailSubject, body: aiModalState.generatedContent, clientId: deal.client_id }) });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || 'Failed to send email.'); }
            setAiModalState(prev => ({ ...prev, sendStatus: 'Email sent successfully!' }));
        } catch (error) {
            console.error('Error sending email:', error);
            setAiModalState(prev => ({ ...prev, sendStatus: `Error sending email: ${error.message}` }));
        }
    };

     const handleDrop = async (e, targetStage) => {
        e.preventDefault();
        setDragOverStage(null);
        const { deal, sourceStage } = draggedItem.current;
        if (!deal || sourceStage === targetStage) return;
        
        const optimisticPipeline = { ...salesPipeline };
        optimisticPipeline[sourceStage] = optimisticPipeline[sourceStage].filter(d => d.id !== deal.id);
        optimisticPipeline[targetStage].push({ ...deal, stage: targetStage });
        setSalesPipeline(optimisticPipeline);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/deals/${deal.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...deal, stage: targetStage })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            
            // NEW: Check for next_actions and trigger the Smart Prompt
            if (result.next_actions && result.next_actions.length > 0) {
                setPromptActions(result.next_actions);
                setPromptContext(result.deal);
                setPromptSuccessMessage(null); // Clear any previous success messages
                setIsPromptModalVisible(true);
            }
            fetchSalesDeals(); // Refresh all data from the server
        } catch (error) {
            console.error('Failed to update deal stage:', error);
            fetchSalesDeals(); // Revert to server state on error
        }
    };
    
    const handlePromptAction = async (actionType, context) => {
        if (actionType === 'create_onboarding_task') {
            const task = {
                title: `Onboard new client: ${context.client_name}`,
                priority: 'High',
                dueDate: null
            };
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(task)
            });
            setPromptSuccessMessage({
                text: `An onboarding task has been created for ${context.client_name}.`,
                buttonLabel: "View Task",
                view: "Virtual Assistant"
            });
        } else if (actionType === 'create_welcome_task') { // NEW: Handle the new action type
            const task = {
                title: `Send welcome kit to ${context.client_name}`,
                priority: 'Medium',
                dueDate: null
            };
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(task)
            });
            setPromptSuccessMessage({
                text: `A task to send a welcome kit to ${context.client_name} has been created.`,
                buttonLabel: "View Task",
                view: "Virtual Assistant"
            });
        }
        // setIsPromptModalVisible(false);
    };


    const closePromptModal = () => {
        setIsPromptModalVisible(false);
        setPromptSuccessMessage(null);
    }

    if (!token) { return <div className="flex items-center justify-center h-screen text-white"><p className="text-xl">Please log in to access the Sales Dashboard.</p></div>; }
    if (loading) { return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>; }
    
    
    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Sales Hub</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Your command center for sales performance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => openForm()} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 flex items-center gap-2">
                        <PlusCircle size={16} /> Add New Deal
                    </button>
                </div>
            </header>

          {isDealFormVisible && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="max-w-xl w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{editingDeal ? 'Edit Deal' : 'Add New Deal'}</h2>
                <button onClick={closeForm}><XCircle size={24} className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
            </div>
            <div className="flex justify-center mb-4">
                <button 
                    onClick={() => { setIsCreatingClient(true); setClientCheck({ checked: false, exists: false, message: '' }); }} 
                    className={`px-4 py-2 text-sm font-semibold rounded-l-lg transition-all ${
                        isCreatingClient 
                        ? 'bg-gradient-to-r from-accent-start to-accent-end text-white shadow-md' 
                        : 'bg-slate-200 dark:bg-slate-700 text-text-secondary dark:text-dark-text-secondary hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                >
                    Create New Client
                </button>
                <button 
                    onClick={() => setIsCreatingClient(false)} 
                    className={`px-4 py-2 text-sm font-semibold rounded-r-lg transition-all ${
                        !isCreatingClient 
                        ? 'bg-gradient-to-r from-accent-start to-accent-end text-white shadow-md' 
                        : 'bg-slate-200 dark:bg-slate-700 text-text-secondary dark:text-dark-text-secondary hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                >
                    Select Existing
                </button>
            </div>
            
            <form onSubmit={handleNewClientAndDealSubmit} className="space-y-4">
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
                        <input type="tel" value={newClient.phoneNumber} onChange={(e) => setNewClient({ ...newClient, phoneNumber: e.target.value })} className={formInputClasses} placeholder="Client Phone Number"/>
                        <input type="text" value={newClient.companyName} onChange={(e) => setNewClient({ ...newClient, companyName: e.target.value })} className={formInputClasses} required placeholder="Client Company"/>
                    </>
                            ) : (
                                <div>
                                    <select value={newDeal.client_id} onChange={(e) => setNewDeal({ ...newDeal, client_id: e.target.value })} className={formSelectClasses} required>
                                        <option value="" disabled>Choose a client...</option>
                                        {clients.map(client => (<option key={client.id} value={client.id}>{client.name} - {client.company_name}</option>))}
                                    </select>
                                </div>
                            )}
                            <input type="text" value={newDeal.name} onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })} className={formInputClasses} required placeholder="Deal Name (e.g., Website Redesign)"/>
                            <input type="number" value={newDeal.value} onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })} className={formInputClasses} required placeholder="Deal Value ($)"/>
                            <select value={newDeal.stage} onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })} className={formSelectClasses} required>
                                {salesStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                            </select>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={closeForm} className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary px-4 py-2 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
                                <button type="submit" className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90">
                                    <Save size={16} /> Save Deal
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
            
{isAiModalVisible && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Wand2 size={24} className="text-accent-start dark:text-dark-accent-mid" /> 
                    {aiModalState.title}
                </h2>
                <button onClick={() => setIsAiModalVisible(false)}>
                    <XCircle size={24} className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/>
                </button>
            </div>
            
            {aiModalState.isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 size={32} className="animate-spin text-accent-start dark:text-dark-accent-mid" />
                    <p className="ml-3 text-text-secondary dark:text-dark-text-secondary">Generating...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {aiModalState.type !== 'leads' && (
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Select a Deal for Context</label>
                            <select onChange={(e) => handleAiDealSelect(e.target.value)} defaultValue="" className="w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start">
                                <option value="" disabled>Choose a deal...</option>
                                {Object.values(salesPipeline).flat().map(deal => (
                                    <option key={deal.id} value={deal.id}>{deal.name} - ${parseFloat(deal.value).toLocaleString()}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    {aiModalState.type === 'email' && (
                        <div className="flex justify-start gap-4 flex-wrap">
                            <label className="text-sm">
                                <input type="radio" value="outreach" checked={aiModalState.aiEmailType === 'outreach'} onChange={(e) => setAiModalState(prev => ({...prev, aiEmailType: e.target.value, generatedContent: ''}))} className="mr-2 accent-accent-start dark:accent-dark-accent-mid" />
                                Outreach
                            </label>
                            <label className="text-sm">
                                <input type="radio" value="follow-up" checked={aiModalState.aiEmailType === 'follow-up'} onChange={(e) => setAiModalState(prev => ({...prev, aiEmailType: e.target.value, generatedContent: ''}))} className="mr-2 accent-accent-start dark:accent-dark-accent-mid" />
                                Follow-up
                            </label>
                            <label className="text-sm">
                                <input type="radio" value="value-added" checked={aiModalState.aiEmailType === 'value-added'} onChange={(e) => setAiModalState(prev => ({...prev, aiEmailType: e.target.value, generatedContent: ''}))} className="mr-2 accent-accent-start dark:accent-dark-accent-mid" />
                                Value-added
                            </label>
                        </div>
                    )}
                    
                    {aiModalState.generatedContent ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Review & Edit</label>
                                <textarea 
                                    value={aiModalState.generatedContent}
                                    onChange={(e) => setAiModalState({...aiModalState, generatedContent: e.target.value})}
                                    rows="10"
                                    className="w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start"
                                />
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary text-center mt-3">✨ AI-generated content. Please review for accuracy and tone.</p>
                            </div>
                            <div className="mt-4 flex gap-2">
                                {aiModalState.type !== 'leads' && (
                                    <button onClick={handleSendAiEmail} disabled={!aiModalState.selectedDeal || aiModalState.sendStatus.includes('Sending')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold w-full flex-1 disabled:opacity-50 flex items-center justify-center gap-2">
                                        <Mail size={16} /> Send Email
                                    </button>
                                )}
                                <button onClick={handleSaveAiContent} disabled={aiModalState.saveStatus.includes('Saving')} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold w-full flex-1 disabled:opacity-50 flex items-center justify-center gap-2">
                                    <Save size={16} /> Save as Note
                                </button>
                            </div>
                            {aiModalState.saveStatus && <p className="text-sm text-center mt-2">{aiModalState.saveStatus}</p>}
                            {aiModalState.sendStatus && <p className="text-sm text-center mt-2">{aiModalState.sendStatus}</p>}
                        </>
                    ) : (
                        <button onClick={handleGenerateAiContent} disabled={(aiModalState.type !== 'leads' && !aiModalState.selectedDeal)} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-4 py-3 rounded-lg font-semibold disabled:opacity-50">
                            Generate {aiModalState.type === 'email' ? 'Email' : aiModalState.type === 'leads' ? 'Leads' : 'Closing Email'}
                        </button>
                    )}
                </div>
            )}
        </Card>
    </div>
)}

{isPromptModalVisible && (
                 <SmartPromptModal
                    deal={promptContext}
                    actions={promptActions}
                    onAction={handlePromptAction}
                    onClose={closePromptModal}
                    successMessage={promptSuccessMessage}
                    setActiveView={setActiveView}
                />
            )}
           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card><p className="text-text-secondary dark:text-dark-text-secondary text-sm">Total Revenue</p><p className="text-3xl font-bold">${metrics.totalRevenue.toLocaleString()}</p></Card>
                <Card><p className="text-text-secondary dark:text-dark-text-secondary text-sm">Conversion Rate</p><p className="text-3xl font-bold">{metrics.conversionRate}%</p></Card>
                <Card><p className="text-text-secondary dark:text-dark-text-secondary text-sm">Average Deal Size</p><p className="text-3xl font-bold">${parseInt(metrics.avgDealSize).toLocaleString()}</p></Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Revenue Overview</h2>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleMonthChange(-1)} className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"><ChevronLeft size={16}/></button>
                            <span className="font-semibold text-sm w-28 text-center">{selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                            <button onClick={() => handleMonthChange(1)} className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"><ChevronRight size={16}/></button>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="lightRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4A90E2" stopOpacity={0.4}/><stop offset="95%" stopColor="#9013FE" stopOpacity={0.1}/></linearGradient>
                                <linearGradient id="darkRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00F2A9" stopOpacity={0.4}/><stop offset="95%" stopColor="#9B51E0" stopOpacity={0.1}/></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis dataKey="name" stroke="currentColor" className="text-xs text-text-secondary dark:text-dark-text-secondary" />
                            <YAxis stroke="currentColor" className="text-xs text-text-secondary dark:text-dark-text-secondary" />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg, #FFFFFF)', border: '1px solid #e2e8f0' }} itemStyle={{ color: 'var(--text-primary, #1E2022)' }}/>
                            <Area type="monotone" dataKey="revenue" className="stroke-accent-start dark:stroke-dark-accent-start" fillOpacity={1} fill="url(#lightRevenue)" />
                            <Area type="monotone" dataKey="revenue" className="dark:stroke-dark-accent-start" fillOpacity={1} fill="url(#darkRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Sales Co-Pilot</h2>
                    <Card onClick={() => openAiModal('email')} className="cursor-pointer group"><div className="flex items-start gap-4"><div className="bg-slate-100 dark:bg-dark-primary-bg p-3 rounded-lg group-hover:bg-accent-start/10 dark:group-hover:bg-dark-accent-start/10"><Bot size={24} className="text-accent-start dark:text-dark-accent-start" /></div><div><h3 className="font-semibold">Generate Email</h3><p className="text-sm text-text-secondary dark:text-dark-text-secondary">Draft a personalized sales email.</p></div></div></Card>
                    <Card onClick={() => openAiModal('closing')} className="cursor-pointer group"><div className="flex items-start gap-4"><div className="bg-slate-100 dark:bg-dark-primary-bg p-3 rounded-lg group-hover:bg-accent-start/10 dark:group-hover:bg-dark-accent-start/10"><CheckCircle size={24} className="text-accent-start dark:text-dark-accent-start" /></div><div><h3 className="font-semibold">Draft Closing Email</h3><p className="text-sm text-text-secondary dark:text-dark-text-secondary">Get an AI-powered email for a closed deal.</p></div></div></Card>
                    <Card onClick={() => openAiModal('leads')} className="cursor-pointer group"><div className="flex items-start gap-4"><div className="bg-slate-100 dark:bg-dark-primary-bg p-3 rounded-lg group-hover:bg-accent-start/10 dark:group-hover:bg-dark-accent-start/10"><Users size={24} className="text-accent-start dark:text-dark-accent-start" /></div><div><h3 className="font-semibold">Generate Lead Ideas</h3><p className="text-sm text-text-secondary dark:text-dark-text-secondary">Brainstorm new lead generation ideas.</p></div></div></Card>
                </div>
            </div>
            
            <div>
                <h2 className="text-xl font-semibold mb-4">Sales Pipeline</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start">
                    {salesStages.map(stage => (
                        <div key={stage} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stage)} onDragEnter={() => setDragOverStage(stage)} onDragLeave={() => setDragOverStage(null)} className={`bg-slate-100/50 dark:bg-dark-primary-bg/50 rounded-lg p-4 min-h-[400px] transition-colors ${dragOverStage === stage ? 'bg-slate-200 dark:bg-slate-800' : ''}`}>
                            <h3 className="font-semibold mb-4">{stage} <span className="text-sm text-text-secondary dark:text-dark-text-secondary ml-2">{salesPipeline[stage]?.length || 0}</span></h3>
                            <div className="space-y-3">
                                {salesPipeline[stage]?.map((deal) => (
                                    <Card key={deal.id} draggable onDragStart={(e) => handleDragStart(e, deal, stage)} className="p-3 cursor-pointer group">
                                        <div>
                                            <p className="font-medium text-sm">{deal.name}</p>
                                            <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">{deal.client_name}</p>
                                            <p className="text-xs text-green-500 mt-1">${parseFloat(deal.value).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => openForm(deal)} className="text-text-secondary dark:text-dark-text-secondary hover:text-accent-start dark:hover:text-dark-accent-start"><Edit size={14}/></button>
                                            <button onClick={() => handleDeleteDeal(deal.id)} className="text-text-secondary dark:text-dark-text-secondary hover:text-red-500"><Trash2 size={14}/></button>
                                            {stage === 'Closed Won' && (<div className="flex items-center gap-1 text-green-500 text-xs" title="An invoice for this deal has been drafted."><FileText size={14}/></div>)}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesDashboard;