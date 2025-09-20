// src/components/sales/SmartPromptModal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Card from '../ui/Card';

const SmartPromptModal = ({ deal, actions, onAction, onClose, successMessage }) => {
    const navigate = useNavigate();
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end rounded-full flex items-center justify-center">
                        <Sparkles size={32} className="text-white" />
                    </div>
                </div>
                
                {successMessage ? (
                    <div>
                        <h2 className="text-xl font-bold mb-2 text-green-500">Success!</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary mb-6">{successMessage.text}</p>
                        <button onClick={() => { navigate(`/${successMessage.view.toLowerCase().replace(' ', '-')}`); onClose(); }} className="w-full bg-slate-100 dark:bg-dark-primary-bg hover:bg-slate-200 dark:hover:bg-slate-800 p-3 rounded-lg font-semibold">
                           {successMessage.buttonLabel}
                        </button>
                        <button onClick={onClose} className="mt-4 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary hover:opacity-80">
                            Close
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Deal Won! What's next?</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary mb-6">You've closed the deal for <span className="font-semibold text-text-primary dark:text-dark-text-primary">{deal.name}</span>. Let's keep the momentum going.</p>
                        <div className="space-y-3">
                            {actions.map(action => (
                                <button key={action.type} onClick={() => onAction(action.type, deal)} className="w-full bg-slate-100 dark:bg-dark-primary-bg hover:bg-slate-200 dark:hover:bg-slate-800 p-3 rounded-lg font-semibold text-left">
                                   {action.label}
                                </button>
                            ))}
                        </div>
                        <button onClick={onClose} className="mt-6 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary hover:opacity-80">
                            I'll do this later
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default SmartPromptModal;