// src/components/crm/TimelineItem.jsx
import React from 'react';
import { DollarSign, FileText, StickyNote, Mail } from 'lucide-react';

const TimelineItem = ({ item }) => {
    const renderIcon = () => {
        switch (item.type) {
            case 'deal': return <DollarSign size={16} className="text-blue-500" />;
            case 'invoice': return <FileText size={16} className="text-green-500" />;
            case 'note': return <StickyNote size={16} className="text-yellow-500" />;
            case 'sent_email': return <Mail size={16} className="text-purple-500" />;
            default: return <StickyNote size={16} />;
        }
    };

    const renderContent = () => {
        switch (item.type) {
            case 'deal':
                return <p><strong>Deal:</strong> {item.name} - Stage changed to <span className="font-semibold">{item.stage}</span> for <span className="font-semibold">${Number(item.value).toLocaleString()}</span>.</p>;
            case 'invoice':
                return <p><strong>Invoice:</strong> {item.invoice_number} - Status updated to <span className="font-semibold capitalize">{item.status}</span> for <span className="font-semibold">${Number(item.total_amount).toLocaleString()}</span>.</p>;
            case 'note':
                return <div><p className="font-semibold">Note added to deal "{item.deal_name}":</p><p className="whitespace-pre-wrap mt-1">{item.note}</p></div>;
            case 'sent_email':
                return <div><p className="font-semibold">Email sent:</p><p className="whitespace-pre-wrap mt-1 text-sm">{item.content}</p></div>;
            default:
                return <p>{item.content}</p>;
        }
    };

    return (
        <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
                <div className="bg-slate-100 dark:bg-dark-primary-bg rounded-full p-2">
                    {renderIcon()}
                </div>
                <div className="w-px flex-grow bg-slate-200 dark:bg-slate-700 my-2"></div>
            </div>
            <div className="flex-1 pb-8">
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary mb-1">
                    {new Date(item.created_at).toLocaleString()}
                </p>
                <div className="p-3 bg-slate-100/50 dark:bg-dark-primary-bg/50 rounded-lg text-sm">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default TimelineItem;