import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Check, ChevronRight, Car, MapPin, Calendar, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/SEO';

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
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // New Service Mode States
  const [serviceMode, setServiceMode] = useState('STATION'); // 'STATION' or 'HOME'
  const [requiresPickup, setRequiresPickup] = useState(false);
  const [hasSocietyPermission, setHasSocietyPermission] = useState(false);
  const [hasWaterAvailability, setHasWaterAvailability] = useState(false);
  const [serviceRequirements, setServiceRequirements] = useState('');
  
  // Data for Providers
  const [providers, setProviders] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);



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

      const searchParams = new URLSearchParams(location.search);
      const serviceIdParam = searchParams.get('serviceId') || location.state?.serviceId;
      const vehicleIdParam = searchParams.get('vehicleId');
      const addressIdParam = searchParams.get('addressId');
      
      if (serviceIdParam) {
        const preselected = activeServices.find(s => s.id === Number(serviceIdParam));
        if (preselected) {
          setSelectedService(preselected);
          setStep(2);
        }
      }
      if (vehicleIdParam) {
        const v = vehiclesRes.data.data.find(v => v.id === Number(vehicleIdParam));
        if (v) setSelectedVehicle(v);
      }
      if (addressIdParam) {
        const a = addressesRes.data.data.find(a => a.id === Number(addressIdParam));
        if (a) setSelectedAddress(a);
      }
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to load required data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedService) return setError('Please select a service package to continue.');
    if (step === 2 && !selectedVehicle) return setError('Please select a vehicle to continue.');
    if (step === 3 && !selectedAddress) return setError('Please select a service location to continue.');
    
    if (step === 4) {
      if (serviceMode === 'STATION' && (!selectedProvider || !selectedSlot)) return setError('Please select a provider and a time slot.');
      if (serviceMode === 'HOME' && (!selectedDate || !selectedSlot)) return setError('Please select a date and a time slot.');
    }
    
    if (step === 3) {
      fetchProviders();
    }
    
    // Additional validation for HOME mode in Step 4
    if (step === 4 && serviceMode === 'HOME' && (!hasSocietyPermission || !hasWaterAvailability)) {
      return setError('Please confirm society permission and water availability for home service.');
    }
    
    setError('');
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setError('');
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchProviders = async () => {
    try {
      setLoadingProviders(true);
      const res = await api.get('/providers/nearby?lat=19.076&lng=72.877');
      if (res.data.success) {
        let availableProviders = res.data.data;
        if (serviceMode === 'HOME') {
          availableProviders = availableProviders.filter(p => p.providesHomeService);
        } else {
          availableProviders = availableProviders.filter(p => p.providesStationService);
        }
        setProviders(availableProviders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProviders(false);
    }
  };

  useEffect(() => {
    if (step === 4) {
      fetchProviders();
      setSelectedProvider(null);
      setSelectedSlot(null);
    }
  }, [serviceMode]);

  useEffect(() => {
    if (serviceMode === 'HOME' && selectedDate) {
      fetchSlots(null, selectedDate);
    } else if (serviceMode === 'STATION' && selectedProvider && selectedDate) {
      fetchSlots(selectedProvider.id, selectedDate);
    }
  }, [selectedProvider, selectedDate, serviceMode]);

  const fetchSlots = async (providerId, date) => {
    if (serviceMode === 'HOME') {
      const homeSlots = [];
      for (let i = 7; i <= 19; i++) {
        const time = `${i.toString().padStart(2, '0')}:00:00`;
        homeSlots.push({ id: `home-${time}`, startTime: time, booked: false });
      }
      setSlots(homeSlots);
      return;
    }
    
    try {
      setLoadingSlots(true);
      const res = await api.get(`/providers/${providerId}/slots?date=${date}`);
      if (res.data.success) {
        setSlots(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode) return;
    setValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await api.get(`/coupons/validate?code=${couponCode}&amount=${selectedService.price}`);
      if (res.data.success) {
        setAppliedCoupon(res.data.data);
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
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
        bookingTime: selectedSlot ? selectedSlot.startTime : '10:00:00',
        providerId: selectedProvider ? selectedProvider.id : null,
        slotId: (selectedSlot && !String(selectedSlot.id).startsWith('home-')) ? selectedSlot.id : null,
        serviceMode,
        requiresPickup,
        hasSocietyPermission,
        hasWaterAvailability,
        serviceRequirements
      };
      
      const response = await api.post('/bookings', payload);
      if (response.data.success) {
        navigate(`/booking-success/${response.data.data.id}`);
      }
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Failed to create booking');
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const steps = [
    { num: 1, label: 'Service' },
    { num: 2, label: 'Vehicle' },
    { num: 3, label: 'Location' },
    { num: 4, label: 'Schedule' },
    { num: 5, label: 'Confirm' }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900">
        <div className="w-12 h-12 border-4 border-yellow-900 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-zinc-400 font-medium">Preparing your booking experience...</p>
      </div>
    );
  }

  const getFinalPrice = () => {
    if (!selectedService) return 0;
    let price = selectedService.price;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'PERCENTAGE') {
        price = price - (price * appliedCoupon.discount / 100);
      } else {
        price = price - appliedCoupon.discount;
      }
    }
    return price.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-zinc-900 pb-10">
      <SEO title="Book a Wash" />
      
      <div className="bg-black text-zinc-50 pt-10 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Book Your Service</h1>
          <p className="text-zinc-500 max-w-2xl mx-auto">Complete the steps below to schedule your premium doorstep car wash.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="bg-zinc-950 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Main Content Area (Left) */}
          <div className="flex-1 p-6 sm:p-10 lg:p-12 lg:border-r border-zinc-800">
            
            {/* Progress Indicator */}
            <div className="flex justify-between mb-12 overflow-x-auto pb-4 hide-scrollbar relative">
              {steps.map((s, idx) => (
                <div key={s.num} className="flex flex-col items-center flex-1 min-w-[60px] relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 mb-3 transition-colors ${
                    step > s.num ? 'bg-yellow-600 text-zinc-50' : step === s.num ? 'bg-black text-zinc-50 ring-4 ring-slate-100' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider text-center ${step === s.num ? 'text-zinc-50' : 'text-zinc-500'}`}>
                    {s.label}
                  </span>
                  {idx < steps.length - 1 && (
                    <div className={`absolute h-1 top-5 -z-10 w-full max-w-[calc(100%/5)] left-[calc(100%/10*(${idx*2+1}))] transition-colors ${
                      step > s.num ? 'bg-yellow-600' : 'bg-zinc-800'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <div className="min-h-[400px]">
              {/* STEP 1: SERVICE */}
              {step === 1 && (
                <div className="animate-fade-in-up">
                  <h2 className="text-2xl font-bold mb-6 text-zinc-50">Select a Service Package</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {services.map(s => (
                      <div 
                        key={s.id} 
                        onClick={() => setSelectedService(s)}
                        className={`cursor-pointer p-6 rounded-2xl border-2 transition-all group ${
                          selectedService?.id === s.id 
                            ? 'border-yellow-600 bg-zinc-900 shadow-md' 
                            : 'border-zinc-800 hover:border-yellow-800 hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`font-bold text-lg mb-1 ${selectedService?.id === s.id ? 'text-yellow-400' : 'text-zinc-50'}`}>{s.name}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">{s.description}</p>
                          </div>
                          <div className="text-right pl-4">
                            <p className="font-extrabold text-xl text-zinc-50">₹{s.price}</p>
                            <p className="text-xs font-medium text-zinc-500 mt-1">{s.durationMinutes} mins</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: VEHICLE */}
              {step === 2 && (
                <div className="animate-fade-in-up">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-zinc-50">Select your Vehicle</h2>
                    <Link to="/vehicles" target="_blank" className="text-sm font-bold text-yellow-500 hover:text-yellow-300 bg-zinc-900 px-4 py-2 rounded-full transition-colors">
                      + Add New
                    </Link>
                  </div>
                  
                  {vehicles.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800">
                      <div className="bg-zinc-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Car className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="font-bold text-zinc-50 mb-2">No vehicles found</h3>
                      <p className="text-zinc-400 mb-6">Add your vehicle to make booking faster.</p>
                      <Link to="/vehicles" className="inline-block bg-black text-zinc-50 px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">Add a Vehicle</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {vehicles.map(v => (
                        <div 
                          key={v.id} 
                          onClick={() => setSelectedVehicle(v)}
                          className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-center ${
                            selectedVehicle?.id === v.id 
                              ? 'border-yellow-600 bg-zinc-900 shadow-md transform -translate-y-1' 
                              : 'border-zinc-800 hover:border-yellow-800 hover:bg-zinc-800'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${selectedVehicle?.id === v.id ? 'bg-blue-200 text-yellow-400' : 'bg-zinc-800 text-zinc-500'}`}>
                            <Car className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className={`font-bold ${selectedVehicle?.id === v.id ? 'text-yellow-400' : 'text-zinc-50'}`}>{v.brand} {v.model}</h3>
                            <p className="text-zinc-400 text-sm font-medium mt-0.5">{v.vehicleNumber}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 flex justify-end">
                     <button onClick={fetchInitialData} className="text-sm font-medium text-zinc-500 hover:text-slate-700 underline transition-colors">Refresh list</button>
                  </div>
                </div>
              )}

              {/* STEP 3: LOCATION */}
              {step === 3 && (
                <div className="animate-fade-in-up">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-zinc-50">Select Service Location</h2>
                    <Link to="/addresses" target="_blank" className="text-sm font-bold text-yellow-500 hover:text-yellow-300 bg-zinc-900 px-4 py-2 rounded-full transition-colors">
                      + Add New
                    </Link>
                  </div>
                  
                  {addresses.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800">
                      <div className="bg-zinc-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <MapPin className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="font-bold text-zinc-50 mb-2">No addresses found</h3>
                      <p className="text-zinc-400 mb-6">Add your service location to continue.</p>
                      <Link to="/addresses" className="inline-block bg-black text-zinc-50 px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">Add an Address</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {addresses.map(a => (
                        <div 
                          key={a.id} 
                          onClick={() => setSelectedAddress(a)}
                          className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-start ${
                            selectedAddress?.id === a.id 
                              ? 'border-yellow-600 bg-zinc-900 shadow-md transform -translate-y-1' 
                              : 'border-zinc-800 hover:border-yellow-800 hover:bg-zinc-800'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shrink-0 mt-1 ${selectedAddress?.id === a.id ? 'bg-blue-200 text-yellow-400' : 'bg-zinc-800 text-zinc-500'}`}>
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className={`font-bold ${selectedAddress?.id === a.id ? 'text-yellow-400' : 'text-zinc-50'}`}>{a.addressLine}</p>
                            <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{a.city}, {a.state} - {a.pincode}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                   <div className="mt-6 flex justify-end">
                     <button onClick={fetchInitialData} className="text-sm font-medium text-zinc-500 hover:text-slate-700 underline transition-colors">Refresh list</button>
                  </div>
                </div>
              )}

              {/* STEP 4: PROVIDER & SCHEDULE */}
              {step === 4 && (
                <div className="animate-fade-in-up">
                  <h2 className="text-xl font-bold mb-4 text-zinc-50">Service Mode & Provider</h2>
                  
                  <div className="space-y-4">
                    {/* Service Mode Selection */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-2 uppercase tracking-wider">How would you like the service?</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div 
                          onClick={() => setServiceMode('STATION')}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            serviceMode === 'STATION'
                            ? 'border-yellow-600 bg-zinc-900 shadow-md'
                            : 'border-zinc-800 bg-zinc-950 hover:border-yellow-800'
                          }`}
                        >
                          <h3 className={`font-bold ${serviceMode === 'STATION' ? 'text-yellow-400' : 'text-zinc-50'}`}>At Service Station</h3>
                          <p className="text-sm text-zinc-400 mt-1">Visit our verified partner stations.</p>
                        </div>
                        <div 
                          onClick={() => setServiceMode('HOME')}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            serviceMode === 'HOME'
                            ? 'border-yellow-600 bg-zinc-900 shadow-md'
                            : 'border-zinc-800 bg-zinc-950 hover:border-yellow-800'
                          }`}
                        >
                          <h3 className={`font-bold ${serviceMode === 'HOME' ? 'text-yellow-400' : 'text-zinc-50'}`}>At Home</h3>
                          <p className="text-sm text-zinc-400 mt-1">Get service at your doorstep.</p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Home Requirements */}
                    {serviceMode === 'HOME' && (
                      <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl space-y-3">
                        <h4 className="font-bold text-zinc-50 mb-1">Home Service Requirements</h4>
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={hasSocietyPermission}
                            onChange={(e) => setHasSocietyPermission(e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-yellow-600 focus:ring-yellow-600 focus:ring-offset-zinc-900" 
                          />
                          <div>
                            <p className="font-medium text-zinc-50">Society Permission</p>
                            <p className="text-xs text-zinc-400">I have obtained necessary permissions for the service provider to enter and wash the car.</p>
                          </div>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={hasWaterAvailability}
                            onChange={(e) => setHasWaterAvailability(e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-yellow-600 focus:ring-yellow-600 focus:ring-offset-zinc-900" 
                          />
                          <div>
                            <p className="font-medium text-zinc-50">Water Availability</p>
                            <p className="text-xs text-zinc-400">Water source is available within 20 meters of the parking spot.</p>
                          </div>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={requiresPickup}
                            onChange={(e) => setRequiresPickup(e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-yellow-600 focus:ring-yellow-600 focus:ring-offset-zinc-900" 
                          />
                          <div>
                            <p className="font-medium text-zinc-50">Pick-up and Drop (Optional)</p>
                            <p className="text-xs text-zinc-400">The provider will take the car to a suitable location if washing is not possible on-site.</p>
                          </div>
                        </label>
                      </div>
                    )}

                    {/* Provider Selection */}
                    {serviceMode === 'STATION' && (
                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-2 uppercase tracking-wider">Available Providers Nearby</label>
                        {loadingProviders ? (
                          <p className="text-zinc-400">Finding nearby professionals...</p>
                        ) : providers.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {providers.map(provider => (
                              <div 
                                key={provider.id}
                                onClick={() => { setSelectedProvider(provider); setSelectedSlot(null); }}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  selectedProvider?.id === provider.id
                                  ? 'border-yellow-600 bg-zinc-900 shadow-md'
                                  : 'border-zinc-800 bg-zinc-950 hover:border-yellow-800'
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-bold text-zinc-50">{provider.name}</h3>
                                    <p className="text-sm text-zinc-400">{provider.specialization}</p>
                                  </div>
                                  <span className="text-xs font-medium px-2 py-1 bg-zinc-800 text-zinc-300 rounded">
                                    {provider.distanceKm} km
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-zinc-400">No providers found in your area.</p>
                        )}
                      </div>
                    )}

                    {/* Date Selection */}
                    {(serviceMode === 'HOME' || selectedProvider) && (
                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-2 uppercase tracking-wider">Service Date</label>
                        <div className="max-w-sm">
                          <input 
                            type="date" 
                            min={getMinDate()}
                            value={selectedDate}
                            onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
                            className="w-full p-2.5 border-2 border-zinc-800 rounded-xl focus:ring-0 focus:border-yellow-600 bg-zinc-900 transition-colors font-medium text-zinc-50"
                          />
                        </div>
                      </div>
                    )}

                    {/* Time Selection */}
                    {(serviceMode === 'HOME' || selectedProvider) && selectedDate && (
                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-2 uppercase tracking-wider">Available Slots</label>
                        {loadingSlots ? (
                          <p className="text-zinc-400">Loading slots...</p>
                        ) : slots.length > 0 ? (
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {slots.map(slot => (
                              <button
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot)}
                                disabled={slot.booked}
                                className={`p-2 rounded-lg border-2 text-center text-sm font-bold transition-all ${
                                  slot.booked 
                                  ? 'opacity-50 cursor-not-allowed border-zinc-800 bg-zinc-950 text-zinc-600'
                                  : selectedSlot?.id === slot.id 
                                    ? 'border-yellow-600 bg-yellow-600 text-zinc-50 shadow-md' 
                                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-yellow-800 hover:bg-zinc-900'
                                }`}
                              >
                                {slot.startTime.substring(0,5)}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-zinc-400">No available slots for this date.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: CONFIRM */}
              {step === 5 && (
                <div className="animate-fade-in-up">
                  <h2 className="text-2xl font-bold mb-6 text-zinc-50">Review & Confirm</h2>
                  <div className="bg-zinc-900 border border-blue-100 rounded-2xl p-6 text-blue-800 mb-8">
                    <h3 className="font-bold flex items-center gap-2 mb-2"><ShieldCheck className="w-5 h-5"/> Payment Terms</h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                      You will not be charged now. Payment will be collected securely after the service is completed to your satisfaction.
                    </p>
                  </div>

                  {!appliedCoupon ? (
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wider">Have a Coupon?</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Enter Code" 
                          value={couponCode} 
                          onChange={e => setCouponCode(e.target.value.toUpperCase())} 
                          className="border-2 border-zinc-800 rounded-xl px-4 py-3 flex-grow font-bold text-zinc-50 uppercase focus:border-blue-600 focus:ring-0 transition-colors" 
                        />
                        <button 
                          onClick={applyCoupon} 
                          disabled={validatingCoupon} 
                          className="bg-black text-zinc-50 px-6 py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-red-500 text-sm mt-2 font-medium">{couponError}</p>}
                    </div>
                  ) : (
                    <div className="flex justify-between items-center bg-green-50 text-green-800 p-4 rounded-xl mb-8 border border-green-200 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="font-bold">Coupon '{appliedCoupon.code}' Applied!</span>
                      </div>
                      <button onClick={removeCoupon} className="text-sm font-bold text-green-700 hover:text-green-900 underline">Remove</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Error Message near buttons */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 border border-red-100 text-sm font-medium flex items-center animate-fade-in-up">
                <ShieldCheck className="w-5 h-5 mr-3 shrink-0" /> {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between pt-6 border-t border-zinc-800">
              <button 
                onClick={handleBack} 
                disabled={step === 1 || submitting}
                className={`px-6 py-3.5 rounded-xl font-bold transition-all ${
                  step === 1 
                    ? 'opacity-0 cursor-default pointer-events-none' 
                    : 'text-zinc-400 border-2 border-zinc-800 hover:border-slate-300 hover:bg-zinc-800'
                }`}
              >
                Go Back
              </button>
              
              {step < 5 ? (
                <button 
                  onClick={handleNext}
                  className="bg-yellow-600 text-zinc-50 px-8 py-3.5 rounded-xl font-bold hover:bg-yellow-500 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all flex items-center group"
                >
                  Continue <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button 
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="bg-black text-zinc-50 px-10 py-3.5 rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all flex items-center disabled:opacity-70"
                >
                  {submitting ? 'Confirming...' : 'Confirm Booking'}
                </button>
              )}
            </div>
            
          </div>

          {/* Persistent Summary Sidebar (Right) */}
          <div className="w-full lg:w-96 bg-zinc-900 p-6 sm:p-10 border-t lg:border-t-0 border-zinc-800">
            <div className="sticky top-28">
              <h3 className="text-lg font-bold text-zinc-50 mb-6 uppercase tracking-wider">Booking Summary</h3>
              
              <div className="space-y-6">
                {/* Service Summary */}
                <div className="flex items-start gap-4 pb-6 border-b border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 text-yellow-500 flex items-center justify-center shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Service</p>
                    {selectedService ? (
                      <>
                        <p className="font-bold text-zinc-50">{selectedService.name}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-zinc-400">{selectedService.durationMinutes} mins</p>
                          <p className="font-bold text-zinc-50">₹{selectedService.price}</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-zinc-500 italic">Not selected</p>
                    )}
                  </div>
                </div>

                {/* Vehicle Summary */}
                <div className="flex items-start gap-4 pb-6 border-b border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Vehicle</p>
                    {selectedVehicle ? (
                      <>
                        <p className="font-bold text-zinc-50">{selectedVehicle.brand} {selectedVehicle.model}</p>
                        <p className="text-sm text-zinc-400">{selectedVehicle.vehicleNumber}</p>
                      </>
                    ) : (
                      <p className="text-sm text-zinc-500 italic">Not selected</p>
                    )}
                  </div>
                </div>

                {/* Location Summary */}
                <div className="flex items-start gap-4 pb-6 border-b border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Location</p>
                    {selectedAddress ? (
                      <>
                        <p className="font-bold text-zinc-50 line-clamp-1">{selectedAddress.addressLine}</p>
                        <p className="text-sm text-zinc-400">{selectedAddress.city}</p>
                      </>
                    ) : (
                      <p className="text-sm text-zinc-500 italic">Not selected</p>
                    )}
                  </div>
                </div>

                {/* Schedule Summary */}
                <div className="flex items-start gap-4 pb-6 border-b border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                    <span className="font-bold">4</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Schedule</p>
                    {selectedDate && selectedSlot ? (
                      <>
                        <p className="font-bold text-zinc-50">{selectedDate}</p>
                        <p className="text-sm text-zinc-400">{selectedSlot.startTime}</p>
                      </>
                    ) : (
                      <p className="text-sm text-zinc-500 italic">Not selected</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="mt-8 bg-black rounded-2xl p-6 text-zinc-50 shadow-xl shadow-slate-900/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-500 font-medium">Subtotal</span>
                  <span className="font-bold">₹{selectedService ? selectedService.price : '0.00'}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center mb-4 text-green-400">
                    <span className="font-medium text-sm">Discount</span>
                    <span className="font-bold">
                      -₹{appliedCoupon.discountType === 'PERCENTAGE' ? (selectedService.price * appliedCoupon.discount / 100).toFixed(2) : appliedCoupon.discount}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-slate-700 mt-2">
                  <span className="font-bold uppercase tracking-wider text-sm text-slate-300">Total</span>
                  <span className="font-extrabold text-2xl text-zinc-50">₹{getFinalPrice()}</span>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
