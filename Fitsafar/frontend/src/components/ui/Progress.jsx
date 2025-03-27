// src/components/ui/progress.jsx
import React from "react";

const Progress = ({ value, max = 100, className }) => {
  const percentage = (value / max) * 100;

  return (
    <div className={`w-full bg-gray-300 rounded-lg h-4 ${className}`}>
      <div
        className="h-full bg-green-500 rounded-lg"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// Named export
export { Progress };
