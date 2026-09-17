import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Car, ChevronRight, XCircle } from 'lucide-react';
import api from '../../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      if (response.data.success) {
        // Sort bookings by date, newest first
        const sorted = response.data.data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
        setBookings(sorted);
      }
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-zinc-800 text-blue-800';
      case 'ASSIGNED': return 'bg-indigo-100 text-indigo-800';
      case 'ON_THE_WAY': return 'bg-purple-100 text-purple-800';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-zinc-800 text-zinc-100';
    }
  };

  return (
    <>
      <div className="w-full pb-10">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">My Bookings</h1>
            <p className="text-zinc-400 mt-1">Track and manage your service history.</p>
          </div>
          <Link to="/book" className="bg-yellow-600 text-zinc-50 px-6 py-2.5 rounded-md font-medium hover:bg-yellow-500 transition-colors">
            Book New Wash
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md mb-6 border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">Loading your bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-10 text-center">
            <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-zinc-500" />
            </div>
            <h2 className="text-xl font-bold text-zinc-50 mb-2">No bookings yet</h2>
            <p className="text-zinc-400 mb-6">You haven't booked any services yet. Experience premium car care at your doorstep.</p>
            <Link to="/book" className="bg-yellow-600 text-zinc-50 px-6 py-2.5 rounded-md font-medium hover:bg-yellow-500">
              Book a Wash Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                  
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <h3 className="text-xl font-bold text-zinc-50">{booking.serviceName}</h3>
                        <p className="text-sm text-zinc-400 mt-1">Booking #{booking.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-yellow-500">₹{booking.totalAmount}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-800">
                      <div className="flex items-center text-zinc-400">
                        <Calendar className="w-4 h-4 mr-2 text-zinc-500" />
                        <span className="text-sm font-medium">{booking.bookingDate}</span>
                      </div>
                      <div className="flex items-center text-zinc-400">
                        <Clock className="w-4 h-4 mr-2 text-zinc-500" />
                        <span className="text-sm font-medium">{booking.bookingTime}</span>
                      </div>
                      <div className="flex items-center text-zinc-400">
                        <Car className="w-4 h-4 mr-2 text-zinc-500" />
                        <span className="text-sm font-medium">{booking.vehicleName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex flex-row sm:flex-col gap-3 justify-end items-center sm:items-end border-t sm:border-t-0 sm:border-l border-zinc-800 pt-4 sm:pt-0 sm:pl-6">
                    <Link to={`/my-bookings/${booking.id}`} className="flex-1 sm:flex-none text-center bg-zinc-950 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-md font-medium hover:bg-zinc-800 flex items-center justify-center">
                      View Details <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyBookings;
