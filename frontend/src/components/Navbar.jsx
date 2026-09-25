import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Car, UserCircle, LogOut, ChevronDown, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Navbar = ({ isTransparent = false }) => {
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
    <nav className={isTransparent ? "absolute top-0 left-0 w-full z-50 bg-transparent pt-4" : "bg-zinc-950 shadow-sm sticky top-0 z-50"}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Car className={`h-8 w-8 ${isTransparent ? 'text-white' : 'text-teal-400'}`} />
              <span className="font-bold text-2xl tracking-tight text-white">MOTO<span className="text-teal-400">Mate</span></span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-medium transition-colors text-sm ${isTransparent ? 'text-teal-400' : 'text-zinc-300 hover:text-teal-400'}`}>Home</Link>
            <Link to="/services" className={`font-medium transition-colors text-sm ${isTransparent ? 'text-white hover:text-teal-400' : 'text-zinc-300 hover:text-teal-400'}`}>Services</Link>
            <Link to="/pricing" className={`font-medium transition-colors text-sm ${isTransparent ? 'text-white hover:text-teal-400' : 'text-zinc-300 hover:text-teal-400'}`}>Pricing</Link>
            <Link to="/subscriptions" className={`font-medium transition-colors text-sm ${isTransparent ? 'text-white hover:text-teal-400' : 'text-zinc-300 hover:text-teal-400'}`}>Subscriptions</Link>
            <Link to="/how-it-works" className={`font-medium transition-colors text-sm ${isTransparent ? 'text-white hover:text-teal-400' : 'text-zinc-300 hover:text-teal-400'}`}>How It Works</Link>
            <Link to="/about" className={`font-medium transition-colors text-sm ${isTransparent ? 'text-white hover:text-teal-400' : 'text-zinc-300 hover:text-teal-400'}`}>About</Link>
            <Link to="/contact" className={`font-medium transition-colors text-sm ${isTransparent ? 'text-white hover:text-teal-400' : 'text-zinc-300 hover:text-teal-400'}`}>Contact</Link>
            
            <div className="flex items-center space-x-4 ml-4">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <div className="relative" ref={notifRef}>
                    <button 
                      onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
                      className="p-2 text-zinc-400 hover:text-yellow-400 transition-colors relative"
                    >
                      <Bell className="w-6 h-6" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-zinc-50 font-bold">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    {notifOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-zinc-950 rounded-xl shadow-lg border border-zinc-800 overflow-hidden z-50">
                        <div className="p-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                          <span className="font-bold text-zinc-50 text-sm">Notifications</span>
                          {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} className="text-xs text-yellow-500 hover:text-blue-800 font-medium">Mark all as read</button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-zinc-400">No notifications</div>
                          ) : (
                            notifications.map(n => (
                              <div key={n.id} onClick={() => !n.read && handleMarkAsRead(n.id)} className={`p-4 border-b border-slate-50 hover:bg-zinc-800 transition cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}>
                                <p className={`text-sm ${!n.read ? 'font-bold text-zinc-50' : 'font-medium text-zinc-300'}`}>{n.title}</p>
                                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{n.message}</p>
                                <p className="text-[10px] text-zinc-500 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
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
                      className="flex items-center gap-2 text-zinc-300 hover:text-yellow-400 font-medium pl-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-zinc-50 font-bold text-sm">
                        {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <span className="font-medium">{currentUser?.name?.split(' ')[0] || 's'}</span>
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-zinc-950 rounded-xl shadow-lg py-2 border border-zinc-800 z-50">
                        {currentUser?.role === 'ADMIN' && (
                          <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">Admin Dashboard</Link>
                        )}
                        {currentUser?.role === 'SERVICE_PROVIDER' && (
                          <Link to="/provider" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">Provider Dashboard</Link>
                        )}
                        {currentUser?.role === 'CUSTOMER' ? (
                          <>
                            <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">My Dashboard</Link>
                            <Link to="/subscriptions/my" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">My Subscription</Link>
                            <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">My Profile</Link>
                            <Link to="/vehicles" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">My Vehicles</Link>
                            <Link to="/my-bookings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">My Bookings</Link>
                            <Link to="/history" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">Wash History</Link>
                            <Link to="/addresses" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">Saved Addresses</Link>
                            <Link to="/payments" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">Payments</Link>
                            <Link to="/offers" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">Offers & Coupons</Link>
                            <Link to="/notifications" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">Notifications</Link>
                            <Link to="/support" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">Help & Support</Link>
                            <Link to="/settings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">Settings</Link>
                          </>
                        ) : (
                          <>
                            <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">Customer Dashboard</Link>
                            <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">Profile</Link>
                            <Link to="/my-bookings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400">My Bookings</Link>
                          </>
                        )}
                        <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t mt-1 pt-2">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/login" className={`font-medium transition-colors text-sm ${isTransparent ? 'text-white hover:text-teal-400' : 'text-teal-400 hover:text-teal-300'}`}>Login</Link>
              )}
              
              <Link to="/book" className={isTransparent ? "bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-zinc-200 transition-colors shadow-sm text-sm ml-4" : "bg-teal-500 text-zinc-950 px-6 py-2.5 rounded-full font-bold hover:bg-teal-400 transition-colors shadow-sm flex items-center gap-2 text-sm ml-4"}>
                Book a Wash
              </Link>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(true)} className="text-zinc-400 hover:text-yellow-400 focus:outline-none p-2 -mr-2">
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} isAuthenticated={isAuthenticated} currentUser={currentUser} logout={logout} />
    </nav>
  );
};

