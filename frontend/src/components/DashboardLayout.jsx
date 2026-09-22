import React from 'react';
import Footer from './Footer';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, navItems = [], showProfile = false, showPromo = false, defaultPath = '' }) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const userName = currentUser?.name || 's';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="bg-zinc-900 flex flex-col font-sans min-h-screen">
      <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex gap-8 flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 flex-shrink-0 gap-6">
          <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 overflow-hidden sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {/* User Profile Header */}
            {showProfile && (
              <div className="p-6 border-b border-zinc-800 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-600 flex items-center justify-center text-zinc-50 font-bold text-xl shadow-sm">
                  {initial}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-50 leading-tight">{userName}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{currentUser?.email || 's@gmail.com'}</p>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex flex-col py-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== defaultPath && item.path !== '/profile');
                
                let linkClassName = 'flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors ';
                linkClassName += showProfile ? 'border-l-4 ' : '';
                
                if (isActive) {
                  if (showProfile) {
                    linkClassName += 'text-yellow-500 border-yellow-600 bg-blue-50/30';
                  } else {
                    linkClassName += 'bg-zinc-900 text-yellow-500 border-r-4 border-yellow-600';
                  }
                } else {
                  linkClassName += 'text-zinc-400 border-transparent hover:bg-zinc-800 hover:text-yellow-400';
                  if (!showProfile) {
                    linkClassName += ' hover:bg-zinc-800';
                  }
                }

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={linkClassName}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.name}
                    </div>
                    {item.badge && (
                      <span className="bg-red-500 text-zinc-50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Promotional Banner */}
          {showPromo && (
            <div className="rounded-xl overflow-hidden shadow-sm relative pt-6 pb-6 px-6 sticky top-[calc(28px+600px)] group">
              <div className="absolute inset-0 bg-[url('/people-washing.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
              <div className="relative z-10 flex flex-col h-full justify-end">
                <h4 className="font-bold text-zinc-50 text-lg leading-tight mb-2">Keep Your Car<br/>Spotless Always!</h4>
                <p className="text-xs text-slate-200 mb-4">Professional car wash<br/>at your doorstep.</p>
                <Link to="/book" className="inline-flex items-center text-sm bg-yellow-600 text-zinc-50 px-4 py-2 rounded-md font-medium hover:bg-yellow-500 transition-colors shadow-sm w-max">
                  Book a Wash <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
