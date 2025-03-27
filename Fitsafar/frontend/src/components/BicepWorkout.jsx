// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";

// const BicepWorkout = () => {
//   const [progress, setProgress] = useState(0);
//   const [isExercising, setIsExercising] = useState(false);

//   const handleStart = () => {
//     setIsExercising(true);
//     setProgress(0);
//     simulateExercise();
//   };

//   const handleStop = () => {
//     setIsExercising(false);
//     setProgress(0);
//   };

//   const simulateExercise = () => {
//     let interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           return 100;
//         }
//         return prev + 5;
//       });
//     }, 500);
//   };

//   const breathingAnimation = {
//     scale: [1, 1.05, 1],
//     opacity: [1, 0.8, 1],
//     transition: { duration: 1.5, repeat: Infinity },
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
//       <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
//         <h2 className="text-2xl font-bold text-center mb-4">Bicep Workout</h2>
//         <Progress value={progress} className="mb-4" />

//         <motion.div
//           className="w-40 h-40 bg-blue-500 rounded-full mx-auto flex justify-center items-center"
//           animate={isExercising ? breathingAnimation : { scale: 1, opacity: 1 }}
//         >
//           <p className="text-white text-lg font-semibold">{isExercising ? "Keep Going!" : "Start Workout"}</p>
//         </motion.div>

//         <div className="mt-6 flex justify-around">
//           <Button
//             onClick={handleStart}
//             disabled={isExercising}
//             className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
//           >
//             Start
//           </Button>
//           <Button
//             onClick={handleStop}
//             disabled={!isExercising}
//             className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
//           >
//             Stop
//           </Button>
//         </div>

//         <p className="text-sm text-gray-500 text-center mt-4">
//           Progress: {progress}%
//         </p>
//       </div>
//     </div>
//   );
// };

// export default BicepWorkout;