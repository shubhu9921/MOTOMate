import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../sections/Hero';
import HowItWorks from '../sections/HowItWorks';
import Services from '../sections/Services';
import VehicleSelector from '../sections/VehicleSelector';
import Testimonials from '../sections/Testimonials';
import FAQ from '../sections/FAQ';
import Footer from '../components/Footer';

import TrustBar from '../sections/TrustBar';
import SEO from '../components/SEO';

const LandingPage = () => {
  return (
    <div className="bg-zinc-900 flex flex-col font-sans">
      <SEO />
      <Navbar />
      <main className="">
        <Hero />
        <TrustBar />
        <Services />
        <VehicleSelector />
        <HowItWorks />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
