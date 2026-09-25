import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail } from 'lucide-react';
import { VALIDATION_RULES, validateField } from '../../utils/validation';
import api from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let errorMsg = validateField(email, { ...VALIDATION_RULES.EMAIL, required: true }, "Email");
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Endpoint to be created on backend later, simulating for now
      // await api.post('/auth/forgot-password', { email });
      setTimeout(() => {
        setMessage('If this email is registered, password reset instructions will be sent.');
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to process request');
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 mb-6">
          <Car className="h-10 w-10 text-yellow-500" />
          <span className="font-bold text-3xl tracking-tight text-zinc-50">MOTO<span className="text-yellow-500">MATE</span></span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-zinc-50">Forgot Password?</h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Enter your email and we'll send you reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-950 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-zinc-800">
          {message ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-md text-sm text-center">
              {message}
              <div className="mt-4">
                <Link to="/login" className="font-medium text-yellow-500 hover:text-yellow-400">
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-300">Email address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 sm:text-sm border-zinc-700 rounded-md py-2 border"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-zinc-50 bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <Link to="/login" className="text-sm font-medium text-yellow-500 hover:text-yellow-400">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
