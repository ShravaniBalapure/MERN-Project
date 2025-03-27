import React from "react";


const WorkoutSessions = () => {
  return (
    <section className="workout_sessions">
      <div className="wrapper">
        <h1 className="section-title">Top Workout Sessions</h1>
        <p className="section-description">
          Our top workout sessions are designed to help you reach your fitness goals with personalized plans, expert guidance, and a focus on building strength, endurance, and overall fitness.
        </p>
        <img src="/img7.jpg" alt="Workout" className="hero-image" />
      </div>
      <div className="wrapper bootcamps-wrapper">
        <h2 className="bootcamps-title">Featured Bootcamps</h2>
        <p className="bootcamps-description">
          Explore our featured bootcamps tailored for all fitness levels. Join our certified trainers in structured workouts to build strength, burn fat, and boost your stamina in a supportive community environment.
        </p>
        <div className="bootcamps">
          <div className="bootcamp-card">
            <h4 className="bootcamp-title">Strength & Conditioning Bootcamp</h4>
            <p className="bootcamp-description">
              This bootcamp combines weightlifting and HIIT for maximum strength and muscle gains. Perfect for those focused on athletic performance.
            </p>
          </div>
          <div className="bootcamp-card">
            <h4 className="bootcamp-title">Cardio & Endurance Bootcamp</h4>
            <p className="bootcamp-description">
              Improve cardiovascular health with dynamic exercises like running, cycling, and more. Ideal for building stamina and burning fat.
            </p>
          </div>
          <div className="bootcamp-card">
            <h4 className="bootcamp-title">HIIT Bootcamp</h4>
            <p className="bootcamp-description">
              Push your limits with High-Intensity Interval Training (HIIT). Great for fat-burning and cardiovascular health in a short period of time.
            </p>
          </div>
          <div className="bootcamp-card">
            <h4 className="bootcamp-title">Yoga & Flexibility Bootcamp</h4>
            <p className="bootcamp-description">
              Improve flexibility and mobility with a blend of yoga and Pilates exercises. Perfect for a balanced fitness approach.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkoutSessions;
