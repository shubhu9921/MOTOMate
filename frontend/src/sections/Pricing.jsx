import React from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
  const packages = [
    {
      name: "Basic Wash",
      price: "299",
      description: "Essential exterior cleaning to keep your car looking fresh.",
      features: [
        "Exterior Foam Wash",
        "Tire & Alloy Cleaning",
        "Glass Cleaning (Outside)",
        "Microfiber Towel Dry"
      ],
      recommended: false
    },
    {
      name: "Premium Wash",
      price: "499",
      description: "Complete inside-out cleaning for a spotless vehicle.",
      features: [
        "Everything in Basic Wash",
        "Interior Vacuuming",
        "Dashboard Polish",
        "Glass Cleaning (Inside)",
        "Floor Mat Cleaning"
      ],
      recommended: true
    },
    {
      name: "Full Wash",
      price: "799",
      description: "The ultimate care package with protective wax.",
      features: [
        "Everything in Premium Wash",
        "Liquid Wax Application",
        "Odor Elimination",
        "Trunk Vacuuming",
        "Exterior Plastic Dressing"
      ],
      recommended: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-blue-600 tracking-wide uppercase mb-2">Transparent Pricing</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Choose Your Package</h3>
          <p className="text-lg text-slate-600">Simple, affordable pricing with no hidden fees. Select the plan that best fits your car's needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <div 
              key={index} 
              className={`relative rounded-3xl p-8 ${
                pkg.recommended 
                  ? 'bg-slate-900 text-white shadow-2xl scale-105 z-10' 
                  : 'bg-white text-slate-900 border border-slate-200'
              }`}
            >
              {pkg.recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h4 className={`text-2xl font-bold mb-2 ${pkg.recommended ? 'text-white' : 'text-slate-900'}`}>{pkg.name}</h4>
                <p className={`${pkg.recommended ? 'text-slate-300' : 'text-slate-500'} h-12`}>{pkg.description}</p>
              </div>
              
              <div className="mb-8 flex items-baseline">
                <span className="text-3xl font-bold">₹</span>
                <span className="text-5xl font-extrabold tracking-tight ml-1">{pkg.price}</span>
                <span className={`ml-2 font-medium ${pkg.recommended ? 'text-slate-400' : 'text-slate-500'}`}>/wash</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start">
                    <Check className={`w-5 h-5 mr-3 shrink-0 ${pkg.recommended ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={pkg.recommended ? 'text-slate-200' : 'text-slate-700'}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
                pkg.recommended 
                  ? 'bg-blue-600 text-white hover:bg-blue-500' 
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
