import React, { useState } from 'react';
import { XCircle, Save } from 'lucide-react';
import Card from '../ui/Card';
import { useAuth } from '../../AuthContext';
import BrandedLoader from '../BrandedLoader';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";

export const EditTransactionModal = ({ transaction, onClose, onUpdate }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState(transaction);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const expenseCategories = ['Software', 'Marketing & Ads', 'Office Supplies', 'Rent', 'Utilities', 'Travel', 'Meals & Entertainment', 'Contractors', 'Salaries'];
    const incomeCategories = ['Client Payment', 'Product Sales', 'Consulting Fees', 'Other Income'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.title.trim() || !formData.amount.trim() || !formData.category.trim() || !formData.transaction_date) {
            setErrorMessage('All fields are required.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/transactions/${transaction.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update transaction.');
            }

            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error updating transaction:', error);
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <Card className="max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Edit Transaction</h2>
                    <button onClick={onClose}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70" /></button>
                </div>
                {errorMessage && <p className="text-sm text-red-500 text-center mb-4">{errorMessage}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title (e.g., Client Payment)"
                        value={formData.title}
                        onChange={handleChange}
                        className={formInputClasses}
                        required
                    />
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className={formInputClasses}
                        required
                    />
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className={`${formInputClasses} form-select`}
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    <input
                        list="categories"
                        name="category"
                        placeholder="Category (e.g., Software)"
                        value={formData.category}
                        onChange={handleChange}
                        className={formInputClasses}
                    />
                    <datalist id="categories">
                        {(formData.type === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                            <option key={cat} value={cat} />
                        ))}
                    </datalist>
                    <input
                        type="date"
                        name="transaction_date"
                        value={formData.transaction_date.split('T')[0]}
                        onChange={handleChange}
                        className={formInputClasses}
                        required
                    />
                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                        {isLoading ? <BrandedLoader text="Saving..." /> : 'Save Changes'}
                    </button>
                </form>
            </Card>
        </div>
    );
};