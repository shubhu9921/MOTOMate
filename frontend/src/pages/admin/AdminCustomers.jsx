import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/customers?page=${page}&size=20`);
      setCustomers(res.data.data.content);
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
<div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-50">Customers</h1>
          <p className="text-zinc-400 mt-1">View and manage registered customers.</p>
        </div>

        <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-zinc-900 text-zinc-400 text-xs uppercase border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Phone</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center"><Loader2 className="animate-spin text-yellow-500 h-6 w-6 mx-auto" /></td></tr>
                ) : customers.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-zinc-400">No customers found.</td></tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-800">
                      <td className="px-6 py-4 font-medium text-zinc-50">#{c.id}</td>
                      <td className="px-6 py-4 font-bold text-zinc-50">{c.name}</td>
                      <td className="px-6 py-4">{c.email}</td>
                      <td className="px-6 py-4">{c.phone || 'N/A'}</td>
                      <td className="px-6 py-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-sm text-zinc-400">Page {page + 1} of {totalPages === 0 ? 1 : totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-2 border border-zinc-700 rounded-md disabled:opacity-50"><ChevronLeft size={16} /></button>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="p-2 border border-zinc-700 rounded-md disabled:opacity-50"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
</>
  );
};

export default AdminCustomers;
