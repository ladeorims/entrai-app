import React, { useState } from 'react';
import { XCircle, Loader2, Download, Send, Save } from 'lucide-react';
import Card from '../ui/Card';
import { SearchableClientDropdown } from '../ui/SearchableClientDropdown';
import { useAuth } from '../../AuthContext';
import CustomModal from '../ui/CustomModal';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";
const formTextareaClasses = `${formInputClasses} h-24`;

export const CreateInvoiceModal = ({ clients, onClose, onInvoiceCreated }) => {
    const { token, user } = useAuth();
    
    const [newInvoice, setNewInvoice] = useState({ 
        client_id: '', 
        issue_date: new Date().toISOString().split('T')[0], 
        due_date: '', 
        notes: '', 
        tax_rate: '', 
        lineItems: [{ description: '', quantity: 1, unit_price: 0, total: 0 }] 
    });
    const [actionStatus, setActionStatus] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLineItemChange = (index, field, value) => {
        const items = [...newInvoice.lineItems];
        const currentItem = items[index];
        currentItem[field] = value;

        if (user.businessType === 'goods') {
            const quantity = parseFloat(currentItem.quantity) || 0;
            const unit_price = parseFloat(currentItem.unit_price) || 0;
            currentItem.total = quantity * unit_price;
        } else {
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

    const handleInvoiceAction = async (action) => {
        if (!newInvoice.client_id) {
            setErrorMessage('Error: Please select a client.');
            return;
        }
        setIsProcessing(true);
        setActionStatus(`Processing: ${action}...`);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newInvoice)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            
            const invoiceId = result.invoiceId;
            
            if (action === 'download') {
                const downloadUrl = `${import.meta.env.VITE_API_BASE_URL}/api/invoices/${invoiceId}/download?token=${token}`;
                window.open(downloadUrl, '_blank');
                setActionStatus('Success! Downloading...');
            } else if (action === 'send') {
                await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${invoiceId}/send`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setActionStatus('Success! Invoice sent.');
            } else {
                setActionStatus('Success! Draft saved.');
            }

            setTimeout(() => {
                onInvoiceCreated();
                onClose();
            }, 1500);

        } catch (error) { 
            console.error("Failed to process invoice:", error); 
            setErrorMessage(`Error: ${error.message}`);
            setIsProcessing(false);
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
            <Card className="max-w-3xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Create Invoice</h2>
                    <button onClick={onClose}><XCircle className="text-text-secondary dark:text-dark-text-secondary"/></button>
                </div>
                <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                    <SearchableClientDropdown clients={clients} selectedClientId={newInvoice.client_id} onSelect={(id) => setNewInvoice({...newInvoice, client_id: id})} />
                    <div className="flex gap-4">
                        <input type="date" value={newInvoice.issue_date} onChange={e => setNewInvoice({...newInvoice, issue_date: e.target.value})} className={formInputClasses} required />
                        <input type="date" value={newInvoice.due_date} onChange={e => setNewInvoice({...newInvoice, due_date: e.target.value})} className={formInputClasses} required />
                    </div>
                    <div className="flex gap-2 items-center">
                        <label htmlFor="tax_rate" className="text-sm text-text-secondary dark:text-dark-text-secondary">Tax Rate (%):</label>
                        <input type="number" id="tax_rate" placeholder="e.g., 5" value={newInvoice.tax_rate} onChange={e => setNewInvoice({...newInvoice, tax_rate: e.target.value})} className={`${formInputClasses} w-24 p-2`} />
                    </div>
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
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                    <button type="button" onClick={() => handleInvoiceAction('draft')} disabled={isProcessing} className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary py-2 px-4 rounded-lg font-semibold flex items-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"><Save size={16}/> Save as Draft</button>
                    <button type="button" onClick={() => handleInvoiceAction('download')} disabled={isProcessing} className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"><Download size={16}/> Save & Download</button>
                    <button type="button" onClick={() => handleInvoiceAction('send')} disabled={isProcessing} className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"><Send size={16}/> Save & Send</button>
                </div>
                {actionStatus && <p className="text-center text-sm mt-2">{actionStatus}</p>}
            </Card>
        </div>
    );
};