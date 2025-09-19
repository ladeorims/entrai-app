// src/components/LegalDocumentModal.jsx
import React from 'react';
import { X } from 'lucide-react';

const LegalDocumentModal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-card-bg dark:bg-dark-card-bg rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-text-secondary dark:text-dark-text-secondary hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto text-text-secondary dark:text-dark-text-secondary custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-right">
          <button
            onClick={onClose}
            className="bg-accent-start dark:bg-dark-accent-mid text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalDocumentModal;