import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, ExternalLink, PlusCircle, Wand2, XCircle, Trash2, FileText, Download, Send, Save, Edit, Check, AlertTriangle, CreditCard, Repeat } from 'lucide-react';
import Card from '../components/ui/Card';
import { CreateInvoiceModal } from '../components/modals/CreateInvoiceModal';
import { TransferModal } from '../components/modals/TransferModal';
import { EditTransactionModal } from '../components/modals/EditTransactionModal';
import { useAuth } from '../AuthContext';
import BrandedLoader from '../components/BrandedLoader';
import CustomModal from '../components/ui/CustomModal';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";
const formSelectClasses = `${formInputClasses} form-select`;

// Reusable component for displaying the main finance view (metrics, chart, transactions)
const FinanceView = ({ summaryData, filterPeriod, setFilterPeriod, onAnalyze, onExport, onDeleteTransaction, onEditTransaction }) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card><p className="text-text-secondary dark:text-dark-text-secondary text-sm">Net Profit</p><p className="text-3xl font-bold">${Number(summaryData.metrics.netProfit).toLocaleString()}</p></Card>
                <Card><p className="text-text-secondary dark:text-dark-text-secondary text-sm">Monthly Net Cash Flow</p><p className="text-3xl font-bold">${Number(summaryData.metrics.burnRate).toLocaleString()}/mo</p></Card>
                <Card><p className="text-text-secondary dark:text-dark-text-secondary text-sm">Cash Runway</p><p className="text-3xl font-bold">{summaryData.metrics.runway} months</p></Card>
            </div>
            <Card>
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <h2 className="text-xl font-semibold">Income vs. Expenses</h2>
                    <div className="flex gap-1 bg-slate-100 dark:bg-dark-primary-bg p-1 rounded-lg">
                        {['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].map(period => (
                            <button key={period} onClick={() => setFilterPeriod(period)} className={`px-3 py-1 text-sm rounded-md capitalize ${filterPeriod === period ? 'bg-card-bg dark:bg-dark-card-bg shadow-sm' : 'text-text-secondary dark:text-dark-text-secondary'}`}>{period}</button>
                        ))}
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={summaryData.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                        <XAxis dataKey="name" stroke="currentColor" className="text-xs text-text-secondary dark:text-dark-text-secondary" />
                        <YAxis stroke="currentColor" className="text-xs text-text-secondary dark:text-dark-text-secondary" />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg, #FFFFFF)', border: '1px solid #e2e8f0' }} itemStyle={{ color: 'var(--text-primary, #1E2022)' }}/>
                        <Legend wrapperStyle={{fontSize: "0.875rem"}}/>
                        <Line type="monotone" dataKey="income" name="Income" stroke="#22c55e" strokeWidth={2} />
                        <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Recent Transactions</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={onAnalyze} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 flex items-center gap-2">
                            <Wand2 size={16} /> Analyze
                        </button>
                        <button onClick={onExport} className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-2">
                            <ExternalLink size={16} /> Export
                        </button>
                    </div>
                </div>
                <div className="flow-root">
                    <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-800">
                        {summaryData.recentTransactions.map(t => (
                            <li key={t.id} className="py-3 sm:py-4 group">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <div className="flex items-center col-span-2 gap-3">
                                        {t.type === 'income' ? <ArrowUpRight className="text-green-500" size={20}/> : <ArrowDownRight className="text-red-500" size={20}/>}
                                        <p className="text-sm font-medium truncate">{t.title}</p>
                                    </div>
                                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary truncate">{t.category}</p>
                                    <div className="inline-flex items-center justify-end text-base font-semibold">
                                        <span className={t.type === 'income' ? 'text-green-500' : 'text-red-500'}>{t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString()}</span>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onEditTransaction(t)} className="text-text-secondary dark:text-dark-text-secondary hover:text-blue-500"><Edit size={16} /></button>
                                            <button onClick={() => onDeleteTransaction(t)} className="text-text-secondary dark:text-dark-text-secondary hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>
        </div>
    );
};

const FinanceDashboard = () => {
    const { token, user } = useAuth();
    const [view, setView] = useState('business');
    const [businessSummary, setBusinessSummary] = useState({ metrics: { netProfit: 0, burnRate: 0, runway: 0 }, recentTransactions: [], chartData: [] });
    const [personalSummary, setPersonalSummary] = useState({ metrics: { netProfit: 0, burnRate: 0, runway: 0 }, recentTransactions: [], chartData: [] });
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterPeriod, setFilterPeriod] = useState('daily');
    const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('');
    const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
    const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
    const [isAiModalVisible, setIsAiModalVisible] = useState(false);
    const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
    const [viewingInvoice, setViewingInvoice] = useState(null);
    const [isEditingInvoiceNumber, setIsEditingInvoiceNumber] = useState(false);
    const [editableInvoiceNumber, setEditableInvoiceNumber] = useState('');
    const [newTransaction, setNewTransaction] = useState({ title: '', amount: '', type: 'expense', category: '', transaction_date: new Date().toISOString().split('T')[0], scope: 'business' });
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [actionStatus, setActionStatus] = useState('');
    const [overdueAlerts, setOverdueAlerts] = useState([]);
    const [isPaying, setIsPaying] = useState(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);

    const expenseCategories = ['Software', 'Marketing & Ads', 'Office Supplies', 'Rent', 'Utilities', 'Travel', 'Meals & Entertainment', 'Contractors', 'Salaries'];
    const incomeCategories = ['Client Payment', 'Product Sales', 'Consulting Fees', 'Other Income'];

    const fetchData = useCallback(async () => {
        if (!token) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const [businessSummaryRes, personalSummaryRes, invoicesRes, clientsRes, alertsRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/finance/summary?period=${filterPeriod}&scope=business`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/finance/summary?period=${filterPeriod}&scope=personal`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices?search=${invoiceSearchTerm}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/clients`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/alerts/overdue-invoices`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            
            setBusinessSummary(await businessSummaryRes.json());
            setPersonalSummary(await personalSummaryRes.json());
            setInvoices(await invoicesRes.json());
            setClients(await clientsRes.json());
            setOverdueAlerts(await alertsRes.json());
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [token, filterPeriod, invoiceSearchTerm]);

    useEffect(() => {
        fetchData();
    }, [filterPeriod, fetchData]);

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        const currentScope = view === 'invoices' ? 'business' : view;
        const transactionPayload = { ...newTransaction, scope: currentScope };
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/transactions`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(transactionPayload) });
            setIsTransactionModalVisible(false);
            setNewTransaction({ title: '', amount: '', type: 'expense', category: '', transaction_date: new Date().toISOString().split('T')[0], scope: 'business' });
            fetchData();
        } catch (error) { console.error("Failed to add transaction:", error); }
    };

    const confirmDeleteTransaction = (transaction) => {
        setTransactionToDelete(transaction);
        setIsConfirmDeleteModalOpen(true);
    };

    const handleDeleteTransaction = async () => {
        if (!transactionToDelete) return;
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/transactions/${transactionToDelete.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            setIsConfirmDeleteModalOpen(false);
            setTransactionToDelete(null);
            fetchData();
        } catch (error) { console.error("Failed to delete transaction:", error); }
    };

    const handlePayInvoice = async (invoiceId) => {
        setIsPaying(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${invoiceId}/create-checkout-session`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error('Failed to create payment session.');
            }
            const session = await response.json();
            window.location.href = session.url;
        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert("Could not initiate payment. Please try again later.");
        } finally {
            setIsPaying(false);
        }
    };
    
    const viewInvoiceDetails = async (invoiceId) => {
        const invoice = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${invoiceId}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json());
        setViewingInvoice(invoice);
        setEditableInvoiceNumber(invoice.invoice_number);
    };

    const handleUpdateInvoiceNumber = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${viewingInvoice.id}`, { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
                body: JSON.stringify({ invoice_number: editableInvoiceNumber }) 
            });
            setIsEditingInvoiceNumber(false);
            await viewInvoiceDetails(viewingInvoice.id);
            await fetchData();
        } catch (error) {
            console.error("Failed to update invoice number:", error);
        }
    };

    const handleSendReminder = async (invoiceId) => {
        setActionStatus('Sending reminder...');
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${invoiceId}/send`, { 
                method: 'POST', 
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setActionStatus(`Reminder sent!`);
            await fetchData();
            setTimeout(() => {
                setActionStatus('');
                setViewingInvoice(null);
            }, 2000);
        } catch (error) {
            console.error("Failed to send reminder:", error);
            setActionStatus('Failed to send reminder.');
        }
    };

    const markAsPaid = async (invoiceId) => {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${invoiceId}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ status: 'paid' }) });
        setViewingInvoice(null);
        fetchData();
    };

    const handleExportCSV = () => {
        const scope = view === 'invoices' ? 'business' : view;
        const dataToExport = scope === 'business' ? businessSummary.recentTransactions : personalSummary.recentTransactions;
        const headers = ["Date", "Title", "Category", "Type", "Amount"];
        const rows = dataToExport.map(t => [ new Date(t.transaction_date).toLocaleDateString(), t.title, t.category, t.type, t.type === 'income' ? t.amount : -t.amount ]);
        let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `${scope}_transactions.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAiAnalysis = async () => {
        const scope = view === 'invoices' ? 'business' : view;
        const summaryToAnalyze = scope === 'invoices' ? businessSummary : (scope === 'business' ? businessSummary : personalSummary);
        setIsAiLoading(true);
        setAiAnalysis('');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/analyze-finances`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ summary: summaryToAnalyze }) });
            if (!response.ok) throw new Error('Failed to get AI analysis');
            const data = await response.json();
            setAiAnalysis(data.analysis);
        } catch (error) {
            console.error(error);
            setAiAnalysis('Sorry, I was unable to analyze the data at this time.');
        } finally {
            setIsAiLoading(false);
        }
    };
    
    if (isLoading) { return <div className="flex items-center justify-center h-full"><BrandedLoader /></div>; }

    return (
        <div className="space-y-8 animate-fade-in">
            {isConfirmDeleteModalOpen && (
                <CustomModal
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete the transaction "${transactionToDelete?.title}"? This action cannot be undone.`}
                    type="confirm"
                    confirmText="Delete"
                    onConfirm={handleDeleteTransaction}
                    onClose={() => setIsConfirmDeleteModalOpen(false)}
                />
            )}
            {isEditTransactionModalOpen && (
                <EditTransactionModal
                    transaction={transactionToEdit}
                    onClose={() => setIsEditTransactionModalOpen(false)}
                    onUpdate={fetchData}
                />
            )}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Finance Hub</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Manage cash flow, invoices, and profitability.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsTransferModalVisible(true)} className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary px-4 py-2 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-2">
                        <Repeat size={16} /> Log Transfer
                    </button>
                    <button onClick={() => setIsTransactionModalVisible(true)} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 flex items-center gap-2">
                        <PlusCircle size={16} /> Add Transaction
                    </button>
                </div>
            </header>

            <div className="border-b border-slate-200 dark:border-slate-800">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setView('business')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${view === 'business' ? 'border-accent-start dark:border-dark-accent-mid text-accent-start dark:text-dark-accent-mid' : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:border-gray-300'}`}>Business</button>
                    <button onClick={() => setView('personal')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${view === 'personal' ? 'border-accent-start dark:border-dark-accent-mid text-accent-start dark:text-dark-accent-mid' : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:border-gray-300'}`}>Personal</button>
                    <button onClick={() => setView('invoices')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${view === 'invoices' ? 'border-accent-start dark:border-dark-accent-mid text-accent-start dark:text-dark-accent-mid' : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:border-gray-300'}`}>Invoices</button>
                </nav>
            </div>

            {overdueAlerts.length > 0 && (
                <Card className="bg-yellow-500/10 border-yellow-500/20">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-yellow-700 dark:text-yellow-400 mb-4">
                        <AlertTriangle />
                        For Your Attention
                    </h2>
                    <div className="space-y-3">
                        {overdueAlerts.map(invoice => (
                            <div key={invoice.id} className="flex items-center justify-between p-3 bg-card-bg/50 dark:bg-dark-card-bg/50 rounded-lg">
                                <div>
                                    <p className="font-semibold">Invoice {invoice.invoice_number} is 3 days overdue.</p>
                                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Client: {invoice.client_name}</p>
                                </div>
                                <button onClick={() => handleSendReminder(invoice.id)} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2">
                                    <Send size={14} /> Send Reminder
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {view === 'business' && <FinanceView summaryData={businessSummary} filterPeriod={filterPeriod} setFilterPeriod={setFilterPeriod} onAddTransaction={() => setIsTransactionModalVisible(true)} onDeleteTransaction={confirmDeleteTransaction} onEditTransaction={(t) => { setTransactionToEdit(t); setIsEditTransactionModalOpen(true); }} onAnalyze={() => { handleAiAnalysis(); setIsAiModalVisible(true); }} onExport={handleExportCSV} />}
            {view === 'personal' && <FinanceView summaryData={personalSummary} filterPeriod={filterPeriod} setFilterPeriod={setFilterPeriod} onAddTransaction={() => setIsTransactionModalVisible(true)} onDeleteTransaction={confirmDeleteTransaction} onEditTransaction={(t) => { setTransactionToEdit(t); setIsEditTransactionModalOpen(true); }} onAnalyze={() => { handleAiAnalysis(); setIsAiModalVisible(true); }} onExport={handleExportCSV} />}
            
            {view === 'invoices' && (
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">All Invoices</h2>
                        <div className="flex items-center gap-2">
                            <input type="text" placeholder="Search invoices..." value={invoiceSearchTerm} onChange={(e) => setInvoiceSearchTerm(e.target.value)} className={`${formInputClasses} text-sm`} />
                            <button onClick={() => setIsInvoiceModalVisible(true)} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 flex items-center gap-2">
                                <PlusCircle size={16} /> New Invoice
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {invoices.map(inv => (
                            <div key={inv.id} onClick={() => viewInvoiceDetails(inv.id)} className="p-3 bg-slate-100/50 dark:bg-dark-primary-bg/50 rounded-lg flex justify-between items-center cursor-pointer hover:bg-slate-200/50 dark:hover:bg-dark-primary-bg">
                                <div>
                                    <p className="font-semibold">{inv.invoice_number}</p>
                                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{inv.client_name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">${Number(inv.total_amount).toLocaleString()}</p>
                                    <p className={`text-sm capitalize ${inv.status === 'paid' ? 'text-green-400' : inv.status === 'sent' ? 'text-yellow-400' : 'text-slate-400'}`}>{inv.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {isTransactionModalVisible && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">New Transaction</h2>
                            <button onClick={() => setIsTransactionModalVisible(false)}><XCircle className="text-text-secondary dark:text-dark-text-secondary"/></button>
                        </div>
                        <form onSubmit={handleAddTransaction} className="space-y-4">
                            <input type="text" placeholder="Title (e.g., Client Payment)" value={newTransaction.title} onChange={e => setNewTransaction({...newTransaction, title: e.target.value})} className={formInputClasses} required />
                            <input type="number" placeholder="Amount" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})} className={formInputClasses} required />
                            <select value={newTransaction.type} onChange={e => setNewTransaction({...newTransaction, type: e.target.value, category: ''})} className={formSelectClasses}>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                            <input 
                                list="categories" 
                                name="category"
                                placeholder="Category (e.g., Software)" 
                                value={newTransaction.category} 
                                onChange={e => setNewTransaction({...newTransaction, category: e.target.value})} 
                                className={formInputClasses} 
                            />
                            <datalist id="categories">
                                {(newTransaction.type === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                                    <option key={cat} value={cat} />
                                ))}
                            </datalist>
                            <input type="date" value={newTransaction.transaction_date} onChange={e => setNewTransaction({...newTransaction, transaction_date: e.target.value})} className={formInputClasses} required />
                            <button type="submit" className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold hover:opacity-90">Save Transaction</button>
                        </form>
                    </Card>
                </div>
            )}
            
            {isTransferModalVisible && <TransferModal onClose={() => setIsTransferModalVisible(false)} onTransferSuccess={() => fetchData()} />}
            
            {isInvoiceModalVisible && <CreateInvoiceModal user={user} clients={clients} onClose={() => setIsInvoiceModalVisible(false)} onInvoiceCreated={fetchData} />}

            {isAiModalVisible && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2"><Wand2 size={24} className="text-accent-start dark:text-dark-accent-mid"/> Financial Analysis</h2>
                            <button onClick={() => setIsAiModalVisible(false)}><XCircle className="text-text-secondary dark:text-dark-text-secondary"/></button>
                        </div>
                        {isAiLoading ? <div className="flex justify-center p-8"><BrandedLoader /></div> : <div className="bg-slate-100 dark:bg-dark-primary-bg p-4 rounded-lg whitespace-pre-wrap">{aiAnalysis}</div>}
                    </Card>
                </div>
            )}

            {viewingInvoice && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-3xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold">Invoice </h2>
                                {isEditingInvoiceNumber ? (
                                    <>
                                        <input type="text" value={editableInvoiceNumber} onChange={(e) => setEditableInvoiceNumber(e.target.value)} className="form-input py-1"/>
                                        <button onClick={handleUpdateInvoiceNumber} className="text-green-500 hover:text-green-400"><Check size={18}/></button>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-semibold">{viewingInvoice.invoice_number}</h2>
                                        <button onClick={() => setIsEditingInvoiceNumber(true)} className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary"><Edit size={16}/></button>
                                    </>
                                )}
                            </div>
                            <button onClick={() => setViewingInvoice(null)}><XCircle className="text-text-secondary dark:text-dark-text-secondary"/></button>
                        </div>
                        <div className="bg-slate-100 dark:bg-dark-primary-bg p-6 rounded-lg">
                            <p><strong>Client:</strong> {viewingInvoice.client_name}</p>
                            <p><strong>Total:</strong> ${Number(viewingInvoice.total_amount).toLocaleString()}</p>
                            <div className="my-4 border-t border-slate-200 dark:border-slate-700"/>
                            {viewingInvoice.lineItems.map(item => <p key={item.id}>{item.description} - ${Number(item.total).toLocaleString()}</p>)}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {viewingInvoice.status !== 'paid' && (
                                <button onClick={() => handlePayInvoice(viewingInvoice.id)} disabled={isPaying} className="flex-1 bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">
                                    {isPaying ? <BrandedLoader text="Redirecting..." /> : <><CreditCard size={16} /> Pay with Stripe</>}
                                </button>
                            )}
                            <a href={`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${viewingInvoice.id}/download?token=${token}`} download className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary py-2 px-4 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 inline-flex items-center justify-center gap-2">
                                <Download size={16}/> Download PDF
                            </a>
                            {viewingInvoice.status === 'sent' && (
                                <button onClick={() => handleSendReminder(viewingInvoice.id)} className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary py-2 px-4 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600">Send Reminder</button>
                            )}
                            {viewingInvoice.status !== 'paid' && (
                                <button onClick={() => markAsPaid(viewingInvoice.id)} className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700">Mark as Paid</button>
                            )}
                        </div>
                        {actionStatus && <p className="text-center mt-2">{actionStatus}</p>}
                    </Card>
                </div>
            )}
        </div>
    );
};

export default FinanceDashboard;