import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, ChevronLeft, Star } from 'lucide-react';
import Footer from '../components/Footer';
import api from '../services/api';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/services/${id}`);
        if (response.data.success) {
          setService(response.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center">Loading...</div>;
  if (!service) return <div className="flex items-center justify-center">Service not found.</div>;

  return (
    <div className="bg-zinc-900 flex flex-col font-sans">
      
      {/* Header */}
      <div className="bg-black text-zinc-50 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/services" className="inline-flex items-center text-yellow-400 hover:text-white mb-6 font-medium transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to all services
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {!service.active && (
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm text-zinc-50 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                  Coming Soon
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{service.name}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center text-slate-300 font-medium">
                  <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                  {service.durationMinutes} minutes duration
                </div>
                {service.totalReviews > 0 && (
                  <div className="flex items-center text-slate-300 font-medium">
                    <Star className="w-5 h-5 mr-2 text-yellow-400 fill-yellow-400" />
                    {service.averageRating?.toFixed(1)} / 5.0 ({service.totalReviews} reviews)
                  </div>
                )}
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-zinc-500 text-sm uppercase tracking-wide font-bold mb-1">Starting from</p>
              <p className="text-5xl font-extrabold text-zinc-50">₹{service.price}</p>
            </div>
          </div>
        </div>
      </div>

      <main className=" max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-950 rounded-2xl shadow-sm border border-zinc-800 p-8">
              <h2 className="text-2xl font-bold text-zinc-50 mb-4">About this service</h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="bg-zinc-950 rounded-2xl shadow-sm border border-zinc-800 p-8">
              <h2 className="text-2xl font-bold text-zinc-50 mb-6">What's Included</h2>
              <ul className="space-y-4">
                {/* Mock included items since they aren't in DB yet */}
                {['Exterior pressure wash', 'Foam cleaning', 'Tyre dressing', 'Interior vacuuming'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-lg text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-zinc-950 rounded-2xl shadow-lg border border-zinc-800 p-6 sticky top-28">
              <h3 className="text-xl font-bold text-zinc-50 mb-2">Ready for a wash?</h3>
              <p className="text-zinc-400 mb-6">Book this service now and our professionals will be at your doorstep.</p>
              
              {service.active ? (
                <button 
                  onClick={() => navigate('/book', { state: { serviceId: service.id } })}
                  className="w-full py-4 bg-yellow-600 text-zinc-50 rounded-xl font-bold text-lg hover:bg-yellow-500 transition-colors shadow-md hover:shadow-lg flex justify-center items-center"
                >
                  Book Now
                </button>
              ) : (
                <button disabled className="w-full py-4 bg-zinc-800 text-zinc-400 rounded-xl font-bold text-lg cursor-not-allowed">
                  Currently Unavailable
                </button>
              )}
              
              <p className="text-xs text-center text-zinc-400 mt-4">No credit card required. Pay after service.</p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetails;
