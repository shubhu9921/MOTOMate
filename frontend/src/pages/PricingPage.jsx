import React, { useState, useEffect } from 'react';
import { Check, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const PricingPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        if (response.data.success) {
          // Filter to only show active ones, maybe sort by price
          setServices(response.data.data.filter(s => s.active).sort((a, b) => a.price - b.price));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
            <p className="text-lg text-slate-600">Choose the perfect care package for your vehicle. No hidden fees, pay only after the service is completed.</p>
          </div>

          {loading ? (
            <div className="text-center py-20">Loading packages...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <div key={service.id} className={`bg-white rounded-2xl p-8 border ${index === 1 ? 'border-blue-500 shadow-xl relative scale-105' : 'border-slate-200 shadow-sm'}`}>
                  {index === 1 && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">Most Popular</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-slate-500 mb-6 h-12">{service.description}</p>
                  <div className="mb-8">
                    <span className="text-4xl font-extrabold text-slate-900">₹{service.price}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                      <span className="text-slate-600">Complete interior & exterior</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                      <span className="text-slate-600">{service.durationMinutes} mins duration</span>
                    </li>
                    {index > 0 && (
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                        <span className="text-slate-600">Premium materials used</span>
                      </li>
                    )}
                  </ul>
                  <Link 
                    to="/book" 
                    state={{ serviceId: service.id }}
                    className={`block w-full py-3 px-4 rounded-lg font-bold text-center transition-colors ${
                      index === 1 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    Book Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
