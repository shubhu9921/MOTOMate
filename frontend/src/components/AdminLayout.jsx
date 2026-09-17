import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, User, UserCog, Settings2, DollarSign, Calendar, Tag, Gift, HelpCircle, Bell, BarChart, Settings, UserCircle } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Customers', path: '/admin/customers', icon: <User className="w-5 h-5" /> },
    { name: 'Service Providers', path: '/admin/providers', icon: <UserCog className="w-5 h-5" /> },
    { name: 'Technicians', path: '/admin/technicians', icon: <UserCog className="w-5 h-5 text-indigo-400" /> },
    { name: 'Services', path: '/admin/services', icon: <Settings2 className="w-5 h-5" /> },
    { name: 'Pricing', path: '/admin/pricing', icon: <DollarSign className="w-5 h-5" /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Coupons', path: '/admin/coupons', icon: <Tag className="w-5 h-5" /> },
    { name: 'Offers', path: '/admin/offers', icon: <Gift className="w-5 h-5" /> },
    { name: 'Support', path: '/admin/support', icon: <HelpCircle className="w-5 h-5" /> },
    { name: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-5 h-5" /> },
    { name: 'Reports', path: '/admin/reports', icon: <BarChart className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
    { name: 'Profile', path: '/admin/profile', icon: <UserCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-zinc-900 flex flex-col font-sans">
      <Navbar />
      <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-zinc-950 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <nav className="flex flex-col py-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                    location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin/dashboard')
                      ? 'bg-zinc-900 text-yellow-500 border-r-4 border-yellow-600'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-yellow-400'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="min-w-0">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
