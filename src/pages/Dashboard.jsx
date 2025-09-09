/* eslint-disable no-irregular-whitespace */
// src/pages/Dashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, PlusCircle, Square, CheckSquare, Lightbulb, FileText, Send, Bot, DollarSign, Megaphone, Info } from 'lucide-react';
import Card from '../components/ui/Card';
import AddTaskModal from '../components/modals/AddTaskModal';
import CreateInvoiceModal from '../components/modals/CreateInvoiceModal';
import ClientDealModal from '../components/modals/ClientDealModal';
import AskAIModal from '../components/modals/AskAIModal';
import GoalsWidget from '../components/dashboard/GoalsWidget';


const BusinessHealthGauge = ({ score }) => {
    const getStatus = (s) => {
        if (s >= 75) return { label: "You're on track", color: "text-green-500" };
        if (s >= 50) return { label: "Things are steady", color: "text-yellow-500" };
        return { label: "Needs attention", color: "text-red-500" };
    };

    const status = getStatus(score);

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-4">
            <div className="relative w-48 h-24">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" strokeWidth="12" className="stroke-slate-200 dark:stroke-slate-700" strokeLinecap="round" />
                </svg>
                <svg viewBox="0 0 100 50" className="w-full h-full absolute top-0 left-0">
                    <path 
                        d="M 10 50 A 40 40 0 0 1 90 50" 
                        fill="none" 
                        strokeWidth="12" 
                        className={`transition-all duration-700 ease-out ${score >= 75 ? 'stroke-green-500' : score >= 50 ? 'stroke-yellow-500' : 'stroke-red-500'}`}
                        strokeLinecap="round"
                        strokeDasharray="125.6"
                        style={{ strokeDashoffset: 125.6 - (score / 100 * 125.6) }}
                    />
                </svg>
                {/* UPDATED: The needle element has been removed from here */}
            </div>
            <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                    <p className="text-text-secondary dark:text-dark-text-secondary text-lg">Business Health Score</p>
                    <Info size={16} className="text-text-secondary dark:text-dark-text-secondary cursor-pointer hover:opacity-70" />
                </div>
                <p className="text-6xl font-bold text-text-primary dark:text-dark-text-primary my-1">{score}</p>
                <p className={`font-semibold ${status.color}`}>{status.label}</p>
            </div>
        </div>
    );
};

