import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Car, MapPin, CheckCircle, Clock3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

const Dashboard = () => {
  const { currentUser } = useAuth();
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
        setBookings(response.data.data);
      }
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const upcomingBooking = bookings.find(b => b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'ASSIGNED');
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;
  const activeCount = bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome, {currentUser?.name?.split(' ')[0]}</h1>
            <p className="text-slate-600 mt-1">Here's what's happening with your car services.</p>
          </div>
          <Link to="/book" className="hidden sm:inline-flex bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm">
            Book a Wash
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
            <div className="bg-blue-100 p-4 rounded-full mr-4 text-blue-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Bookings</p>
              <p className="text-2xl font-bold text-slate-900">{bookings.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
            <div className="bg-green-100 p-4 rounded-full mr-4 text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Completed Services</p>
              <p className="text-2xl font-bold text-slate-900">{completedCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
            <div className="bg-orange-100 p-4 rounded-full mr-4 text-orange-600">
              <Clock3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Bookings</p>
              <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Booking */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Upcoming Booking</h2>
                {upcomingBooking && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {upcomingBooking.status}
                  </span>
                )}
              </div>
              <div className="p-6">
                {loading ? (
                  <p className="text-slate-500">Loading...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : upcomingBooking ? (
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{upcomingBooking.serviceName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">Date</p>
                          <p className="font-medium text-slate-900">{upcomingBooking.bookingDate}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">Time</p>
                          <p className="font-medium text-slate-900">{upcomingBooking.bookingTime}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Car className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-500">Vehicle</p>
                          <p className="font-medium text-slate-900">{upcomingBooking.vehicleName} ({upcomingBooking.vehicleNumber})</p>
                        </div>
                      </div>
                    </div>
                    <Link to={`/my-bookings/${upcomingBooking.id}`} className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
                      View full details &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                      <Calendar className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No upcoming bookings</h3>
                    <p className="text-slate-500 mt-1 mb-6">Ready for a spotless car? Book your next wash now.</p>
                    <Link to="/book" className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700">
                      Book a Wash
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
              </div>
              <div className="p-2">
                <Link to="/book" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-md font-medium">
                  Book a New Service
                </Link>
                <Link to="/my-bookings" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-md font-medium">
                  View All Bookings
                </Link>
                <Link to="/profile/vehicles" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-md font-medium">
                  Manage Vehicles
                </Link>
                <Link to="/profile/addresses" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-md font-medium">
                  Manage Addresses
                </Link>
                <Link to="/profile" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-md font-medium">
                  Account Settings
                </Link>
              </div>
            </div>
            
            {/* Mobile Book Button */}
            <Link to="/book" className="sm:hidden block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm">
              Book a Wash
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
