import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserPlus, UserCheck, LineChart, Loader2, Edit, Trash2, Power, AlertTriangle, KeyRound, Save, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';
import UserEditModal from '../components/admin/UserEditModal';
import { useAuth } from '../AuthContext';
import BrandedLoader from '../components/BrandedLoader';
import CustomModal from '../components/ui/CustomModal';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";

const AdminDashboard = () => {
    const { token } = useAuth();
    const [adminView, setAdminView] = useState('overview');
    const [overviewData, setOverviewData] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchData = useCallback(async () => {
        if (!token) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const [overviewRes, usersRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/overview`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            
            if (!overviewRes.ok) throw new Error('Failed to fetch admin overview. Ensure you have admin privileges.');
            if (!usersRes.ok) throw new Error('Failed to fetch users list.');

            setOverviewData(await overviewRes.json());
            setUsers(await usersRes.json());
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleDeleteUser = async (userId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Deletion failed.');
            fetchData();
            setShowDeleteConfirmation(false);
        } catch (err) {
            console.error(err);
        }
    };
    
    const confirmDeleteUser = (u) => {
        setUserToDelete(u);
        setShowDeleteConfirmation(true);
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><BrandedLoader /></div>;
    }

    const OverviewSection = () => {
        if (!overviewData) return <div className="text-center text-text-secondary">Could not load overview data.</div>;
        const formattedChartData = overviewData.signupsChartData.map(d => ({
            date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            signups: parseInt(d.signups, 10)
        }));
        
        const isDarkMode = document.documentElement.classList.contains('dark');
        const barFillColor = isDarkMode ? '#00F2A9' : '#4A90E2';

        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="flex items-center gap-4"><div className="p-3 bg-blue-500/10 rounded-lg"><Users size={24} className="text-blue-500"/></div><div><p className="text-text-secondary dark:text-dark-text-secondary text-sm">Total Users</p><p className="text-3xl font-bold">{overviewData.totalUsers}</p></div></Card>
                    <Card className="flex items-center gap-4"><div className="p-3 bg-green-500/10 rounded-lg"><UserPlus size={24} className="text-green-500"/></div><div><p className="text-text-secondary dark:text-dark-text-secondary text-sm">New Signups (Today)</p><p className="text-3xl font-bold">{overviewData.newSignupsToday}</p></div></Card>
                    <Card className="flex items-center gap-4"><div className="p-3 bg-purple-500/10 rounded-lg"><UserCheck size={24} className="text-purple-500"/></div><div><p className="text-text-secondary dark:text-dark-text-secondary text-sm">Active Users (7 Days)</p><p className="text-3xl font-bold">{overviewData.activeUsersWeekly}</p></div></Card>
                </div>
                <Card>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><LineChart size={20}/> Signups Over Last 30 Days</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={formattedChartData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis dataKey="date" stroke="currentColor" className="text-xs text-text-secondary dark:text-dark-text-secondary" />
                            <YAxis stroke="currentColor" className="text-xs text-text-secondary dark:text-dark-text-secondary" />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg, #FFFFFF)', border: '1px solid #e2e8f0', color: 'var(--text-primary, #1E2022)' }}/>
                            <Legend wrapperStyle={{fontSize: "0.875rem"}}/>
                            <Bar dataKey="signups" name="New Signups" fill={barFillColor} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        );
    };

    const UserManagementSection = () => (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">User Management</h2>
                <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={formInputClasses + " max-w-xs"} />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">Plan & Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">Last Login</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredUsers.map(u => (
                            <tr key={u.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium">{u.name}</div>
                                    <div className="text-sm text-text-secondary dark:text-dark-text-secondary">{u.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${u.subscriptionStatus === 'active' || u.subscriptionStatus === 'beta' ? 'bg-green-100 text-green-800' : u.subscriptionStatus === 'trialing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {u.subscriptionStatus}
                                    </span>
                                    <div className="text-sm text-text-secondary dark:text-dark-text-secondary capitalize">{u.planType} Plan</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-dark-text-secondary">
                                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => setEditingUser(u)} className="text-accent-start dark:text-dark-accent-mid hover:opacity-70 mr-4"><Edit size={16}/></button>
                                    <button onClick={() => confirmDeleteUser(u)} className="text-red-500 hover:opacity-70"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {editingUser && <UserEditModal user={editingUser} onClose={() => setEditingUser(null)} onUpdate={fetchData} />}
            {showDeleteConfirmation && (
                <CustomModal
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete the user "${userToDelete?.name}"? This action cannot be undone.`}
                    type="confirm"
                    confirmText="Delete"
                    onConfirm={() => handleDeleteUser(userToDelete?.id)}
                    onClose={() => setShowDeleteConfirmation(false)}
                />
            )}
            
            <header>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Platform oversight and user management.</p>
            </header>

            <div className="border-b border-slate-200 dark:border-slate-800">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setAdminView('overview')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${adminView === 'overview' ? 'border-accent-start dark:border-dark-accent-mid text-accent-start dark:text-dark-accent-mid' : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:border-gray-300'}`}>Overview</button>
                    <button onClick={() => setAdminView('users')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${adminView === 'users' ? 'border-accent-start dark:border-dark-accent-mid text-accent-start dark:text-dark-accent-mid' : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:border-gray-300'}`}>User Management</button>
                </nav>
            </div>

            {adminView === 'overview' ? <OverviewSection /> : <UserManagementSection />}
        </div>
    );
};

export default AdminDashboard;