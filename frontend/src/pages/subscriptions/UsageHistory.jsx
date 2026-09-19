import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Car, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const UsageHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/subscriptions/my/usage', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching usage history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/subscriptions/my" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <History className="text-blue-500" /> Usage History
        </h1>
        <p className="text-slate-400 mb-8">Track your subscription wash consumption</p>

        {loading ? (
          <div className="text-slate-400">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="bg-slate-800 p-8 rounded-2xl text-center border border-slate-700 text-slate-400">
            No washes consumed yet.
          </div>
        ) : (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-slate-300 text-xs uppercase font-medium tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4 text-right">Quota Used</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {history.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-white flex items-center gap-2">
                        <Car className="w-4 h-4 text-slate-500" />
                        {record.vehicleInfo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-emerald-400">
                        {record.serviceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-mono">
                        #{record.bookingId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-orange-400">
                        - {record.washConsumed} Wash
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsageHistory;
