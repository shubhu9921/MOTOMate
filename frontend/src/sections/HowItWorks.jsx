import React from 'react';
import { MousePointerClick, MapPin, Calendar, CheckCircle2, Car } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Choose Your Service",
      description: "Select from our range of premium car wash and detailing packages.",
      icon: <MousePointerClick className="w-6 h-6 text-zinc-50" />
    },
    {
      id: 2,
      title: "Select Vehicle",
      description: "Tell us about your car to get the best care tailored to it.",
      icon: <Car className="w-6 h-6 text-zinc-50" />
    },
    {
      id: 3,
      title: "Choose Date & Time",
      description: "Pick a convenient time slot that fits your busy schedule.",
      icon: <Calendar className="w-6 h-6 text-zinc-50" />
    },
    {
      id: 4,
      title: "Relax — We Take Care of the Rest",
      description: "Our professionals arrive and transform your car at your doorstep.",
      icon: <CheckCircle2 className="w-6 h-6 text-zinc-50" />
    }
  ];

  return (
    <section id="how-it-works" className="py-12 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-yellow-500 tracking-wide uppercase mb-2">Simple Process</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-zinc-50 mb-4">How It Works</h3>
          <p className="text-lg text-zinc-400">Get your car professionally washed in four simple steps without leaving your home.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative max-w-6xl mx-auto">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-zinc-800 -z-0"></div>

          {steps.map((step, idx) => (
            <div key={step.id} className={`relative z-10 flex flex-col items-center text-center animate-fade-in-up delay-${(idx + 1) * 100}`}>
              <div className="w-24 h-24 rounded-full bg-zinc-950 border-8 border-slate-50 flex items-center justify-center shadow-lg mb-6 relative group">
                <div className="w-14 h-14 rounded-full bg-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black text-zinc-50 flex items-center justify-center font-bold text-sm">
                  0{step.id}
                </div>
              </div>
              <h4 className="text-xl font-bold text-zinc-50 mb-3">{step.title}</h4>
              <p className="text-zinc-400 px-4">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
