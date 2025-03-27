import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
const Detector = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [squatCount, setSquatCount] = useState(0);
  const [instruction, setInstruction] = useState('');
  const [feedback, setFeedback] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [isExercising, setIsExercising] = useState(false);
  const [squatTarget, setSquatTarget] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleSquatTarget = (e) => {
    setSquatTarget(Number(e.target.value));
  };

  const startCountdown = () => {
    setIsReady(true);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown > 0) {
      setInstruction(`Ready... ${countdown}`);
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isReady) {
      setInstruction('Start Now!');
      startExercise();
    }
  }, [countdown, isReady]);

  const startExercise = () => {
    setIsExercising(true);
    let action = 'Sit Down';
    let count = 0;

    setTimeout(() => {
      const interval = setInterval(() => {
        setInstruction(action);

        if (action === 'Sit Down') {
          action = 'Stand Up';
        } else {
          action = 'Sit Down';
          count += 1;
          setSquatCount(count);
          setFeedback('Great Job! Keep Going!');
        }

        if (count === squatTarget) {
          clearInterval(interval);
          setInstruction('Exercise Complete!');
          setFeedback('Well Done! You finished your squats!');
          setIsExercising(false);
        }
      }, 3000);
    }, 1000);
  };

  useEffect(() => {
    const initializePoseDetection = async () => {
      try {
        await tf.ready();
        await tf.setBackend('webgl');

        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
        );

        if (webcamRef.current && webcamRef.current.video) {
          const video = webcamRef.current.video;
          video.play();

          const detect = async () => {
            if (video.readyState === 4 && isExercising) {
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

    initializePoseDetection();
  }, [isExercising]);

  const detectSquats = (keypoints) => {
    const leftHip = keypoints.find((point) => point.name === 'left_hip');
    const rightHip = keypoints.find((point) => point.name === 'right_hip');
    const leftKnee = keypoints.find((point) => point.name === 'left_knee');
    const rightKnee = keypoints.find((point) => point.name === 'right_knee');

    if (
      leftHip &&
      rightHip &&
      leftKnee &&
      rightKnee &&
      leftHip.score > 0.6 &&
      rightHip.score > 0.6 &&
      leftKnee.score > 0.6 &&
      rightKnee.score > 0.6
    ) {
      const avgHipY = (leftHip.y + rightHip.y) / 2;
      const avgKneeY = (leftKnee.y + rightKnee.y) / 2;

      if (avgHipY > avgKneeY + 40 && !isCooldown) {
        setIsCooldown(true);
        setTimeout(() => {
          setIsCooldown(false);
        }, 3000);
      }
    }
  };

  const drawCanvas = (keypoints) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = webcamRef.current.video.videoWidth;
    canvas.height = webcamRef.current.video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.5) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      }
    });

    const leftHip = keypoints.find((point) => point.name === 'left_hip');
    const rightHip = keypoints.find((point) => point.name === 'right_hip');
    const leftKnee = keypoints.find((point) => point.name === 'left_knee');
    const rightKnee = keypoints.find((point) => point.name === 'right_knee');

    if (leftHip && leftKnee && rightHip && rightKnee) {
      ctx.beginPath();
      ctx.moveTo(leftHip.x, leftHip.y);
      ctx.lineTo(leftKnee.x, leftKnee.y);
      ctx.moveTo(rightHip.x, rightHip.y);
      ctx.lineTo(rightKnee.x, rightKnee.y);
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  return (
    <div className="detector-container">
      <div className="left-section">
        <div className="start-input">
          <input
            type="number"
            value={squatTarget}
            onChange={handleSquatTarget}
            placeholder="Enter Squat Count"
          />
          <button onClick={startCountdown}>Start Exercise</button>
        </div>
      </div>

      <div className="center-section">
        <div className="instruction-box">
          {instruction}
        </div>

        <div className="squat-counter-box">
          <span className="counter-text">{squatCount}</span>
        </div>

        <div className="feedback-box">
          {feedback}
        </div>

        <div className="webcam-container">
          <Webcam ref={webcamRef} className="webcam" />
          <canvas ref={canvasRef} className="canvas" />
        </div>
      </div>
    </div>
  );
};

export default Detector;
