import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WorkoutSessions from "./components/WorkoutSessions";
import Gallery from "./components/Gallery";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import Detector from "./components/Detector";

import Login from "./components/Login";
import Register from "./components/Register";

import Exercise from "./components/Exercise";
import BMICalculator from "./components/BMICalculator";
import Footer from "./components/Footer";
import About from "./components/About";
import Neck from "./components/Neck";
import DataComponent from "./components/DataComponent";
import Arm from "./components/Arm";
import Biceps from "./components/Biceps";
import Situp from "./components/Situp";



const App = () => {
  return (
    <Router>
      <Navbar /> 

      <Routes>
        <Route path="/" element={<Register />} />
        
        <Route path="/register" element ={<Register/>} />
        <Route path="/login" element ={<Login/>} />
        <Route path="/hero" element={<Hero />} /> {/* Route for the homepage */}
        <Route path="/workouts" element={<WorkoutSessions />} /> 
        <Route path="/biceps" element={<Biceps />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={< About/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/detector" element={<Detector />} /> 
        <Route path="/bmicalculator" element={<BMICalculator />} /> 
      </Routes>
      {/* <DataComponent/> */}
      <Hero/>
     
      
      <WorkoutSessions /> {/* This line might be redundant, as WorkoutSessions is already routed */}
      {/* <Detector />  */}
      <Biceps />
      {/* <Situp /> */}
      {/* <Neck/>
      <Arm/> */}
      
     
      
      <Gallery />
      <Pricing />
      <Contact />
      <BMICalculator />
       
      <ToastContainer theme="dark" position="top-center" />
    </Router>
  );
};

export default App;