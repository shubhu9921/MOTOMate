import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Shield } from 'lucide-react';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <>
      <div className="w-full pb-10">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Settings</h1>
            <p className="text-zinc-400 mt-1">Manage your application preferences.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-6">
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 text-yellow-500 mr-2" />
              <h2 className="text-xl font-bold text-zinc-50">Notification Preferences</h2>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-zinc-800">
              <div>
                <p className="font-medium text-zinc-50">Email Notifications</p>
                <p className="text-sm text-zinc-400">Receive booking updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-yellow-500 mr-2" />
              <h2 className="text-xl font-bold text-zinc-50">Privacy & Security</h2>
            </div>
            <div className="space-y-3">
              <button className="text-yellow-500 hover:underline text-sm font-medium">Privacy Policy</button>
              <br />
              <button className="text-yellow-500 hover:underline text-sm font-medium">Terms of Service</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
