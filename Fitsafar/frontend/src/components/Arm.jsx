 
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

const HandRaiseDetector = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [handRaiseCount, setHandRaiseCount] = useState(0);
  const [instruction, setInstruction] = useState('');
  const [feedback, setFeedback] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [isExercising, setIsExercising] = useState(false);
  const [handRaiseTarget, setHandRaiseTarget] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleHandRaiseTarget = (e) => {
    setHandRaiseTarget(Number(e.target.value));
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
    let action = 'Raise Hands';
    let count = 0;

    setTimeout(() => {
      const interval = setInterval(() => {
        setInstruction(action);

        if (action === 'Raise Hands') {
          action = 'Lower Hands';
        } else {
          action = 'Raise Hands';
          count += 1;
          setHandRaiseCount(count);
          setFeedback('Great Job! Keep Going!');
        }

        if (count === handRaiseTarget) {
          clearInterval(interval);
          setInstruction('Exercise Complete!');
          setFeedback('Well Done! You finished your hand raises!');
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
                detectHandRaises(poses[0].keypoints);
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

  const detectHandRaises = (keypoints) => {
    const leftWrist = keypoints.find((point) => point.name === 'left_wrist');
    const rightWrist = keypoints.find((point) => point.name === 'right_wrist');
    const leftShoulder = keypoints.find((point) => point.name === 'left_shoulder');
    const rightShoulder = keypoints.find((point) => point.name === 'right_shoulder');

    if (
      leftWrist &&
      rightWrist &&
      leftShoulder &&
      rightShoulder &&
      leftWrist.score > 0.6 &&
      rightWrist.score > 0.6 &&
      leftShoulder.score > 0.6 &&
      rightShoulder.score > 0.6
    ) {
      const avgShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const avgWristY = (leftWrist.y + rightWrist.y) / 2;

      if (avgWristY < avgShoulderY - 40 && !isCooldown) {
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

    const leftWrist = keypoints.find((point) => point.name === 'left_wrist');
    const rightWrist = keypoints.find((point) => point.name === 'right_wrist');
    const leftShoulder = keypoints.find((point) => point.name === 'left_shoulder');
    const rightShoulder = keypoints.find((point) => point.name === 'right_shoulder');

    if (leftWrist && leftShoulder && rightWrist && rightShoulder) {
      ctx.beginPath();
      ctx.moveTo(leftWrist.x, leftWrist.y);
      ctx.lineTo(leftShoulder.x, leftShoulder.y);
      ctx.moveTo(rightWrist.x, rightWrist.y);
      ctx.lineTo(rightShoulder.x, rightShoulder.y);
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
            value={handRaiseTarget}
            onChange={handleHandRaiseTarget}
            placeholder="Enter Hand Raise Count"
          />
          <button onClick={startCountdown}>Start Exercise</button>
        </div>
      </div>

      <div className="center-section">
        <div className="instruction-box">
          {instruction}
        </div>

        <div className="hand-raise-counter-box">
          <span className="counter-text">{handRaiseCount}</span>
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

export default HandRaiseDetector;
