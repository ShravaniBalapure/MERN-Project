import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import 'Link' for internal navigation


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by reading from localStorage
    const userStatus = localStorage.getItem("userLoggedIn") === "true";
    setLoggedIn(userStatus);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="navbar">
      <div className="logo">
        <img src="Logofit.png" alt="FitSafar Logo" className="logo-img" />
        <h1 className="wow bounceIn" data-wow-delay="0.9s">FitSafar</h1>
      </div>
      <nav className={`navbar-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><Link to="/Hero">Home</Link></li>
          <li><Link to="/Biceps">Workouts</Link></li>
          <li><Link to="/Pricing">Plans</Link></li>
          <li><Link to="/About">About</Link></li>
          <li><Link to="/Contact">Contact</Link></li>
          <li><Link to="/Detector">Pose Detection</Link></li>
          <li><Link to="/BMICalculator">BMI</Link></li>

          {loggedIn ? (
            <li className="nav-item">
              <Link to="/login">
              <img src="avatar.png" alt="User Avatar" className="avatar" />
              </Link>
            </li>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="hamburger" onClick={toggleMenu}>
        <span>&#9776;</span>
      </div>
    </header>
  );
};

export default Navbar;
