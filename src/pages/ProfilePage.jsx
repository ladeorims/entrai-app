// src/pages/ProfilePage.jsx

import React, { useState, useEffect, useRef } from "react";
import Card from "../components/ui/Card";
import { User, Mail, Star, Phone, LogOut, Save, XCircle, ArrowLeft, Image as ImageIcon } from "lucide-react";
import UpgradeModal from '../components/UpgradeModal';
import { useAuth } from '../AuthContext';

const formInputClasses = "w-full mt-1 bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";
const formTextareaClasses = `${formInputClasses} h-auto`;

const ProfilePage = () => {
    const { user, setUser, token, setActiveView, onSelectPlan } = useAuth();    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);
    const [initials, setInitials] = useState("");
    const fileInputRef = useRef(null);
    const logoInputRef = useRef(null);
    const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });
    const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(user);
            setInitials(user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "A");
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveProfile = async () => {
        if (!token) return;
        setUpdateMessage({ type: '', text: '' });

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message || "Failed to update profile.");
            }

            localStorage.setItem("token", result.token);
            setUser(result.user);
            
            setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (err) {
            console.error("Profile update error:", err);
            setUpdateMessage({ type: 'error', text: err.message });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const handlePictureUpload = (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setFormData({ ...formData, [fieldName]: reader.result });
            setUpdateMessage({ type: 'info', text: 'New image selected. Click "Save Profile" to apply.' });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {isUpgradeModalVisible && <UpgradeModal onSelectPlan={onSelectPlan} onClose={() => setIsUpgradeModalVisible(false)} />}
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => setActiveView('Dashboard')} className="bg-slate-200 dark:bg-slate-700 p-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold">My Profile</h1>
                        <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Manage your personal and company details.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"><Save size={16} /> Save Profile</button>
                            <button onClick={() => { setIsEditing(false); setFormData(user); setUpdateMessage({type: '', text: ''}); }} className="bg-slate-200 dark:bg-slate-700 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-600"><XCircle size={16} /> Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => { setIsEditing(true); setUpdateMessage({type: '', text: ''}); }} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90">Edit Profile</button>
                    )}
                </div>
            </header>

            {updateMessage.text && (
                <div className={`p-3 rounded-lg text-center ${updateMessage.type === 'success' ? 'bg-green-500/20 text-green-500' : updateMessage.type === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>{updateMessage.text}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-1">
                    <div className="flex flex-col items-center mb-6">
                        {formData.profilePictureUrl ? (<img src={formData.profilePictureUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-4" />) : (<div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent-start to-accent-end dark:from-dark-accent-start flex items-center justify-center text-white font-bold text-4xl mb-4">{initials}</div>)}
                        <input type="file" ref={fileInputRef} onChange={(e) => handlePictureUpload(e, 'profilePictureUrl')} className="hidden" accept="image/*" />
                        {isEditing && (<button onClick={() => fileInputRef.current.click()} className="text-sm font-semibold text-accent-start dark:text-dark-accent-mid hover:opacity-80">Upload new picture</button>)}
                    </div>
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <User size={20} className="text-text-secondary dark:text-dark-text-secondary mt-1" />
                            <div>
                                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Name</p>
                                {isEditing ? (<input type="text" name="name" value={formData.name || ''} onChange={handleChange} className={formInputClasses} />) : (<p className="font-semibold">{formData.name || "Not specified"}</p>)}
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Mail size={20} className="text-text-secondary dark:text-dark-text-secondary mt-1" />
                            <div>
                                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Email Address</p>
                                <p className="font-semibold">{formData.email || "..."}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Phone size={20} className="text-text-secondary dark:text-dark-text-secondary mt-1" />
                            <div>
                                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Phone Number</p>
                                {isEditing ? (<input type="tel" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} className={formInputClasses} />) : (<p className="font-semibold">{formData.phoneNumber || "Not specified"}</p>)}
                            </div>
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4">
                            <button onClick={handleLogout} className="flex items-center gap-4 text-text-secondary dark:text-dark-text-secondary hover:text-red-500 dark:hover:text-red-500 transition-colors w-full text-left">
                                <LogOut size={20} className="text-red-500" />
                                <p className="font-semibold">Log Out</p>
                            </button>
                        </div>
                    </div>
                </Card>

                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <h2 className="text-xl font-semibold mb-4">Company Information</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-2">Company Logo</label>
                                {formData.companyLogoUrl ? (<img src={formData.companyLogoUrl} alt="Company Logo" className="h-12 bg-slate-100 dark:bg-dark-primary-bg p-2 rounded-lg object-contain mb-2"/>) : (<div className="h-12 w-40 bg-slate-100 dark:bg-dark-primary-bg rounded-lg flex items-center justify-center mb-2"><ImageIcon className="text-text-secondary dark:text-dark-text-secondary"/></div>)}
                                <input type="file" ref={logoInputRef} onChange={(e) => handlePictureUpload(e, 'companyLogoUrl')} className="hidden" accept="image/*" />
                                {isEditing && (<button onClick={() => logoInputRef.current.click()} className="text-sm font-semibold text-accent-start dark:text-dark-accent-mid hover:opacity-80">Upload new logo</button>)}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1">Company Name</label>
                                {isEditing ? (<input type="text" name="company" value={formData.company || ''} onChange={handleChange} className={formInputClasses} />) : (<p className="font-semibold">{formData.company || "Not specified"}</p>)}
                            </div>
                             <div>
                                <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1">Address</label>
                                {isEditing ? (<input type="text" name="address" value={formData.address || ''} onChange={handleChange} className={formInputClasses} />) : (<p className="font-semibold">{formData.address || "Not specified"}</p>)}
                            </div>
                             <div>
                                <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1">City, Province, Postal Code</label>
                                {isEditing ? (<input type="text" name="city_province_postal" value={formData.city_province_postal || ''} onChange={handleChange} className={formInputClasses} />) : (<p className="font-semibold">{formData.city_province_postal || "Not specified"}</p>)}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-1">About Your Company</label>
                                {isEditing ? (<textarea name="companyDescription" value={formData.companyDescription || ""} onChange={handleChange} rows="5" className={formTextareaClasses} placeholder="Describe your business here..."/>) : (<p className="text-text-secondary dark:text-dark-text-secondary">{formData.companyDescription || "Not specified"}</p>)}
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-semibold mb-4">Subscription Plan</h2>
                        <div className="flex items-center gap-4 mb-4">
                            <h3 className="text-3xl font-bold capitalize">{user?.planType || 'Free'} Plan</h3>
                            <span className="text-sm bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-3 py-1 rounded-full font-semibold capitalize">
                                {user?.subscriptionStatus || 'Active'}
                            </span>
                        </div>
                        <p className="text-text-secondary dark:text-dark-text-secondary">
                            Your current plan details and features.
                        </p>
                        {user?.planType !== 'team' && ( // Show upgrade button if not on the highest plan
                            <button onClick={() => setIsUpgradeModalVisible(true)} className="w-full mt-6 bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white font-semibold px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90">
                                <Star size={16} /> Upgrade Plan
                            </button>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;