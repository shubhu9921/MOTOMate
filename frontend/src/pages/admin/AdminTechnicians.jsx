import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader2 } from 'lucide-react';

const AdminTechnicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await api.get('/admin/providers');
      // Filter for technicians, or if the backend doesn't have it set properly for the mock data, 
      // we can just pretend for now by filtering on specialization or ID
      const allProviders = res.data.data;
      const techs = allProviders.filter(p => p.specialization === 'TECHNICIAN');
      setTechnicians(techs);
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
          <h1 className="text-3xl font-bold text-zinc-50">Technicians</h1>
          <p className="text-zinc-400 mt-1">View and manage specialized technicians.</p>
        </div>

        <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-zinc-900 text-zinc-400 text-xs uppercase border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3 font-medium">Tech ID</th>
                  <th className="px-6 py-3 font-medium">Employee Code</th>
                  <th className="px-6 py-3 font-medium">User Name</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr><td colSpan="4" className="px-6 py-8 text-center"><Loader2 className="animate-spin text-yellow-500 h-6 w-6 mx-auto" /></td></tr>
                ) : technicians.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-8 text-center text-zinc-400">No technicians found.</td></tr>
                ) : (
                  technicians.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-800">
                      <td className="px-6 py-4 font-medium text-zinc-50">#{p.id}</td>
                      <td className="px-6 py-4 font-bold text-zinc-50">{p.employeeCode}</td>
                      <td className="px-6 py-4">{p.user?.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          p.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                          p.status === 'BUSY' ? 'bg-zinc-800 text-blue-800' :
                          p.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                          'bg-zinc-800 text-zinc-100'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminTechnicians;
