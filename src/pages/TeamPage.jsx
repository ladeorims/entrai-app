import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import Card from '../components/ui/Card';
import CustomModal from '../components/ui/CustomModal';
import { UserPlus, Mail, XCircle, Loader2, User, Send, Trash2 } from 'lucide-react';
import BrandedLoader from '../components/BrandedLoader';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";

const TeamPage = () => {
    const { token, user } = useAuth();
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inviteData, setInviteData] = useState({ name: '', email: '' });
    const [modalState, setModalState] = useState({ isOpen: false, type: '', title: '', message: '' });
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [memberToKick, setMemberToKick] = useState(null);
    const [isKicking, setIsKicking] = useState(false);

    const fetchTeamMembers = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/team/members`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch team members.');
            const data = await response.json();
            setTeamMembers(data);
        } catch (error) {
            setModalState({ isOpen: true, type: 'error', title: 'Error', message: error.message });
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (user?.planType === 'team') {
            fetchTeamMembers();
        }
    }, [user, fetchTeamMembers]);

    const handleInvite = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/team/invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(inviteData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setModalState({ isOpen: true, type: 'success', title: 'Success!', message: data.message });
            setInviteData({ name: '', email: '' });
            fetchTeamMembers();
        } catch (error) {
            setModalState({ isOpen: true, type: 'error', title: 'Error', message: error.message });
        } finally {
            setIsLoading(false);
        }
    };
    
    const confirmKickMember = (member) => {
        setMemberToKick(member);
        setShowDeleteConfirmation(true);
    };

    const handleKickMember = async () => {
        if (!memberToKick) return;
        setIsKicking(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/team/kick`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ memberId: memberToKick.id }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setModalState({ isOpen: true, type: 'success', title: 'Success', message: data.message });
            setShowDeleteConfirmation(false);
            setMemberToKick(null);
            fetchTeamMembers();
        } catch (error) {
            setModalState({ isOpen: true, type: 'error', title: 'Error', message: error.message });
        } finally {
            setIsKicking(false);
        }
    };

    if (user?.planType !== 'team') {
        return (
            <div className="flex items-center justify-center h-full text-center">
                <Card className="max-w-md w-full">
                    <h2 className="text-xl font-bold mb-2">Upgrade to Team Plan</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary">This feature is available exclusively to users on the Team plan.</p>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><BrandedLoader /></div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {modalState.isOpen && (
                <CustomModal
                    title={modalState.title}
                    message={modalState.message}
                    type={modalState.type}
                    onClose={() => setModalState({ ...modalState, isOpen: false })}
                    onConfirm={() => setModalState({ ...modalState, isOpen: false })}
                />
            )}
            {showDeleteConfirmation && (
                <CustomModal
                    title="Confirm Removal"
                    message={isKicking ? "Removing team member..." : `Are you sure you want to remove ${memberToKick.name} from the team?`}
                    type="confirm"
                    confirmText="Remove"
                    onConfirm={handleKickMember}
                    onClose={() => setShowDeleteConfirmation(false)}
                />
            )}
            <header>
                <h1 className="text-3xl font-bold">Team Management</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Invite and manage your team members on the Enterprise plan.</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <h2 className="text-xl font-semibold mb-4">Current Team Members</h2>
                        <ul className="space-y-4">
                            {teamMembers.map(member => (
                                <li key={member.id} className="flex items-center gap-4 p-4 bg-slate-100/50 dark:bg-dark-primary-bg/50 rounded-lg">
                                    <User size={24} />
                                    <div>
                                        <h3 className="font-semibold">{member.name}</h3>
                                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{member.email}</p>
                                    </div>
                                    <button onClick={() => confirmKickMember(member)} className="ml-auto text-red-500 hover:opacity-70 disabled:opacity-50" disabled={user.email === member.email}>
                                        <Trash2 size={18} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
                <div>
                    <Card>
                        <h2 className="text-xl font-semibold mb-4">Invite New Member</h2>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={inviteData.name}
                                onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                                className={formInputClasses}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={inviteData.email}
                                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                className={formInputClasses}
                                required
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-accent-start to-accent-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50"
                            >
                                {isLoading ? <BrandedLoader text="Sending..." /> : <><Send size={16} className="mr-2" /> Send Invitation</>}
                            </button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TeamPage;