/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { KeyRound, Bell, Building2, Send, Loader2 } from 'lucide-react';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";

const ToggleSwitch = ({ isEnabled, onToggle, disabled = false }) => {
    return (
        <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
            <input type="checkbox" checked={isEnabled} onChange={onToggle} className="sr-only peer" disabled={disabled} />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-accent-start peer-checked:to-accent-end dark:peer-checked:from-dark-accent-start dark:peer-checked:to-dark-accent-end"></div>
        </label>
    );
};

const SettingsPage = ({ user, token }) => {
    const [settings, setSettings] = useState({ weeklyPulseEnabled: user?.weeklyPulseEnabled || false });
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        if(user) {
            setSettings({ weeklyPulseEnabled: user.weeklyPulseEnabled });
        }
    }, [user]);

    const handleToggleWeeklyPulse = async () => {
        const newSetting = !settings.weeklyPulseEnabled;
        setIsLoading(true);
        setStatusMessage('');

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
            setStatusMessage('Settings updated successfully!');
        } catch (error) {
            console.error(error);
            setStatusMessage('Error updating settings.');
            // Revert on error
            setSettings(prev => ({ ...prev, weeklyPulseEnabled: !newSetting }));
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatusMessage(''), 3000);
        }
    };
    
    const handleChangePassword = () => alert("Password change functionality to be implemented.");
    const handleUpdateAddress = () => alert("Address update functionality to be implemented.");

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Manage your account preferences and settings.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <Card>
                    <h2 className="text-xl font-semibold flex items-center gap-3 mb-4"><KeyRound /> Change Password</h2>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}>
                        <input type="password" placeholder="Current Password" className={formInputClasses} />
                        <input type="password" placeholder="New Password" className={formInputClasses} />
                        <input type="password" placeholder="Confirm New Password" className={formInputClasses} />
                        <button type="submit" className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold hover:opacity-90">Update Password</button>
                    </form>
                </Card>

                <Card>
                    <h2 className="text-xl font-semibold flex items-center gap-3 mb-4"><Building2 /> Company Address</h2>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUpdateAddress(); }}>
                        <input type="text" placeholder="Address" defaultValue={user?.address} className={formInputClasses} />
                        <input type="text" placeholder="City, Province, Postal Code" defaultValue={user?.city_province_postal} className={formInputClasses} />
                        <button type="submit" className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold hover:opacity-90">Update Address</button>
                    </form>
                </Card>

                <Card className="md:col-span-2">
                    <h2 className="text-xl font-semibold flex items-center gap-3 mb-4"><Bell /> Notification Preferences</h2>
                    {statusMessage && <p className="text-sm text-center text-green-500 mb-4">{statusMessage}</p>}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-2 rounded-lg">
                            <div>
                                <p className="font-medium">Weekly Pulse AI Report</p>
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Get an AI-generated business summary every Monday.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {isLoading && <Loader2 className="animate-spin text-accent-start" size={16} />}
                                <ToggleSwitch isEnabled={settings.weeklyPulseEnabled} onToggle={handleToggleWeeklyPulse} disabled={isLoading} />
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-lg">
                            <span>Email me for overdue tasks</span>
                            <ToggleSwitch />
                        </div>
                         <div className="flex justify-between items-center p-2 rounded-lg">
                            <span>Push notifications for new leads</span>
                            <ToggleSwitch defaultChecked={true} />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;

