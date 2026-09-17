import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import api from '../../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications?size=50');
      if (res.data.success) {
        setNotifications(res.data.data.content || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="w-full pb-10">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Notifications</h1>
            <p className="text-zinc-400 mt-1">Updates on your bookings and account.</p>
          </div>
        </div>
        
        {notifications.length === 0 ? (
          <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-10 text-center">
            <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-zinc-500" />
            </div>
            <h2 className="text-xl font-bold text-zinc-50 mb-2">No notifications</h2>
            <p className="text-zinc-400">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map(n => (
              <div key={n.id} className={`p-4 rounded-xl border ${!n.read ? 'bg-zinc-900 border-yellow-900' : 'bg-zinc-950 border-zinc-800'}`}>
                <h3 className="font-bold text-zinc-50">{n.title}</h3>
                <p className="text-zinc-400 mt-1">{n.message}</p>
                <p className="text-xs text-zinc-500 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
