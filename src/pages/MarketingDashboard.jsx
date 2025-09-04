// src/pages/MarketingDashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Megaphone, PlusCircle, Wand2, XCircle, Loader2, Copy } from 'lucide-react';
import Card from '../components/ui/Card';

const formInputClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid";
const formSelectClasses = `${formInputClasses} form-select`;
const formTextareaClasses = `${formInputClasses} h-24`;

const MarketingDashboard = ({ token }) => {
    const [summary, setSummary] = useState({ metrics: {}, campaigns: [] });
    const [content, setContent] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCampaignModalVisible, setIsCampaignModalVisible] = useState(false);
    const [newCampaign, setNewCampaign] = useState({ name: '', platform: 'Facebook', ad_spend: '', reach: '', engagement: '', conversions: '', start_date: new Date().toISOString().split('T')[0] });
    const [isContentModalVisible, setIsContentModalVisible] = useState(false);
    const [newContent, setNewContent] = useState({ post_text: '', platform: 'Instagram', status: 'draft', post_date: new Date().toISOString().split('T')[0] });
    const [isAiModalVisible, setIsAiModalVisible] = useState(false);
    const [aiState, setAiState] = useState({ topic: '', tone: 'professional', idea: '', isLoading: false });

    const fetchData = useCallback(async () => {
        if (!token) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const [summaryRes, contentRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/marketing/summary`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/content-calendar`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const summaryData = await summaryRes.json();
            const contentData = await contentRes.json();
            setSummary(summaryData);
            setContent(contentData);
        } catch (error) {
            console.error("Failed to fetch marketing data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleAddCampaign = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/campaigns`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(newCampaign) });
            setIsCampaignModalVisible(false);
            fetchData();
        } catch (error) { console.error("Failed to add campaign:", error); }
    };

    const handleAddContent = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/content-calendar`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(newContent) });
            setIsContentModalVisible(false);
            fetchData();
        } catch (error) { console.error("Failed to add content:", error); }
    };

    const handleGenerateIdea = async () => {
        if (!aiState.topic) return;
        setAiState(p => ({ ...p, isLoading: true, idea: '' }));
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/generate-post-idea`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ topic: aiState.topic, tone: aiState.tone }) });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setAiState(p => ({ ...p, idea: data.postIdea, isLoading: false }));
        } catch (error) {
            console.error("AI generation failed:", error);
            setAiState(p => ({ ...p, idea: `Error: ${error.message}`, isLoading: false }));
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    if (isLoading) { return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-accent-start" size={32} /></div>; }

    return (
        <div className="space-y-8 animate-fade-in">
            {isCampaignModalVisible && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">New Campaign</h2>
                            <button onClick={() => setIsCampaignModalVisible(false)}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                        </div>
                        <form onSubmit={handleAddCampaign} className="space-y-4">
                          <input type="text" placeholder="Campaign Name" onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} className={formInputClasses} required/>
                            <select onChange={e => setNewCampaign({...newCampaign, platform: e.target.value})} className={formSelectClasses}>
                                <option>Facebook</option><option>Instagram</option><option>Google Ads</option><option>LinkedIn</option><option>Other</option>
                            </select>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Ad Spend ($)" onChange={e => setNewCampaign({...newCampaign, ad_spend: e.target.value})} className={formSelectClasses}/>
                                <input type="number" placeholder="Reach" onChange={e => setNewCampaign({...newCampaign, reach: e.target.value})} className={formSelectClasses}/>
                                <input type="number" placeholder="Engagement" onChange={e => setNewCampaign({...newCampaign, engagement: e.target.value})} className={formSelectClasses}/>
                                <input type="number" placeholder="Conversions" onChange={e => setNewCampaign({...newCampaign, conversions: e.target.value})} className={formSelectClasses}/>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold hover:opacity-90">Save Campaign</button>
                        </form>
                    </Card>
                </div>
            )}

            {isContentModalVisible && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">New Content</h2>
                            <button onClick={() => setIsContentModalVisible(false)}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                        </div>
                        <form onSubmit={handleAddContent} className="space-y-4">
                            <textarea placeholder="Post text..." onChange={e => setNewContent({...newContent, post_text: e.target.value})} className={formTextareaClasses} rows="5" required/>
                            <select onChange={e => setNewContent({...newContent, platform: e.target.value})} className={formSelectClasses}>
                                <option>Instagram</option>
                                <option>Facebook</option>
                                <option>LinkedIn</option>
                                <option>Blog</option>
                            </select>
                            <input type="date" defaultValue={new Date().toISOString().split('T')[0]} onChange={e => setNewContent({...newContent, post_date: e.target.value})} className={formSelectClasses} required/>
                            <button type="submit" className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold hover:opacity-90">Save to Calendar</button>
                        </form>
                    </Card>
                </div>
            )}

            {isAiModalVisible && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2"><Wand2 className="text-accent-start dark:text-dark-accent-mid"/> Generate Post Caption</h2>
                            <button onClick={() => setIsAiModalVisible(false)}><XCircle className="text-text-secondary dark:text-dark-text-secondary hover:opacity-70"/></button>
                        </div>
                        <div className="space-y-4">
                            <textarea placeholder="What is the post about?" onChange={e => setAiState({...aiState, topic: e.target.value})} rows="3" className={formTextareaClasses}/>
                            <select onChange={e => setAiState({...aiState, tone: e.target.value})} className={formSelectClasses}>
                                <option value="professional">Professional</option>
                                <option value="casual">Casual</option>
                                <option value="salesy">Salesy</option>
                                <option value="witty">Witty</option>
                            </select>
                            <button onClick={handleGenerateIdea} disabled={aiState.isLoading} className="w-full bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white py-3 rounded-lg font-semibold flex items-center justify-center hover:opacity-90 disabled:opacity-50">
                                {aiState.isLoading ? <Loader2 className="animate-spin"/> : "Generate"}
                            </button>
                            {aiState.idea && 
                                <div className="bg-slate-100 dark:bg-dark-primary-bg p-4 rounded-lg relative">
                                    <p className="whitespace-pre-wrap">{aiState.idea}</p>
                                    <button onClick={() => copyToClipboard(aiState.idea)} className="absolute top-2 right-2 p-1 text-text-secondary dark:text-dark-text-secondary hover:opacity-70"><Copy size={16}/></button>
                                </div>
                            }
                        </div>
                    </Card>
                </div>
            )}

            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Marketing Suite</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Manage campaigns, content, and analytics.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsAiModalVisible(true)} className="bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:to-dark-accent-end text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 flex items-center gap-2">
                        <Wand2 size={16} /> AI Post Idea
                    </button>
                    <button onClick={() => setIsCampaignModalVisible(true)} className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-2">
                        <PlusCircle size={16} /> New Campaign
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><p className="text-text-secondary dark:text-dark-text-secondary text-sm mb-2">Total Reach</p><p className="text-3xl font-bold">{Number(summary.metrics.total_reach).toLocaleString()}</p></Card>
                <Card><p className="text-text-secondary dark:text-dark-text-secondary text-sm mb-2">Engagement Rate</p><p className="text-3xl font-bold">{summary.metrics.engagementRate}%</p></Card>
                <Card><p className="text-text-secondary dark:text-dark-text-secondary text-sm mb-2">Conversions</p><p className="text-3xl font-bold">{Number(summary.metrics.total_conversions).toLocaleString()}</p></Card>
                <Card><p className="text-text-secondary dark:text-dark-text-secondary text-sm mb-2">Ad Spend</p><p className="text-3xl font-bold">${Number(summary.metrics.total_ad_spend).toLocaleString()}</p></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <Card>
                        <h2 className="text-xl font-semibold mb-4">Campaign Performance</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={summary.campaigns}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                                <XAxis dataKey="name" stroke="currentColor" className="text-xs text-text-secondary dark:text-dark-text-secondary" />
                                <YAxis yAxisId="left" orientation="left" stroke="#4A90E2" className="text-xs text-text-secondary dark:text-dark-text-secondary" />
                                <YAxis yAxisId="right" orientation="right" stroke="#00F2A9" className="text-xs text-text-secondary dark:text-dark-text-secondary" />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg, #FFFFFF)', border: '1px solid #e2e8f0' }} itemStyle={{ color: 'var(--text-primary, #1E2022)' }}/>
                                <Legend wrapperStyle={{fontSize: "0.875rem"}}/>
                                <Bar yAxisId="left" dataKey="engagement" fill="#9013FE" name="Engagement" />
                                <Bar yAxisId="right" dataKey="reach" fill="#4A90E2" name="Reach" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Content Calendar</h2>
                            <button onClick={() => setIsContentModalVisible(true)} className="bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-dark-text-primary px-3 py-1 rounded-lg text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center gap-1">
                                <PlusCircle size={14} /> Add Content
                            </button>
                        </div>
                        <div className="space-y-4">
                            {content.slice(0, 3).map(item => (
                                <div key={item.id} className="flex items-start">
                                    <div className="bg-slate-100 dark:bg-dark-primary-bg p-3 rounded-lg mr-4 text-center">
                                        <p className="text-accent-start dark:text-dark-accent-start font-bold text-sm">{new Date(item.post_date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</p>
                                        <p className="text-lg font-bold">{new Date(item.post_date).getDate()}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">{item.post_text}</p>
                                        <p className="text-text-secondary dark:text-dark-text-secondary text-sm">{item.platform} - <span className="capitalize">{item.status}</span></p>
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

export default MarketingDashboard;