import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

const SitUpCounter = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [counter, setCounter] = useState(0);
  const [stage, setStage] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
      const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
      setDetector(detector);
    };
    loadModel();
  }, []);

  const calculateAngle = (a, b, c) => {
    const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  const detectPoses = async () => {
    if (webcamRef.current && detector) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      if (video.readyState === 4 && canvas) {
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // Ensure canvas matches video size
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const poses = await detector.estimatePoses(video);

        if (poses.length > 0) {
          const keypoints = poses[0].keypoints;

          // Extract keypoints
          const shoulder = [keypoints[5].x * videoWidth, keypoints[5].y * videoHeight];
          const hip = [keypoints[11].x * videoWidth, keypoints[11].y * videoHeight];
          const knee = [keypoints[13].x * videoWidth, keypoints[13].y * videoHeight];

          const angle = calculateAngle(shoulder, hip, knee);

          // Sit-up counting logic (HALF sit-up detection)
          if (angle > 160) {
            setStage('down');
          }
          if (angle < 120 && angle > 100 && stage === 'down') {
            setStage('half-up');
            setCounter((prevCounter) => prevCounter + 1);
          }

          // Draw keypoints
          keypoints.forEach((keypoint) => {
            const x = keypoint.x * videoWidth;
            const y = keypoint.y * videoHeight;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
          });

          // Draw angle value near hip
          ctx.fillStyle = 'white';
          ctx.font = '18px Arial';
          ctx.fillText(`Angle: ${Math.round(angle)}°`, hip[0] - 30, hip[1] - 20);
        }

        // Debugging: Draw a test rectangle
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;
        ctx.strokeRect(50, 50, 100, 100);
      }
    }
    requestAnimationFrame(detectPoses);
  };

  useEffect(() => {
    detectPoses();
  }, [detector, counter, stage]);

  return (
    <div style={{ position: 'relative', width: '640px', height: '480px' }}>
      {/* Webcam Feed */}
      <Webcam
        ref={webcamRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
        videoConstraints={{ width: 640, height: 480 }}
      />

      {/* Canvas Overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 2,
          backgroundColor: 'transparent',
        }}
      />

      {/* Counter Display */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '20px',
          zIndex: 3,
        }}
      >
        <p>Reps: {counter}</p>
        <p>Stage: {stage}</p>
      </div>
    </div>
  );
};

export default SitUpCounter;
