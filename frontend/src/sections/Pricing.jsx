import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Pricing = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        if (response.data.success) {
          // Sort by displayOrder or price, maybe limit to top 3 for landing page
          const sorted = response.data.data
            .filter(s => s.active)
            .sort((a, b) => {
              if (a.displayOrder !== null && b.displayOrder !== null && a.displayOrder !== b.displayOrder) {
                return a.displayOrder - b.displayOrder;
              }
              return a.price - b.price;
            });
          setServices(sorted.slice(0, 3));
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
    <section id="pricing" className="py-12 bg-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-yellow-500 tracking-wide uppercase mb-2">Pricing</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-zinc-50 mb-4">Simple, transparent pricing</h3>
          <p className="text-lg text-zinc-400">No hidden fees. Choose the perfect plan for your vehicle.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-600"></div>
            </div>
          ) : services.map((service) => (
            <div 
              key={service.id} 
              className={`relative rounded-3xl p-8 flex flex-col ${
                service.premiumFlag 
                  ? 'bg-black text-zinc-50 shadow-2xl scale-105 z-10 border border-slate-800' 
                  : 'bg-zinc-950 text-zinc-50 border border-zinc-800'
              }`}
            >
              {service.premiumFlag && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-yellow-600 text-zinc-50 text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h4 className={`text-2xl font-bold mb-2 ${service.premiumFlag ? 'text-zinc-50' : 'text-zinc-50'}`}>{service.name}</h4>
                <p className={`${service.premiumFlag ? 'text-slate-300' : 'text-zinc-400'} min-h-[3rem]`}>{service.description}</p>
              </div>
              
              <div className="mb-8 flex items-baseline">
                <span className="text-3xl font-bold">₹</span>
                <span className="text-5xl font-extrabold tracking-tight ml-1">{service.price}</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {service.features ? service.features.split(',').map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className={`w-5 h-5 mr-3 shrink-0 mt-0.5 ${service.premiumFlag ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    <span className={service.premiumFlag ? 'text-slate-200' : 'text-zinc-300'}>{feature.trim()}</span>
                  </li>
                )) : (
                  <li className="flex items-start">
                    <Check className={`w-5 h-5 mr-3 shrink-0 mt-0.5 ${service.premiumFlag ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    <span className={service.premiumFlag ? 'text-slate-200' : 'text-zinc-300'}>Standard Service</span>
                  </li>
                )}
                <li className="flex items-start">
                  <Check className={`w-5 h-5 mr-3 shrink-0 mt-0.5 ${service.premiumFlag ? 'text-yellow-400' : 'text-yellow-500'}`} />
                  <span className={service.premiumFlag ? 'text-slate-200' : 'text-zinc-300'}>Estimated {service.durationMinutes} mins</span>
                </li>
              </ul>
              
              <Link 
                to={`/book?serviceId=${service.id}`}
                className={`block w-full py-4 rounded-xl font-bold text-lg text-center transition-colors mt-auto ${
                  service.premiumFlag 
                    ? 'bg-yellow-600 text-zinc-50 hover:bg-yellow-500' 
                    : 'bg-zinc-800 text-zinc-50 hover:bg-slate-200'
                }`}
              >
                Choose Plan
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
