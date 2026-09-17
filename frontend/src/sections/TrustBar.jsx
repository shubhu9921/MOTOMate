import React from 'react';
import { ShieldCheck, CalendarCheck, Banknote, Users, MapPin } from 'lucide-react';

const TrustBar = () => {
  const trusts = [
    { text: "Professional Service", icon: <ShieldCheck className="w-5 h-5 text-yellow-500" /> },
    { text: "Convenient Booking", icon: <CalendarCheck className="w-5 h-5 text-yellow-500" /> },
    { text: "Transparent Pricing", icon: <Banknote className="w-5 h-5 text-yellow-500" /> },
    { text: "Trained Technicians", icon: <Users className="w-5 h-5 text-yellow-500" /> },
    { text: "Doorstep Service", icon: <MapPin className="w-5 h-5 text-yellow-500" /> }
  ];

  return (
    <div className="bg-zinc-950 border-b border-zinc-800 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-6 md:justify-between items-center animate-fade-in-up delay-400">
          {trusts.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 group hover-premium p-2 rounded-lg cursor-default">
              <div className="bg-zinc-900 p-1.5 rounded-full group-hover:bg-blue-100 transition-colors">
                {item.icon}
              </div>
              <span className="text-zinc-300 font-medium text-sm md:text-base">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
