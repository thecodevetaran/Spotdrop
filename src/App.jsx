import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CityIntro from './sections/CityIntro';
import DropsSection from './components/DropsSection';
import PersonalitySection from './sections/PersonalitySection';
import ProductTease from './components/ProductTease';
import DropOrSkip from './components/DropOrSkip';
import FinalWaitlist from './sections/FinalWaitlist';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-[#D8FF45] selection:text-[#111111]">
      {/* Sticky minimal header */}
      <Navbar />

      {/* Main Page Flow */}
      <main id="main-content">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. City Intro Section */}
        <CityIntro />

        {/* 3. The Drops Section */}
        <DropsSection />

        {/* 4. Personality Section */}
        <PersonalitySection />

        {/* 5. Product Tease Section */}
        <ProductTease />

        {/* 6. Interactive Drop or Skip Card */}
        <DropOrSkip />

        {/* 7. Final Waitlist Section */}
        <FinalWaitlist />
      </main>

      {/* 8. Minimal Spacious Footer */}
      <Footer />
    </div>
  );
}
