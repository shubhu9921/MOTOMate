import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Droplets, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MySubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMySubscription = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/subscriptions/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubscription(response.data); // empty if none
      } catch (error) {
        console.error('Error fetching subscription', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMySubscription();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading your dashboard...</div>;
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <Droplets className="w-24 h-24 text-slate-700 mb-6" />
        <h2 className="text-3xl font-bold mb-4">No Active Subscription</h2>
        <p className="text-slate-400 mb-8 max-w-md text-center">
          Upgrade your car care routine. Get priority booking, unlimited shine, and exclusive discounts.
        </p>
        <Link 
          to="/subscriptions" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
        >
          View Plans
        </Link>
      </div>
    );
  }

  const isExpiringSoon = new Date(subscription.endDate).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;
  const progressPercent = (subscription.usedWashes / subscription.totalWashes) * 100;

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Subscription</h1>
            <p className="text-slate-400">Manage your wash quota and plan details</p>
          </div>
          <div className="flex gap-3">
            <Link 
              to="/booking" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Book Subscription Wash
            </Link>
          </div>
        </div>

        {isExpiringSoon && (
          <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-4 rounded-xl mb-8 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold">Subscription Expiring Soon</h4>
              <p className="text-sm opacity-80">Your {subscription.planName} plan expires on {new Date(subscription.endDate).toLocaleDateString()}. Make sure to use your remaining washes!</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-wider mb-1">Current Plan</p>
                <h2 className="text-2xl font-bold text-emerald-400">{subscription.planName}</h2>
                <p className="text-slate-300 text-sm mt-1 capitalize">{subscription.billingPeriod.toLowerCase()} Billing</p>
              </div>
              <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> ACTIVE
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">Wash Quota Usage</span>
                <span className="font-medium text-white">{subscription.usedWashes} / {subscription.totalWashes} Used</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${progressPercent > 80 ? 'bg-orange-500' : 'bg-blue-500'}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 text-right">
                {subscription.remainingWashes} washes remaining
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-700 pt-6">
              <div>
                <p className="text-xs text-slate-400 mb-1">Start Date</p>
                <p className="font-medium">{new Date(subscription.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Valid Until</p>
                <p className="font-medium text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  {new Date(subscription.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col">
            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
            
            <div className="space-y-3 mb-6">
              <Link to="/subscriptions/my/usage" className="block w-full bg-slate-700 hover:bg-slate-600 text-white text-center py-2.5 rounded-lg transition-colors text-sm font-medium">
                View Usage History
              </Link>
            </div>
            
            <div className="mt-auto border-t border-slate-700 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Auto-Renew</span>
                <span className={subscription.autoRenew ? "text-emerald-400 font-medium" : "text-slate-500 font-medium"}>
                  {subscription.autoRenew ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <button className="text-xs text-blue-400 hover:text-blue-300 mt-2 underline underline-offset-2">
                Change Renewal Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySubscription;
