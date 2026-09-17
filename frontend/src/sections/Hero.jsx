import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, CalendarCheck, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-black overflow-hidden">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Car Wash Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="md:w-2/3 lg:w-1/2">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-yellow-400 font-medium text-sm mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4 mr-2" />
            Premium Car Care, At Your Door
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-zinc-50 leading-tight tracking-tight mb-6 animate-fade-in-up delay-100">
            Your Car Deserves <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">More Than Just a Wash.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed animate-fade-in-up delay-200">
            Book a premium detailing and washing service from the comfort of your home. We bring the professional equipment, expertise, and care directly to your location.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up delay-300">
            <Link to="/book" className="text-center bg-yellow-600 text-zinc-50 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transform hover:-translate-y-1 flex justify-center items-center gap-2 group">
              Book a Wash <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <a href="#services" className="text-center bg-transparent backdrop-blur-md text-zinc-50 border-2 border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all flex justify-center items-center gap-2">
              Explore Services
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
