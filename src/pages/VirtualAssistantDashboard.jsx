/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect, useCallback } from 'react';
import { CheckSquare, Calendar, Mail, FileText, Trash2, XCircle, PlusCircle, Loader2, Wand2, AlertTriangle, RotateCcw, UserPlus, Users } from 'lucide-react';
import Card from '../components/ui/Card';
import { AddTaskModal } from '../components/modals/AddTaskModal';
import BrandedLoader from '../components/BrandedLoader';
import CustomModal from '../components/ui/CustomModal';
import EmailDraftModal from '../components/assistant/EmailDraftModal';
import MeetingModal from '../components/assistant/MeetingModal';
import { useAuth } from '../AuthContext';


const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid text-text-primary dark:text-dark-text-primary";
const formTextareaClasses = `${formInputClasses} h-24`;


const VirtualAssistantDashboard = () => {
    const { token } = useAuth();
    const [currentTasks, setCurrentTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isCleanerModalVisible, setIsCleanerModalVisible] = useState(false);
    const [cleanerState, setCleanerState] = useState({ inputText: '', cleanedText: '', isLoading: false });
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
    const [isMeetingModalVisible, setIsMeetingModalVisible] = useState(false);
    const [isTrashModalVisible, setIsTrashModalVisible] = useState(false);
    const [trashedTasks, setTrashedTasks] = useState([]);
    const [clients, setClients] = useState([]);

    const fetchTasks = useCallback(async () => {
        if (!token) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            setCurrentTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const fetchClients = useCallback(async () => {
        if (!token) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/clients`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) {
                setClients(await response.json());
            }
        } catch (error) { console.error("Failed to fetch clients for VA:", error); }
    }, [token]);

    useEffect(() => {
        fetchTasks();
        fetchClients();
    }, [fetchTasks, fetchClients]);
    
    const toggleTask = async (taskToToggle) => {
        const updatedTask = {
            ...taskToToggle,
            status: taskToToggle.status === 'complete' ? 'incomplete' : 'complete',
            due_date: taskToToggle.due_date || null
        };
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskToToggle.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(updatedTask)
            });
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };
    
    const handleDeleteTask = (task) => {
        setTaskToDelete(task);
        setIsDeleteModalVisible(true);
    };

    const confirmDeleteTask = async () => {
        if (!taskToDelete) return;
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDeleteMessage('Task successfully deleted!');
            fetchTasks();
            setTimeout(() => {
                setIsDeleteModalVisible(false);
                setTaskToDelete(null);
                setDeleteMessage('');
            }, 2000);
        } catch (error) {
            console.error('Error deleting task:', error);
            setDeleteMessage('Failed to delete task.');
        }
    };

    const handleCleanText = async () => {
        if (!cleanerState.inputText.trim()) return;
        setCleanerState(prev => ({ ...prev, isLoading: true, cleanedText: '' }));
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/clean-text`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ text: cleanerState.inputText })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to clean text');
            }
            const result = await response.json();
            setCleanerState(prev => ({ ...prev, cleanedText: result.cleanedText, isLoading: false }));
        } catch (error) {
            console.error('Error cleaning text:', error);
            setCleanerState(prev => ({ ...prev, cleanedText: `Error: ${error.message}`, isLoading: false }));
        }
    };

    // ➡️ NEW: Functions for the Trash Can
    const openTrashModal = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/trash`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Failed to fetch trashed tasks');
            const data = await response.json();
            setTrashedTasks(data);
            setIsTrashModalVisible(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestoreTask = async (taskId) => {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}/restore`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
            setTrashedTasks(trashedTasks.filter(t => t.id !== taskId)); // Optimistically update UI
            fetchTasks(); // Refresh main task list
        } catch (error) {
            console.error('Error restoring task:', error);
        }
    };

    const handlePermanentDelete = async (taskId) => {
        if (window.confirm('This task will be deleted forever. Are you sure?')) {
            try {
                await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}/permanent`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                setTrashedTasks(trashedTasks.filter(t => t.id !== taskId)); // Optimistically update UI
            } catch (error) {
                console.error('Error permanently deleting task:', error);
            }
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><BrandedLoader /></div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold">Virtual Assistant</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Your AI-powered command center for productivity.</p>
            </header>

            {isAddTaskModalOpen && <AddTaskModal token={token} onClose={() => setIsAddTaskModalOpen(false)} onTaskAdded={fetchTasks} />}
            
            {/* NEW: Email Draft Modal */}
            {isEmailModalVisible && <EmailDraftModal onClose={() => setIsEmailModalVisible(false)} clients={clients} onSuccess={() => fetchTasks()} />}

            {/* NEW: Meeting Modal */}
            {isMeetingModalVisible && <MeetingModal onClose={() => setIsMeetingModalVisible(false)} clients={clients} />}

            {isCleanerModalVisible && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2"><Wand2 size={24} className="text-accent-start dark:text-dark-accent-mid"/> Text Cleaner & Formatter</h2>
                            <button onClick={() => setIsCleanerModalVisible(false)}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                        </div>
                        <div className="space-y-4">
                            <textarea placeholder="Paste messy text here..." value={cleanerState.inputText} onChange={(e) => setCleanerState(prev => ({ ...prev, inputText: e.target.value }))} rows="10" className={formTextareaClasses}/>
                            <button onClick={handleCleanText} disabled={cleanerState.isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold flex items-center justify-center hover:opacity-90 disabled:opacity-50">
                                {cleanerState.isLoading ? <BrandedLoader text="Cleaning..." /> : 'Clean Up Text'}
                            </button>
                        </div>
                        {cleanerState.cleanedText && (
                            <div className="bg-slate-100 dark:bg-dark-primary-bg p-4 rounded-lg mt-4">
                                <h3 className="font-semibold mb-2">Cleaned Text:</h3>
                                <p className="text-text-secondary dark:text-dark-text-secondary whitespace-pre-wrap">{cleanerState.cleanedText}</p>
                            </div>
                        )}
                    </Card>
                </div>
            )}
            
            {isDeleteModalVisible && (
                <CustomModal
                    title="Confirm Deletion"
                    message={deleteMessage || `Are you sure you want to delete the task "${taskToDelete?.title}"? It will be moved to the trash.`}
                    type="confirm"
                    confirmText="Delete"
                    onConfirm={confirmDeleteTask}
                    onClose={() => setIsDeleteModalVisible(false)}
                />
            )}

            {isTrashModalVisible && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2"><Trash2 size={24} /> Trash</h2>
                            <button onClick={() => setIsTrashModalVisible(false)}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {trashedTasks.length > 0 ? trashedTasks.map(task => (
                                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-dark-primary-bg">
                                    <span className="text-text-secondary dark:text-dark-text-secondary line-through">{task.title}</span>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => handleRestoreTask(task.id)} className="text-text-secondary dark:text-dark-text-secondary hover:text-green-500 flex items-center gap-2 text-sm"><RotateCcw size={16} /> Restore</button>
                                        <button onClick={() => handlePermanentDelete(task.id)} className="text-text-secondary dark:text-dark-text-secondary hover:text-red-500 flex items-center gap-2 text-sm"><AlertTriangle size={16} /> Delete Forever</button>
                                    </div>
                                </div>
                            )) : <p className="text-center text-text-secondary dark:text-dark-text-secondary py-8">Trash is empty.</p>}
                        </div>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Task Manager</h2>
                            <div className="flex items-center gap-2">
                                <button onClick={openTrashModal} className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary px-3 py-2 text-sm rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-2">
                                    <Trash2 size={16} /> Trash
                                </button>
                                <button onClick={() => setIsAddTaskModalOpen(true)} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-3 py-2 text-sm rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center gap-2">
                                    <PlusCircle size={16} /> Add Task
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {currentTasks.map(task => (
                                <div key={task.id} className={`flex items-center justify-between p-3 rounded-lg transition-all ${task.status === 'complete' ? 'bg-slate-100/50 dark:bg-dark-primary-bg/50' : 'bg-slate-100 dark:bg-dark-primary-bg'}`}>
                                    <div className="flex items-center cursor-pointer" onClick={() => toggleTask(task)}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${task.status === 'complete' ? 'border-green-500 bg-green-500' : 'border-slate-400 dark:border-slate-600'}`}>
                                            {task.status === 'complete' && <CheckSquare size={14} className="text-white" />}
                                        </div>
                                        <span className={`${task.status === 'complete' ? 'line-through text-text-secondary dark:text-dark-text-secondary' : ''}`}>{task.title}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${task.priority === 'High' ? 'bg-red-500/20 text-red-500' : task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'}`}>{task.priority}</span>
                                        {task.due_date && <span className="text-sm text-text-secondary dark:text-dark-text-secondary">{new Date(task.due_date).toLocaleDateString()}</span>}
                                        <button onClick={() => handleDeleteTask(task)} className="text-text-secondary dark:text-dark-text-secondary hover:text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button onClick={() => setIsEmailModalVisible(true)} className="w-full text-left bg-slate-100 dark:bg-dark-primary-bg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors p-3 rounded-lg flex items-center gap-3"><Mail size={18} className="text-accent-start dark:text-dark-accent-mid" /> Draft an Email</button>
                            <button onClick={() => setIsMeetingModalVisible(true)} className="w-full text-left bg-slate-100 dark:bg-dark-primary-bg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors p-3 rounded-lg flex items-center gap-3"><Calendar size={18} className="text-accent-start dark:text-dark-accent-mid" /> Schedule a Meeting</button>
                            <button onClick={() => setIsCleanerModalVisible(true)} className="w-full text-left bg-slate-100 dark:bg-dark-primary-bg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors p-3 rounded-lg flex items-center gap-3"><FileText size={18} className="text-accent-start dark:text-dark-accent-mid" /> Clean & Format Text</button>
                        </div>
                    </Card>
                    <Card>
                        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                        <div className="space-y-4">
                            {currentTasks.filter(t => t.status === 'incomplete' && t.due_date).sort((a, b) => new Date(a.due_date) - new Date(b.due_date)).slice(0, 3).map(task => (
                                <div key={task.id} className="flex items-start gap-3">
                                    <div className="bg-slate-100 dark:bg-dark-primary-bg p-2 rounded-lg mt-1"><Calendar size={18} className="text-accent-start dark:text-dark-accent-mid" /></div>
                                    <div>
                                        <p className="font-semibold">{task.title}</p>
                                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{new Date(task.due_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default VirtualAssistantDashboard;