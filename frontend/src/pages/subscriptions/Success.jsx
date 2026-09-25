import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 p-8 rounded-2xl max-w-md w-full border border-slate-700 text-center"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-emerald-500" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">Subscription Activated!</h2>
        <p className="text-slate-400 mb-8">
          Welcome to REVORA premium. Your unlimited shine awaits.
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/subscriptions/my"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Go to My Dashboard
          </Link>
          <Link 
            to="/booking"
            className="block w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Book a Wash Now
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;

