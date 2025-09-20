import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { KeyRound, Bell, Building2, Mail, Check, AlertTriangle } from 'lucide-react';
import { useAuth } from '../AuthContext';
import BrandedLoader from '../components/BrandedLoader';
import CustomModal from '../components/ui/CustomModal';

// This constant is now defined once and used consistently
const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";

const ToggleSwitch = ({ isEnabled, onToggle, disabled = false }) => {
    return (
        <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
            <input type="checkbox" checked={isEnabled} onChange={onToggle} className="sr-only peer" disabled={disabled} />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-accent-start peer-checked:to-accent-end dark:peer-checked:from-dark-accent-start dark:peer-checked:to-dark-accent-end"></div>
        </label>
    );
};


const SettingsPage = () => {
    const { user, token, fetchUserProfile } = useAuth();
    const [settings, setSettings] = useState({
        weeklyPulseEnabled: user?.weeklyPulseEnabled ?? false,
        overdueTaskNotificationsEnabled: false,
        newLeadNotificationsEnabled: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    const [addressData, setAddressData] = useState({ address: user?.address || '', cityProvincePostal: user?.cityProvincePostal || '' });
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    
    // Password complexity regex
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{12,})/;

    useEffect(() => {
        if(user) {
            setSettings({
                weeklyPulseEnabled: user.weeklyPulseEnabled,
                overdueTaskNotificationsEnabled: false, // For now, these remain false
                newLeadNotificationsEnabled: false 
            });
            setAddressData({ address: user.address || '', cityProvincePostal: user.cityProvincePostal || '' });
        }
    }, [user]);

    const handleToggleWeeklyPulse = async () => {
        const newSetting = !settings.weeklyPulseEnabled;
        setIsLoading(true);
        setStatusMessage({ type: '', text: '' });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ weeklyPulseEnabled: newSetting })
            });

            if(!response.ok) throw new Error('Failed to update settings.');
            
            const updatedUser = await response.json();
            setSettings({ weeklyPulseEnabled: updatedUser.weeklyPulseEnabled });
            setStatusMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (error) {
            console.error(error);
            setStatusMessage({ type: 'error', text: 'Error updating settings.' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);
        }
    };
    
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: '', text: '' });
        
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setStatusMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        if (!strongPasswordRegex.test(passwordData.newPassword)) {
            setStatusMessage({ type: 'error', text: 'Password must be at least 12 characters and include uppercase, lowercase, a number, and a symbol.' });
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile/change-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            setStatusMessage({ type: 'success', text: 'Password updated successfully!' });
            setIsPasswordModalVisible(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (error) {
            console.error('Password change error:', error);
            setStatusMessage({ type: 'error', text: error.message || 'Failed to change password.' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleAddressUpdate = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: '', text: '' });
        setIsSaving(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ address: addressData.address, cityProvincePostal: addressData.cityProvincePostal })
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            fetchUserProfile(token);
            setStatusMessage({ type: 'success', text: 'Address updated successfully!' });
            setIsAddressModalVisible(false);
        } catch (error) {
            console.error('Address update error:', error);
            setStatusMessage({ type: 'error', text: error.message || 'Failed to update address.' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);
        }
    };
    

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Manage your account preferences and settings.</p>
            </header>

            {statusMessage.text && (
                <div className={`p-3 rounded-lg text-center ${statusMessage.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {statusMessage.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <Card>
                    <h2 className="text-xl font-semibold flex items-center gap-3 mb-4"><KeyRound /> Security</h2>
                    <div className="space-y-4">
                        <p className="text-text-secondary dark:text-dark-text-secondary">Password management is handled securely. You will receive an email verification to complete the process.</p>
                        <button 
                            onClick={() => setIsPasswordModalVisible(true)} 
                            className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center gap-2"
                        >
                            <Mail size={16} /> Reset Password via Email
                        </button>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-semibold flex items-center gap-3 mb-4"><Building2 /> Company Address</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary">Update your company address, which appears on your invoices.</p>
                    <form className="space-y-4 mt-4" onSubmit={handleAddressUpdate}>
                        <input type="text" name="address" placeholder="Address" value={addressData.address} onChange={e => setAddressData({ ...addressData, address: e.target.value })} className={formInputClasses} />
                        <input type="text" name="cityProvincePostal" placeholder="City, Province, Postal Code" value={addressData.cityProvincePostal} onChange={e => setAddressData({ ...addressData, cityProvincePostal: e.target.value })} className={formInputClasses} />
                        <button type="submit" disabled={isSaving} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50">
                            {isSaving ? <BrandedLoader text="Updating..." /> : 'Update Address'}
                        </button>
                    </form>
                </Card>

                <Card className="md:col-span-2">
                    <h2 className="text-xl font-semibold flex items-center gap-3 mb-4"><Bell /> Notification Preferences</h2>
                    {statusMessage.text && <p className={`p-3 rounded-lg text-center ${statusMessage.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>{statusMessage.text}</p>}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-2 rounded-lg">
                            <div>
                                <p className="font-medium">Weekly Pulse AI Report</p>
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Get an AI-generated business summary every Monday.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {isLoading && <BrandedLoader text="Updating..." />}
                                <ToggleSwitch isEnabled={settings.weeklyPulseEnabled} onToggle={handleToggleWeeklyPulse} disabled={isLoading} />
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-lg">
                            <div>
                                <p className="font-medium">Overdue Task Alerts</p>
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Receive an email when a task is overdue.</p>
                            </div>
                            <ToggleSwitch isEnabled={settings.overdueTaskNotificationsEnabled} onToggle={() => setStatusMessage({ type: 'info', text: 'This feature is coming soon!' })} />
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-lg">
                            <div>
                                <p className="font-medium">New Lead Push Notifications</p>
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Get a push notification when a new lead is added.</p>
                            </div>
                            <ToggleSwitch isEnabled={settings.newLeadNotificationsEnabled} onToggle={() => setStatusMessage({ type: 'info', text: 'This feature is coming soon!' })} />
                        </div>
                    </div>
                </Card>
            </div>

            {isAddressModalVisible && (
                <CustomModal
                    title="Update Company Address"
                    onClose={() => setIsAddressModalVisible(false)}
                >
                    <form onSubmit={handleAddressUpdate} className="space-y-4">
                        <input type="text" name="address" placeholder="Address" value={addressData.address} onChange={e => setAddressData({ ...addressData, address: e.target.value })} className={formInputClasses} required />
                        <input type="text" name="cityProvincePostal" placeholder="City, Province, Postal Code" value={addressData.cityProvincePostal} onChange={e => setAddressData({ ...addressData, cityProvincePostal: e.target.value })} className={formInputClasses} required />
                        <button type="submit" disabled={isSaving} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                            {isSaving ? <BrandedLoader text="Updating..." /> : 'Update Address'}
                        </button>
                    </form>
                </CustomModal>
            )}

            {isPasswordModalVisible && (
                <CustomModal
                    title="Reset Password"
                    onClose={() => { setIsPasswordModalVisible(false); setStatusMessage({ type: '', text: '' }); setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); }}
                >
                    {statusMessage.text && <p className={`mb-4 text-center text-sm ${statusMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{statusMessage.text}</p>}
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <input type="password" placeholder="Current Password" value={passwordData.currentPassword} onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className={formInputClasses} required />
                        <input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} className={formInputClasses} required />
                        <input type="password" placeholder="Confirm New Password" value={passwordData.confirmNewPassword} onChange={e => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })} className={formInputClasses} required />
                        <button type="submit" disabled={isSaving} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                            {isSaving ? <BrandedLoader text="Saving..." /> : 'Update Password'}
                        </button>
                    </form>
                </CustomModal>
            )}
        </div>
    );
};

export default SettingsPage;