import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HowItWorks from '../sections/HowItWorks';
import { Link } from 'react-router-dom';

const HowItWorksPage = () => {
  return (
    <div className="bg-zinc-900 flex flex-col font-sans">
      <Navbar />
      <main className="">
        <HowItWorks />
        <div className="py-16 bg-yellow-600 text-center text-zinc-50">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience the Difference?</h2>
          <Link to="/book" className="inline-block bg-zinc-950 text-yellow-500 px-8 py-3 rounded-md font-bold text-lg hover:bg-zinc-700 transition-colors shadow-lg">
            Book Your Wash Now
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
