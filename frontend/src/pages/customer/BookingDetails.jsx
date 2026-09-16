import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Car, MapPin, XCircle, ChevronLeft, CheckCircle2, Star, CreditCard, Banknote } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
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
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ASSIGNED': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'ON_THE_WAY': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
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
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading details...</div>;
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <p className="text-red-500 mb-4">{error || 'Booking not found'}</p>
          <Link to="/my-bookings" className="text-blue-600 hover:underline">Return to My Bookings</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const canCancel = booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        <Link to="/my-bookings" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 font-medium">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to My Bookings
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          {/* Header */}
          <div className="px-6 py-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Booking ID: #{booking.id}</p>
              <h1 className="text-2xl font-bold text-slate-900">{booking.serviceName}</h1>
            </div>
            <div className={`px-4 py-1.5 rounded-full border text-sm font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
              {booking.status}
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            
            {/* Timeline */}
            {booking.status !== 'CANCELLED' && (
              <div className="mb-10">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Booking Timeline</h3>
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 md:hidden"></div>
                  <div className="hidden md:block absolute top-4 left-0 right-0 h-0.5 bg-slate-200"></div>
                  
                  {timelineSteps.map((step, index) => {
                    const isCompleted = step.statuses.includes(booking.status);
                    const isCurrent = timelineSteps.findIndex(s => s.statuses.includes(booking.status) === false) - 1 === index || (booking.status === 'COMPLETED' && index === 5);
                    
                    return (
                      <div key={index} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-2 mb-6 md:mb-0 pl-8 md:pl-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-300 ${
                          isCompleted ? 'border-blue-600 text-blue-600' : 'border-slate-300 text-slate-300'
                        } ${isCurrent && booking.status !== 'COMPLETED' ? 'ring-4 ring-blue-100' : ''}`}>
                          {isCompleted ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                        </div>
                        <span className={`text-xs md:text-sm font-medium ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
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
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Schedule & Location</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Date & Time</p>
                      <p className="font-medium text-slate-900">{booking.bookingDate} at {booking.bookingTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Service Address</p>
                      <p className="font-medium text-slate-900">Address ID: {booking.addressId}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Service Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Car className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Vehicle</p>
                      <p className="font-medium text-slate-900">{booking.vehicleName}</p>
                      <p className="text-xs text-slate-500 uppercase">{booking.vehicleNumber}</p>
                    </div>
                  </div>
                  {booking.serviceProviderId && (
                    <div className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-500">Service Provider</p>
                        <p className="font-medium text-slate-900">Provider #{booking.serviceProviderId}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Payment Summary</h3>
              <div className="bg-slate-50 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                  <p className="text-4xl font-extrabold text-blue-600">₹{booking.totalAmount}</p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center sm:text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Method</p>
                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      <Banknote size={16} /> {booking.paymentMethod || 'CASH'}
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                    <div className={`flex items-center gap-1 font-bold ${booking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {booking.paymentStatus || 'PENDING'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Additional Notes</h3>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-md">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* Action Bar */}
          {canCancel && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
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
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Rate Your Service</h2>
            <p className="text-slate-600 mb-6">How was your experience with MotoMate? Your feedback helps us improve.</p>
            
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Write a review (optional)</label>
                <textarea
                  className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Tell us what you liked or what could be better..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={rating === 0 || submittingReview}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank you for your review!</h2>
            <p className="text-slate-600">Your feedback has been successfully submitted.</p>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default BookingDetails;
