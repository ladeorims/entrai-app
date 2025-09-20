// src/pages/SalesDashboard.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlusCircle, Edit, Trash2, XCircle, Save, Bot, Wand2, Mail, Users, CheckCircle, FileText, ChevronLeft, ChevronRight, Sparkles, FileSignature } from 'lucide-react';
import Card from "../components/ui/Card";
import { ClientDealModal } from '../components/modals/ClientDealModal';
import { IntakeFormModal } from '../components/modals/IntakeFormModal';
import { useAuth } from '../AuthContext';
import BrandedLoader from '../components/BrandedLoader';
import CustomModal from '../components/ui/CustomModal';
import SmartPromptModal from '../components/sales/SmartPromptModal';
import AiSalesModal from '../components/sales/AiSalesModal';

const salesStages = ['New Leads', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won'];

const SalesDashboard = () => {
    const { token } = useAuth();
    const [salesData, setSalesData] = useState([]);
    const [salesPipeline, setSalesPipeline] = useState({});
    const [clients, setClients] = useState([]);
    const [isDealFormVisible, setIsDealFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({ totalRevenue: 0, conversionRate: 0, avgDealSize: 0 });
    const [isAiModalVisible, setIsAiModalVisible] = useState(false);
    const [aiModalState, setAiModalState] = useState({ type: null, title: '', selectedDeal: null, generatedContent: '', aiEmailType: 'outreach', isLoading: false, saveStatus: '', sendStatus: '' });
    const draggedItem = useRef(null);
    const [dragOverStage, setDragOverStage] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [isPromptModalVisible, setIsPromptModalVisible] = useState(false);
    const [promptActions, setPromptActions] = useState([]);
    const [promptContext, setPromptContext] = useState(null);
    const [promptSuccessMessage, setPromptSuccessMessage] = useState(null);
    const [isIntakeFormModalVisible, setIsIntakeFormModalVisible] = useState(false);
    const [intakeForm, setIntakeForm] = useState(null);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [dealToDelete, setDealToDelete] = useState(null);

    const fetchSalesData = useCallback(async () => {
        if (!token) { setLoading(false); return; }
        setLoading(true);
        try {
            const [dealsRes, clientsRes, formRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/deals`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/clients`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/intake-form`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (!dealsRes.ok || !clientsRes.ok || !formRes.ok) throw new Error('Failed to fetch sales data');
            
            const dealsData = await dealsRes.json();
            const clientsData = await clientsRes.json();
            const formData = await formRes.json();
            
            setClients(clientsData);
            setIntakeForm(formData);

            const pipeline = salesStages.reduce((acc, stage) => {
                acc[stage] = dealsData.filter(deal => deal.stage === stage);
                return acc;
            }, {});
            setSalesPipeline(pipeline);
            
            const closedWonDeals = dealsData.filter(d => d.stage === 'Closed Won');
            setSalesData(closedWonDeals);
            
            const totalDeals = dealsData.length;
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

    useEffect(() => {
        fetchSalesData();
    }, [fetchSalesData]);

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
                if (dailyData[dayOfMonth - 1]) {
                    dailyData[dayOfMonth - 1].revenue += parseFloat(deal.value);
                }
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
    
    const confirmDeleteDeal = (deal) => {
        setDealToDelete(deal);
        setIsConfirmDeleteModalOpen(true);
    };

    const handleDeleteDeal = async () => {
        if (!dealToDelete) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/deals/${dealToDelete.id}`, { 
                method: 'DELETE', 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (response.ok) {
                fetchSalesData();
                setIsConfirmDeleteModalOpen(false);
                setDealToDelete(null);
            }
        } catch (error) { 
            console.error('Network error deleting deal:', error); 
        }
    };
    
    const openForm = () => {
        setIsDealFormVisible(true);
    };

    const closeForm = () => {
        setIsDealFormVisible(false);
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
            
            if (result.next_actions && result.next_actions.length > 0) {
                setPromptActions(result.next_actions);
                setPromptContext(result.deal);
                setPromptSuccessMessage(null);
                setIsPromptModalVisible(true);
            }
            fetchSalesData();
        } catch (error) {
            console.error('Failed to update deal stage:', error);
            fetchSalesData();
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
        } else if (actionType === 'create_welcome_task') {
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
    };

    const closePromptModal = () => {
        setIsPromptModalVisible(false);
        setPromptSuccessMessage(null);
    }

    const handleSaveIntakeForm = async (questions) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/intake-form`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ questions })
            });
            if (!response.ok) throw new Error('Failed to save form.');
            const updatedForm = await response.json();
            setIntakeForm(updatedForm);
            setIsIntakeFormModalVisible(false);
        } catch (error) {
            console.error('Error saving intake form:', error);
        }
    };


    if (!token) { return <div className="flex items-center justify-center h-screen text-white"><p className="text-xl">Please log in to access the Sales Dashboard.</p></div>; }
    if (loading) { return <div className="flex items-center justify-center h-full"><BrandedLoader /></div>; }
    
    return (
        <div className="space-y-8 animate-fade-in">
            {isConfirmDeleteModalOpen && (
                <CustomModal
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete the deal "${dealToDelete?.name}"? This action cannot be undone.`}
                    type="confirm"
                    confirmText="Delete"
                    onConfirm={handleDeleteDeal}
                    onClose={() => setIsConfirmDeleteModalOpen(false)}
                />
            )}

            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Sales Hub</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Your command center for sales performance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsIntakeFormModalVisible(true)} className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-2">
                        <FileSignature size={16} /> Client Intake Form
                    </button>
                    <button onClick={() => openForm()} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 flex items-center gap-2">
                        <PlusCircle size={16} /> Add New Deal
                    </button>
                </div>
            </header>

            {isDealFormVisible && (
                <ClientDealModal
                    token={token}
                    clients={clients}
                    onClose={closeForm}
                    onSuccess={fetchSalesData}
                />
            )}

            {isIntakeFormModalVisible && (
                <IntakeFormModal
                    token={token}
                    initialForm={intakeForm}
                    onClose={() => setIsIntakeFormModalVisible(false)}
                    onSave={handleSaveIntakeForm}
                />
            )}
            
            {isAiModalVisible && (
                <AiSalesModal
                    aiModalState={aiModalState}
                    setAiModalState={setAiModalState}
                    setIsAiModalVisible={setIsAiModalVisible}
                    salesPipeline={salesPipeline}
                    onSuccess={fetchSalesData}
                />
            )}

            {isPromptModalVisible && (
                               <SmartPromptModal
                                   deal={promptContext}
                                   actions={promptActions}
                                   onAction={handlePromptAction}
                                   onClose={closePromptModal}
                                   successMessage={promptSuccessMessage}
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
                                            <button onClick={() => confirmDeleteDeal(deal)} className="text-text-secondary dark:text-dark-text-secondary hover:text-red-500"><Trash2 size={14}/></button>
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