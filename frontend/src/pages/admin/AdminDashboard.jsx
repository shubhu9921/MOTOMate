import React, { useState, useEffect } from 'react';
import { Users, Calendar, CheckCircle, Clock, Package, Briefcase, IndianRupee, HardHat } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser?.role === 'ADMIN') {
      fetchAdminData();
    }
  }, [currentUser]);

  const fetchAdminData = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.data);
    } catch (err) {
      setError('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (currentUser?.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  const statCards = [
    { title: 'Total Bookings', value: stats?.totalBookings, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100', link: '/admin/bookings' },
    { title: 'Pending Bookings', value: stats?.pendingBookings, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100', link: '/admin/bookings' },
    { title: 'Active Jobs', value: stats?.activeJobs, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100', link: '/admin/bookings' },
    { title: 'Completed Jobs', value: stats?.completedBookings, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', link: '/admin/bookings' },
    { title: 'Total Revenue', value: `₹${stats?.totalRevenue || 0}`, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-100', link: '/admin/bookings' },
    { title: 'Total Customers', value: stats?.totalCustomers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100', link: '/admin/customers' },
    { title: 'Active Services', value: stats?.activeServices, icon: Package, color: 'text-rose-600', bg: 'bg-rose-100', link: '/admin/services' },
    { title: 'Available Providers', value: stats?.availableProviders, icon: HardHat, color: 'text-amber-600', bg: 'bg-amber-100', link: '/admin/providers' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">System operations and overview.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md mb-6 border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">Loading dashboard...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statCards.map((stat, i) => (
              <Link to={stat.link} key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition block group">
                <div className="flex items-center">
                  <div className={`${stat.bg} p-3 rounded-lg mr-4 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value || 0}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