const Dashboard = ({ setActiveView, token, user }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [activity, setActivity] = useState([]);
    const [clients, setClients] = useState([]);
    const [activityFilter, setActivityFilter] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [greeting, setGreeting] = useState('');
    const [statusMessage, setStatusMessage] = useState("Here's your business at a glance.");
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
    const [isClientDealModalOpen, setIsClientDealModalOpen] = useState(false);
    const [isAskAIModalOpen, setIsAskAIModalOpen] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        const name = user?.name?.split(' ')[0] || 'there';
        if (hour < 12) setGreeting(`Good morning, ${name}`);
        else if (hour < 18) setGreeting(`Good afternoon, ${name}`);
        else setGreeting(`Good evening, ${name}`);
    }, [user]);

    // Inside src/pages/Dashboard.jsx

    const fetchData = useCallback(async () => {
        if (!token) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const [overviewRes, tasksRes, activityRes, clientsRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/overview`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/recent-activity`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/clients`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (!overviewRes.ok || !tasksRes.ok || !activityRes.ok || !clientsRes.ok) {
                throw new Error('Failed to fetch all dashboard data');
            }

            const overviewData = await overviewRes.json();
            const allTasks = await tasksRes.json();
            const activityData = await activityRes.json();
            const clientsData = await clientsRes.json();
            
            setDashboardData(overviewData);
            setTasks(allTasks.filter(t => t.status === 'incomplete').slice(0, 3));
            setActivity(activityData);
            setClients(clientsData);

            const statusRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/status-message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ healthScore: overviewData.healthScore })
            });
            if (statusRes.ok) {
                const statusData = await statusRes.json();
                setStatusMessage(statusData.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleTask = async (taskToToggle) => {
        const updatedTasks = tasks.filter(t => t.id !== taskToToggle.id);
        setTasks(updatedTasks);

        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskToToggle.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...taskToToggle, status: 'complete' })
            });
        } catch (error) {
            console.error('Error updating task:', error);
            fetchData();
        }
    };

    const filteredActivity = activity.filter(item => activityFilter === 'ALL' || item.type.toUpperCase() === activityFilter);

    if (isLoading) { return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-accent-start" size={32} /></div>; }
    if (!dashboardData) { return <div className="text-center text-text-secondary">Could not load dashboard data. Please try again later.</div>; }

    return (
        <div className="animate-fade-in space-y-8">
            {isAddTaskModalOpen && <AddTaskModal token={token} onClose={() => setIsAddTaskModalOpen(false)} onTaskAdded={fetchData} />}
            {isCreateInvoiceModalOpen && <CreateInvoiceModal token={token} user={user} clients={clients} onClose={() => setIsCreateInvoiceModalOpen(false)} onInvoiceCreated={fetchData} />}
            {isClientDealModalOpen && <ClientDealModal token={token} clients={clients} onClose={() => setIsClientDealModalOpen(false)} onSuccess={fetchData} defaultToNewClient={true} />}
            {isAskAIModalOpen && <AskAIModal token={token} onClose={() => setIsAskAIModalOpen(false)} />}

            <header>
                <h1 className="text-3xl font-bold">{greeting}</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-1">{statusMessage}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <GoalsWidget token={token} dashboardData={dashboardData} />
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Business Health</h2>
                        <BusinessHealthGauge score={dashboardData.healthScore} />
                    </Card>

                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Urgent Tasks</h2>
                            <button onClick={() => setIsAddTaskModalOpen(true)} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
                                <PlusCircle size={16} /> Add Task
                            </button>
                        </div>
                        <div className="space-y-3">
                            {tasks.length > 0 ? tasks.map(task => (
                                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => toggleTask(task)}>
                                    <Square size={20} className="text-text-secondary dark:text-dark-text-secondary" />
                                    <span className="flex-1">{task.title}</span>
                                </div>
                            )) : <div className="flex items-center gap-3 p-4 text-text-secondary dark:text-dark-text-secondary"><CheckSquare size={20} className="text-green-500" /><span>No urgent tasks. Great job!</span></div>}
                        </div>
                    </Card>
                    
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Recent Activity</h2>
                            <div className="flex gap-1 bg-slate-100 dark:bg-dark-primary-bg p-1 rounded-lg">
                                {['ALL', 'DEAL', 'INVOICE', 'TASK'].map(filter => (
                                    <button key={filter} onClick={() => setActivityFilter(filter)} className={`px-3 py-1 text-sm rounded-md capitalize ${activityFilter === filter ? 'bg-card-bg dark:bg-dark-card-bg shadow-sm text-text-primary dark:text-dark-text-primary' : 'text-text-secondary dark:text-dark-text-secondary'}`}>{filter.toLowerCase()}</button>
                                ))}
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <th className="text-left font-semibold p-2">Description</th>
                                        <th className="text-left font-semibold p-2">Type</th>
                                        <th className="text-left font-semibold p-2">Status</th>
                                        <th className="text-right font-semibold p-2">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredActivity.length > 0 ? filteredActivity.slice(0, 5).map((item, index) => (
                                        <tr key={index} className="border-b border-slate-200 dark:border-slate-800">
                                            <td className="p-2 truncate">{item.description}</td>
                                            
                                            <td className="p-2"><span className="px-2 py-1 text-xs rounded-full bg-slate-200 dark:bg-slate-700 capitalize">{item.type.toLowerCase()}</span></td>
                                            <td className="p-2"><span className="capitalize text-text-secondary dark:text-dark-text-secondary">{item.status}</span></td>
                                            <td className="p-2 text-right font-semibold">{item.amount ? `$${Number(item.amount).toLocaleString()}` : '—'}</td>
                                        </tr>
                                    )) : <tr><td colSpan="4" className="text-center text-text-secondary dark:text-dark-text-secondary py-8">No recent activity.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <h2 className="text-xl font-bold mb-4">This Week</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-100 dark:bg-dark-primary-bg rounded-lg"><p className="text-sm text-text-secondary dark:text-dark-text-secondary">Revenue</p><p className="text-2xl font-bold text-green-500">${Number(dashboardData.weeklyRevenue).toLocaleString()}</p></div>
                            <div className="p-4 bg-slate-100 dark:bg-dark-primary-bg rounded-lg"><p className="text-sm text-text-secondary dark:text-dark-text-secondary">Expenses</p><p className="text-2xl font-bold text-red-500">${Number(dashboardData.weeklyExpenses).toLocaleString()}</p></div>
                            <div className="p-4 bg-slate-100 dark:bg-dark-primary-bg rounded-lg"><p className="text-sm text-text-secondary dark:text-dark-text-secondary">Cash Flow</p><p className={`text-2xl font-bold ${dashboardData.weeklyCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>{dashboardData.weeklyCashFlow >= 0 ? '+' : ''}${Number(dashboardData.weeklyCashFlow).toLocaleString()}</p></div>
                        </div>
                    </Card>
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <button onClick={() => setIsCreateInvoiceModalOpen(true)} className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-primary-bg transition-colors"><FileText className="text-accent-start dark:text-dark-accent-mid" /><span className="text-sm font-semibold">Create Invoice</span></button>
                            <button onClick={() => setIsClientDealModalOpen(true)} className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-primary-bg transition-colors"><UserPlus className="text-accent-start dark:text-dark-accent-mid" /><span className="text-sm font-semibold">Add New Client</span></button>
                            <button onClick={() => setIsAskAIModalOpen(true)} className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-primary-bg transition-colors"><Bot className="text-accent-start dark:text-dark-accent-mid" /><span className="text-sm font-semibold">Ask AI</span></button>
                            <button onClick={() => setActiveView('Marketing')} className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-primary-bg transition-colors"><Megaphone className="text-accent-start dark:text-dark-accent-mid" /><span className="text-sm font-semibold">New Campaign</span></button>
                        </div>
                    </Card>
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Recommendations</h2>
                        <div className="space-y-4">
                            {dashboardData.recommendations.map(rec => (
                                <div key={rec.id} className="flex items-start gap-3">
                                    <div className="text-2xl">{rec.icon}</div>
                                    <p className="text-text-secondary dark:text-dark-text-secondary text-sm">{rec.text}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-center text-text-secondary/70 dark:text-dark-text-secondary/70 mt-4">
                            (AI-powered suggestions coming soon)
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;