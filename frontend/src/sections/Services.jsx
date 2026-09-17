import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Sparkles, Star, Clock, Check, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

const serviceTiers = [
  {
    id: 'base',
    name: 'Base Services',
    description: 'Essential cleaning to keep your car looking fresh and maintained.',
    price: 299,
    durationMinutes: 45,
    icon: <Droplets className="w-8 h-8" />,
    colorClass: 'blue',
    features: [
      'Exterior snow foam wash',
      'High-pressure tire cleaning',
      'Basic interior vacuuming',
      'Streak-free window wipe',
      'Dashboard dusting',
      'Free air freshener'
    ]
  },
  {
    id: 'medium',
    name: 'Medium Services',
    description: 'Comprehensive care for a spotless interior and glowing exterior.',
    price: 499,
    durationMinutes: 90,
    icon: <Sparkles className="w-8 h-8" />,
    colorClass: 'purple',
    popular: true,
    features: [
      'Everything in Base Services',
      'Dashboard & console polish',
      'Deep interior vacuuming',
      'Premium spray wax',
      'Underbody wash',
      'Floor mat shampooing',
      'Engine bay wipe-down'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Services',
    description: 'The ultimate detailing experience to restore that brand new feel.',
    price: 799,
    durationMinutes: 120,
    icon: <Star className="w-8 h-8" />,
    colorClass: 'yellow',
    premiumFlag: true,
    features: [
      'Everything in Medium Services',
      'Deep seat extraction',
      'Clay bar decontamination',
      '9H Ceramic spray coating',
      'AC vent sanitization',
      'Headlight restoration',
      'Tire dressing & shine'
    ]
  }
];

const Services = () => {
  const [backendServices, setBackendServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.data.success) {
          setBackendServices(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch services', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Merge static visual data with dynamic backend data (prices, durations)
  const displayServices = serviceTiers.map((tier, index) => {
    // Assuming backend returns them in order: Base, Medium, Premium (IDs 1, 2, 3)
    const backendService = backendServices.find(s => s.name.toLowerCase().includes(tier.name.split(' ')[0].toLowerCase())) || backendServices[index];
    
    return {
      ...tier,
      realId: backendService?.id || tier.id,
      price: backendService ? backendService.price : tier.price,
      durationMinutes: backendService ? backendService.durationMinutes : tier.durationMinutes,
      name: backendService ? backendService.name : tier.name,
    };
  });

  return (
    <section id="services" className="py-12 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-yellow-500 tracking-wide uppercase mb-2">Our Services</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-zinc-50 mb-6 tracking-tight">Premium Care for Your Car</h3>
          <p className="text-lg text-zinc-400 leading-relaxed">Choose from our range of professional service packages designed to keep your vehicle looking brand new, tailored to your specific needs.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
             <Loader2 className="w-10 h-10 animate-spin text-yellow-500" />
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {displayServices.map((service) => (
            <div 
              key={service.id} 
              className={`relative flex flex-col group rounded-3xl border p-8 transition-all duration-500 hover:-translate-y-2 ${
                service.premiumFlag 
                  ? 'border-yellow-500/50 hover:border-yellow-400 hover:shadow-2xl shadow-yellow-500/20 bg-gradient-to-b from-zinc-900 to-zinc-950' 
                  : service.popular
                  ? 'border-zinc-700 hover:border-yellow-600 hover:shadow-2xl shadow-yellow-600/20 bg-gradient-to-b from-zinc-800 to-zinc-950 transform md:-translate-y-4'
                  : 'border-zinc-800 hover:border-zinc-600 hover:shadow-xl shadow-zinc-500/10 bg-zinc-950'
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-zinc-50 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center">
                  Most Popular
                </div>
              )}
              {service.premiumFlag && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black text-zinc-50 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center">
                  <Star className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400" /> Premium Choice
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${
                service.colorClass === 'yellow' ? 'bg-black text-yellow-400' : 
                service.colorClass === 'purple' ? 'bg-zinc-800 text-yellow-500' : 
                'bg-zinc-800 text-zinc-400'
              }`}>
                {service.icon}
              </div>
              
              <h4 className="text-2xl font-bold text-zinc-50 mb-2">{service.name}</h4>
              <p className="text-zinc-400 mb-6 min-h-[60px]">{service.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-zinc-50">₹{service.price}</span>
              </div>

              <div className="space-y-4 mb-8 flex-grow">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 mr-3 ${
                      service.colorClass === 'yellow' ? 'bg-yellow-500/20 text-yellow-500' : 
                      service.colorClass === 'purple' ? 'bg-zinc-800 text-yellow-400' : 
                      'bg-zinc-800 text-zinc-300'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-zinc-800 mt-auto">
                <div className="flex items-center justify-center mb-4 text-zinc-400 font-medium">
                  <Clock className="w-4 h-4 mr-1.5"/> {service.durationMinutes} minutes
                </div>
                <Link to={`/book?serviceId=${service.realId}`} className={`flex justify-center items-center gap-2 block w-full text-center py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg group/btn ${
                  service.premiumFlag
                    ? 'bg-black text-zinc-50 hover:bg-slate-800'
                    : service.popular
                    ? 'bg-yellow-600 text-zinc-50 hover:bg-yellow-500'
                    : 'bg-zinc-950 border-2 border-zinc-800 text-zinc-50 hover:border-slate-300'
                }`}>
                  Book Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};

export default Services;
