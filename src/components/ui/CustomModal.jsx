import React from 'react';
import { XCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Card from './Card';

const CustomModal = ({
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'info', // Can be 'info', 'success', 'warning', 'confirm'
}) => {
    const isConfirmModal = type === 'confirm';
    
    let icon, headerColor;
    switch (type) {
        case 'success':
            icon = <CheckCircle size={48} className="text-green-500" />;
            headerColor = 'text-green-500';
            break;
        case 'warning':
        case 'confirm':
            icon = <AlertTriangle size={48} className="text-yellow-500" />;
            headerColor = 'text-yellow-500';
            break;
        case 'error':
            icon = <XCircle size={48} className="text-red-500" />;
            headerColor = 'text-red-500';
            break;
        default:
            icon = <Info size={48} className="text-blue-500" />;
            headerColor = 'text-blue-500';
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <Card className="max-w-sm w-full text-center">
                <div className="flex flex-col items-center">
                    {icon}
                    <h3 className={`text-2xl font-bold mt-4 ${headerColor}`}>{title}</h3>
                    <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">{message}</p>
                </div>
                
                <div className={`mt-6 flex gap-3 ${isConfirmModal ? 'justify-end' : 'justify-center'}`}>
                    {isConfirmModal && (
                        <button onClick={onClose} className="px-6 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold">
                            {cancelText}
                        </button>
                    )}
                    <button onClick={onConfirm} className={`px-6 py-2 rounded-lg font-semibold text-white ${isConfirmModal ? 'bg-red-500 hover:bg-red-600' : 'bg-accent-start hover:bg-accent-end'}`}>
                        {confirmText}
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default CustomModal;