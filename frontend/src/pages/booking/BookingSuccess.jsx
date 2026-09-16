import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Car } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const BookingSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get(`/bookings/${id}`);
        if (response.data.success) {
          setBooking(response.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchBooking();
    }
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 max-w-lg w-full text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600 mb-8">
            Your service has been successfully scheduled. We will notify you when the professional is on the way.
          </p>

          {booking && (
            <div className="bg-slate-50 rounded-xl p-6 text-left mb-8 border border-slate-200">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                <span className="text-sm font-medium text-slate-500">Booking ID: #{booking.id}</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                  {booking.status}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-bold text-slate-900">{booking.serviceName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 text-slate-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Date</p>
                      <p className="text-sm font-medium text-slate-900">{booking.bookingDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-4 h-4 text-slate-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Time</p>
                      <p className="text-sm font-medium text-slate-900">{booking.bookingTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Car className="w-4 h-4 text-slate-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Vehicle</p>
                      <p className="text-sm font-medium text-slate-900">{booking.vehicleName}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-slate-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Amount</p>
                      <p className="text-sm font-bold text-blue-600">₹{booking.totalAmount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/my-bookings" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
              View My Bookings
            </Link>
            <Link to="/dashboard" className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-md hover:bg-slate-50">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingSuccess;
