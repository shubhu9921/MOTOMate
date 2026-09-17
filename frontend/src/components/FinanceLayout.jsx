import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, DollarSign, Undo2, HandCoins, FileText, BarChart, Bell, User, Settings } from 'lucide-react';

const FinanceLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/finance/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Payments', path: '/finance/payments', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'Transactions', path: '/finance/transactions', icon: <DollarSign className="w-5 h-5" /> },
    { name: 'Refunds', path: '/finance/refunds', icon: <Undo2 className="w-5 h-5" /> },
    { name: 'Settlements', path: '/finance/settlements', icon: <HandCoins className="w-5 h-5" /> },
    { name: 'Invoices', path: '/finance/invoices', icon: <FileText className="w-5 h-5" /> },
    { name: 'Reports', path: '/finance/reports', icon: <BarChart className="w-5 h-5" /> },
    { name: 'Notifications', path: '/finance/notifications', icon: <Bell className="w-5 h-5" /> },
    { name: 'Profile', path: '/finance/profile', icon: <User className="w-5 h-5" /> },
    { name: 'Settings', path: '/finance/settings', icon: <Settings className="w-5 h-5" /> },
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
                    location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/finance/dashboard')
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

export default FinanceLayout;
