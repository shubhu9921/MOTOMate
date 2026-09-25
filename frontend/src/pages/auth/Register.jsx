import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { VALIDATION_RULES, validateField } from '../../utils/validation';
import api from '../../services/api';
import RevoraLogo from '../../assets/Revora.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let errorMsg = validateField(formData.name, { ...VALIDATION_RULES.NAME, required: true }, "Name")
      || validateField(formData.email, { ...VALIDATION_RULES.EMAIL, required: true }, "Email")
      || validateField(formData.phone, { ...VALIDATION_RULES.PHONE, required: true }, "Phone")
      || validateField(formData.password, { ...VALIDATION_RULES.PASSWORD, required: true }, "Password");
      
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/send-otp', { email: formData.email });
      if (response.data.success) {
        setStep(2);
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const otpError = validateField(formData.otp, { ...VALIDATION_RULES.OTP, required: true }, "OTP");
    if (otpError) {
      setError(otpError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        otp: formData.otp
      });

      if (response.data.success) {
        // Automatically log them in with the returned data
        login(response.data.data, response.data.data.token);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 flex font-sans">
      {/* Left side - Image/Animation */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden items-center justify-center group">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop" 
            alt="Car wash background" 
            className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-[10000ms] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>
        
        <div className="relative z-10 p-12 text-center text-zinc-50 max-w-lg animate-fade-in-up">
          <Car className="h-16 w-16 mx-auto mb-6 text-yellow-400 animate-bounce" />
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Join REVORA</h1>
          <p className="text-lg text-slate-200 drop-shadow">
            Create an account to book top-tier detailing and washing services from the palm of your hand.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-20 xl:px-24 bg-zinc-900 overflow-y-auto relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-zinc-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        
        <div className="mx-auto w-full max-w-sm lg:max-w-md relative z-10 animate-fade-in-up delay-100">
          
          <div className="bg-zinc-950 px-8 py-8 shadow-xl shadow-slate-200/50 rounded-2xl border border-zinc-800">
            <Link to="/" className="flex items-center justify-center gap-2 mb-6 group w-fit mx-auto">
              <img src={RevoraLogo} alt="REVORA" className="h-10 lg:hidden" />
            </Link>
            
            <h2 className="text-3xl font-extrabold text-zinc-50 text-center">Create Account</h2>
            <p className="mt-1 text-sm text-zinc-400 text-center mb-6">
              Join REVORA today
            </p>

            <form className="space-y-3" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {step === 1 ? (
                <>

              <div>
                <label className="block text-sm font-medium text-zinc-300">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 sm:text-sm border-zinc-700 rounded-lg py-2 border bg-zinc-900 text-zinc-50 hover:bg-zinc-800 focus:bg-black transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300">Email address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 sm:text-sm border-zinc-700 rounded-lg py-2 border bg-zinc-900 text-zinc-50 hover:bg-zinc-800 focus:bg-black transition-all duration-200"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300">Mobile Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 sm:text-sm border-zinc-700 rounded-lg py-2 border bg-zinc-900 text-zinc-50 hover:bg-zinc-800 focus:bg-black transition-all duration-200"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 pr-10 sm:text-sm border-zinc-700 rounded-lg py-2 border bg-zinc-900 text-zinc-50 hover:bg-zinc-800 focus:bg-black transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-zinc-500 hover:text-slate-500 focus:outline-none">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300">Confirm Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 sm:text-sm border-zinc-700 rounded-lg py-2 border bg-zinc-900 text-zinc-50 hover:bg-zinc-800 focus:bg-black transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-zinc-50 bg-yellow-600 hover:bg-yellow-500 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-200"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
              </>
              ) : (
              <>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Enter OTP sent to {formData.email}</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="otp"
                    required
                    maxLength="6"
                    value={formData.otp}
                    onChange={handleChange}
                    className="focus:ring-yellow-600 text-center text-xl tracking-[0.5em] focus:border-yellow-600 block w-full sm:text-sm border-zinc-700 rounded-lg py-3 border bg-zinc-900 text-zinc-50 hover:bg-zinc-800 focus:bg-black transition-all duration-200"
                    placeholder="------"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 flex justify-center py-2.5 px-4 border border-zinc-700 rounded-lg shadow-sm text-sm font-medium text-zinc-300 bg-zinc-950 hover:bg-zinc-800 transition-all duration-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-2/3 flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-zinc-50 bg-yellow-600 hover:bg-yellow-500 hover:shadow-md hover:-translate-y-0.5 focus:outline-none transition-all duration-200"
                >
                  {loading ? 'Verifying...' : 'Verify & Register'}
                </button>
              </div>
              </>
              )}
            </form>

            <div className="mt-6 animate-fade-in-up delay-200">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-zinc-950 text-zinc-400 font-medium">Already have an account?</span>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2.5 px-4 border border-zinc-800 rounded-lg shadow-sm text-sm font-medium text-zinc-300 bg-zinc-950 hover:bg-zinc-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Login Instead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
