import React from 'react';
import { Home, Droplet, Users, IndianRupee, Smartphone, Clock } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      title: "Doorstep Service",
      description: "We come to you. Save time and fuel by getting your car washed at your home or office.",
      icon: <Home className="w-8 h-8 text-blue-600" />
    },
    {
      title: "Professional Equipment",
      description: "We use specialized tools, high-pressure washers, and premium cleaning products.",
      icon: <Droplet className="w-8 h-8 text-blue-600" />
    },
    {
      title: "Trained Partners",
      description: "Our service providers are thoroughly vetted and trained for the best results.",
      icon: <Users className="w-8 h-8 text-blue-600" />
    },
    {
      title: "Transparent Pricing",
      description: "No hidden charges. You pay exactly what you see when you book the service.",
      icon: <IndianRupee className="w-8 h-8 text-blue-600" />
    },
    {
      title: "Easy Online Booking",
      description: "Book a wash in under 60 seconds using our user-friendly platform.",
      icon: <Smartphone className="w-8 h-8 text-blue-600" />
    },
    {
      title: "Convenient Scheduling",
      description: "Pick a date and time that works perfectly with your daily routine.",
      icon: <Clock className="w-8 h-8 text-blue-600" />
    }
  ];

  return (
    <section id="about" className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-bold text-blue-400 tracking-wide uppercase mb-2">Why Choose MotoMate</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold mb-6">Redefining Car Care with Convenience</h3>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              We understand that your time is valuable. Driving to a car wash and waiting in line is a hassle of the past. MotoMate brings the ultimate car cleaning experience directly to your parking spot.
            </p>
            
            <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h4 className="text-xl font-bold mb-2">Check Service Area</h4>
              <p className="text-slate-300 mb-4">Enter your pincode to see if we're washing cars in your neighborhood.</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter Pincode" 
                  className="flex-grow px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-medium transition-colors">
                  Check
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                <div className="bg-slate-900 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
