import React from 'react';
import { 
  LayoutDashboard, Users, User, UserCog, Settings2, DollarSign, Calendar, Tag, Gift, HelpCircle, 
  Bell, BarChart, Settings, UserCircle, Shield, CreditCard, ClipboardList, Clock, CalendarDays, UserCheck,
  Undo2, HandCoins, FileText, Briefcase, Car, History, MapPin, Repeat, MessageSquare
} from 'lucide-react';

export const customerNav = [
  { name: 'My Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'My Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
  { name: 'My Subscription', path: '/subscriptions/my', icon: <Repeat className="w-5 h-5" /> },
  { name: 'My Vehicles', path: '/vehicles', icon: <Car className="w-5 h-5" /> },
  { name: 'My Bookings', path: '/my-bookings', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Wash History', path: '/history', icon: <History className="w-5 h-5" /> },
  { name: 'Saved Addresses', path: '/addresses', icon: <MapPin className="w-5 h-5" /> },
  { name: 'Payments', path: '/payments', icon: <CreditCard className="w-5 h-5" /> },
  { name: 'Offers & Coupons', path: '/offers', icon: <Tag className="w-5 h-5" /> },
  { name: 'Notifications', path: '/notifications', icon: <Bell className="w-5 h-5" />, badge: 3 },
  { name: 'Help & Support', path: '/support', icon: <HelpCircle className="w-5 h-5" /> },
  { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
];

export const adminNav = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
  { name: 'Customers', path: '/admin/customers', icon: <User className="w-5 h-5" /> },
  { name: 'Service Providers', path: '/admin/providers', icon: <UserCog className="w-5 h-5" /> },
  { name: 'Technicians', path: '/admin/technicians', icon: <UserCog className="w-5 h-5 text-indigo-400" /> },
  { name: 'Services', path: '/admin/services', icon: <Settings2 className="w-5 h-5" /> },
  { name: 'Pricing', path: '/admin/pricing', icon: <DollarSign className="w-5 h-5" /> },
  { name: 'Subscription Plans', path: '/admin/subscription-plans', icon: <Tag className="w-5 h-5" /> },
  { name: 'Customer Subscriptions', path: '/admin/subscriptions', icon: <Repeat className="w-5 h-5" /> },
  { name: 'Bookings', path: '/admin/bookings', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Coupons', path: '/admin/coupons', icon: <Tag className="w-5 h-5" /> },
  { name: 'Offers', path: '/admin/offers', icon: <Gift className="w-5 h-5" /> },
  { name: 'Support', path: '/admin/support', icon: <HelpCircle className="w-5 h-5" /> },
  { name: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-5 h-5" /> },
  { name: 'WhatsApp', path: '/admin/whatsapp', icon: <MessageSquare className="w-5 h-5" /> },
  { name: 'Reports', path: '/admin/reports', icon: <BarChart className="w-5 h-5" /> },
  { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  { name: 'Profile', path: '/admin/profile', icon: <UserCircle className="w-5 h-5" /> },
];

export const superAdminNav = [
  { name: 'Dashboard', path: '/super-admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Users', path: '/super-admin/users', icon: <Users className="w-5 h-5" /> },
  { name: 'Roles & Permissions', path: '/super-admin/roles', icon: <Shield className="w-5 h-5" /> },
  { name: 'Customers', path: '/super-admin/customers', icon: <User className="w-5 h-5" /> },
  { name: 'Admins', path: '/super-admin/admins', icon: <UserCog className="w-5 h-5" /> },
  { name: 'Service Providers', path: '/super-admin/providers', icon: <UserCog className="w-5 h-5" /> },
  { name: 'Services', path: '/super-admin/services', icon: <Settings2 className="w-5 h-5" /> },
  { name: 'Pricing', path: '/super-admin/pricing', icon: <DollarSign className="w-5 h-5" /> },
  { name: 'Bookings', path: '/super-admin/bookings', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Payments', path: '/super-admin/payments', icon: <CreditCard className="w-5 h-5" /> },
  { name: 'Coupons', path: '/super-admin/coupons', icon: <Tag className="w-5 h-5" /> },
  { name: 'Offers', path: '/super-admin/offers', icon: <Gift className="w-5 h-5" /> },
  { name: 'Support', path: '/super-admin/support', icon: <HelpCircle className="w-5 h-5" /> },
  { name: 'Notifications', path: '/super-admin/notifications', icon: <Bell className="w-5 h-5" /> },
  { name: 'Reports', path: '/super-admin/reports', icon: <BarChart className="w-5 h-5" /> },
  { name: 'System Settings', path: '/super-admin/settings', icon: <Settings className="w-5 h-5" /> },
  { name: 'Audit Logs', path: '/super-admin/audit-logs', icon: <ClipboardList className="w-5 h-5" /> },
  { name: 'Profile', path: '/super-admin/profile', icon: <UserCircle className="w-5 h-5" /> },
];

export const operationsNav = [
  { name: 'Dashboard', path: '/operations/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Bookings', path: '/operations/bookings', icon: <Calendar className="w-5 h-5" /> },
  { name: "Today's Operations", path: '/operations/today', icon: <Clock className="w-5 h-5" /> },
  { name: 'Service Providers', path: '/operations/providers', icon: <UserCog className="w-5 h-5" /> },
  { name: 'Assignments', path: '/operations/assignments', icon: <UserCheck className="w-5 h-5" /> },
  { name: 'Schedule', path: '/operations/schedule', icon: <CalendarDays className="w-5 h-5" /> },
  { name: 'Services', path: '/operations/services', icon: <Settings2 className="w-5 h-5" /> },
  { name: 'Customers', path: '/operations/customers', icon: <Users className="w-5 h-5" /> },
  { name: 'Notifications', path: '/operations/notifications', icon: <Bell className="w-5 h-5" /> },
  { name: 'Reports', path: '/operations/reports', icon: <BarChart className="w-5 h-5" /> },
  { name: 'Help & Support', path: '/operations/support', icon: <HelpCircle className="w-5 h-5" /> },
  { name: 'Profile', path: '/operations/profile', icon: <User className="w-5 h-5" /> },
  { name: 'Settings', path: '/operations/settings', icon: <Settings className="w-5 h-5" /> },
];

export const financeNav = [
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

export const providerNav = [
  { name: 'Dashboard', path: '/provider/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'My Jobs', path: '/provider/jobs', icon: <Briefcase className="w-5 h-5" /> },
  { name: 'Schedule', path: '/provider/schedule', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Notifications', path: '/provider/notifications', icon: <Bell className="w-5 h-5" /> },
  { name: 'Earnings', path: '/provider/earnings', icon: <DollarSign className="w-5 h-5" /> },
  { name: 'Help & Support', path: '/provider/support', icon: <HelpCircle className="w-5 h-5" /> },
  { name: 'Profile', path: '/provider/profile', icon: <User className="w-5 h-5" /> },
  { name: 'Settings', path: '/provider/settings', icon: <Settings className="w-5 h-5" /> },
];

export const supportNav = [
  { name: 'Dashboard', path: '/support/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Support Tickets', path: '/support/tickets', icon: <HelpCircle className="w-5 h-5" /> },
  { name: 'Customers', path: '/support/customers', icon: <Users className="w-5 h-5" /> },
  { name: 'Bookings', path: '/support/bookings', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Notifications', path: '/support/notifications', icon: <Bell className="w-5 h-5" /> },
  { name: 'Profile', path: '/support/profile', icon: <User className="w-5 h-5" /> },
  { name: 'Settings', path: '/support/settings', icon: <Settings className="w-5 h-5" /> },
];
