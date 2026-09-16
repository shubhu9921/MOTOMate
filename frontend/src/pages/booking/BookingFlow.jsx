import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Check, ChevronRight, Car, MapPin, Calendar, Clock, CreditCard } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BookingFlow = () => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [addresses, setAddresses] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected state
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [servicesRes, vehiclesRes, addressesRes] = await Promise.all([
        api.get('/services'),
        api.get('/vehicles'),
        api.get('/addresses')
      ]);

      const activeServices = servicesRes.data.data.filter(s => s.active);
      setServices(activeServices);
      setVehicles(vehiclesRes.data.data);
      setAddresses(addressesRes.data.data);

      // Check if a service was passed via router state (e.g., clicking "Book Now" on a specific service)
      if (location.state?.serviceId) {
        const preselected = activeServices.find(s => s.id === location.state.serviceId);
        if (preselected) setSelectedService(preselected);
      }
    } catch (err) {
      setError('Failed to load required data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedService) return setError('Please select a service');
    if (step === 2 && !selectedVehicle) return setError('Please select a vehicle');
    if (step === 3 && !selectedAddress) return setError('Please select an address');
    if (step === 4 && !selectedDate) return setError('Please select a date');
    if (step === 5 && !selectedTime) return setError('Please select a time slot');
    
    setError('');
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(s => s - 1);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    
    try {
      const payload = {
        serviceId: selectedService.id,
        vehicleId: selectedVehicle.id,
        addressId: selectedAddress.id,
        bookingDate: selectedDate,
        bookingTime: selectedTime
      };
      
      const response = await api.post('/bookings', payload);
      if (response.data.success) {
        navigate(`/booking-success/${response.data.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const renderStepIndicator = () => {
    const steps = [
      { num: 1, label: 'Service' },
      { num: 2, label: 'Vehicle' },
      { num: 3, label: 'Location' },
      { num: 4, label: 'Date' },
      { num: 5, label: 'Time' },
      { num: 6, label: 'Confirm' }
    ];

    return (
      <div className="flex justify-between mb-8 overflow-x-auto pb-4 hide-scrollbar">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex flex-col items-center flex-1 min-w-[60px]">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm z-10 mb-2 transition-colors ${
              step > s.num ? 'bg-green-500 text-white' : step === s.num ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {step > s.num ? <Check className="w-5 h-5" /> : s.num}
            </div>
            <span className={`text-xs font-medium text-center ${step === s.num ? 'text-blue-600' : 'text-slate-500'}`}>
              {s.label}
            </span>
            {idx < steps.length - 1 && (
              <div className={`absolute h-1 top-4 -z-10 w-full max-w-[calc(100%/6)] left-[calc(100%/12*(${idx*2+1}))] ${
                step > s.num ? 'bg-green-500' : 'bg-slate-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading booking flow...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 relative">
          <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Book Your Service</h1>
          
          <div className="relative">
            {renderStepIndicator()}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md mb-6 border border-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="min-h-[300px]">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold mb-4 text-slate-800">Select a Service</h2>
                <div className="grid grid-cols-1 gap-4">
                  {services.map(s => (
                    <div 
                      key={s.id} 
                      onClick={() => setSelectedService(s)}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${selectedService?.id === s.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{s.name}</h3>
                          <p className="text-slate-600 text-sm mt-1">{s.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-blue-600">₹{s.price}</p>
                          <p className="text-xs text-slate-500">{s.durationMinutes} mins</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Select your Vehicle</h2>
                  <Link to="/profile/vehicles" target="_blank" className="text-sm text-blue-600 hover:underline flex items-center">
                    + Add New
                  </Link>
                </div>
                {vehicles.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-slate-600 mb-4">You haven't added any vehicles yet.</p>
                    <Link to="/profile/vehicles" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md">Add a Vehicle</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vehicles.map(v => (
                      <div 
                        key={v.id} 
                        onClick={() => setSelectedVehicle(v)}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center ${selectedVehicle?.id === v.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                      >
                        <Car className={`w-8 h-8 mr-4 ${selectedVehicle?.id === v.id ? 'text-blue-500' : 'text-slate-400'}`} />
                        <div>
                          <h3 className="font-bold text-slate-900">{v.brand} {v.model}</h3>
                          <p className="text-slate-500 text-sm">{v.vehicleNumber}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                   <button onClick={fetchInitialData} className="text-xs text-slate-500 hover:text-blue-500 underline">Refresh list</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Select Service Location</h2>
                  <Link to="/profile/addresses" target="_blank" className="text-sm text-blue-600 hover:underline flex items-center">
                    + Add New
                  </Link>
                </div>
                {addresses.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-slate-600 mb-4">You haven't added any addresses yet.</p>
                    <Link to="/profile/addresses" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md">Add an Address</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {addresses.map(a => (
                      <div 
                        key={a.id} 
                        onClick={() => setSelectedAddress(a)}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start ${selectedAddress?.id === a.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                      >
                        <MapPin className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${selectedAddress?.id === a.id ? 'text-blue-500' : 'text-slate-400'}`} />
                        <div>
                          <p className="font-bold text-slate-900">{a.addressLine}</p>
                          <p className="text-slate-600 text-sm mt-1">{a.city}, {a.state} - {a.pincode}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                 <div className="mt-4 flex justify-end">
                   <button onClick={fetchInitialData} className="text-xs text-slate-500 hover:text-blue-500 underline">Refresh list</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold mb-4 text-slate-800">Select a Date</h2>
                <div className="max-w-md mx-auto bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Service Date</label>
                  <input 
                    type="date" 
                    min={getMinDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-3 text-center">We operate 7 days a week.</p>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold mb-4 text-slate-800">Select a Time Slot</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border text-center font-medium transition-all ${
                        selectedTime === time 
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md' 
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-400'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold mb-6 text-slate-800">Booking Summary</h2>
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
                  
                  <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{selectedService?.name}</h3>
                      <p className="text-sm text-slate-500">{selectedService?.durationMinutes} mins</p>
                    </div>
                    <span className="font-bold text-xl text-blue-600">₹{selectedService?.price}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-start">
                      <Car className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-500">Vehicle</p>
                        <p className="font-medium text-slate-900">{selectedVehicle?.brand} {selectedVehicle?.model}</p>
                        <p className="text-xs text-slate-500 uppercase">{selectedVehicle?.vehicleNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-500">Location</p>
                        <p className="font-medium text-slate-900">{selectedAddress?.addressLine}</p>
                        <p className="text-xs text-slate-500">{selectedAddress?.city}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-500">Date</p>
                        <p className="font-medium text-slate-900">{selectedDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-500">Time</p>
                        <p className="font-medium text-slate-900">{selectedTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <div className="flex items-center text-sm text-slate-600">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payment to be collected after service completion.
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between pt-6 border-t border-slate-100">
            <button 
              onClick={handleBack} 
              disabled={step === 1 || submitting}
              className={`px-6 py-2.5 rounded-md font-medium ${step === 1 ? 'opacity-0 cursor-default' : 'text-slate-600 border border-slate-300 hover:bg-slate-50'}`}
            >
              Back
            </button>
            
            {step < 6 ? (
              <button 
                onClick={handleNext}
                className="bg-blue-600 text-white px-8 py-2.5 rounded-md font-medium hover:bg-blue-700 flex items-center"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button 
                onClick={handleConfirm}
                disabled={submitting}
                className="bg-green-600 text-white px-8 py-2.5 rounded-md font-medium hover:bg-green-700 flex items-center disabled:opacity-70"
              >
                {submitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            )}
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingFlow;
