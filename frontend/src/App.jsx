import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import AccessDenied from './pages/auth/AccessDenied';

// Layouts
import CustomerLayout from './components/CustomerLayout';
import AdminLayout from './components/AdminLayout';
import ProviderLayout from './components/ProviderLayout';
import SuperAdminLayout from './components/SuperAdminLayout';
import OperationsLayout from './components/OperationsLayout';
import SupportLayout from './components/SupportLayout';
import FinanceLayout from './components/FinanceLayout';
import { ROLES } from './utils/permissions';

import Dashboard from './pages/customer/Dashboard';
import Profile from './pages/customer/Profile';
import Addresses from './pages/customer/Addresses';
import Vehicles from './pages/customer/Vehicles';

import BookingFlow from './pages/booking/BookingFlow';
import BookingSuccess from './pages/booking/BookingSuccess';
import MyBookings from './pages/customer/MyBookings';
import BookingDetails from './pages/customer/BookingDetails';
import WashHistory from './pages/customer/WashHistory';
import Notifications from './pages/customer/Notifications';
import Payments from './pages/customer/Payments';
import Offers from './pages/customer/Offers';
import Support from './pages/customer/Support';
import Settings from './pages/customer/Settings';

import ServicesPage from './pages/ServicesPage';
import ServiceDetails from './pages/ServiceDetails';
import PricingPage from './pages/PricingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import Contact from './pages/Contact';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminProviders from './pages/admin/AdminProviders';
import AdminTechnicians from './pages/admin/AdminTechnicians';
import AdminServices from './pages/admin/AdminServices';

import ProviderDashboard from './pages/provider/ProviderDashboard';
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import OperationsDashboard from './pages/operations/OperationsDashboard';
import SupportDashboard from './pages/support/SupportDashboard';
import FinanceDashboard from './pages/finance/FinanceDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* RBAC Protected Routes */}
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}><AdminLayout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="providers" element={<AdminProviders />} />
              <Route path="technicians" element={<AdminTechnicians />} />
              <Route path="services" element={<AdminServices />} />
              {/* Fallback to dashboard */}
              <Route path="*" element={<AdminDashboard />} />
            </Routes>
          </AdminLayout></ProtectedRoute>} />

          {/* Super Admin Routes */}
          <Route path="/super-admin/*" element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}><SuperAdminLayout>
            <Routes>
              <Route path="dashboard" element={<SuperAdminDashboard />} />
              <Route path="*" element={<SuperAdminDashboard />} />
            </Routes>
          </SuperAdminLayout></ProtectedRoute>} />
          
          {/* Operations Routes */}
          <Route path="/operations/*" element={<ProtectedRoute allowedRoles={[ROLES.OPERATIONS_MANAGER, ROLES.SUPER_ADMIN]}><OperationsLayout>
            <Routes>
              <Route path="dashboard" element={<OperationsDashboard />} />
              <Route path="*" element={<OperationsDashboard />} />
            </Routes>
          </OperationsLayout></ProtectedRoute>} />

          {/* Support Routes */}
          <Route path="/support-staff/*" element={<ProtectedRoute allowedRoles={[ROLES.SUPPORT_AGENT, ROLES.SUPER_ADMIN]}><SupportLayout>
            <Routes>
              <Route path="dashboard" element={<SupportDashboard />} />
              <Route path="*" element={<SupportDashboard />} />
            </Routes>
          </SupportLayout></ProtectedRoute>} />

          {/* Finance Routes */}
          <Route path="/finance/*" element={<ProtectedRoute allowedRoles={[ROLES.FINANCE_MANAGER, ROLES.SUPER_ADMIN]}><FinanceLayout>
            <Routes>
              <Route path="dashboard" element={<FinanceDashboard />} />
              <Route path="*" element={<FinanceDashboard />} />
            </Routes>
          </FinanceLayout></ProtectedRoute>} />
          
          {/* Provider Routes */}
          <Route path="/provider/*" element={<ProtectedRoute allowedRoles={[ROLES.SERVICE_PROVIDER]}><ProviderLayout>
            <Routes>
              <Route path="dashboard" element={<ProviderDashboard />} />
              <Route path="*" element={<ProviderDashboard />} />
            </Routes>
          </ProviderLayout></ProtectedRoute>} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/unauthorized" element={<AccessDenied />} />
          
          {/* Customer Routes */}
          <Route path="/*" element={<ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATIONS_MANAGER, ROLES.SUPPORT_AGENT, ROLES.FINANCE_MANAGER]}><CustomerLayout>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="addresses" element={<Addresses />} />
              <Route path="vehicles" element={<Vehicles />} />
              
              <Route path="history" element={<WashHistory />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="payments" element={<Payments />} />
              <Route path="offers" element={<Offers />} />
              <Route path="support" element={<Support />} />
              <Route path="settings" element={<Settings />} />

              <Route path="book" element={<BookingFlow />} />
              <Route path="booking-success/:id" element={<BookingSuccess />} />
              <Route path="my-bookings" element={<MyBookings />} />
              <Route path="my-bookings/:id" element={<BookingDetails />} />
            </Routes>
          </CustomerLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
