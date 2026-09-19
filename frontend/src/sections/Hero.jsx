import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-black min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Car Wash Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
        {/* Adds a slight dark overlay everywhere to ensure navbar is visible */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 mt-10">
        <div className="md:w-3/4 lg:w-1/2 flex flex-col items-start">
          
          {/* Trust Badge */}
          <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border-2 border-zinc-950 object-cover" src="https://i.pravatar.cc/100?img=1" alt="User 1" />
              <img className="w-8 h-8 rounded-full border-2 border-zinc-950 object-cover" src="https://i.pravatar.cc/100?img=2" alt="User 2" />
              <img className="w-8 h-8 rounded-full border-2 border-zinc-950 object-cover" src="https://i.pravatar.cc/100?img=3" alt="User 3" />
              <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-teal-500 flex items-center justify-center text-zinc-950 z-10">
                <Plus className="w-4 h-4 font-bold" />
              </div>
            </div>
            <span className="text-zinc-300 text-sm font-medium">Trusted by 10,000+ car owners in Pune</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-[76px] font-bold text-white leading-[1.05] tracking-tight mb-6 animate-fade-in-up delay-100">
            Premium Car Care,<br/>
            <span className="text-teal-400">At Your Doorstep.</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-zinc-300 mb-10 max-w-md leading-relaxed animate-fade-in-up delay-200">
            Professional car washing and care services delivered to your home, society, or workplace.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-16 animate-fade-in-up delay-300">
            <Link to="/book" className="w-full sm:w-auto bg-gradient-to-r from-teal-400 to-teal-500 text-white px-8 py-3.5 rounded-full font-bold text-base hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all flex justify-center items-center gap-2 group">
              Book a Wash <span className="group-hover:translate-x-1 transition-transform">❯</span>
            </Link>
            
            <button className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md group-hover:bg-white/10 transition-colors">
                <Play className="w-4 h-4 text-white fill-white ml-1" />
              </div>
              <span className="text-white font-medium text-sm group-hover:text-teal-400 transition-colors">Watch How It Works</span>
            </button>
          </div>
          
          {/* Social Icons */}
          <div className="flex items-center gap-6 pt-24 animate-fade-in-up delay-500">
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Hero;
