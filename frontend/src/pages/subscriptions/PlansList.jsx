import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlansList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('MONTHLY');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/subscriptions/plans');
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching plans', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = (planId) => {
    navigate(`/subscriptions/checkout/${planId}`);
  };

  const filteredPlans = plans.filter(p => p.billingPeriod === billingCycle);

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading plans...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            MotorMate Subscriptions
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Get unlimited shine. Choose a plan that fits your car care needs and save more.
          </p>
          
          <div className="mt-8 inline-flex bg-slate-800 p-1 rounded-full border border-slate-700">
            <button 
              onClick={() => setBillingCycle('MONTHLY')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${billingCycle === 'MONTHLY' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('YEARLY')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${billingCycle === 'YEARLY' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlans.map((plan) => (
            <motion.div 
              key={plan.id}
              whileHover={{ y: -10 }}
              className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-blue-500 transition-colors relative flex flex-col"
            >
              {plan.discountPercentage > 0 && (
                <div className="absolute -top-4 right-8 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  SAVE {plan.discountPercentage}%
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-sm h-10 mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold">₹{plan.price}</span>
                <span className="text-slate-400">/{billingCycle === 'MONTHLY' ? 'mo' : 'yr'}</span>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 text-blue-400 font-semibold mb-2">
                  <Info className="w-5 h-5" />
                  {plan.includedWashes} Washes Included
                </div>
                <div className="text-sm text-slate-300">
                  Additional washes at ₹{plan.additionalWashPrice}
                </div>
              </div>

              <div className="flex-grow">
                <p className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Services Included</p>
                <ul className="space-y-3 mb-8">
                  {plan.planServices?.map((ps) => (
                    <li key={ps.id} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check className={`w-5 h-5 shrink-0 ${ps.isIncluded ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className={!ps.isIncluded ? 'text-slate-500 line-through' : ''}>
                        {ps.serviceName}
                        {ps.discountPercentage > 0 && !ps.isIncluded && (
                          <span className="ml-2 text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
                            {ps.discountPercentage}% OFF
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => handleSubscribe(plan.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors mt-auto"
              >
                Subscribe Now
              </button>
            </motion.div>
          ))}
          {filteredPlans.length === 0 && (
            <div className="col-span-full text-center text-slate-400 py-10">
              No plans available for this billing cycle right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlansList;
