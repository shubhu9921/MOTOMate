import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { VALIDATION_RULES, validateField } from '../../utils/validation';
import api from '../../services/api';
import RevoraLogo from '../../assets/Revora.png';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    let errorMsg = validateField(email, { ...VALIDATION_RULES.EMAIL, required: true }, "Email");
    if (errorMsg) { setError(errorMsg); return; }

    setLoading(true); setError(''); setMessage('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      setStep(2);
      setCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setError('OTP must be 6 digits'); return; }

    setLoading(true); setError(''); setMessage('');
    try {
      const res = await api.post('/auth/verify-forgot-password-otp', { email, otp });
      setResetToken(res.data.data.resetToken);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    let errorMsg = validateField(passwords.password, { ...VALIDATION_RULES.PASSWORD, required: true }, "Password");
    if (errorMsg) { setError(errorMsg); return; }
    if (passwords.password !== passwords.confirmPassword) { setError('Passwords do not match'); return; }

    setLoading(true); setError('');
    try {
      await api.post('/auth/reset-password', { resetToken, newPassword: passwords.password });
      setMessage('Password reset successful. You can now login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans min-h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 mb-6">
          <img src={RevoraLogo} alt="REVORA" className="h-16 animate-pulse" />
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-zinc-50">Reset Password</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-950 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-zinc-800">
          
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">{error}</div>}
          {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm mb-4">{message}</div>}

          {step === 1 && (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Email address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-zinc-500" /></div>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 sm:text-sm bg-zinc-900 border-zinc-700 text-zinc-50 rounded-md py-2 border" placeholder="you@example.com" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-zinc-50 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Reset OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Enter OTP sent to {email}</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-zinc-500" /></div>
                  <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))} className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 sm:text-sm bg-zinc-900 border-zinc-700 text-zinc-50 rounded-md py-2 border tracking-widest text-lg" placeholder="123456" />
                </div>
              </div>
              <button type="submit" disabled={loading || otp.length < 6} className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-zinc-50 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <div className="text-center mt-2">
                <button type="button" onClick={handleSendOtp} disabled={countdown > 0 || loading} className="text-sm font-medium text-yellow-500 hover:text-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed">
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label className="block text-sm font-medium text-zinc-300">New Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-zinc-500" /></div>
                  <input type={showPassword ? "text" : "password"} required value={passwords.password} onChange={(e) => setPasswords({...passwords, password: e.target.value})} className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 pr-10 sm:text-sm bg-zinc-900 border-zinc-700 text-zinc-50 rounded-md py-2 border" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showPassword ? <EyeOff className="h-5 w-5 text-zinc-500" /> : <Eye className="h-5 w-5 text-zinc-500" />}</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Confirm Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-zinc-500" /></div>
                  <input type={showPassword ? "text" : "password"} required value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 sm:text-sm bg-zinc-900 border-zinc-700 text-zinc-50 rounded-md py-2 border" placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-zinc-50 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50">
                {loading ? 'Saving...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-zinc-300">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
