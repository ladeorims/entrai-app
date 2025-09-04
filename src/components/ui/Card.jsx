// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`
        bg-card-bg dark:bg-dark-card-bg 
        border border-slate-200/80 dark:border-slate-800
        rounded-xl shadow-sm 
        p-6 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;