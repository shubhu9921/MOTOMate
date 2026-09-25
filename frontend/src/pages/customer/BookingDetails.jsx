import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Car, MapPin, XCircle, ChevronLeft, CheckCircle2, Star, CreditCard, Banknote } from 'lucide-react';
import { VALIDATION_RULES, validateField } from '../../utils/validation';
import api from '../../services/api';

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');
  
  // Review state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/bookings/${id}`);
      if (response.data.success) {
        setBooking(response.data.data);
      }
    } catch (err) {
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }
    
    setCancelling(true);
    try {
      const response = await api.put(`/bookings/${id}/cancel`);
      if (response.data.success) {
        setBooking(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a rating');
    
    let errorMsg = validateField(comment, { required: false, maxLength: 1000 }, "Review Comment");
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    
    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        bookingId: booking.id,
        rating,
        comment
      });
      if (res.data.success) {
        setReviewSubmitted(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED': return 'bg-zinc-800 text-blue-800 border-yellow-900';
      case 'ASSIGNED': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'ON_THE_WAY': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-zinc-800 text-zinc-100 border-zinc-800';
    }
  };

  const timelineSteps = [
    { label: 'Booking Created', statuses: ['PENDING', 'CONFIRMED', 'ASSIGNED', 'ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED'] },
    { label: 'Confirmed', statuses: ['CONFIRMED', 'ASSIGNED', 'ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED'] },
    { label: 'Provider Assigned', statuses: ['ASSIGNED', 'ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED'] },
    { label: 'On The Way', statuses: ['ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED'] },
    { label: 'In Progress', statuses: ['IN_PROGRESS', 'COMPLETED'] },
    { label: 'Completed', statuses: ['COMPLETED'] },
  ];

  if (loading) {
    return <div className="flex items-center justify-center bg-zinc-900">Loading details...</div>;
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col font-sans">
        <div className="flex-grow flex flex-col items-center justify-center">
          <p className="text-red-500 mb-4">{error || 'Booking not found'}</p>
          <Link to="/my-bookings" className="text-yellow-500 hover:underline">Return to My Bookings</Link>
        </div>
      </div>
    );
  }

  const canCancel = booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED';

  return (
    <>
      <div className="w-full pb-10">
        
        <Link to="/my-bookings" className="inline-flex items-center text-zinc-400 hover:text-yellow-400 mb-6 font-medium">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to My Bookings
        </Link>

        <div className="bg-zinc-950 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden mb-8">
          {/* Header */}
          <div className="px-6 py-6 border-b border-zinc-800 bg-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm text-zinc-400 mb-1">Booking ID: #{booking.id}</p>
              <h1 className="text-2xl font-bold text-zinc-50">{booking.serviceName}</h1>
            </div>
            <div className={`px-4 py-1.5 rounded-full border text-sm font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
              {booking.status}
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            
            {/* Timeline */}
            {booking.status !== 'CANCELLED' && (
              <div className="mb-10">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-6">Booking Timeline</h3>
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-800 md:hidden"></div>
                  <div className="hidden md:block absolute top-4 left-0 right-0 h-0.5 bg-zinc-800"></div>
                  
                  {timelineSteps.map((step, index) => {
                    const isCompleted = step.statuses.includes(booking.status);
                    const isCurrent = timelineSteps.findIndex(s => s.statuses.includes(booking.status) === false) - 1 === index || (booking.status === 'COMPLETED' && index === 5);
                    
                    return (
                      <div key={index} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-2 mb-6 md:mb-0 pl-8 md:pl-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-zinc-950 transition-colors duration-300 ${
                          isCompleted ? 'border-yellow-600 text-yellow-500' : 'border-zinc-700 text-slate-300'
                        } ${isCurrent && booking.status !== 'COMPLETED' ? 'ring-4 ring-blue-100' : ''}`}>
                          {isCompleted ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                        </div>
                        <span className={`text-xs md:text-sm font-medium ${isCompleted ? 'text-zinc-50' : 'text-zinc-500'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Schedule & Location</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-zinc-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-400">Date & Time</p>
                      <p className="font-medium text-zinc-50">{booking.bookingDate} at {booking.bookingTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-zinc-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-400">Service Address</p>
                      <p className="font-medium text-zinc-50">Address ID: {booking.addressId}</p>
                    </div>
                  </div>
                  {booking.serviceMode && (
                    <div className="flex items-start">
                      <div className="w-5 h-5 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-zinc-500 font-bold uppercase text-[10px]">MODE</span>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Service Mode</p>
                        <p className="font-medium text-zinc-50">{booking.serviceMode}</p>
                        {booking.serviceMode === 'HOME' && (
                          <div className="mt-1 flex flex-col gap-0.5">
                            <span className="text-[10px] text-zinc-500">{booking.hasSocietyPermission ? '✓ Society Permission' : '✗ No Society Permission'}</span>
                            <span className="text-[10px] text-zinc-500">{booking.hasWaterAvailability ? '✓ Water Available' : '✗ No Water Info'}</span>
                            {booking.requiresPickup && <span className="text-[10px] text-zinc-500">✓ Requires Pickup</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Service Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Car className="w-5 h-5 text-zinc-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-400">Vehicle</p>
                      <p className="font-medium text-zinc-50">{booking.vehicleName}</p>
                      <p className="text-xs text-zinc-400 uppercase">{booking.vehicleNumber}</p>
                    </div>
                  </div>
                  {booking.serviceProviderId && (
                    <div className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-zinc-400">Service Provider</p>
                        <p className="font-medium text-zinc-50">Provider #{booking.serviceProviderId}</p>
                        {booking.companyIdUrl && (
                          <a href={booking.companyIdUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline mr-2">Company ID</a>
                        )}
                        {booking.governmentIdUrl && (
                          <a href={booking.governmentIdUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline">Govt ID</a>
                        )}
                      </div>
                    </div>
                  )}
                  {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && booking.status !== 'PENDING' && (
                    <div className="flex items-start bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                      <div className="mr-3">
                        {booking.isVerified ? (
                           <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                           <div className="w-5 h-5 flex items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-bold">!</div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Verification Status</p>
                        {booking.isVerified ? (
                          <p className="font-bold text-green-500 text-sm">Verified</p>
                        ) : (
                          <>
                            <p className="font-bold text-yellow-500 text-sm mb-1">Pending Verification</p>
                            <p className="text-xs text-zinc-300">Share this OTP with the provider:</p>
                            <p className="text-2xl font-black tracking-widest text-zinc-50 mt-1 bg-black px-3 py-1 rounded inline-block">{booking.verificationOtp}</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="pt-6 border-t border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Payment Summary</h3>
              <div className="bg-zinc-900 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Total Amount</p>
                  <p className="text-4xl font-extrabold text-yellow-500">₹{booking.totalAmount}</p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center sm:text-right">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Method</p>
                    <div className="flex items-center gap-1 font-semibold text-zinc-300">
                      <Banknote size={16} /> {booking.paymentMethod || 'CASH'}
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Status</p>
                    <div className={`flex items-center gap-1 font-bold ${booking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {booking.paymentStatus || 'PENDING'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="pt-6 border-t border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Additional Notes</h3>
                <p className="text-zinc-300 bg-zinc-900 p-4 rounded-md">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* Action Bar */}
          {canCancel && (
            <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex justify-end">
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="inline-flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-md font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                {cancelling ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          )}
        </div>

        {/* Review Section */}
        {booking.status === 'COMPLETED' && !reviewSubmitted && (
          <div className="bg-zinc-950 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden p-6 md:p-8">
            <h2 className="text-2xl font-bold text-zinc-50 mb-2">Rate Your Service</h2>
            <p className="text-zinc-400 mb-6">How was your experience with MOTOMate? Your feedback helps us improve.</p>
            
            <form onSubmit={submitReview}>
              <div className="mb-6 flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-10 h-10 ${
                        star <= (hoverRating || rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-slate-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Write a review (optional)</label>
                <textarea
                  className="w-full border-zinc-700 rounded-lg shadow-sm focus:ring-yellow-600 focus:border-yellow-600"
                  rows="4"
                  placeholder="Tell us what you liked or what could be better..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={rating === 0 || submittingReview}
                className="px-6 py-3 bg-yellow-600 text-zinc-50 font-bold rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {reviewSubmitted && (
          <div className="bg-green-50 rounded-2xl border border-green-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-zinc-50 mb-2">Thank you for your review!</h2>
            <p className="text-zinc-400">Your feedback has been successfully submitted.</p>
          </div>
        )}

      </div>
    </>
  );
};

export default BookingDetails;
