import React from 'react';
import { ShieldCheck, MapPin, CalendarCheck, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-slate-900 overflow-hidden">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Car Wash Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="md:w-2/3 lg:w-1/2">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium text-sm mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Premium Mobile Car Care
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Professional Car Wash, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Right at Your Doorstep.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed">
            Book a professional car wash from the comfort of your home. We bring the equipment, expertise, and care directly to your location.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transform hover:-translate-y-1">
              Book a Wash
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
              Explore Services
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div className="flex flex-col items-start">
              <div className="bg-blue-500/20 p-2 rounded-lg mb-3">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-white font-medium">Professional Service</p>
            </div>
            <div className="flex flex-col items-start">
              <div className="bg-blue-500/20 p-2 rounded-lg mb-3">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-white font-medium">Doorstep Convenience</p>
            </div>
            <div className="flex flex-col items-start">
              <div className="bg-blue-500/20 p-2 rounded-lg mb-3">
                <CalendarCheck className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-white font-medium">Easy Booking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
