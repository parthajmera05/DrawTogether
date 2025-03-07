import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import FeaturesSection from "./features";
import WhyChooseWhiteboard from "./whychoose";
import Footer from "./Footer";
const LandingPage = () => {
  return (
    <div className="max-w-screen-2xl mx-auto bg-gradient-to-b from-[#F6F0FF] to-white">
      {/* Navbar */}
      <Navbar />
      <Hero />
      <FeaturesSection />
      <WhyChooseWhiteboard />
      <Footer />
      {/* Scroll Indicator */}
      

    </div>
  );
};

export default LandingPage;
