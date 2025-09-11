// src/pages/public/CareersPage.jsx

import React from 'react';
import PublicLayout from './PublicLayout';
import Card from '../../components/ui/Card';

const JobCard = ({ title, location }) => (
    <Card className="flex items-center justify-between">
        <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-text-secondary dark:text-dark-text-secondary">{location}</p>
        </div>
        <button className="bg-gradient-to-r from-accent-start to-accent-end text-white font-semibold px-5 py-2 rounded-lg transition hover:opacity-90">
            Apply Now
        </button>
    </Card>
);

const CareersPage = ({ setActiveView, onLaunchApp, onStartTrial }) => {
    const openRoles = [
        { title: 'Frontend Developer', location: 'Remote' },
        { title: 'Marketing Associate', location: 'Remote' },
        { title: 'Customer Success Lead', location: 'Remote' }
    ];
    return (
        <PublicLayout activeView="Careers" setActiveView={setActiveView} onLaunchApp={onLaunchApp} onStartTrial={onStartTrial}>
            <div className="container mx-auto px-5 py-20 max-w-4xl text-center">
                <h1 className="text-4xl md:text-6xl font-bold">Join us in building the future of work.</h1>
                <p className="mt-6 text-lg md:text-xl text-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
                   Entruvi is on a mission to free entrepreneurs from admin overload. We’re a remote-first, impact-driven, and passionate team looking for innovative thinkers to join us.
                </p>
            </div>

            <div className="container mx-auto px-5 max-w-4xl pb-20">
                <h2 className="text-3xl font-bold mb-8">Open Roles</h2>
                <div className="space-y-6">
                    {openRoles.map(role => <JobCard key={role.title} {...role} />)}
                </div>
            </div>
        </PublicLayout>
    );
};

export default CareersPage;