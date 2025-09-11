// src/pages/public/AboutPage.jsx

import React from 'react';
import PublicLayout from './PublicLayout';
import { Zap, Shield, Heart, Target } from 'lucide-react';
import Card from '../../components/ui/Card';

const AboutPage = ({ setActiveView, onLaunchApp, onStartTrial }) => {
    return (
        <PublicLayout activeView="About" setActiveView={setActiveView} onLaunchApp={onLaunchApp} onStartTrial={onStartTrial}>
            <div className="container mx-auto px-5 py-20 max-w-4xl text-center">
                <h1 className="text-4xl md:text-6xl font-bold">We built Entruvi so entrepreneurs can finally focus on what matters.</h1>
                <p className="mt-6 text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
                    Every entrepreneur knows the struggle: endless admin tasks stealing time from creativity and growth. Entruvi was born from that frustration to solve one problem—to build a single, intelligent platform that manages the busywork for you.
                </p>
            </div>

            <div className="bg-slate-100/50 dark:bg-dark-primary-bg/50 py-20">
                <div className="container mx-auto px-5 max-w-7xl text-center">
                    <h2 className="text-3xl font-bold mb-4">Our Mission & Vision</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">To empower visionaries with self-driving business operations, becoming the virtual COO every founder deserves.</p>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                        <Card><Zap className="mb-2"/> <h3 className="font-bold">Simplicity</h3><p className="text-sm text-text-secondary dark:text-dark-text-secondary">Powerful tools don't have to be complicated.</p></Card>
                        <Card><Heart className="mb-2"/> <h3 className="font-bold">Empowerment</h3><p className="text-sm text-text-secondary dark:text-dark-text-secondary">Give founders their time and focus back.</p></Card>
                        <Card><Target className="mb-2"/> <h3 className="font-bold">Innovation</h3><p className="text-sm text-text-secondary dark:text-dark-text-secondary">Proactively solve problems with smart automation.</p></Card>
                        <Card><Shield className="mb-2"/> <h3 className="font-bold">Trust</h3><p className="text-sm text-text-secondary dark:text-dark-text-secondary">Your business data is sacred and secure.</p></Card>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default AboutPage;