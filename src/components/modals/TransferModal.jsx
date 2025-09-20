import React, { useState } from 'react';
import { XCircle, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import { useAuth } from '../../AuthContext';
import CustomModal from '../ui/CustomModal';
import BrandedLoader from '../BrandedLoader';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid text-text-primary dark:text-dark-text-primary";
const formSelectClasses = `${formInputClasses} form-select`;

export const TransferModal = ({ onClose, onTransferSuccess }) => {
    const { token } = useAuth();
    const [transferData, setTransferData] = useState({
        amount: '',
        fromScope: 'business',
        toScope: 'personal',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (transferData.fromScope === transferData.toScope) {
            setErrorMessage("'From' and 'To' accounts cannot be the same.");
            return;
        }
        if (!transferData.amount || parseFloat(transferData.amount) <= 0) {
            setErrorMessage("Please enter a valid amount.");
            return;
        }
        
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/transactions/transfer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(transferData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to log transfer.");
            }

            onTransferSuccess();
            onClose();

        } catch (error) {
            console.error("Error logging transfer:", error);
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleScopeChange = (field, value) => {
        const newTransferData = { ...transferData, [field]: value };
        if (field === 'fromScope' && value === newTransferData.toScope) {
            newTransferData.toScope = value === 'business' ? 'personal' : 'business';
        }
        if (field === 'toScope' && value === newTransferData.fromScope) {
            newTransferData.fromScope = value === 'business' ? 'personal' : 'business';
        }
        setTransferData(newTransferData);
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
                    onClose={() => setErrorMessage('')}
                />
            )}
            <Card className="max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Log a Transfer</h2>
                    <button onClick={onClose}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                </div>
                <form onSubmit={handleTransfer} className="space-y-4">
                    <input 
                        type="number" 
                        placeholder="Amount" 
                        value={transferData.amount} 
                        onChange={e => setTransferData({...transferData, amount: e.target.value})} 
                        className={formInputClasses} 
                        required 
                    />
                    <div className="flex items-center gap-2">
                        <select value={transferData.fromScope} onChange={e => handleScopeChange('fromScope', e.target.value)} className={formSelectClasses}>
                            <option value="business">Business</option>
                            <option value="personal">Personal</option>
                        </select>
                        <ArrowRight className="text-text-secondary dark:text-dark-text-secondary flex-shrink-0" />
                        <select value={transferData.toScope} onChange={e => handleScopeChange('toScope', e.target.value)} className={formSelectClasses}>
                            <option value="personal">Personal</option>
                            <option value="business">Business</option>
                        </select>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Description (e.g., Owner's Draw)" 
                        value={transferData.description} 
                        onChange={e => setTransferData({...transferData, description: e.target.value})} 
                        className={formInputClasses} 
                    />
                    <input 
                        type="date" 
                        value={transferData.date} 
                        onChange={e => setTransferData({...transferData, date: e.target.value})} 
                        className={formInputClasses} 
                        required 
                    />
                    {errorMessage && <p className="text-sm text-red-500 text-center">{errorMessage}</p>}
                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                        {isLoading ? <BrandedLoader text="Logging..." /> : 'Log Transfer'}
                    </button>
                </form>
            </Card>
        </div>
    );
};