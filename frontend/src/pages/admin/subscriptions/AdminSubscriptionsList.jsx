import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { CheckCircle2, XCircle, PauseCircle, PlayCircle, StopCircle, RefreshCw } from 'lucide-react';

const AdminSubscriptionsList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/subscriptions');
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Error fetching admin subscriptions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setProcessingId(id);
    try {
      await api.post(`/admin/subscriptions/${id}/${action}`);
      fetchSubscriptions();
    } catch (error) {
      alert(`Failed to ${action} subscription`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 text-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Subscriptions</h1>
        <button onClick={fetchSubscriptions} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading subscriptions...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">ID / Plan</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Washes</th>
                <th className="px-6 py-4">Next Billing</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscriptions.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">#SUB-{sub.id}</div>
                    <div className="text-slate-500 text-xs">{sub.planName}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{sub.vehicleName}</td>
                  <td className="px-6 py-4">
                    {sub.status === 'ACTIVE' && (
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded w-max">
                        <CheckCircle2 className="w-3 h-3" /> ACTIVE
                      </span>
                    )}
                    {sub.status === 'PENDING' && (
                      <span className="flex items-center gap-1 text-yellow-600 text-xs font-bold bg-yellow-50 px-2 py-1 rounded w-max">
                        <PlayCircle className="w-3 h-3" /> PENDING
                      </span>
                    )}
                    {sub.status === 'PAUSED' && (
                      <span className="flex items-center gap-1 text-orange-600 text-xs font-bold bg-orange-50 px-2 py-1 rounded w-max">
                        <PauseCircle className="w-3 h-3" /> PAUSED
                      </span>
                    )}
                    {sub.status === 'CANCELLED' && (
                      <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded w-max">
                        <XCircle className="w-3 h-3" /> CANCELLED
                      </span>
                    )}
                    {sub.status === 'EXPIRED' && (
                      <span className="flex items-center gap-1 text-slate-600 text-xs font-bold bg-slate-100 px-2 py-1 rounded w-max">
                        <StopCircle className="w-3 h-3" /> EXPIRED
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(sub.washesUsed / sub.washesAllowed) * 100}%` }}></div>
                        </div>
                        <span className="text-xs">{sub.washesUsed}/{sub.washesAllowed}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {sub.status === 'PENDING' && (
                        <button 
                          onClick={() => handleAction(sub.id, 'activate')}
                          disabled={processingId === sub.id}
                          className="text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded disabled:opacity-50"
                        >
                          Activate
                        </button>
                      )}
                      {sub.status === 'ACTIVE' && (
                        <>
                          <button 
                            onClick={() => handleAction(sub.id, 'pause')}
                            disabled={processingId === sub.id}
                            className="text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded disabled:opacity-50"
                          >
                            Pause
                          </button>
                          <button 
                            onClick={() => handleAction(sub.id, 'cancel')}
                            disabled={processingId === sub.id}
                            className="text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {sub.status === 'PAUSED' && (
                        <button 
                          onClick={() => handleAction(sub.id, 'resume')}
                          disabled={processingId === sub.id}
                          className="text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded disabled:opacity-50"
                        >
                          Resume
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {subscriptions.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No subscriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionsList;
