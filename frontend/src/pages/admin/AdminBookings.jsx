import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { Loader2, Search, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Assign Provider Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/bookings?page=${page}&size=20`);
      setBookings(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableProviders = async () => {
    try {
      const res = await api.get('/admin/providers/available');
      setAvailableProviders(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignClick = (booking) => {
    setSelectedBooking(booking);
    fetchAvailableProviders();
    setShowAssignModal(true);
  };

  const submitAssignProvider = async () => {
    if (!selectedProviderId) return;
    try {
      await api.put(`/admin/bookings/${selectedBooking.id}/assign-provider`, {
        providerId: selectedProviderId
      });
      setShowAssignModal(false);
      setSelectedProviderId('');
      fetchBookings(); // refresh
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign provider');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Bookings Management</h1>
            <p className="text-slate-600 mt-1">Manage and assign customer bookings.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search bookings..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-medium">ID / Date</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Service</th>
                  <th className="px-6 py-3 font-medium">Provider</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <Loader2 className="animate-spin text-blue-600 h-6 w-6 mx-auto" />
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">#{b.id}</div>
                        <div className="text-xs text-slate-500">{b.bookingDate} {b.bookingTime}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-900">User #{b.userId}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{b.serviceName}</td>
                      <td className="px-6 py-4">
                        {b.serviceProviderId ? (
                          <span className="text-slate-900 font-medium">Provider #{b.serviceProviderId}</span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          b.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          b.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          b.status === 'ASSIGNED' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {(b.status === 'PENDING' || b.status === 'CONFIRMED') && !b.serviceProviderId && (
                          <button 
                            onClick={() => handleAssignClick(b)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-end gap-1 ml-auto"
                          >
                            <UserPlus size={16} /> Assign
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm text-slate-600">
              Page {page + 1} of {totalPages === 0 ? 1 : totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                disabled={page === 0} 
                onClick={() => setPage(p => p - 1)}
                className="p-2 border border-slate-300 rounded-md disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                disabled={page >= totalPages - 1} 
                onClick={() => setPage(p => p + 1)}
                className="p-2 border border-slate-300 rounded-md disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Assign Provider Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Assign Provider to #{selectedBooking?.id}</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Available Providers</label>
              {availableProviders.length === 0 ? (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  No providers are currently available.
                </div>
              ) : (
                <select 
                  className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value)}
                >
                  <option value="">Select a provider</option>
                  {availableProviders.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.employeeCode} - Provider User ID: {p.user.id}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                onClick={submitAssignProvider}
                disabled={!selectedProviderId}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminBookings;
