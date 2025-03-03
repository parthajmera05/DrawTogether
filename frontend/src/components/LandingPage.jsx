import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
const LandingPage = () => {
  return (
    <div className="max-w-screen-2xl mx-auto bg-gradient-to-b from-[#F6F0FF] to-white">
      {/* Navbar */}
      <Navbar />
      <Hero />
      
      
      {/* Scroll Indicator */}
      

    </div>
  );
};

export default LandingPage;
