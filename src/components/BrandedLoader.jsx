/* eslint-disable no-irregular-whitespace */
import React from 'react';
import AnimatedLogo from './AnimatedLogo';

const BrandedLoader = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-card-bg dark:bg-dark-card-bg rounded-lg shadow-lg">
            <div className="relative w-20 h-20 mb-4">
                <div className="absolute inset-0 border-2 border-transparent border-t-accent-start dark:border-t-dark-accent-mid rounded-full animate-spin-slow"></div>
                <div className="absolute inset-2 flex items-center justify-center">
                    <AnimatedLogo isCollapsed={true} />
                </div>
            </div>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{text}</p>
        </div>
    );
};

export default BrandedLoader;