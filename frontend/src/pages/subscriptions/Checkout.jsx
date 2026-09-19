import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);

  // In a real scenario, we'd fetch the plan details first to show the amount.
  // For the mock payment, we'll just show a button to complete it.

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Assuming user is authenticated and token is managed by an interceptor
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/subscriptions/subscribe', {
        planId: Number.parseInt(planId, 10),
        autoRenew
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/subscriptions/success');
    } catch (error) {
      console.error('Subscription failed', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl max-w-md w-full border border-slate-700">
        <h2 className="text-2xl font-bold mb-6">Complete Purchase</h2>
        
        <div className="mb-6 p-4 bg-blue-900/20 rounded-xl border border-blue-800/50">
          <p className="text-sm text-blue-300 mb-2">Selected Plan ID: {planId}</p>
          <p className="text-xs text-slate-400">
            This is a mock checkout flow. Clicking pay will simulate a successful Razorpay transaction and activate your subscription.
          </p>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <input 
            type="checkbox" 
            id="autoRenew" 
            checked={autoRenew} 
            onChange={(e) => setAutoRenew(e.target.checked)}
            className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
          />
          <label htmlFor="autoRenew" className="text-slate-300">
            Enable auto-renewal
          </label>
        </div>

        <button 
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay & Subscribe (Mock)'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
