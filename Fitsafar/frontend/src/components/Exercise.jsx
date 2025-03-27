import React from "react";
import { useNavigate } from "react-router-dom";

const ExerciseSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Select Your Exercise</h1>
      <button onClick={() => navigate("/detector")} className="bg-blue-500 text-white px-4 py-2 rounded mb-2">
        Squats
      </button>
      <button onClick={() => navigate("/biceps")} className="bg-green-500 text-white px-4 py-2 rounded">
        Biceps Curl
      </button>
    </div>
  );
};

export default ExerciseSelection;
