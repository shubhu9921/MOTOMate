import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader2, Search, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  

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



  return (
    <>
<div className="pb-10">
<div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Bookings Management</h1>
            <p className="text-zinc-400 mt-1">Manage and assign customer bookings.</p>
          </div>
        </div>

        <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search bookings..." 
                className="w-full pl-10 pr-4 py-2 border border-zinc-700 rounded-lg focus:ring-yellow-600 focus:border-yellow-600"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-zinc-900 text-zinc-400 text-xs uppercase border-b border-zinc-800">
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
                      <Loader2 className="animate-spin text-yellow-500 h-6 w-6 mx-auto" />
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-zinc-400">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-800">
                      <td className="px-6 py-4">
                        <div className="font-bold text-zinc-50">#{b.id}</div>
                        <div className="text-xs text-zinc-400">{b.bookingDate} {b.bookingTime}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-zinc-50">{b.customerName || `User #${b.userId}`}</div>
                        <div className="text-xs text-zinc-400">{b.customerPhone || ''}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-50">{b.serviceName}</td>
                      <td className="px-6 py-4">
                        {b.serviceProviderId ? (
                          <div className="flex flex-col">
                            <span className="text-zinc-50 font-medium">Provider #{b.serviceProviderId}</span>
                            <span className="text-xs text-zinc-400 mt-1">Status: {b.assignmentStatus || 'ASSIGNED'}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-zinc-500 italic">Unassigned</span>
                            <span className="text-xs text-zinc-400 mt-1">Attempts: {b.assignmentAttemptCount || 0}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          b.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          b.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          b.status === 'ASSIGNED' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-zinc-800 text-blue-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-zinc-500 text-xs">Auto-assigned</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-sm text-zinc-400">
              Page {page + 1} of {totalPages === 0 ? 1 : totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                disabled={page === 0} 
                onClick={() => setPage(p => p - 1)}
                className="p-2 border border-zinc-700 rounded-md disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                disabled={page >= totalPages - 1} 
                onClick={() => setPage(p => p + 1)}
                className="p-2 border border-zinc-700 rounded-md disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminBookings;
