/* eslint-disable no-irregular-whitespace */
import React, {useState} from 'react'
import Card from '../ui/Card';
import { XCircle, KeyRound, Power, Loader2, CheckCircle, ShieldCheck, Save, Trash2 } from 'lucide-react';

const formSelectClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid form-select";

const UserEditModal = ({ user, token, onClose, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
    const [newPlan, setNewPlan] = useState(user.planType);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const handleAction = async (endpoint, method = 'POST', body = {}) => {
        setIsLoading(true);
        setActionMessage({ type: '', text: '' });
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${user.id}/${endpoint}`, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(body)
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            setActionMessage({ type: 'success', text: result.message });
            onUpdate();
        } catch (err) {
            setActionMessage({ type: 'error', text: err.message || 'Action failed.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        setIsLoading(true);
        setActionMessage({ type: '', text: '' });
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${user.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            setActionMessage({ type: 'success', text: result.message });
            onClose();
            onUpdate();
        } catch (err) {
            setActionMessage({ type: 'error', text: err.message || 'Deletion failed.' });
        } finally {
            setIsLoading(false);
            setShowDeleteConfirmation(false);
        }
    };

    const isDeactivated = user.subscriptionStatus === 'deactivated';

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-lg w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary dark:text-dark-text-secondary hover:opacity-70">
                    <XCircle />
                </button>
                <div>
                    <h2 className="text-2xl font-bold">{user.name || 'No Name Provided'}</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary">{user.email}</p>
                </div>
                
                <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>

                <div className="space-y-4">
                    <h3 className="font-semibold">Support Actions</h3>
                    
                    {!user.isVerified && (
                        <div className="p-4 bg-slate-100 dark:bg-dark-primary-bg rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-medium">Manually Verify User's Email</p>
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Force-verify this user if they can't find the email link.</p>
                            </div>
                            <button onClick={() => handleAction('verify', 'PUT')} disabled={isLoading} className="bg-slate-200 dark:bg-slate-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-2 disabled:opacity-50">
                                {isLoading ? <Loader2 className="animate-spin" size={16}/> : <ShieldCheck size={16} />} Verify
                            </button>
                        </div>
                    )}

                    <div className="p-4 bg-slate-100 dark:bg-dark-primary-bg rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-medium">Trigger Password Reset</p>
                            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Send a secure password reset link to the user's email.</p>
                        </div>
                        <button onClick={() => handleAction('trigger-reset', 'POST')} disabled={isLoading} className="bg-slate-200 dark:bg-slate-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-2 disabled:opacity-50">
                            {isLoading ? <Loader2 className="animate-spin" size={16}/> : <KeyRound size={16} />} Send Link
                        </button>
                    </div>

                    <div className="p-4 bg-slate-100 dark:bg-dark-primary-bg rounded-lg">
                        <p className="font-medium mb-2">Change Plan</p>
                        <div className="flex items-center gap-2">
                           <select value={newPlan} onChange={(e) => setNewPlan(e.target.value)} className={formSelectClasses}>
                                <option value="free">Starter (Free)</option>
                                <option value="solo">Solo</option>
                                <option value="team">Team</option>
                           </select>
                           <button onClick={() => handleAction('plan', 'PUT', { planType: newPlan })} disabled={isLoading || newPlan === user.planType} className="bg-slate-200 dark:bg-slate-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-2 disabled:opacity-50">
                                <Save size={16}/> Save
                           </button>
                        </div>
                    </div>

                    <div className={`p-4 rounded-lg flex items-center justify-between ${isDeactivated ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        <div>
                            <p className={`font-medium ${isDeactivated ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>{isDeactivated ? 'Reactivate Account' : 'Deactivate Account'}</p>
                            <p className={`text-xs ${isDeactivated ? 'text-green-600/80 dark:text-green-400/80' : 'text-red-600/80 dark:text-red-400/80'}`}>{isDeactivated ? 'Allow this user to log in again.' : 'This will prevent the user from logging in.'}</p>
                        </div>
                        <button onClick={() => handleAction('status', 'PUT', { status: isDeactivated ? 'active' : 'deactivated' })} className={`${isDeactivated ? 'bg-green-200/50 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900' : 'bg-red-200/50 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900'} font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2`}>
                           <Power size={16} /> {isDeactivated ? 'Reactivate' : 'Deactivate'}
                        </button>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>

                    <h3 className="font-semibold text-red-700 dark:text-red-400">Dangerous Actions</h3>
                    <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-medium text-red-700 dark:text-red-400">Permanently Delete User</p>
                            <p className="text-xs text-red-600/80 dark:text-red-400/80">This action cannot be undone. All user data will be lost.</p>
                        </div>
                        <button onClick={() => setShowDeleteConfirmation(true)} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-red-600 flex items-center gap-2 disabled:opacity-50">
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>

                </div>

                {actionMessage.text && (
                    <div className={`mt-4 text-sm flex items-center gap-2 ${actionMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                       {actionMessage.type === 'success' && <CheckCircle size={16} />}
                       <span>{actionMessage.text}</span>
                    </div>
                )}
            </Card>

            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-sm w-full">
                        <div className="flex flex-col items-center text-center">
                            <Trash2 size={48} className="text-red-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
                            <p className="text-text-secondary dark:text-dark-text-secondary">This will permanently delete {user.name} and all their associated data. This action cannot be undone.</p>
                            <div className="flex justify-end gap-3 mt-6 w-full">
                                <button onClick={() => setShowDeleteConfirmation(false)} className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary font-semibold px-4 py-2 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600">
                                    Cancel
                                </button>
                                <button onClick={handleDeleteUser} disabled={isLoading} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-red-600 disabled:opacity-50 flex items-center gap-2">
                                    {isLoading ? <Loader2 className="animate-spin" size={16}/> : <Trash2 size={16} />}
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default UserEditModal;
