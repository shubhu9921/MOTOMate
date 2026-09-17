import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import api from '../services/api';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        if (response.data.success) {
          setServices(response.data.data);
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
      
      {/* Header */}
      <div className="bg-black text-zinc-50 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Our Services</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Professional car care services brought directly to your doorstep. Choose from our range of premium packages.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-10 text-zinc-400">No services currently available.</div>
        ) : (
          <div className="space-y-16">
            {/* Standard Services */}
            {services.filter(s => !s.premiumFlag).length > 0 && (
              <section>
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-3xl font-extrabold text-zinc-50">Standard Packages</h2>
                  <p className="text-zinc-400 mt-2">Essential care to keep your vehicle looking sharp.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.filter(s => !s.premiumFlag).sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </section>
            )}

            {/* Premium Services */}
            {services.filter(s => s.premiumFlag).length > 0 && (
              <section>
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-3xl font-extrabold text-zinc-50 flex items-center justify-center md:justify-start gap-2">
                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" /> Premium Care
                  </h2>
                  <p className="text-zinc-400 mt-2">Advanced detailing and protection for the ultimate finish.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.filter(s => s.premiumFlag).sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((service) => (
                    <ServiceCard key={service.id} service={service} premium />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
