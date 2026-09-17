import React, { useState } from 'react';
import { Car, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const vehicleTypes = [
  { 
    id: 'hatchback', 
    name: 'Hatchback', 
    images: [
      '/cars/maruti_swift_hatchback_1789627890645.jpg',
      '/cars/hyundai_i20_hatchback_1789627905772.jpg'
    ] 
  },
  { 
    id: 'sedan', 
    name: 'Sedan', 
    images: [
      '/cars/honda_city_sedan_1789627918238.jpg',
      '/cars/hyundai_verna_sedan_1789627932324.jpg'
    ] 
  },
  { 
    id: 'suv', 
    name: 'SUV', 
    images: [
      '/cars/mahindra_thar_suv_1789627873715.jpg',
      '/cars/tata_nexon_suv_1789627857924.jpg',
      '/cars/kia_seltos_suv_1789627948809.jpg'
    ] 
  },
  { 
    id: 'luxury', 
    name: 'Luxury/Sports', 
    images: [
      '/cars/mercedes_benz_luxury_1789627961639.jpg',
      '/cars/promo_car_1789621853539.jpg'
    ] 
  }
];

const ImageSlider = ({ images, isSelected }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2500); // Change image every 2.5 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="w-full h-32 mb-3 relative overflow-hidden rounded-xl">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Car ${index}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          } ${isSelected ? 'brightness-110' : 'brightness-90'} `}
        />
      ))}
    </div>
  );
};

const needs = [
  { id: 'quick', name: 'Quick Refresh', desc: 'Basic wash and vacuum for regular maintenance.', recommend: 1 },
  { id: 'deep', name: 'Deep Cleaning', desc: 'Thorough interior and exterior detail.', recommend: 2 },
  { id: 'protect', name: 'Protection & Shine', desc: 'Ceramic coating and clay bar treatment.', recommend: 3 }
];

const VehicleSelector = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedNeed, setSelectedNeed] = useState(null);

  return (
    <section className="py-12 bg-zinc-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mr-20 -mt-10 w-96 h-96 rounded-full bg-blue-50/50 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-10 w-72 h-72 rounded-full bg-slate-50/80 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-sm font-bold text-yellow-500 tracking-wide uppercase mb-2">Tailored Experience</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-zinc-50 mb-6 tracking-tight">Tell Us About Your Car</h3>
          <p className="text-lg text-zinc-400">Select your vehicle type and what it needs today to get a personalized service recommendation.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Vehicle Selection */}
          <div className="mb-12 animate-fade-in-up delay-100">
            <h4 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
              <span className="bg-zinc-800 text-yellow-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
              What do you drive?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {vehicleTypes.map(v => (
                <button 
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 overflow-hidden ${
                    selectedVehicle === v.id 
                      ? 'border-yellow-600 bg-zinc-900 shadow-lg transform -translate-y-2 ring-4 ring-blue-600/20' 
                      : 'border-zinc-800 bg-zinc-950 hover:border-blue-300 hover:bg-zinc-800 hover:shadow-md hover:-translate-y-1'
                  }`}
                >
                  <ImageSlider images={v.images} isSelected={selectedVehicle === v.id} />
                  <span className={`font-bold text-lg ${selectedVehicle === v.id ? 'text-yellow-400' : 'text-zinc-100'}`}>{v.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Need Selection (Appears after vehicle selection) */}
          <div className={`transition-all duration-500 overflow-hidden ${selectedVehicle ? 'max-h-96 opacity-100 mb-12' : 'max-h-0 opacity-0'}`}>
            <h4 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
              <span className="bg-zinc-800 text-yellow-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
              What does your {vehicleTypes.find(v => v.id === selectedVehicle)?.name.toLowerCase()} need?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {needs.map(n => (
                <button 
                  key={n.id}
                  onClick={() => setSelectedNeed(n.id)}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    selectedNeed === n.id 
                      ? 'border-yellow-600 bg-zinc-900 shadow-md transform -translate-y-1' 
                      : 'border-zinc-800 bg-zinc-950 hover:border-yellow-800 hover:bg-zinc-800'
                  }`}
                >
                  <h5 className={`font-bold text-lg mb-2 ${selectedNeed === n.id ? 'text-yellow-400' : 'text-zinc-50'}`}>{n.name}</h5>
                  <p className="text-zinc-400 text-sm leading-relaxed">{n.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Result / CTA */}
          <div className={`transition-all duration-500 transform ${selectedNeed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
            <div className="bg-black rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between text-zinc-50 shadow-xl shadow-slate-900/10">
              <div className="mb-6 md:mb-0">
                <p className="text-yellow-400 font-bold text-sm uppercase tracking-wider mb-2">Recommendation</p>
                <h4 className="text-2xl md:text-3xl font-extrabold mb-2">
                  {selectedNeed === 'quick' && 'Base Wash Package'}
                  {selectedNeed === 'deep' && 'Medium Care Package'}
                  {selectedNeed === 'protect' && 'Premium Detail Package'}
                </h4>
                <p className="text-zinc-500">Perfect for your {vehicleTypes.find(v => v.id === selectedVehicle)?.name}.</p>
              </div>
              <Link 
                to={`/book?serviceId=${needs.find(n => n.id === selectedNeed)?.recommend}`}
                className="w-full md:w-auto bg-yellow-600 text-zinc-50 px-8 py-4 rounded-xl font-bold hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                Continue to Booking <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VehicleSelector;
