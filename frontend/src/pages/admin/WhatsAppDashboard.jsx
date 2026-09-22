import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Settings, CheckCircle, AlertCircle, RefreshCw,
  Search, Calendar, Clock, User, Phone, CheckSquare, XCircle, Send
} from 'lucide-react';
import { whatsappAdminService } from '../../services/whatsappAdminService';

const WhatsAppDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState(null);
  const [stats, setStats] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationDetail, setConversationDetail] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusData, statsData, convsData, notifsData] = await Promise.all([
        whatsappAdminService.getStatus(),
        whatsappAdminService.getStatistics(),
        whatsappAdminService.getConversations(),
        whatsappAdminService.getNotifications()
      ]);
      
      setStatus(statusData);
      setStats(statsData);
      setConversations(convsData.content || []);
      setNotifications(notifsData.content || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load WhatsApp dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conv) => {
    setSelectedConversation(conv);
    try {
      const detail = await whatsappAdminService.getConversationDetail(conv.id);
      setConversationDetail(detail);
    } catch (err) {
      console.error("Failed to load conversation details");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">WhatsApp Management</h1>
          <p className="text-slate-500">Monitor customer conversations and automated WhatsApp notifications.</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      <div className="flex space-x-1 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('conversations')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'conversations' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Conversations
        </button>
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'notifications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Notification History
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 font-medium mb-1">WhatsApp Status</p>
              <div className="flex items-center">
                {status?.enabled ? (
                  <><CheckCircle className="w-5 h-5 text-green-500 mr-2" /><span className="text-lg font-bold text-slate-800">Connected</span></>
                ) : (
                  <><XCircle className="w-5 h-5 text-red-500 mr-2" /><span className="text-lg font-bold text-slate-800">Disabled</span></>
                )}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 font-medium mb-1">Total Messages</p>
              <p className="text-2xl font-bold text-slate-800">{stats?.totalMessages}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 font-medium mb-1">Active Convs</p>
              <p className="text-2xl font-bold text-slate-800">{stats?.activeConversations}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 font-medium mb-1">Notifs Sent</p>
              <p className="text-2xl font-bold text-slate-800 text-green-600">{stats?.notificationsSent}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 font-medium mb-1">Notifs Failed</p>
              <p className="text-2xl font-bold text-slate-800 text-red-600">{stats?.notificationsFailed}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 font-medium mb-1">Notifs Retrying</p>
              <p className="text-2xl font-bold text-slate-800 text-yellow-600">{stats?.notificationsRetrying}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Message Volume Trends</h3>
              <div className="space-y-4 mt-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Today</span>
                    <span className="font-medium">{stats?.todayMessages}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((stats?.todayMessages / 50) * 100, 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Last 7 Days</span>
                    <span className="font-medium">{stats?.last7DaysMessages}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.min((stats?.last7DaysMessages / 350) * 100, 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Last 30 Days</span>
                    <span className="font-medium">{stats?.last30DaysMessages}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min((stats?.last30DaysMessages / 1500) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-0 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800">Recent Notifications</h3>
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {notifications.slice(0, 5).map(notif => (
                  <div key={notif.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-900">#{notif.bookingId}</span>
                        <span className="text-sm text-slate-500">{notif.eventType}</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-400 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(notif.createdAt).toLocaleString()}
                        <span className="mx-2">•</span>
                        Attempts: {notif.attemptCount}
                      </div>
                    </div>
                    <div>
                      {notif.status === 'SENT' && <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">SENT</span>}
                      {notif.status === 'FAILED' && <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">FAILED</span>}
                      {notif.status === 'RETRYING' && <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">RETRYING</span>}
                      {notif.status === 'PENDING' && <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">PENDING</span>}
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="p-6 text-center text-slate-500">No recent notifications.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'conversations' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex h-[600px] flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search conversations..." 
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map(conv => (
                <div 
                  key={conv.id} 
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${selectedConversation?.id === conv.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-800">{conv.customerName}</span>
                    <span className="text-xs text-slate-400">
                      {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500 mb-2">
                    <Phone className="w-3 h-3 mr-1" />
                    {conv.phoneNumber}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{conv.state}</span>
                    {conv.active && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
                  </div>
                </div>
              ))}
              {conversations.length === 0 && (
                <div className="p-8 text-center text-slate-500">No conversations found.</div>
              )}
            </div>
          </div>
          
          <div className="w-full lg:w-2/3 flex flex-col bg-slate-50">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-10">
                  <div>
                    <h3 className="font-bold text-slate-800">{selectedConversation.customerName} ({selectedConversation.phoneNumber})</h3>
                    <p className="text-xs text-slate-500 mt-1">State: {selectedConversation.state}</p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    {conversationDetail?.selectedService && <div>{conversationDetail.selectedService}</div>}
                    {conversationDetail?.selectedVehicle && <div>{conversationDetail.selectedVehicle}</div>}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversationDetail?.messages?.map(msg => (
                    <div key={msg.id} className={`flex ${msg.direction === 'OUTGOING' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-lg p-3 ${msg.direction === 'OUTGOING' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'}`}>
                        <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
                        <div className={`text-[10px] mt-1 text-right ${msg.direction === 'OUTGOING' ? 'text-blue-200' : 'text-slate-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!conversationDetail?.messages || conversationDetail.messages.length === 0) && (
                    <div className="text-center text-slate-400 my-8">No messages yet.</div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                <MessageSquare className="w-16 h-16 mb-4 text-slate-300" />
                <p>Select a conversation to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center flex-wrap gap-4">
            <div className="flex space-x-2">
              <select className="border border-slate-300 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">All Statuses</option>
                <option value="SENT">Sent</option>
                <option value="FAILED">Failed</option>
                <option value="RETRYING">Retrying</option>
                <option value="PENDING">Pending</option>
              </select>
              <select className="border border-slate-300 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">All Event Types</option>
                <option value="BOOKING_CREATED">Booking Created</option>
                <option value="BOOKING_CONFIRMED">Booking Confirmed</option>
                <option value="PROVIDER_ASSIGNED">Provider Assigned</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Booking ID</th>
                  <th className="px-6 py-3 font-semibold">Event Type</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Attempts</th>
                  <th className="px-6 py-3 font-semibold">Created At</th>
                  <th className="px-6 py-3 font-semibold">Updated At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notifications.map(notif => (
                  <tr key={notif.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">#{notif.bookingId}</td>
                    <td className="px-6 py-4 text-slate-600">{notif.eventType}</td>
                    <td className="px-6 py-4">
                      {notif.status === 'SENT' && <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">SENT</span>}
                      {notif.status === 'FAILED' && <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-200">FAILED</span>}
                      {notif.status === 'RETRYING' && <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">RETRYING</span>}
                      {notif.status === 'PENDING' && <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">PENDING</span>}
                      {notif.status === 'SENDING' && <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">SENDING</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{notif.attemptCount}</td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{new Date(notif.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{new Date(notif.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
                {notifications.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No notification events found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
            <span>Showing {notifications.length} results</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50">Previous</button>
              <button className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppDashboard;
