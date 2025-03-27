import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection';

const Detector = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [squatCount, setSquatCount] = useState(0);
  const [isSquatting, setIsSquatting] = useState(false);

  useEffect(() => {
    const runPoseDetection = async () => {
      try {
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          { modelType: 'singlepose_lightning' }
        );

        if (webcamRef.current && webcamRef.current.video) {
          const video = webcamRef.current.video;
          video.play(); 

          const detect = async () => {
            if (video.readyState === 4) {
              const poses = await detector.estimatePoses(video);

              if (poses.length > 0 && poses[0].score > 0.5) {
                detectSquats(poses[0].keypoints);
                drawCanvas(poses[0].keypoints);
              }

              requestAnimationFrame(detect);
            }
          };

          detect();
        }
      } catch (error) {
        console.error('Error loading pose detector:', error);
      }
    };

    runPoseDetection();
  }, [webcamRef]); // Only re-run effect if webcamRef changes

  const detectSquats = (keypoints) => {
    // ... (your squat detection logic) ... 
  };

  const drawCanvas = (keypoints) => {
    // ... (your canvas drawing logic) ... 
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="counter">Squats: {squatCount}</div>
      <Webcam ref={webcamRef} style={{ width: '640px', height: '480px' }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '640px', height: '480px' }} />
    </div>
  );
};

export default Detector;