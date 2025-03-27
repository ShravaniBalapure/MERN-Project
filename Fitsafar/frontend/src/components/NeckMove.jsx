import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

const NeckDetector = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [turnCount, setTurnCount] = useState(0);
  const [lastTurn, setLastTurn] = useState(null);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    const initializePoseDetection = async () => {
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
          if (video.readyState === 4) {
            const poses = await detector.estimatePoses(video);

            if (poses.length > 0 && poses[0].score > 0.5) {
              detectNeckMovement(poses[0].keypoints);
              drawCanvas(poses[0].keypoints);
            }

            requestAnimationFrame(detect);
          }
        };

        detect();
      }
    };

    initializePoseDetection();
  }, []);

  const detectNeckMovement = (keypoints) => {
    const nose = keypoints.find((point) => point.name === 'nose');
    const leftEar = keypoints.find((point) => point.name === 'left_ear');
    const rightEar = keypoints.find((point) => point.name === 'right_ear');
    const leftShoulder = keypoints.find((point) => point.name === 'left_shoulder');
    const rightShoulder = keypoints.find((point) => point.name === 'right_shoulder');

    if (
      nose && leftEar && rightEar && leftShoulder && rightShoulder &&
      nose.score > 0.6 && leftEar.score > 0.6 && rightEar.score > 0.6 &&
      leftShoulder.score > 0.6 && rightShoulder.score > 0.6
    ) {
      const noseX = nose.x;
      const leftShoulderX = leftShoulder.x;
      const rightShoulderX = rightShoulder.x;
      const noseY = nose.y;
      const shoulderY = (leftShoulder.y + rightShoulder.y) / 2; // Average shoulder height

      // Threshold for movement detection
      const turnThreshold = 30;
      const incorrectPostureThreshold = 20;

      // Detect left turn
      if (noseX < leftShoulderX - turnThreshold && lastTurn !== 'left') {
        setTurnCount((prev) => prev + 1);
        setLastTurn('left');
        setWarning("");
        console.log("Left turn detected!");
      }
      // Detect right turn
      else if (noseX > rightShoulderX + turnThreshold && lastTurn !== 'right') {
        setTurnCount((prev) => prev + 1);
        setLastTurn('right');
        setWarning("");
        console.log("Right turn detected!");
      }
      // Reset turn detection when head is centered
      else if (noseX > leftShoulderX - 10 && noseX < rightShoulderX + 10) {
        setLastTurn(null);
      }

      // Detect incorrect posture (if nose moves too high or too low)
      if (Math.abs(noseY - shoulderY) > incorrectPostureThreshold) {
        setWarning("Incorrect posture! Keep your head level.");
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

    // Draw lines for better visualization
    const nose = keypoints.find((point) => point.name === 'nose');
    const leftShoulder = keypoints.find((point) => point.name === 'left_shoulder');
    const rightShoulder = keypoints.find((point) => point.name === 'right_shoulder');

    if (nose && leftShoulder && rightShoulder) {
      ctx.beginPath();
      ctx.moveTo(leftShoulder.x, leftShoulder.y);
      ctx.lineTo(rightShoulder.x, rightShoulder.y);
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, backgroundColor: '#fff', padding: '10px', borderRadius: '5px' }}>
        Turns: {turnCount}
        <br />
        {warning && <span style={{ color: 'red' }}>{warning}</span>}
      </div>
      <Webcam ref={webcamRef} style={{ width: '640px', height: '480px' }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '640px', height: '480px' }} />
    </div>
  );
};

export default NeckDetector;
