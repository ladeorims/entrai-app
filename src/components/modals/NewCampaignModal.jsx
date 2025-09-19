import React, { useState } from 'react';
import { XCircle, Loader2 } from 'lucide-react';
import Card from '../ui/Card';
import { useAuth } from '../../AuthContext';
import CustomModal from '../ui/CustomModal';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid text-text-primary dark:text-dark-text-primary";
const formSelectClasses = `${formInputClasses} form-select`;

export const NewCampaignModal = ({ onClose, onCampaignAdded }) => {
    const { token } = useAuth();
    const [newCampaign, setNewCampaign] = useState({ 
        name: '', 
        platform: 'Facebook', 
        ad_spend: '', 
        reach: '', 
        engagement: '', 
        conversions: '', 
        start_date: new Date().toISOString().split('T')[0] 
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddCampaign = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/campaigns`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
                body: JSON.stringify(newCampaign) 
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add campaign.");
            }
            onCampaignAdded();
            onClose();
        } catch (error) { 
            console.log(error);
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
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
            <Card className="max-w-lg w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">New Campaign</h2>
                    <button onClick={onClose}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                </div>
                <form onSubmit={handleAddCampaign} className="space-y-4">
                    <input type="text" placeholder="Campaign Name" onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} className={formInputClasses} required/>
                    <select onChange={e => setNewCampaign({...newCampaign, platform: e.target.value})} className={formSelectClasses}>
                        <option>Facebook</option><option>Instagram</option><option>Google Ads</option><option>LinkedIn</option><option>Other</option>
                    </select>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Ad Spend ($)" onChange={e => setNewCampaign({...newCampaign, ad_spend: e.target.value})} className={formInputClasses}/>
                        <input type="number" placeholder="Reach" onChange={e => setNewCampaign({...newCampaign, reach: e.target.value})} className={formInputClasses}/>
                        <input type="number" placeholder="Engagement" onChange={e => setNewCampaign({...newCampaign, engagement: e.target.value})} className={formInputClasses}/>
                        <input type="number" placeholder="Conversions" onChange={e => setNewCampaign({...newCampaign, conversions: e.target.value})} className={formInputClasses}/>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Save Campaign'}
                    </button>
                </form>
            </Card>
        </div>
    );
};