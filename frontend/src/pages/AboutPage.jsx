import React from 'react';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="bg-zinc-900 flex flex-col font-sans">
      <main className=" py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-50 mb-8 text-center">About MOTOMate</h1>
        
        <div className="prose prose-lg prose-blue mx-auto text-zinc-400">
          <p className="mb-6">
            MOTOMate (formerly CareWash) was founded with a simple vision: to revolutionize the way people maintain their vehicles by bringing premium car care services directly to their doorstep.
          </p>
          
          <h2 className="text-2xl font-bold text-zinc-50 mt-10 mb-4">Our Mission</h2>
          <p className="mb-6">
            To provide the most convenient, eco-friendly, and professional automobile cleaning and detailing services, saving our customers time while delivering exceptional results.
          </p>

          <h2 className="text-2xl font-bold text-zinc-50 mt-10 mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-5 space-y-2 mb-8">
            <li><strong>Convenience:</strong> We come to your home, office, or anywhere your car is parked.</li>
            <li><strong>Quality:</strong> Our professionals are trained and use industry-leading products.</li>
            <li><strong>Eco-Friendly:</strong> We use techniques that save water compared to traditional washes.</li>
          </ul>

          <h2 className="text-2xl font-bold text-zinc-50 mt-10 mb-4">The Future Vision</h2>
          <p className="mb-6">
            While we are starting with doorstep car washing, our architecture and vision are designed to expand. Soon, MOTOMate will offer a complete suite of automobile services including:
          </p>
          <ul className="grid grid-cols-2 gap-2 font-medium text-zinc-300 mb-10 bg-zinc-800 p-6 rounded-xl">
            <li>• Premium Detailing</li>
            <li>• Ceramic Coating</li>
            <li>• PPF Installation</li>
            <li>• Interior Deep Cleaning</li>
            <li>• Denting & Painting</li>
            <li>• Routine Maintenance</li>
          </ul>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/book" className="inline-block bg-yellow-600 text-zinc-50 px-8 py-3 rounded-md font-bold text-lg hover:bg-yellow-500 transition-colors shadow-md">
            Book Your First Wash
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