const MobileMenu = ({ isOpen, setIsOpen, isAuthenticated, currentUser, logout }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <div 
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-zinc-950 z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <Car className="h-7 w-7 text-yellow-500" />
            <span className="font-bold text-xl tracking-tight text-zinc-50">MOTO<span className="text-yellow-500">MATE</span></span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-400 hover:text-slate-900 bg-zinc-950 rounded-full shadow-sm border border-zinc-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {!isAuthenticated || currentUser?.role !== 'CUSTOMER' ? (
              <>
                <Link to="/services" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Services</Link>
                <Link to="/how-it-works" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">How It Works</Link>
                <Link to="/pricing" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Pricing</Link>
                <Link to="/about" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">About</Link>
                <a href="/#reviews" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Reviews</a>
                <a href="/#faq" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">FAQ</a>
              </>
            ) : null}
            
            <div className={`pt-6 mt-6 ${(!isAuthenticated || currentUser?.role !== 'CUSTOMER') ? 'border-t border-zinc-800' : ''}`}>
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">My Account</div>
                  {currentUser?.role === 'ADMIN' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Admin Dashboard</Link>
                  )}
                  {currentUser?.role === 'SERVICE_PROVIDER' && (
                    <Link to="/provider" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Provider Dashboard</Link>
                  )}
                  {currentUser?.role === 'CUSTOMER' ? (
                    <>
                      <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Dashboard</Link>
                      <Link to="/subscriptions/my" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">My Subscription</Link>
                      <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Home</Link>
                      <Link to="/services" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Services</Link>
                      <Link to="/pricing" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Pricing</Link>
                      <Link to="/book" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Book Your Wash</Link>
                      <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">My Bookings</Link>
                      <Link to="/vehicles" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">My Vehicles</Link>
                      <Link to="/history" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Wash History</Link>
                      <Link to="/notifications" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Notifications</Link>
                      <Link to="/support" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Help & Support</Link>
                      <Link to="/settings" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Settings</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Customer Dashboard</Link>
                      <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">Profile</Link>
                      <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-zinc-300 hover:text-yellow-400 hover:bg-zinc-800 rounded-lg transition-colors">My Bookings</Link>
                    </>
                  )}
                  <button onClick={() => { setIsOpen(false); logout(); }} className="w-full text-left flex items-center gap-2 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg mt-2 transition-colors">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 text-base font-bold text-zinc-300 hover:text-yellow-400 bg-zinc-800 rounded-xl transition-colors">Login / Register</Link>
              )}
            </div>
        </div>
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
           <Link to="/book" onClick={() => setIsOpen(false)} className="block w-full text-center bg-yellow-600 text-zinc-50 px-4 py-4 rounded-xl font-bold shadow-md hover:bg-yellow-500 hover:shadow-lg transition-all">Book Your Wash</Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
