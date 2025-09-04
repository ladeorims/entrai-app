// /* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, ExternalLink, PlusCircle, Wand2, XCircle, Loader2, Trash2, FileText, Download, Send, Save, Edit, Check, AlertTriangle, CreditCard } from 'lucide-react';
import Card from '../components/ui/Card';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";
const formSelectClasses = `${formInputClasses} form-select`;
const formTextareaClasses = `${formInputClasses} h-24`;

const SearchableClientDropdown = ({ clients, selectedClientId, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className={`${formSelectClasses} text-left`}>
                {selectedClientId ? clients.find(c => c.id === selectedClientId)?.name : 'Select a Client'}
            </button>
            {isOpen && (
                <div className="absolute top-full mt-1 w-full bg-card-bg dark:bg-dark-card-bg border border-slate-200 dark:border-slate-700 rounded-lg z-50 shadow-lg">
                    <input type="text" placeholder="Search clients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input w-full rounded-b-none border-b border-slate-200 dark:border-slate-700" />
                    <ul className="max-h-60 overflow-y-auto">
                        {filteredClients.map(client => (
                            <li key={client.id} onClick={() => { onSelect(client.id); setIsOpen(false); setSearchTerm(''); }} className="p-3 hover:bg-slate-100 dark:hover:bg-dark-primary-bg cursor-pointer">
                                {client.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


const FinanceDashboard = ({ token, user }) => {
    const [view, setView] = useState('overview');
    const [summaryData, setSummaryData] = useState({ metrics: { netProfit: 0, burnRate: 0, runway: 0 }, recentTransactions: [], chartData: [] });
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterPeriod, setFilterPeriod] = useState('daily');
    const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('');
    const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
    const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
    const [isAiModalVisible, setIsAiModalVisible] = useState(false);
    const [viewingInvoice, setViewingInvoice] = useState(null);
    const [isEditingInvoiceNumber, setIsEditingInvoiceNumber] = useState(false);
    const [editableInvoiceNumber, setEditableInvoiceNumber] = useState('');
    const [newTransaction, setNewTransaction] = useState({ title: '', amount: '', type: 'expense', category: '', transaction_date: new Date().toISOString().split('T')[0] });
    const [newInvoice, setNewInvoice] = useState({ client_id: '', issue_date: new Date().toISOString().split('T')[0], due_date: '', notes: '', tax_rate: '', lineItems: [{ description: '', quantity: 1, unit_price: 0, total: 0 }] });
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [actionStatus, setActionStatus] = useState('');
    const [overdueAlerts, setOverdueAlerts] = useState([]);
    const [isPaying, setIsPaying] = useState(false);

    const fetchData = useCallback(async () => {
        if (!token) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const [summaryRes, invoicesRes, clientsRes, alertsRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/finance/summary?period=${filterPeriod}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices?search=${invoiceSearchTerm}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/clients`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/alerts/overdue-invoices`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            setSummaryData(await summaryRes.json());
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
    }, [fetchData]);

        const handleSendReminder = async (invoiceId) => {
        setActionStatus(`Sending reminder for invoice #${invoiceId}...`);
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${invoiceId}/send`, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ isReminder: true }) // We can add a flag for the server if needed
            });
            setActionStatus(`Reminder sent for invoice #${invoiceId}!`);
            // Remove the alert from the UI after it's been handled
            setOverdueAlerts(overdueAlerts.filter(inv => inv.id !== invoiceId));
            setTimeout(() => setActionStatus(''), 2000);
        } catch (error) {
            console.error("Failed to send reminder:", error);
            setActionStatus('Failed to send reminder.');
        }
    };

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/transactions`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ ...newTransaction, amount: parseFloat(newTransaction.amount) }) });
            setIsTransactionModalVisible(false);
            setNewTransaction({ title: '', amount: '', type: 'expense', category: '', transaction_date: new Date().toISOString().split('T')[0] });
            fetchData();
        } catch (error) { console.error("Failed to add transaction:", error); }
    };

    const handleDeleteTransaction = async (transactionId) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/transactions/${transactionId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                fetchData();
            } catch (error) { console.error("Failed to delete transaction:", error); }
        }
    };

const handleInvoiceAction = async (action) => {
    setActionStatus('Processing...');
    try {
        // Step 1: Always create the invoice first to get an ID
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(newInvoice)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        
        const invoiceId = result.invoiceId;
        
        // Step 2: Perform the specific action
        if (action === 'download') {
            // CORRECTED LOGIC: Open the secure download URL from the server
            const downloadUrl = `${import.meta.env.VITE_API_BASE_URL}/api/invoices/${invoiceId}/download?token=${token}`;
            window.open(downloadUrl, '_blank');
            setActionStatus('Success! Downloading...');

        } else if (action === 'send') {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${invoiceId}/send`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setActionStatus('Success! Invoice sent.');

        } else { // This handles the 'draft' action
            setActionStatus('Success! Draft saved.');
        }

        // Step 3: Close the modal and refresh the data
        setTimeout(() => {
            setIsInvoiceModalVisible(false);
            setNewInvoice({ client_id: '', issue_date: new Date().toISOString().split('T')[0], due_date: '', notes: '', tax_rate: '', lineItems: [{ description: '', quantity: 1, unit_price: 0, total: 0 }] });
            setActionStatus('');
            fetchData();
        }, 2000);

    } catch (error) { 
        console.error("Failed to process invoice:", error); 
        setActionStatus(`Error: ${error.message}`);
    }
};

     // NEW: Function to handle the Stripe payment process
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
            // Redirect the user to the Stripe Checkout page
            window.location.href = session.url;
        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert("Could not initiate payment. Please try again later.");
            setIsPaying(false);
        }
    };


    const handleLineItemChange = (index, field, value) => {
        const items = [...newInvoice.lineItems];
        const currentItem = items[index];
        currentItem[field] = value;

        if (user.businessType === 'goods') {
            if (field === 'quantity' || field === 'unit_price') {
                const quantity = parseFloat(currentItem.quantity) || 0;
                const unit_price = parseFloat(currentItem.unit_price) || 0;
                currentItem.total = quantity * unit_price;
            }
        } else { // For services, amount directly sets the total
            if (field === 'total') {
                currentItem.quantity = 1;
                currentItem.unit_price = parseFloat(value) || 0;
            }
        }
        setNewInvoice({ ...newInvoice, lineItems: items });
    };

    const addLineItem = () => {
        setNewInvoice({ ...newInvoice, lineItems: [...newInvoice.lineItems, { description: '', quantity: 1, unit_price: 0, total: 0 }] });
    };

    const viewInvoiceDetails = async (invoiceId) => {
        const invoice = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${invoiceId}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json());
        setViewingInvoice(invoice);
        setEditableInvoiceNumber(invoice.invoice_number);
    };

    const handleUpdateInvoiceNumber = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${viewingInvoice.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ invoice_number: editableInvoiceNumber }) });
            setIsEditingInvoiceNumber(false);
            fetchData();
            viewInvoiceDetails(viewingInvoice.id);
        } catch (error) {
            console.error("Failed to update invoice number:", error);
        }
    };

    // const generatePDF = (invoiceData) => {
    //     const doc = new jsPDF();
    //     if (user?.profilePictureUrl) { try { doc.addImage(user.profilePictureUrl, 'PNG', 14, 15, 20, 20); } catch (e) { console.error("Could not add image to PDF:", e); } }
    //     doc.setFontSize(20);
    //     doc.text(user?.company || user?.name || 'My Company', 40, 22);
    //     doc.setFontSize(10);
    //     doc.text(user?.address || '', 40, 28);
    //     doc.text(user?.city_province_postal || '', 40, 32);
    //     doc.setFontSize(26);
    //     doc.text("INVOICE", 190, 22, { align: 'right' });
    //     doc.setFontSize(12);
    //     doc.text(`Invoice #: ${invoiceData.invoice_number}`, 190, 40, { align: 'right' });
    //     doc.text(`Issue Date: ${new Date(invoiceData.issue_date).toLocaleDateString()}`, 190, 46, { align: 'right' });
    //     doc.text(`Due Date: ${new Date(invoiceData.due_date).toLocaleDateString()}`, 190, 52, { align: 'right' });
    //     doc.text("Bill To:", 14, 70);
    //     doc.text(invoiceData.client_name, 14, 76);
    //     const tableColumn = ["Description", "Quantity", "Unit Price", "Total"];
    //     const tableRows = [];
    //     invoiceData.lineItems.forEach(item => {
    //         const itemData = [ item.description, item.quantity, `$${Number(item.unit_price).toFixed(2)}`, `$${Number(item.total).toFixed(2)}` ];
    //         tableRows.push(itemData);
    //     });
    //     autoTable(doc, { head: [tableColumn], body: tableRows, startY: 85 });
    //     const finalY = doc.lastAutoTable.finalY;
    //     doc.setFontSize(14);
    //     doc.text(`Total: $${Number(invoiceData.total_amount).toLocaleString()}`, 190, finalY + 15, { align: 'right' });
    //     doc.save(`${invoiceData.invoice_number}.pdf`);
    // };

    const markAsPaid = async (invoiceId) => {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${invoiceId}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ status: 'paid' }) });
        setViewingInvoice(null);
        fetchData();
    };

    const handleExportCSV = () => {
        const headers = ["Date", "Title", "Category", "Type", "Amount"];
        const rows = summaryData.recentTransactions.map(t => [ new Date(t.transaction_date).toLocaleDateString(), t.title, t.category, t.type, t.type === 'income' ? t.amount : -t.amount ]);
        let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAiAnalysis = async () => {
        setIsAiLoading(true);
        setAiAnalysis('');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/analyze-finances`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ summary: summaryData }) });
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
    
    const handleSendExistingInvoice = async (invoiceId) => {
        setActionStatus('Sending...');
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${invoiceId}/send`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
            setActionStatus('Invoice sent!');
            setTimeout(() => {
                setViewingInvoice(null);
                setActionStatus('');
                fetchData();
            }, 1500);
        } catch (error) {
            console.error("Failed to send invoice:", error);
            setActionStatus('Send failed.');
        }
    };

 if (isLoading) { return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-accent-start" size={32} /></div>; }

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Finance Hub</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Track cash flow, create invoices, and manage profitability.</p>
                </div>
                {view === 'overview' && (
                    <button onClick={() => setIsTransactionModalVisible(true)} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 flex items-center gap-2">
                        <PlusCircle size={16} /> Add Transaction
                    </button>
                )}
            </header>

            <div className="border-b border-slate-200 dark:border-slate-800">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setView('overview')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${view === 'overview' ? 'border-accent-start dark:border-dark-accent-mid text-accent-start dark:text-dark-accent-mid' : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:border-gray-300'}`}>Overview</button>
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
                                <button onClick={() => handleSendExistingInvoice(invoice.id)} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2">
                                    <Send size={14} /> Send Reminder
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {view === 'overview' && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card><p className="text-text-secondary dark:text-dark-text-secondary text-sm">Net Profit</p><p className="text-3xl font-bold">${Number(summaryData.metrics.netProfit).toLocaleString()}</p></Card>
                        <Card><p className="text-text-secondary dark:text-dark-text-secondary text-sm">Monthly Net Cash Flow</p><p className="text-3xl font-bold">${Number(summaryData.metrics.burnRate).toLocaleString()}/mo</p></Card>
                        <Card><p className="text-text-secondary dark:text-dark-text-secondary text-sm">Cash Runway</p><p className="text-3xl font-bold">{summaryData.metrics.runway} months</p></Card>
                    </div>
                    <Card>
                        <div className="flex justify-between items-center mb-4">
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
                            <div>
                                <button onClick={() => { setIsAiModalVisible(true); handleAiAnalysis(); }} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 flex items-center gap-2 mr-2">
                                    <Wand2 size={16} /> Analyze
                                </button>
                                <button onClick={handleExportCSV} className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-2">
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
                                                <button onClick={() => handleDeleteTransaction(t.id)} className="ml-4 text-text-secondary dark:text-dark-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>
                </>
            )}

            {view === 'invoices' && (
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">All Invoices</h2>
                        <div className="flex items-center gap-2">
                            <input type="text" placeholder="Search invoices..." value={invoiceSearchTerm} onChange={(e) => setInvoiceSearchTerm(e.target.value)} className="form-input text-sm" />
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
                            <select value={newTransaction.type} onChange={e => setNewTransaction({...newTransaction, type: e.target.value})} className={formSelectClasses}>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                            <input type="text" placeholder="Category (e.g., Software)" value={newTransaction.category} onChange={e => setNewTransaction({...newTransaction, category: e.target.value})} className={formInputClasses} />
                            <input type="date" value={newTransaction.transaction_date} onChange={e => setNewTransaction({...newTransaction, transaction_date: e.target.value})} className={formInputClasses} required />
                            <button type="submit" className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold hover:opacity-90">Save Transaction</button>
                        </form>
                    </Card>
                </div>
            )}

            {isInvoiceModalVisible && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-3xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Create Invoice</h2>
                            <button onClick={() => setIsInvoiceModalVisible(false)}><XCircle className="text-text-secondary dark:text-dark-text-secondary"/></button>
                        </div>
                       <form className="space-y-4">
                            <SearchableClientDropdown clients={clients} selectedClientId={newInvoice.client_id} onSelect={(id) => setNewInvoice({...newInvoice, client_id: id})} />
                            <div className="flex gap-4">
                                <input type="date" value={newInvoice.issue_date} onChange={e => setNewInvoice({...newInvoice, issue_date: e.target.value})} className={formInputClasses} required />
                                <input type="date" value={newInvoice.due_date} onChange={e => setNewInvoice({...newInvoice, due_date: e.target.value})} className={formInputClasses} required />
                            </div>
                            <div className="flex gap-2 items-center">
                                <label htmlFor="tax_rate" className="text-sm text-text-secondary dark:text-dark-text-secondary">Tax Rate (%):</label>
                                <input type="number" id="tax_rate" placeholder="e.g., 5" value={newInvoice.tax_rate} onChange={e => setNewInvoice({...newInvoice, tax_rate: e.target.value})} className={`${formInputClasses} w-24 p-2`} />
                            </div>

                            {/* NEW: Dynamic Invoice Line Items */}
                            <div className="border-t border-b border-slate-200 dark:border-slate-700 py-4 space-y-3">
                                {newInvoice.lineItems.map((item, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                        {user?.businessType === 'goods' ? (
                                            <>
                                                <input type="text" placeholder="Item/Description" value={item.description} onChange={e => handleLineItemChange(index, 'description', e.target.value)} className={`${formInputClasses} col-span-6 p-2`} />
                                                <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleLineItemChange(index, 'quantity', e.target.value)} className={`${formInputClasses} col-span-2 p-2 text-center`} />
                                                <input type="number" placeholder="Price" value={item.unit_price} onChange={e => handleLineItemChange(index, 'unit_price', e.target.value)} className={`${formInputClasses} col-span-2 p-2 text-right`} />
                                                <p className="col-span-2 text-right font-semibold pr-2">${item.total.toFixed(2)}</p>
                                            </>
                                        ) : (
                                            <>
                                                <input type="text" placeholder="Service Description" value={item.description} onChange={e => handleLineItemChange(index, 'description', e.target.value)} className={`${formInputClasses} col-span-8 p-2`} />
                                                <input type="number" placeholder="Amount" value={item.total} onChange={e => handleLineItemChange(index, 'total', e.target.value)} className={`${formInputClasses} col-span-4 p-2 text-right`} />
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addLineItem} className="text-sm font-semibold text-accent-start dark:text-dark-accent-mid hover:opacity-80">Add Line Item</button>
                            <textarea placeholder="Notes..." value={newInvoice.notes} onChange={e => setNewInvoice({...newInvoice, notes: e.target.value})} className={formTextareaClasses} rows="3" />
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => handleInvoiceAction('draft')} className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary py-2 px-4 rounded-lg font-semibold flex items-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-600"><Save size={16}/> Save as Draft</button>
                                <a href={`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${viewingInvoice?.id}/download?token=${token}`} download className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700"><Download size={16}/> Save & Download</a>
                                <button type="button" onClick={() => handleInvoiceAction('send')} className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700"><Send size={16}/> Save & Send</button>
                            </div>
                            {actionStatus && <p className="text-center mt-2">{actionStatus}</p>}
                        </form>
                    </Card>
                </div>
            )}

            {isAiModalVisible && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2"><Wand2 size={24} className="text-accent-start dark:text-dark-accent-mid"/> Financial Analysis</h2>
                            <button onClick={() => setIsAiModalVisible(false)}><XCircle className="text-text-secondary dark:text-dark-text-secondary"/></button>
                        </div>
                        {isAiLoading ? <div className="flex justify-center p-8"><Loader2 className="animate-spin text-accent-start"/></div> : <div className="bg-slate-100 dark:bg-dark-primary-bg p-4 rounded-lg whitespace-pre-wrap">{aiAnalysis}</div>}
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
                                <button 
                                    onClick={() => handlePayInvoice(viewingInvoice.id)} 
                                    disabled={isPaying}
                                    className="flex-1 bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                                >
                                    {isPaying ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
                                    {isPaying ? 'Redirecting...' : 'Pay with Stripe'}
                                </button>
                            )}
                            <a 
                                href={`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${viewingInvoice.id}/download?token=${token}`}
                                download
                                className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary py-2 px-4 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 inline-flex items-center justify-center gap-2"
                            >
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
