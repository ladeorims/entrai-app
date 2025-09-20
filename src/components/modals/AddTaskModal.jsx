import React, { useState } from 'react';
import Card from '../ui/Card';
import { XCircle, PlusCircle } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import BrandedLoader from '../BrandedLoader';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid text-text-primary dark:text-dark-text-primary";
const formSelectClasses = `${formInputClasses} text-left`;

export const AddTaskModal = ({ onClose, onTaskAdded }) => {
    const { token } = useAuth();
    const [newTask, setNewTask] = useState({ title: '', priority: 'Medium', dueDate: '', is_recurring: false, recurrence_interval: 'Weekly' });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) {
            setErrorMessage('Task title is required.');
            return;
        }
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    ...newTask,
                    dueDate: newTask.dueDate || null
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add task.');
            }
            
            setNewTask({ title: '', priority: 'Medium', dueDate: '', is_recurring: false, recurrence_interval: 'Weekly' });
            onTaskAdded();
            onClose();
        } catch (error) {
            console.error('Error adding task:', error);
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <Card className="max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Add New Task</h2>
                    <button onClick={onClose}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                </div>
                <form onSubmit={handleAddTask} className="space-y-4">
                    <input type="text" placeholder="Task title..." value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className={formInputClasses} required />
                    <div className="flex gap-4">
                        <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})} className={formSelectClasses}>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                        <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className={formInputClasses} />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="is_recurring" checked={newTask.is_recurring} onChange={(e) => setNewTask({...newTask, is_recurring: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-accent-start focus:ring-accent-start"/>
                            <label htmlFor="is_recurring" className="text-sm">Recurring Task</label>
                        </div>
                        {newTask.is_recurring && (
                            <select value={newTask.recurrence_interval} onChange={(e) => setNewTask({...newTask, recurrence_interval: e.target.value})} className={formSelectClasses}>
                                <option>Daily</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                            </select>
                        )}
                    </div>
                    {errorMessage && <p className="text-sm text-red-500 text-center">{errorMessage}</p>}
                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                        {isLoading ? <BrandedLoader text="Adding..." /> : 'Add Task'}
                    </button>
                </form>
            </Card>
        </div>
    );
};