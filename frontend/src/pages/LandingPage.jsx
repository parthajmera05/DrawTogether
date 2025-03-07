import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturesSection from "../components/features";
import WhyChooseWhiteboard from "../components/whychoose";
import Footer from "../components/Footer";
const LandingPage = () => {
  return (
    <div className="max-w-screen-2xl mx-auto bg-gradient-to-b from-[#F6F0FF] to-white">
      
      <Navbar />
      <Hero />
      <FeaturesSection />
      <WhyChooseWhiteboard />
      <Footer />
      
      

    </div>
  );
};

export default LandingPage;
