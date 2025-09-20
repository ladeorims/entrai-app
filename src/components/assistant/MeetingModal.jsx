// src/components/assistant/MeetingModal.jsx
import React, { useState } from 'react';
import Card from '../ui/Card';
import { useAuth } from '../../AuthContext';
import BrandedLoader from '../BrandedLoader';
import { XCircle, Calendar, Wand2, Download, Send } from 'lucide-react';
import { SearchableClientDropdown } from '../ui/SearchableClientDropdown';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";
const formTextareaClasses = `${formInputClasses} h-24`;
const formSelectClasses = `${formInputClasses} form-select`;

const MeetingModal = ({ onClose, clients }) => {
    const { token } = useAuth();
    const [meetingState, setMeetingState] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        description: '',
        generatedEmail: '',
        isLoading: false,
        sendStatus: '',
        selectedClient: null,
    });

    const handleGenerateMeetingEmail = async () => {
        const { title, date, startTime, endTime, description } = meetingState;
        if (!title || !date || !startTime) {
            setMeetingState(p => ({ ...p, generatedEmail: 'Please fill in meeting title, date, and start time.' }));
            return;
        }
        
        setMeetingState(p => ({ ...p, isLoading: true, generatedEmail: '' }));

        const prompt = `Draft a professional meeting invitation email. The meeting is titled "${title}", scheduled for ${date} from ${startTime} to ${endTime}. Additional details: ${description}`;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/draft-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ prompt, clientName: meetingState.selectedClient?.name })
            });
            if (!response.ok) { const err = await response.json(); throw new Error(err.message); }
            const result = await response.json();
            setMeetingState(p => ({ ...p, generatedEmail: result.emailBody, isLoading: false }));
        } catch (error) {
            console.error("Error drafting meeting email:", error);
            setMeetingState(p => ({ ...p, generatedEmail: `Error: ${error.message}`, isLoading: false }));
        }
    };

    const handleCreateMeetingFile = (e) => {
        e.preventDefault();
        const { title, date, startTime, endTime, description } = meetingState;

        const formatDateTime = (dateStr, timeStr) => {
            const dt = new Date(`${dateStr}T${timeStr}`);
            return dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const startDate = formatDateTime(date, startTime);
        const endDate = formatDateTime(date, endTime);

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Entruvi.ai//EN',
            'BEGIN:VEVENT',
            `UID:${Date.now()}@Entruvi.ai`,
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
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2"><Calendar size={24} className="text-accent-start dark:text-dark-accent-mid"/> Schedule a Meeting</h2>
                    <button onClick={onClose}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                </div>
                <form onSubmit={handleCreateMeetingFile} className="space-y-4">
                    <input type="text" placeholder="Meeting Title" value={meetingState.title} onChange={(e) => setMeetingState(p => ({...p, title: e.target.value}))} className={formInputClasses} required />
                    <SearchableClientDropdown 
                        clients={clients} 
                        selectedClientId={meetingState.selectedClient?.id} 
                        onSelect={(id) => { 
                            const client = clients.find(c => c.id === id); 
                            setMeetingState(p => ({...p, selectedClient: client}));
                        }} 
                    />
                    <div className="flex gap-4">
                        <input type="date" value={meetingState.date} onChange={(e) => setMeetingState(p => ({...p, date: e.target.value}))} className={formSelectClasses} required />
                        <input type="time" value={meetingState.startTime} onChange={(e) => setMeetingState(p => ({...p, startTime: e.target.value}))} className={formSelectClasses} required />
                        <input type="time" value={meetingState.endTime} onChange={(e) => setMeetingState(p => ({...p, endTime: e.target.value}))} className={formSelectClasses} required />
                    </div>
                    <textarea placeholder="Description or Notes..." value={meetingState.description} onChange={(e) => setMeetingState(p => ({...p, description: e.target.value}))} rows="4" className={formTextareaClasses} />
                    
                    {meetingState.generatedEmail ? (
                        <>
                            <textarea value={meetingState.generatedEmail} onChange={(e) => setMeetingState(p => ({...p, generatedEmail: e.target.value}))} rows="6" className={formTextareaClasses} />
                            <button type="button" onClick={() => { /* Send email logic here */ }} className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-500 transition-colors flex items-center justify-center disabled:opacity-50">
                                <Mail size={16} className="mr-2"/> Send Invitation
                            </button>
                        </>
                    ) : (
                        <button type="button" onClick={handleGenerateMeetingEmail} disabled={meetingState.isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-2 rounded-lg font-semibold hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                            {meetingState.isLoading ? <BrandedLoader text="Generating..." /> : <><Wand2 size={16} className="mr-2"/> Generate Invitation Email</>}
                        </button>
                    )}
                    <button type="submit" className="w-full border-2 border-accent-start dark:border-dark-accent-mid text-accent-start dark:text-dark-accent-mid px-6 py-3 rounded-lg font-semibold hover:bg-accent-start/10 dark:hover:bg-dark-accent-mid/10 transition-colors">Create & Download Event File</button>
                </form>
            </Card>
        </div>
    );
};

export default MeetingModal;