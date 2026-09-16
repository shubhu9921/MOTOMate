import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HowItWorks from '../sections/HowItWorks';
import { Link } from 'react-router-dom';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <HowItWorks />
        <div className="py-16 bg-blue-600 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience the Difference?</h2>
          <Link to="/book" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-bold text-lg hover:bg-slate-100 transition-colors shadow-lg">
            Book Your Wash Now
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
