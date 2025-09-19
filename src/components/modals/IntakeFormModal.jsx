import React, { useState } from 'react';
import { XCircle, Loader2, Plus, Trash2, Copy, Check } from 'lucide-react';
import Card from '../ui/Card';


const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid text-text-primary dark:text-dark-text-primary";


export const IntakeFormModal = ({ initialForm, onClose, onSave }) => {
    const [form, setForm] = useState(initialForm || { questions: [{ text: 'What are your primary goals for this project?' }] });
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...form.questions];
        newQuestions[index] = { ...newQuestions[index], text: value };
        setForm({ ...form, questions: newQuestions });
    };

    const addQuestion = () => {
        setForm({ ...form, questions: [...form.questions, { text: '' }] });
    };

    const removeQuestion = (index) => {
        const newQuestions = form.questions.filter((_, i) => i !== index);
        setForm({ ...form, questions: newQuestions });
    };

    const handleSave = async () => {
        setIsLoading(true);
        await onSave(form.questions);
        setIsLoading(false);
        onClose();
    };
    
    const copyLinkToClipboard = () => {
        const formUrl = `${window.location.origin}/form/${form.id}`;
        navigator.clipboard.writeText(formUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <Card className="max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Client Intake Form Builder</h2>
                    <button onClick={onClose}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                </div>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {form.questions.map((q, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder={`Question ${index + 1}`}
                                value={q.text}
                                onChange={(e) => handleQuestionChange(index, e.target.value)}
                                className={formInputClasses}
                            />
                            <button onClick={() => removeQuestion(index)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    <button onClick={addQuestion} className="w-full text-sm font-semibold text-accent-start dark:text-dark-accent-mid hover:opacity-80 flex items-center gap-2">
                        <Plus size={16} /> Add Question
                    </button>
                </div>

                <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
                    {form.id && (
                        <div className="space-y-2">
                             <label className="text-sm font-semibold">Your Shareable Form Link:</label>
                             <div className="flex items-center gap-2">
                                 <input type="text" readOnly value={`${window.location.origin}/form/${form.id}`} className={`${formInputClasses} text-text-secondary dark:text-dark-text-secondary`} />
                                 <button onClick={copyLinkToClipboard} className="bg-slate-200 dark:bg-slate-700 px-4 py-3 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-2">
                                     {isCopied ? <Check size={16} className="text-green-500"/> : <Copy size={16} />}
                                 </button>
                             </div>
                         </div>
                     )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary px-4 py-2 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600">Close</button>
                    <button onClick={handleSave} disabled={isLoading} className="bg-gradient-to-r from-accent-start to-accent-end text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-50">
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Save Form'}
                    </button>
                </div>
            </Card>
        </div>
    );
};