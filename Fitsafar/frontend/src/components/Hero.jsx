import React from "react";


const Hero = () => {
  return (
    <section className="hero">
      {/* Background Video */}
      <video
        className="background-video"
        autoPlay
        muted
        loop
      >
        <source
          src="https://cdn-images.cure.fit/www-curefit-com/video/upload/c_fill,w_680,ar_1.77,q_auto:eco,dpr_2,vc_auto,f_auto/video/test/we-are-cult-web.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Content Overlay */}
      <div className="content">
        <div className="title">
          <h1>LET'S</h1>
          <h1>GET</h1>
          <h1>MOVING</h1>
        </div>
        <div className="sub-title">
          <p>Your Journey to Fitness Starts Here</p>
          <p>Unleash Your Potential</p>
        </div>
        <div className="buttons">
          <button>Start Your Journey</button>
          <button>Discover Your Plan</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
