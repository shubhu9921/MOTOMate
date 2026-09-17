import React, { useState, useEffect } from 'react';
import { User, Phone, Lock, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { currentUser, login } = useAuth(); // login function updates context
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        phone: currentUser.phone || ''
      });
    }
  }, [currentUser]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileMsg({ type: '', text: '' });
    
    try {
      const response = await api.put('/users/me', profileData);
      if (response.data.success) {
        setProfileMsg({ type: 'success', text: 'Profile updated successfully' });
        // Update context and local storage
        const updatedUser = { ...currentUser, ...profileData };
        login(updatedUser, localStorage.getItem('token'));
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    setLoading(true);
    setPasswordMsg({ type: '', text: '' });
    
    try {
      const response = await api.put('/users/me/password', passwordData);
      if (response.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password updated successfully' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full pb-10">
        <div className="mb-8 flex justify-between items-end border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">My Profile</h1>
            <p className="text-zinc-400 mt-1">Manage your account settings and preferences.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link to="/profile/vehicles" className="text-zinc-300 bg-zinc-950 border border-zinc-700 px-4 py-2 rounded-md font-medium hover:bg-zinc-800">Manage Vehicles</Link>
            <Link to="/profile/addresses" className="text-zinc-300 bg-zinc-950 border border-zinc-700 px-4 py-2 rounded-md font-medium hover:bg-zinc-800">Manage Addresses</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Form */}
          <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900">
              <h2 className="text-lg font-bold text-zinc-50">Personal Information</h2>
            </div>
            <div className="p-6">
              {profileMsg.text && (
                <div className={`mb-4 px-4 py-3 rounded-md text-sm ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {profileMsg.text}
                </div>
              )}
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Email (Read Only)</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || ''}
                    className="block w-full sm:text-sm border-zinc-800 bg-zinc-900 text-zinc-400 rounded-md py-2 px-3 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Full Name</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-zinc-500" />
                    </div>
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 sm:text-sm border-zinc-700 rounded-md py-2 border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Phone Number</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-zinc-500" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 sm:text-sm border-zinc-700 rounded-md py-2 border"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-zinc-50 bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600"
                  >
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Password Form */}
          <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900">
              <h2 className="text-lg font-bold text-zinc-50">Change Password</h2>
            </div>
            <div className="p-6">
              {passwordMsg.text && (
                <div className={`mb-4 px-4 py-3 rounded-md text-sm ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {passwordMsg.text}
                </div>
              )}
              
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Current Password</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-zinc-500" />
                    </div>
                    <input
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 sm:text-sm border-zinc-700 rounded-md py-2 border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">New Password</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-zinc-500" />
                    </div>
                    <input
                      type="password"
                      required
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 sm:text-sm border-zinc-700 rounded-md py-2 border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Confirm New Password</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-zinc-500" />
                    </div>
                    <input
                      type="password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="focus:ring-yellow-600 focus:border-yellow-600 block w-full pl-10 sm:text-sm border-zinc-700 rounded-md py-2 border"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-zinc-50 bg-black hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
                  >
                    <Lock className="h-4 w-4 mr-2" /> Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
