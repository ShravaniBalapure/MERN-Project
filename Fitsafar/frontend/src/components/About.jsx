import React, { useState, useEffect } from 'react';


const About = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const quotes = [
    "The only bad workout is the one that didn’t happen.",
    "Fitness is not about being better than someone else. It’s about being better than you used to be.",
    "Take care of your body. It’s the only place you have to live."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 4000); // Changes quote every 4 seconds
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="about-page">
      <div className="content-wrapper">
        <div className="about-section">
          <h1>Welcome to FitSafar</h1>
          <p>Your Fitness Journey, Perfected.</p>
          <p>
            At FitSafar, we combine cutting-edge technology with your fitness goals to create a seamless workout experience. 
            Our platform uses advanced Mediapipe pose detection to analyze and guide your exercise posture in real time, 
            ensuring you work out safely and effectively.
          </p>
        </div>

        {/* Image Section
        <div className="about-image-section">
          <div className="image-container">
            <img
              src="/about.jpeg" // Replace with the actual path of your image
              alt="Fitness"
              className="about-image"
            />
          </div>
        </div> */}

        <div className="thought-box">
          <p>{quotes[currentQuoteIndex]}</p>
        </div>
      </div>
    </div>
  );
};

export default About;
