import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Plus, Edit2, CheckCircle2, XCircle } from 'lucide-react';

const PlansManager = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/admin/subscription-plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching admin plans', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Plan
        </button>
      </div>

      {loading ? (
        <p>Loading plans...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Plan Name</th>
                <th className="px-6 py-4">Billing</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Quota</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plans.map(plan => (
                <tr key={plan.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">{plan.name}</td>
                  <td className="px-6 py-4">{plan.billingPeriod}</td>
                  <td className="px-6 py-4">₹{plan.price}</td>
                  <td className="px-6 py-4">{plan.washLimit} washes</td>
                  <td className="px-6 py-4">
                    {plan.active ? (
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded w-max">
                        <CheckCircle2 className="w-3 h-3" /> ACTIVE
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded w-max">
                        <XCircle className="w-3 h-3" /> INACTIVE
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 p-2">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No plans found. Create one to get started.
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

export default PlansManager;
