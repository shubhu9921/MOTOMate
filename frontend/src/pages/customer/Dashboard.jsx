import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Car, MapPin, CheckCircle, Clock3, ChevronUp, ChevronRight, List, Settings, Zap, Tag, FileSearch, History } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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

  const upcomingBooking = (bookings || []).find(b => b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'ASSIGNED');
  const completedCount = (bookings || []).filter(b => b.status === 'COMPLETED').length;
  const activeCount = (bookings || []).filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length;

  // Format today's date
  const today = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-GB', options); // e.g. "Wednesday, 17 September 2026"

  const userName = currentUser?.name?.split(' ')[0] || 's';

  return (
    <>
      <div className="w-full pb-10">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50 flex items-center gap-2">
              Welcome back, {userName}! <span>👋</span>
            </h1>
            <p className="text-zinc-400 mt-1">Here's what's happening with your car services.</p>
          </div>
          <div className="flex items-center text-zinc-400 text-sm font-medium">
            <Calendar className="w-4 h-4 mr-2" />
            {formattedDate}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-zinc-900 p-3 rounded-full text-yellow-500">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-400">Total Bookings</p>
                <p className="text-2xl font-bold text-zinc-50">{(bookings || []).length}</p>
              </div>
            </div>
            <div className="text-green-500 flex items-center text-xs font-medium pl-14">
              <ChevronUp className="w-3 h-3 mr-1" /> 0% this month
            </div>
          </div>
          
          <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-green-50 p-3 rounded-full text-green-500">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-400">Completed Services</p>
                <p className="text-2xl font-bold text-zinc-50">{completedCount}</p>
              </div>
            </div>
            <div className="text-green-500 flex items-center text-xs font-medium pl-14">
              <ChevronUp className="w-3 h-3 mr-1" /> 0% this month
            </div>
          </div>

          <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-orange-50 p-3 rounded-full text-orange-500">
                <Clock3 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-400">Active Bookings</p>
                <p className="text-2xl font-bold text-zinc-50">{activeCount}</p>
              </div>
            </div>
            <div className="text-green-500 flex items-center text-xs font-medium pl-14">
              <ChevronUp className="w-3 h-3 mr-1" /> 0% this month
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Upcoming Booking */}
            <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
              <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock3 className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-lg font-bold text-zinc-50">Upcoming Booking</h2>
                </div>
                <Link to="/my-bookings" className="text-yellow-500 text-sm font-medium hover:text-yellow-300">View All</Link>
              </div>
              <div className="p-6">
                {loading ? (
                  <p className="text-zinc-400">Loading...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : upcomingBooking ? (
                  <div>
                    <h3 className="text-xl font-bold text-zinc-50 mb-4">{upcomingBooking.serviceName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-zinc-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-zinc-400">Date</p>
                          <p className="font-medium text-zinc-50">{upcomingBooking.bookingDate}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-zinc-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-zinc-400">Time</p>
                          <p className="font-medium text-zinc-50">{upcomingBooking.bookingTime}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Car className="w-5 h-5 text-zinc-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-zinc-400">Vehicle</p>
                          <p className="font-medium text-zinc-50">{upcomingBooking.vehicleName} ({upcomingBooking.vehicleNumber})</p>
                        </div>
                      </div>
                    </div>
                    <Link to={`/my-bookings/${upcomingBooking.id}`} className="inline-flex items-center text-yellow-500 font-medium hover:text-yellow-300">
                      View full details &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-800 mb-4 text-zinc-500">
                      <Calendar className="w-10 h-10" />
                      <div className="absolute bottom-0 right-0 bg-yellow-600 text-zinc-50 rounded-full p-1 border-2 border-white">
                        <Clock className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-50">No upcoming bookings</h3>
                    <p className="text-sm text-zinc-400 mt-1 mb-6">Ready for a spotless car? Book your next wash now.</p>
                    <Link to="/book" className="inline-flex items-center gap-2 bg-yellow-600 text-zinc-50 px-6 py-2.5 rounded-md font-medium hover:bg-yellow-500 transition-colors shadow-sm">
                      <Calendar className="w-4 h-4" /> Book a Wash
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
              <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-lg font-bold text-zinc-50">Recent Activity</h2>
                </div>
                <Link to="/history" className="text-yellow-500 text-sm font-medium hover:text-yellow-300">View All</Link>
              </div>
              <div className="p-6">
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-800 mb-4 text-zinc-500">
                    <FileSearch className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-50">No recent activity</h3>
                  <p className="text-sm text-zinc-400 mt-1">Your bookings, payments, and notifications will appear here.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Area (Right Column) */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
              <div className="px-6 py-5 border-b border-zinc-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-bold text-zinc-50">Quick Actions</h2>
              </div>
              <div className="flex flex-col">
                <Link to="/book" className="flex items-center justify-between px-6 py-4 border-b border-slate-50 text-zinc-300 hover:bg-zinc-800 transition-colors group">
                  <div className="flex items-center gap-3 font-medium text-sm">
                    <div className="bg-zinc-900 text-yellow-500 p-2 rounded-lg group-hover:bg-blue-100 transition-colors"><Calendar className="w-4 h-4" /></div>
                    Book a New Service
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-600" />
                </Link>
                <Link to="/my-bookings" className="flex items-center justify-between px-6 py-4 border-b border-slate-50 text-zinc-300 hover:bg-zinc-800 transition-colors group">
                  <div className="flex items-center gap-3 font-medium text-sm">
                    <div className="bg-zinc-900 text-yellow-500 p-2 rounded-lg group-hover:bg-blue-100 transition-colors"><List className="w-4 h-4" /></div>
                    View All Bookings
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-600" />
                </Link>
                <Link to="/vehicles" className="flex items-center justify-between px-6 py-4 border-b border-slate-50 text-zinc-300 hover:bg-zinc-800 transition-colors group">
                  <div className="flex items-center gap-3 font-medium text-sm">
                    <div className="bg-zinc-900 text-yellow-500 p-2 rounded-lg group-hover:bg-blue-100 transition-colors"><Car className="w-4 h-4" /></div>
                    Manage Vehicles
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-600" />
                </Link>
                <Link to="/addresses" className="flex items-center justify-between px-6 py-4 border-b border-slate-50 text-zinc-300 hover:bg-zinc-800 transition-colors group">
                  <div className="flex items-center gap-3 font-medium text-sm">
                    <div className="bg-zinc-900 text-yellow-500 p-2 rounded-lg group-hover:bg-blue-100 transition-colors"><MapPin className="w-4 h-4" /></div>
                    Manage Addresses
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-600" />
                </Link>
                <Link to="/settings" className="flex items-center justify-between px-6 py-4 text-zinc-300 hover:bg-zinc-800 transition-colors group">
                  <div className="flex items-center gap-3 font-medium text-sm">
                    <div className="bg-zinc-900 text-yellow-500 p-2 rounded-lg group-hover:bg-blue-100 transition-colors"><Settings className="w-4 h-4" /></div>
                    Account Settings
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-600" />
                </Link>
              </div>
            </div>

            {/* Special Offers */}
            <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
              <div className="px-6 py-5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-lg font-bold text-zinc-50">Special Offers</h2>
                </div>
                <Link to="/offers" className="text-yellow-500 text-sm font-medium hover:text-yellow-300">View All</Link>
              </div>
              <div className="px-6 pb-6">
                <div className="rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-32 shadow-sm group border border-zinc-800">
                  <div className="absolute inset-0 bg-[url('/foam-car.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-900/70 to-transparent"></div>
                  <div className="relative z-10 w-2/3">
                    <h3 className="text-zinc-50 font-bold text-lg leading-tight mb-2">Get 20% Off<br/>on Your First Wash</h3>
                    <p className="text-green-100 text-xs font-medium">Use code <span className="font-bold text-zinc-50 bg-green-800/50 px-1 py-0.5 rounded">REVORA20</span></p>
                  </div>
                  <button className="absolute bottom-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-zinc-50 rounded-full w-8 h-8 flex items-center justify-center shadow-sm backdrop-blur-sm transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-center mt-4 gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                  <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                  <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                </div>
              </div>
            </div>
            
            {/* Mobile Book Button */}
            <Link to="/book" className="sm:hidden block w-full text-center bg-yellow-600 text-zinc-50 px-6 py-3 rounded-md font-medium hover:bg-yellow-500 transition-colors shadow-sm">
              <Calendar className="w-4 h-4 inline mr-2 -mt-1" /> Book a Wash
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

