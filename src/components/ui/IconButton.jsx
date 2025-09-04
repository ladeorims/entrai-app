import React from 'react';
// eslint-disable-next-line no-unused-vars
const IconButton = ({ icon: Icon, className = '', ...props }) => (
  <button className={`p-2 rounded-full hover:bg-purple-500/20 text-gray-300 hover:text-white transition-all duration-300 ${className}`} {...props}>
    <Icon size={20} />
  </button>
);

export default IconButton;