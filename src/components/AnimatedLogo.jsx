// src/components/AnimatedLogo.jsx

import React from 'react';

const AnimatedLogo = ({ isCollapsed = false }) => {
    const svgContent = (
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
        >
            <style>
                {`
                    @keyframes auroraGradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .aurora-logo {
                        fill: url(#logoGradient);
                    }
                    #logoGradient {
                        animation: auroraGradient 8s ease infinite;
                        background: linear-gradient(-45deg, var(--light-start), var(--light-end), var(--dark-start), var(--dark-end));
                        background-size: 400% 400%;
                    }
                    .dark #logoGradient {
                        background: linear-gradient(-45deg, var(--dark-start), var(--dark-mid), var(--dark-end), var(--light-start));
                        background-size: 400% 400%;
                    }
                `}
            </style>
            <defs>
                 <linearGradient id="logoGradient">
                    <stop stopColor="#4A90E2" offset="0%" />
                    <stop stopColor="#9013FE" offset="100%" />
                </linearGradient>
            </defs>
            {/* UPDATED: Bolder SVG path that fills more space */}
            <path
                className="aurora-logo"
                d="M4 4 H 28 V 9 H 4 V 4 M 4 13.5 H 24 V 18.5 H 4 V 13.5 M 4 23 H 28 V 28 H 4 V 23"
            />
        </svg>
    );

    return (
        <div className="flex items-center gap-3" style={{'--light-start': '#4A90E2', '--light-end': '#9013FE', '--dark-start': '#00F2A9', '--dark-mid': '#2D9CDB', '--dark-end': '#9B51E0'}}>
            {/* UPDATED: Increased size from w-8 h-8 to w-10 h-10 */}
            <div className="w-10 h-10 flex-shrink-0">
                {svgContent}
            </div>
            {!isCollapsed && <h1 className="text-2xl font-bold font-logo hero-gradient-text tracking-wider whitespace-nowrap">Entruvi</h1>}
        </div>
    );
};

export default AnimatedLogo;