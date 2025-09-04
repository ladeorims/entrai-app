// src/components/layout/NavItem.jsx
import React from 'react';

// eslint-disable-next-line no-unused-vars
const NavItem = ({ icon: Icon, label, view, activeView, isCollapsed, setActiveView }) => {
    const isActive = activeView === view;
    
    const handleClick = () => {
        if (view === 'Logout') {
            setActiveView(); // This is the handleLogout function
        } else {
            setActiveView(view);
        }
    };

    return (
        <li>
            <button
                onClick={handleClick}
                className={`flex items-center w-full h-12 px-4 rounded-lg transition-all duration-200
                    ${isCollapsed ? 'justify-center' : ''}
                    ${isActive 
                        ? 'bg-gradient-to-r from-accent-start to-accent-end dark:from-dark-accent-start dark:via-dark-accent-mid dark:to-dark-accent-end text-white shadow-md' 
                        : 'text-text-secondary dark:text-dark-text-secondary hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
                    }
                `}
            >
                <Icon size={20} />
                {!isCollapsed && <span className="ml-3 font-semibold">{label}</span>}
            </button>
        </li>
    );
};

export default NavItem;