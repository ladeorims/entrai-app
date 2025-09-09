/* eslint-disable no-irregular-whitespace */
// /* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect, useCallback } from 'react';
import { CheckSquare, Calendar, Mail, FileText, Trash2, XCircle, PlusCircle, Loader2, Wand2, AlertTriangle, RotateCcw, UserPlus, Users } from 'lucide-react';
import Card from '../components/ui/Card';
import { AddTaskModal } from '../components/modals/AddTaskModal';
import { SearchableClientDropdown } from '../ui/SearchableClientDropdown';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid text-text-primary dark:text-dark-text-primary";
const formSelectClasses = `${formInputClasses} form-select`;
const formTextareaClasses = `${formInputClasses} h-24`;

const VirtualAssistantDashboard = ({ token }) => {
    const [currentTasks, setCurrentTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isCleanerModalVisible, setIsCleanerModalVisible] = useState(false);
    const [cleanerState, setCleanerState] = useState({ inputText: '', cleanedText: '', isLoading: false });
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
    const [emailState, setEmailState] = useState({ recipient: '', subject: '', prompt: '', generatedBody: '', isLoading: false, sendStatus: '', selectedClientId: null, isNewClient: false, newClientName: '' });
    const [isMeetingModalVisible, setIsMeetingModalVisible] = useState(false);
    const [meetingState, setMeetingState] = useState({ title: '', date: '', startTime: '', endTime: '', description: '' });
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
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/crm/clients`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) {
                setClients(await response.json());
            }
        } catch (error) { console.error("Failed to fetch clients for VA:", error); }
    }, [token]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        if (isEmailModalVisible) {
            fetchClients();
        }
    }, [isEmailModalVisible, fetchClients]);
    
    const toggleTask = async (taskToToggle) => {
        const updatedTask = {
            ...taskToToggle,
            status: taskToToggle.status === 'complete' ? 'incomplete' : 'complete',
            due_date: taskToToggle.due_date ? new Date(taskToToggle.due_date).toISOString() : null
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



    const handleGenerateEmail = async () => {
        if (!emailState.prompt.trim()) return;
        setEmailState(prev => ({ ...prev, isLoading: true, generatedBody: '' }));
        
        let clientName = '';
        if(emailState.selectedClientId) {
            const client = clients.find(c => c.id === emailState.selectedClientId);
            clientName = client?.name;
        } else if (emailState.isNewClient) {
            clientName = emailState.newClientName;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/draft-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ prompt: emailState.prompt, clientName })
            });
            if (!response.ok) { const err = await response.json(); throw new Error(err.message); }
            const result = await response.json();
            setEmailState(prev => ({ ...prev, generatedBody: result.emailBody, isLoading: false }));
        } catch (error) {
            console.error("Error drafting email:", error);
            setEmailState(prev => ({ ...prev, generatedBody: `Error: ${error.message}`, isLoading: false }));
        }
    };

    const handleSendEmail = async () => {
        setEmailState(prev => ({ ...prev, sendStatus: 'Sending...', isLoading: true }));
        try {
            const body = {
                recipientEmail: emailState.recipient,
                subject: emailState.subject,
                body: emailState.generatedBody,
                clientId: emailState.selectedClientId,
                newClientName: emailState.isNewClient ? emailState.newClientName : null,
            };
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(body)
            });
            if (!response.ok) { const err = await response.json(); throw new Error(err.message); }
            setEmailState(prev => ({ ...prev, sendStatus: 'Email sent successfully!', isLoading: false }));
            setTimeout(() => {
                setIsEmailModalVisible(false);
                setEmailState({ recipient: '', subject: '', prompt: '', generatedBody: '', isLoading: false, sendStatus: '', selectedClientId: null, isNewClient: false, newClientName: '' });
            }, 2000);
        } catch (error) {
            console.error("Error sending email:", error);
            setEmailState(prev => ({ ...prev, sendStatus: `Error: ${error.message}`, isLoading: false }));
        }
    };
    
    // ➡️ NEW: Function to generate and download an .ics calendar file
    const handleCreateMeetingFile = (e) => {
        e.preventDefault();
        const { title, date, startTime, endTime, description } = meetingState;
        if (!title || !date || !startTime || !endTime) {
            alert('Please fill in all required fields.');
            return;
        }

        const formatDateTime = (dateStr, timeStr) => {
            const dt = new Date(`${dateStr}T${timeStr}`);
            return dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const startDate = formatDateTime(date, startTime);
        const endDate = formatDateTime(date, endTime);

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Entrai.ai//EN',
            'BEGIN:VEVENT',
            `UID:${Date.now()}@entrai.ai`,
            `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'}`,
            `DTSTART:${startDate}`,
            `DTEND:${endDate}`,
            `SUMMARY:${title}`,
            `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title.replace(/ /g, '_')}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsMeetingModalVisible(false);
        setMeetingState({ title: '', date: '', startTime: '', endTime: '', description: '' });
    };

        

        // ➡️ NEW: AI-Enhanced Meeting Email Generation
    const handleGenerateMeetingEmail = async () => {
        const { title, date, startTime, endTime, description } = meetingState;
        if (!title || !date || !startTime) return;
        const prompt = `Draft a professional meeting invitation email. The meeting is titled "${title}", scheduled for ${date} from ${startTime} to ${endTime}. Additional details: ${description}`;
        setMeetingState(p => ({ ...p, isLoading: true }));
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/draft-email`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ prompt }) });
            if (!response.ok) { const err = await response.json(); throw new Error(err.message); }
            const result = await response.json();
            setMeetingState(p => ({ ...p, generatedEmail: result.emailBody, isLoading: false }));
        } catch (error) {
            console.error("Error drafting meeting email:", error);
            setMeetingState(p => ({ ...p, generatedEmail: `Error: ${error.message}`, isLoading: false }));
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
        return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-accent-start" size={32} /></div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold">Virtual Assistant</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Your AI-powered command center for productivity.</p>
            </header>

                 {isAddTaskModalOpen && <AddTaskModal token={token} onClose={() => setIsAddTaskModalOpen(false)} onTaskAdded={fetchTasks} />}
            
            {isCleanerModalVisible && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2"><Wand2 size={24} className="text-accent-start dark:text-dark-accent-mid"/> Text Cleaner & Formatter</h2>
                            <button onClick={() => setIsCleanerModalVisible(false)}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                        </div>
                         <div className="space-y-4">
                            <textarea placeholder="Paste messy text here..." value={cleanerState.inputText} onChange={(e) => setCleanerState(prev => ({ ...prev, inputText: e.target.value }))} rows="10" className={formTextareaClasses}/>
                            <button onClick={handleCleanText} disabled={cleanerState.isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold flex items-center justify-center hover:opacity-90">
                                {cleanerState.isLoading ? <Loader2 className="animate-spin" /> : 'Clean Up Text'}
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
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full">
                        <div className="text-center">
                            {deleteMessage ? (
                                <>
                                    <CheckSquare size={48} className="mx-auto text-green-500 mb-4" />
                                    <p className="text-green-500 text-lg">{deleteMessage}</p>
                                </>
                            ) : (
                                <>
                                    <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
                                    <h2 className="text-xl font-semibold mb-2">Are you sure?</h2>
                                    <p className="text-text-secondary dark:text-dark-text-secondary mb-6">Do you really want to delete this task? It will be moved to the trash.</p>
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => setIsDeleteModalVisible(false)} className="px-6 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold">Cancel</button>
                                        <button onClick={confirmDeleteTask} className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold">Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {isEmailModalVisible && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-2xl w-full">
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2"><Wand2 size={24} className="text-accent-start dark:text-dark-accent-mid"/> Draft an Email</h2>
                            <button onClick={() => setIsEmailModalVisible(false)}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-center mb-4">
                                <button onClick={() => setEmailState(p => ({...p, isNewClient: false}))} className={`px-4 py-2 text-sm font-semibold rounded-l-lg transition-all ${!emailState.isNewClient ? 'bg-gradient-to-r from-accent-start to-accent-end text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700'}`}><Users size={16} className="inline-block mr-2"/>Existing Client</button>
                                <button onClick={() => setEmailState(p => ({...p, isNewClient: true, selectedClientId: null}))} className={`px-4 py-2 text-sm font-semibold rounded-r-lg transition-all ${emailState.isNewClient ? 'bg-gradient-to-r from-accent-start to-accent-end text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700'}`}><UserPlus size={16} className="inline-block mr-2"/>New Client</button>
                            </div>

                            {emailState.isNewClient ? (
                                <div className='flex gap-4'>
                                    <input type="text" placeholder="New Client Name" value={emailState.newClientName} onChange={(e) => setEmailState(p => ({...p, newClientName: e.target.value}))} className="form-input w-full"/>
                                    <input type="email" placeholder="Recipient's Email" value={emailState.recipient} onChange={(e) => setEmailState(p => ({...p, recipient: e.target.value}))} className="form-input w-full"/>
                                </div>
                            ) : (
                                <SearchableClientDropdown clients={clients} selectedClientId={emailState.selectedClientId} onSelect={(id) => { const client = clients.find(c=>c.id === id); setEmailState(p => ({...p, selectedClientId: id, recipient: client.email})) }} />
                            )}
                            
                            <input type="text" placeholder="Subject" value={emailState.subject} onChange={(e) => setEmailState(p => ({...p, subject: e.target.value}))} className="form-input w-full"/>
                            <textarea placeholder="Tell the AI what this email is about..." value={emailState.prompt} onChange={(e) => setEmailState(p => ({...p, prompt: e.target.value}))} rows="3" className="form-textarea w-full"/>
                            <button onClick={handleGenerateEmail} disabled={emailState.isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                                {emailState.isLoading ? <Loader2 className="animate-spin" /> : 'Generate Draft'}
                            </button>
                            {emailState.generatedBody && (
                                <>
                                    <textarea value={emailState.generatedBody} onChange={(e) => setEmailState(p => ({...p, generatedBody: e.target.value}))} rows="8" className="form-textarea w-full" />
                                    <button onClick={handleSendEmail} disabled={emailState.isLoading} className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors flex items-center justify-center disabled:opacity-50">
                                        {emailState.isLoading && emailState.sendStatus ? <Loader2 className="animate-spin" /> : 'Send Email'}
                                    </button>
                                </>
                            )}
                            {emailState.sendStatus && <p className="text-center text-sm mt-2">{emailState.sendStatus}</p>}
                        </div>
                    </Card>
                </div>
            )}

            {isMeetingModalVisible && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2"><Calendar size={24} className="text-accent-start dark:text-dark-accent-mid"/> Schedule a Meeting</h2>
                            <button onClick={() => setIsMeetingModalVisible(false)}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                        </div>
                        <form onSubmit={handleCreateMeetingFile} className="space-y-4">
                            <input type="text" placeholder="Meeting Title" value={meetingState.title} onChange={(e) => setMeetingState(p => ({...p, title: e.target.value}))} className={formSelectClasses} required />
                            <div className="flex gap-4">
                                <input type="date" value={meetingState.date} onChange={(e) => setMeetingState(p => ({...p, date: e.target.value}))} className={formSelectClasses} required />
                                <input type="time" value={meetingState.startTime} onChange={(e) => setMeetingState(p => ({...p, startTime: e.target.value}))} className={formSelectClasses} required />
                                <input type="time" value={meetingState.endTime} onChange={(e) => setMeetingState(p => ({...p, endTime: e.target.value}))} className={formSelectClasses} required />
                            </div>
                            <textarea placeholder="Description or Notes..." value={meetingState.description} onChange={(e) => setMeetingState(p => ({...p, description: e.target.value}))} rows="4" className={formTextareaClasses} />
                            {meetingState.generatedEmail ? (
                                <textarea value={meetingState.generatedEmail} onChange={(e) => setMeetingState(p => ({...p, generatedEmail: e.target.value}))} rows="6" className={formTextareaClasses} />
                            ) : (
                                <button type="button" onClick={handleGenerateMeetingEmail} disabled={meetingState.isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-2 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                                    {meetingState.isLoading ? <Loader2 className="animate-spin" /> : <><Wand2 size={16} className="mr-2"/> Generate Invitation Email</>}
                                </button>
                            )}
                            <button type="submit" className="w-full border-2 border-accent-start dark:border-dark-accent-mid text-accent-start dark:text-dark-accent-mid px-6 py-3 rounded-lg font-semibold hover:bg-accent-start/10 dark:hover:bg-dark-accent-mid/10 transition-colors">Create & Download Event File</button>
                        </form>
                    </Card>
                </div>
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