import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Droplets, Sparkles, CarFront, Brush, Star, Clock } from 'lucide-react';

const iconMap = {
  'Doorstep Car Wash': <Droplets className="w-8 h-8 text-blue-500" />,
  'Car Detailing': <Sparkles className="w-8 h-8 text-purple-500" />,
  'Ceramic Coating': <CarFront className="w-8 h-8 text-cyan-500" />,
  'Interior Cleaning': <Brush className="w-8 h-8 text-amber-500" />
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For Phase 1, we try to fetch from API, but also have fallbacks for the UI
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/services');
        if (response.data && response.data.success) {
          setServices(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const fallbackServices = [
    {
      name: "Doorstep Car Wash",
      description: "Professional exterior and basic car cleaning performed at your doorstep.",
      price: 299,
      durationMinutes: 45,
      active: true
    },
    {
      name: "Car Detailing",
      description: "Complete interior and exterior detailing for a showroom finish.",
      active: false
    },
    {
      name: "Ceramic Coating",
      description: "Long-lasting protection and high-gloss finish for your car's paint.",
      active: false
    },
    {
      name: "Interior Cleaning",
      description: "Deep cleaning of seats, carpets, and dashboard to remove stains and odors.",
      active: false
    }
  ];

  const displayServices = services.length > 0 ? [...services, ...fallbackServices.filter(f => !services.find(s => s.name === f.name))] : fallbackServices;

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-blue-600 tracking-wide uppercase mb-2">Our Services</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Premium Care for Your Car</h3>
          <p className="text-lg text-slate-600">Choose from our range of professional services designed to keep your vehicle looking brand new.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayServices.map((service, index) => (
            <div 
              key={index} 
              className={`relative group rounded-2xl border p-8 transition-all duration-300 ${
                service.active 
                  ? 'border-slate-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 bg-white' 
                  : 'border-slate-100 bg-slate-50 opacity-80'
              }`}
            >
              {!service.active && (
                <div className="absolute top-4 right-4 bg-slate-200 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                  Coming Soon
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${service.active ? 'bg-blue-50' : 'bg-slate-200'}`}>
                {iconMap[service.name] || <Star className="w-8 h-8 text-slate-400" />}
              </div>
              
              <h4 className="text-xl font-bold text-slate-900 mb-3">{service.name}</h4>
              <p className="text-slate-600 mb-6 h-20">{service.description}</p>
              
              {service.active && (
                <div className="pt-6 border-t border-slate-100 mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-500 text-sm flex items-center"><Clock className="w-4 h-4 mr-1"/> {service.durationMinutes} min</span>
                    <span className="font-bold text-slate-900">From ₹{service.price}</span>
                  </div>
                  <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
                    Book Now
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
