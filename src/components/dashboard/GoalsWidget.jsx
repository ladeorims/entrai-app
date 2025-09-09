import React, { useState, useEffect } from 'react';
import { Target, DollarSign, Users, CheckCircle, Edit, Save, XCircle } from 'lucide-react';
import Card from '../ui/Card';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid text-text-primary dark:text-dark-text-primary";

const GoalProgressBar = ({ title, icon, current, goal }) => {
    const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                    {icon}
                    <p className="font-semibold text-sm">{title}</p>
                </div>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                    <span className="font-bold text-text-primary dark:text-dark-text-primary">${Number(current).toLocaleString()}</span> / ${Number(goal).toLocaleString()}
                </p>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div 
                    className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-mid h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export const GoalsWidget = ({ token, dashboardData }) => {
    const [goals, setGoals] = useState({ revenue_goal: 0, new_clients_goal: 0, deals_won_goal: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [editedGoals, setEditedGoals] = useState(goals);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/goals`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setGoals(data);
                    setEditedGoals(data);
                }
            } catch (error) {
                console.error("Failed to fetch goals:", error);
            }
        };
        fetchGoals();
    }, [token]);

    const handleSaveGoals = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/goals`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(editedGoals)
            });
            if (response.ok) {
                const updatedGoals = await response.json();
                setGoals(updatedGoals);
                setIsEditing(false);
            } else {
                console.error("Failed to save goals");
            }
        } catch (error) {
            console.error("Error saving goals:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedGoals(prev => ({ ...prev, [name]: Number(value) || 0 }));
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><Target /> Monthly Goals</h2>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                         <button onClick={handleSaveGoals} className="text-green-500 hover:opacity-70"><Save size={20} /></button>
                         <button onClick={() => { setIsEditing(false); setEditedGoals(goals); }} className="text-red-500 hover:opacity-70"><XCircle size={20} /></button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="text-text-secondary dark:text-dark-text-secondary hover:text-accent-start dark:hover:text-dark-accent-mid"><Edit size={16} /></button>
                )}
            </div>
            
            <div className="space-y-4">
                {isEditing ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <label className="font-semibold text-sm">Revenue Goal ($)</label>
                            <input type="number" name="revenue_goal" value={editedGoals.revenue_goal} onChange={handleChange} className={formInputClasses} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <label className="font-semibold text-sm">New Clients Goal</label>
                            <input type="number" name="new_clients_goal" value={editedGoals.new_clients_goal} onChange={handleChange} className={formInputClasses} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <label className="font-semibold text-sm">Deals Won Goal</label>
                            <input type="number" name="deals_won_goal" value={editedGoals.deals_won_goal} onChange={handleChange} className={formInputClasses} />
                        </div>
                    </>
                ) : (
                    <>
                        <GoalProgressBar 
                            title="Monthly Revenue"
                            icon={<DollarSign size={16} className="text-green-500"/>}
                            current={dashboardData?.metrics.monthlyRevenue || 0}
                            goal={goals.revenue_goal}
                        />
                        <GoalProgressBar 
                            title="New Clients"
                            icon={<Users size={16} className="text-blue-500"/>}
                            current={dashboardData?.metrics.newClientsThisMonth || 0}
                            goal={goals.new_clients_goal}
                        />
                         <GoalProgressBar 
                            title="Deals Won"
                            icon={<CheckCircle size={16} className="text-purple-500"/>}
                            current={dashboardData?.metrics.dealsWonThisMonth || 0}
                            goal={goals.deals_won_goal}
                        />
                    </>
                )}
            </div>
        </Card>
    );
};

// export default GoalsWidget;
