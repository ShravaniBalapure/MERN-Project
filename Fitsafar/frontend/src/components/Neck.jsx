import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

const NeckExerciseTracker = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [feedback, setFeedback] = useState("Initializing...");
  const [targetReps, setTargetReps] = useState(5);
  const [currentReps, setCurrentReps] = useState(0);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [movementState, setMovementState] = useState(null);
  const [baseNoseX, setBaseNoseX] = useState(null);
  const moveThreshold = 25;
  const delay = 4000;

  useEffect(() => {
    const loadModel = async () => {
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet
      );
      detectPose(detector);
    };

    const detectPose = async (detector) => {
      if (webcamRef.current?.video.readyState === 4) {
        const video = webcamRef.current.video;
        adjustCanvasSize();
        const poses = await detector.estimatePoses(video);

        if (poses.length > 0) {
          trackNeckMovement(poses[0]);
          drawPose(poses[0]);
        }
      }
      requestAnimationFrame(() => detectPose(detector));
    };

    loadModel();
  }, [exerciseStarted, targetReps, currentReps]);

  const adjustCanvasSize = () => {
    if (webcamRef.current && canvasRef.current) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  };

  const trackNeckMovement = (pose) => {
    if (!pose || !pose.keypoints) return;

    const nose = pose.keypoints.find((p) => p.name === "nose");
    if (!nose) {
      setFeedback("Face not detected. Please adjust your position.");
      return;
    }

    if (!baseNoseX) setBaseNoseX(nose.x);

    const horizontalShift = nose.x - baseNoseX;

    if (horizontalShift > moveThreshold && movementState !== "right") {
      setMovementState("right");
      setFeedback("Move to center");
      setTimeout(() => setMovementState("center"), delay);
    } else if (horizontalShift < -moveThreshold && movementState !== "left") {
      setMovementState("left");
      setFeedback("Move to center");
      setTimeout(() => setMovementState("center"), delay);
    } else if (movementState === "center") {
      setCurrentReps((prev) => prev + 1);
      setFeedback("Great! Move right again");
      setMovementState(null);
    }
  };

  const drawPose = (pose) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!pose || !pose.keypoints) return;

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    const connections = [
      ["nose", "left_eye"],
      ["nose", "right_eye"],
      ["left_eye", "left_ear"],
      ["right_eye", "right_ear"],
      ["left_shoulder", "right_shoulder"],
      ["left_shoulder", "left_ear"],
      ["right_shoulder", "right_ear"],
    ];

    connections.forEach(([partA, partB]) => {
      const pointA = pose.keypoints.find((p) => p.name === partA);
      const pointB = pose.keypoints.find((p) => p.name === partB);
      if (pointA && pointB && pointA.score > 0.3 && pointB.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(pointA.x, pointA.y);
        ctx.lineTo(pointB.x, pointB.y);
        ctx.stroke();
      }
    });

    ctx.fillStyle = "red";
    pose.keypoints.forEach((point) => {
      if (point.score > 0.3) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Neck Exercise Tracker</h1>
      {!exerciseStarted ? (
        <div className="flex flex-col items-center">
          <label className="text-lg">Enter number of reps:</label>
          <input
            type="number"
            min="1"
            className="border-2 p-2 m-2"
            onChange={(e) => setTargetReps(parseInt(e.target.value))}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setExerciseStarted(true)}
          >
            Start Exercise
          </button>
        </div>
      ) : (
        <div className="relative w-full h-auto">
          <Webcam ref={webcamRef} className="w-full h-auto" />
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
          <p className="text-lg font-semibold mt-4">{feedback}</p>
          <p className="text-lg mt-2">
            Reps Completed: {currentReps} / {targetReps}
          </p>
        </div>
      )}
    </div>
  );
};

export default NeckExerciseTracker;
