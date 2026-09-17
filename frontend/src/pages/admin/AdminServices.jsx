import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader2 } from 'lucide-react';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services'); // public endpoint is fine
      setServices(res.data.data);
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
          <h1 className="text-3xl font-bold text-zinc-50">Services</h1>
          <p className="text-zinc-400 mt-1">View car care services.</p>
        </div>

        <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-zinc-900 text-zinc-400 text-xs uppercase border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Duration</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center"><Loader2 className="animate-spin text-yellow-500 h-6 w-6 mx-auto" /></td></tr>
                ) : services.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-zinc-400">No services found.</td></tr>
                ) : (
                  services.map((s) => (
                    <tr key={s.id} className="hover:bg-zinc-800">
                      <td className="px-6 py-4 font-medium text-zinc-50">#{s.id}</td>
                      <td className="px-6 py-4 font-bold text-zinc-50">{s.name}</td>
                      <td className="px-6 py-4">₹{s.price}</td>
                      <td className="px-6 py-4">{s.durationMinutes} min</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.active ? 'bg-green-100 text-green-800' : 'bg-zinc-800 text-zinc-100'}`}>
                          {s.active ? 'Active' : 'Inactive'}
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

export default AdminServices;
