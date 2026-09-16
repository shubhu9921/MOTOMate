import React from 'react';
import { MousePointerClick, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Choose Your Service",
      description: "Select from our range of premium car wash and detailing packages.",
      icon: <MousePointerClick className="w-6 h-6 text-white" />
    },
    {
      id: 2,
      title: "Select Your Location",
      description: "Enter your home or office address where you want the service.",
      icon: <MapPin className="w-6 h-6 text-white" />
    },
    {
      id: 3,
      title: "Choose Date & Time",
      description: "Pick a convenient time slot that fits your busy schedule.",
      icon: <Calendar className="w-6 h-6 text-white" />
    },
    {
      id: 4,
      title: "Relax While We Wash",
      description: "Our professionals arrive and transform your car at your doorstep.",
      icon: <CheckCircle2 className="w-6 h-6 text-white" />
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-blue-600 tracking-wide uppercase mb-2">Simple Process</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">How It Works</h3>
          <p className="text-lg text-slate-600">Get your car professionally washed in four simple steps without leaving your home.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-200 -z-0"></div>

          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white border-8 border-slate-50 flex items-center justify-center shadow-lg mb-6 relative group">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                  {step.id}
                </div>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
              <p className="text-slate-600 px-4">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
