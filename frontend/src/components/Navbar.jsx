import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Car, UserCircle, LogOut, ChevronDown, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Close dropdowns on outside click
  const notifRef = useRef();
  const userRef = useRef();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications?size=5');
      if (res.data.success) {
        setNotifications(res.data.data.content);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
      setNotifOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-2xl tracking-tight text-slate-900">MOTO<span className="text-blue-600">MATE</span></span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Services</Link>
            <Link to="/how-it-works" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">How It Works</Link>
            <Link to="/pricing" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Pricing</Link>
            <Link to="/about" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">About</Link>
            <Link to="/contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Contact</Link>
            
            <div className="flex items-center space-x-4 ml-4">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <div className="relative" ref={notifRef}>
                    <button 
                      onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
                      className="p-2 text-slate-600 hover:text-blue-600 transition-colors relative"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-white">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    {notifOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                        <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                          <span className="font-bold text-slate-900 text-sm">Notifications</span>
                          {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Mark all as read</button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-slate-500">No notifications</div>
                          ) : (
                            notifications.map(n => (
                              <div key={n.id} onClick={() => !n.read && handleMarkAsRead(n.id)} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}>
                                <p className={`text-sm ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{n.title}</p>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                                <p className="text-[10px] text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Profile */}
                  <div className="relative" ref={userRef}>
                    <button 
                      onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
                      className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-medium pl-2"
                    >
                      <UserCircle className="w-5 h-5" />
                      <span>{currentUser?.name?.split(' ')[0]}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-slate-100 z-50">
                        {currentUser?.role === 'ADMIN' && (
                          <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600">Admin Dashboard</Link>
                        )}
                        {currentUser?.role === 'SERVICE_PROVIDER' && (
                          <Link to="/provider" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600">Provider Dashboard</Link>
                        )}
                        <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600">Customer Dashboard</Link>
                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600">Profile</Link>
                        <Link to="/my-bookings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600">My Bookings</Link>
                        <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">Login</Link>
              )}
              
              <Link to="/book" className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                Book Now
              </Link>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-blue-600 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg">
            <Link to="/services" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md">Services</Link>
            <Link to="/how-it-works" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md">How It Works</Link>
            <Link to="/pricing" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md">Pricing</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md">About</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md">Contact</Link>
            
            <div className="pt-4 border-t border-slate-100 mt-2">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-base font-bold text-slate-900">Hi, {currentUser?.name}</div>
                  {currentUser?.role === 'ADMIN' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md">Admin Dashboard</Link>
                  )}
                  {currentUser?.role === 'SERVICE_PROVIDER' && (
                    <Link to="/provider" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md">Provider Dashboard</Link>
                  )}
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md">Dashboard</Link>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md">Profile</Link>
                  <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md">My Bookings</Link>
                  <button onClick={() => { setIsOpen(false); logout(); }} className="w-full text-left block px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md">Login</Link>
              )}
              <Link to="/book" onClick={() => setIsOpen(false)} className="mt-4 block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-700">Book Now</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
