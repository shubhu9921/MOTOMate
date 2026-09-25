import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { VALIDATION_RULES, validateField } from '../../utils/validation';
import api from '../../services/api';
import RevoraLogo from '../../assets/Revora.png';

const images = [
  {
    url: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop",
    title: "Premium Auto Care",
    desc: "Book top-tier detailing and washing services from the palm of your hand."
  },
  {
    url: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=2070&auto=format&fit=crop",
    title: "Deep Interior Cleaning",
    desc: "Revitalize your seats and upholstery with our premium interior treatments."
  },
  {
    url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2070&auto=format&fit=crop",
    title: "Engine Bay Detailing",
    desc: "Safe and thorough engine cleaning for optimal performance and aesthetics."
  }
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const getDefaultRoute = (role) => {
    switch (role) {
      case 'SUPER_ADMIN': return '/super-admin/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      case 'OPERATIONS_MANAGER': return '/operations/dashboard';
      case 'SERVICE_PROVIDER': return '/provider/dashboard';
      case 'SUPPORT_AGENT': return '/support-staff/dashboard';
      case 'FINANCE_MANAGER': return '/finance/dashboard';
      default: return '/dashboard';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let errorMsg = validateField(email, { ...VALIDATION_RULES.EMAIL, required: true }, "Email")
      || validateField(password, { required: true, maxLength: 72 }, "Password"); // Use generic password validation without strict min length for login to avoid leaking rules
      
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const userData = response.data.data;
        login(userData, userData.token);
        
        let destination = from;
        // If they were trying to access the generic dashboard or home page, 
        // redirect employees to their specific dashboards instead
        if (!destination || destination === '/' || destination === '/dashboard') {
          destination = getDefaultRoute(userData.role);
        }
        
        navigate(destination, { replace: true });
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 flex font-sans min-h-screen">
      {/* Left side - Image/Animation Slider */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden items-center justify-center group">
        
        {images.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={img.url} 
              alt={img.title} 
              className={`w-full h-full object-cover opacity-50 transition-transform duration-[10000ms] ease-out ${index === currentImageIndex ? 'scale-105' : 'scale-100'}`}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        
        <div className="relative z-10 p-12 text-center text-zinc-50 max-w-lg">
          <Car className="h-16 w-16 mx-auto mb-6 text-yellow-400 animate-bounce" />
          
          <div className="min-h-[120px] transition-all duration-500">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-lg animate-fade-in-up key={currentImageIndex}">
              {images[currentImageIndex].title}
            </h1>
            <p className="text-lg text-slate-200 drop-shadow animate-fade-in-up delay-100 key={currentImageIndex}">
              {images[currentImageIndex].desc}
            </p>
          </div>
          
          {/* Slider indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {images.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-8 bg-yellow-600' : 'bg-slate-500 hover:bg-zinc-700'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-20 xl:px-24 bg-zinc-900 relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        
        <div className="mx-auto w-full max-w-sm lg:max-w-md relative z-10 animate-fade-in-up delay-100">
          
          <div className="bg-zinc-950 px-8 py-8 shadow-xl shadow-slate-200/50 rounded-2xl border border-zinc-800">
            <Link to="/" className="flex items-center justify-center gap-2 mb-6 group w-fit mx-auto">
              <img src={RevoraLogo} alt="REVORA" className="h-16 lg:hidden" />
            </Link>
            
            <h2 className="text-3xl font-extrabold text-zinc-50 text-center">Welcome Back</h2>
            <p className="mt-1 text-sm text-zinc-400 text-center mb-6">
              Login to manage your car services
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
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
                    className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 sm:text-sm border-zinc-700 rounded-lg py-2.5 border bg-zinc-900 text-zinc-50 hover:bg-zinc-800 focus:bg-black transition-all duration-200"
                    placeholder="you@example.com"
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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 pr-10 sm:text-sm border-zinc-700 rounded-lg py-2.5 border bg-zinc-900 text-zinc-50 hover:bg-zinc-800 focus:bg-black transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-zinc-500 hover:text-slate-500 focus:outline-none">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-yellow-500 focus:ring-yellow-600 border-zinc-700 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-50">Remember me</label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-yellow-500 hover:text-yellow-400">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div className="mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-zinc-50 bg-yellow-600 hover:bg-yellow-500 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-200"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>

            <div className="mt-6 animate-fade-in-up delay-200">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-zinc-950 text-zinc-400 font-medium">New to REVORA?</span>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  to="/register"
                  className="w-full flex justify-center py-2.5 px-4 border border-zinc-800 rounded-lg shadow-sm text-sm font-medium text-zinc-300 bg-zinc-950 hover:bg-zinc-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Create an Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

