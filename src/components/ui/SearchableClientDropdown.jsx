/* eslint-disable no-irregular-whitespace */
// src/components/ui/SearchableClientDropdown.jsx

import React, { useState, useEffect, useRef } from 'react';

const formSelectClasses = "w-full bg-slate-100 dark:bg-dark-primary-bg border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-start dark:focus:ring-dark-accent-mid text-text-primary dark:text-dark-text-primary text-left";

export const SearchableClientDropdown = ({ clients, selectedClientId, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const getSelectedClientName = () => {
        if (!selectedClientId) return 'Select a Client';
        const selectedClient = clients.find(c => c.id === selectedClientId);
        return selectedClient ? selectedClient.name : 'Select a Client';
    };

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className={formSelectClasses}>
                {getSelectedClientName()}
            </button>
            {isOpen && (
                <div className="absolute top-full mt-1 w-full bg-card-bg dark:bg-dark-card-bg border border-slate-200 dark:border-slate-700 rounded-lg z-50 shadow-lg">
                    <input type="text" placeholder="Search clients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 border-b border-slate-200 dark:border-slate-700 focus:outline-none bg-transparent" />
                    <ul className="max-h-60 overflow-y-auto">
                        {filteredClients.map(client => (
                            <li key={client.id} onClick={() => { onSelect(client.id); setIsOpen(false); setSearchTerm(''); }} className="p-3 hover:bg-slate-100 dark:hover:bg-dark-primary-bg cursor-pointer">
                                {client.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// export default SearchableClientDropdown;