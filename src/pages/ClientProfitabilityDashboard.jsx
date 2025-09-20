import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import { useAuth } from '../AuthContext';
import Card from '../components/ui/Card';
import BrandedLoader from '../components/BrandedLoader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ClientProfitabilityDashboard = () => {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [metrics, setMetrics] = useState({ topClient: '', highestValue: 0, averageValue: 0 });

    const fetchData = useCallback(async () => {
        if (!token) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/analytics/client-profitability`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch profitability data.');
            
            const result = await response.json();
            setData(result.profitabilityData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const calculateMetrics = useCallback(() => {
        if (data.length > 0) {
            const topClientData = data.reduce((prev, current) => (prev.totalValue > current.totalValue) ? prev : current);
            const totalValue = data.reduce((sum, client) => sum + client.totalValue, 0);
            const averageValue = totalValue / data.length;

            setMetrics({
                topClient: topClientData.name,
                highestValue: topClientData.totalValue,
                averageValue: averageValue,
            });
        }
    }, [data]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        calculateMetrics();
    }, [data, calculateMetrics]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><BrandedLoader /></div>;
    }

    // Determine bar color based on dark mode preference
    const isDarkMode = document.documentElement.classList.contains('dark');
    const barFillColor = isDarkMode ? '#00F2A9' : '#4A90E2';

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold">Client Profitability</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Understand which clients are driving the most value for your business.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg"><TrendingUp className="text-green-500" size={24}/></div>
                    <div>
                        <p className="text-text-secondary dark:text-dark-text-secondary text-sm">Top Client</p>
                        <p className="text-2xl font-bold">{metrics.topClient || 'N/A'}</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg"><DollarSign className="text-blue-500" size={24}/></div>
                    <div>
                        <p className="text-text-secondary dark:text-dark-text-secondary text-sm">Highest Client Value</p>
                        <p className="text-2xl font-bold">${Number(metrics.highestValue).toLocaleString()}</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-lg"><BarChart3 className="text-purple-500" size={24}/></div>
                    <div>
                        <p className="text-text-secondary dark:text-dark-text-secondary text-sm">Average Client Value</p>
                        <p className="text-2xl font-bold">${Math.round(metrics.averageValue).toLocaleString()}</p>
                    </div>
                </Card>
            </div>

            <Card>
                <h2 className="text-xl font-semibold mb-4">Client Value Breakdown</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                        <XAxis type="number" stroke="currentColor" className="text-xs text-text-secondary dark:text-dark-text-secondary" />
                        <YAxis dataKey="name" type="category" width={150} stroke="currentColor" className="text-xs text-text-secondary dark:text-dark-text-secondary" />
                        <Tooltip
                            cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
                            contentStyle={{ 
                                backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF', 
                                border: '1px solid #e2e8f0', 
                                color: isDarkMode ? '#EAEAEA' : '#1E2022'
                            }}
                        />
                        <Legend wrapperStyle={{fontSize: "0.875rem"}} />
                        <Bar dataKey="totalValue" name="Total Revenue" fill={barFillColor} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default ClientProfitabilityDashboard;