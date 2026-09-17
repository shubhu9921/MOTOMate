import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, CheckCircle } from 'lucide-react';

const ServiceCard = ({ service, premium = false }) => {
  return (
    <div className={`bg-zinc-950 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border ${premium ? 'border-yellow-200' : 'border-zinc-800'} overflow-hidden flex flex-col h-full group`}>
      <div className="h-48 bg-zinc-800 overflow-hidden relative">
        <img 
          src={service.imageUrl || 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!service.active && (
          <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm text-zinc-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Coming Soon
          </div>
        )}
        {premium && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
            <Star className="w-3 h-3 mr-1 fill-yellow-900" /> Premium
          </div>
        )}
      </div>
      
      <div className="p-8 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-zinc-50 leading-tight">{service.name}</h3>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-yellow-500 block leading-none">₹{service.price}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center text-zinc-400 text-sm font-medium">
            <Clock className="w-4 h-4 mr-1.5 text-yellow-500" />
            {service.durationMinutes} mins
          </div>
          {service.totalReviews > 0 && (
            <div className="flex items-center text-zinc-400 text-sm font-medium">
              <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
              {service.averageRating?.toFixed(1)} ({service.totalReviews})
            </div>
          )}
        </div>
        
        <p className="text-zinc-400 mb-6 leading-relaxed flex-grow">
          {service.description}
        </p>

        {service.features && (
          <div className="mb-8 space-y-2">
            {service.features.split(',').map((feature, idx) => (
              <div key={idx} className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-zinc-400">{feature.trim()}</span>
              </div>
            ))}
          </div>
        )}
        
        {service.active ? (
          <div className="flex gap-3 mt-auto">
            <Link 
              to={`/services/${service.id}`}
              className="flex-1 text-center px-4 py-2.5 bg-zinc-900 text-zinc-300 font-semibold rounded-xl hover:bg-slate-200 transition-colors border border-zinc-800"
            >
              Details
            </Link>
            <Link 
              to={`/book?serviceId=${service.id}`}
              className="flex-1 text-center px-4 py-2.5 bg-yellow-600 text-zinc-50 font-semibold rounded-xl hover:bg-yellow-500 transition-colors shadow-md shadow-blue-200"
            >
              Book Now
            </Link>
          </div>
        ) : (
          <button disabled className="w-full text-center px-6 py-3 bg-zinc-800 text-zinc-500 font-semibold rounded-xl cursor-not-allowed mt-auto">
            Currently Unavailable
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
