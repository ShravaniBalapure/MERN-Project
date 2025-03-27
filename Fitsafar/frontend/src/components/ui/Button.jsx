// src/components/ui/button.jsx
import React from "react";

const Button = ({ children, onClick, className = "", disabled = false }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-gray-400 ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export { Button };  // Named export for 'Button'
