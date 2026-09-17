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
          // Filter to only show active ones, sort by displayOrder or price
          setServices(response.data.data.filter(s => s.active).sort((a, b) => {
            if (a.displayOrder !== null && b.displayOrder !== null && a.displayOrder !== b.displayOrder) {
              return a.displayOrder - b.displayOrder;
            }
            return a.price - b.price;
          }));
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
    <div className="bg-zinc-900 flex flex-col font-sans">
      <Navbar />
      <main className=" py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-zinc-50 mb-4">Simple, Transparent Pricing</h1>
            <p className="text-lg text-zinc-400">Choose the perfect care package for your vehicle. No hidden fees, pay only after the service is completed.</p>
          </div>

          {loading ? (
            <div className="text-center py-10">Loading packages...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {services.map((service) => (
                <div key={service.id} className={`bg-zinc-950 rounded-2xl p-8 border ${service.premiumFlag ? 'border-yellow-600 shadow-xl relative md:-translate-y-4' : 'border-zinc-800 shadow-sm'} flex flex-col`}>
                  {service.premiumFlag && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-yellow-600 text-zinc-50 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm">Premium</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-zinc-50 mb-2">{service.name}</h3>
                  <p className="text-zinc-400 mb-6 min-h-[3rem]">{service.description}</p>
                  <div className="mb-8">
                    <span className="text-4xl font-extrabold text-zinc-50">₹{service.price}</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    {service.features ? service.features.split(',').map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-zinc-400">{feature.trim()}</span>
                      </li>
                    )) : (
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-zinc-400">Standard Service</span>
                      </li>
                    )}
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                      <span className="text-zinc-400">Estimated {service.durationMinutes} mins</span>
                    </li>
                  </ul>
                  <Link 
                    to={`/book?serviceId=${service.id}`}
                    className={`block w-full py-3 px-4 rounded-xl font-bold text-center transition-colors mt-auto ${
                      service.premiumFlag 
                        ? 'bg-yellow-600 text-zinc-50 hover:bg-yellow-500 shadow-md shadow-blue-200' 
                        : 'bg-zinc-800 text-zinc-50 hover:bg-slate-200'
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
