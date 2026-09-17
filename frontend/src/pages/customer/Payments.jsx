import React, { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import api from '../../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments');
      if (res.data.success) {
        setPayments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="w-full pb-10">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Payments</h1>
            <p className="text-zinc-400 mt-1">View your past transactions.</p>
          </div>
        </div>
        
        {payments.length === 0 ? (
          <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-10 text-center">
            <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="w-8 h-8 text-zinc-500" />
            </div>
            <h2 className="text-xl font-bold text-zinc-50 mb-2">No payments yet</h2>
            <p className="text-zinc-400">Your completed transaction history will appear here.</p>
          </div>
        ) : (
          <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-zinc-950 divide-y divide-slate-200">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-50">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                      {payment.serviceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-50">
                      {payment.currency} {payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Payments;
