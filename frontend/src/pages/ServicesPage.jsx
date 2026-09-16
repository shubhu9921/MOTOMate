import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Our Services</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Professional car care services brought directly to your doorstep. Choose from our range of premium packages.
          </p>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="text-center py-20">Loading services...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full group">
                <div className="h-48 bg-slate-200 overflow-hidden relative">
                  {/* Placeholder image, ideally would come from backend */}
                  <img 
                    src={`https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`} 
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {!service.active && (
                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Coming Soon
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{service.name}</h3>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-blue-600 block leading-none">₹{service.price}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center text-slate-500 text-sm font-medium">
                      <Clock className="w-4 h-4 mr-1.5 text-blue-500" />
                      {service.durationMinutes} mins
                    </div>
                    {service.totalReviews > 0 && (
                      <div className="flex items-center text-slate-500 text-sm font-medium">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                        {service.averageRating?.toFixed(1)} ({service.totalReviews})
                      </div>
                    )}
                  </div>
                  
                  <p className="text-slate-600 mb-8 leading-relaxed flex-grow">
                    {service.description}
                  </p>
                  
                  {service.active ? (
                    <Link 
                      to={`/services/${service.id}`}
                      className="w-full text-center px-6 py-3 bg-slate-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-colors border border-blue-100 hover:border-transparent"
                    >
                      View Details
                    </Link>
                  ) : (
                    <button disabled className="w-full text-center px-6 py-3 bg-slate-100 text-slate-400 font-semibold rounded-xl cursor-not-allowed">
                      Currently Unavailable
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
