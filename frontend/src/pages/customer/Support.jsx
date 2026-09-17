import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus } from 'lucide-react';
import api from '../../services/api';

const Support = () => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ category: 'General', subject: '', description: '' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/support');
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/support', formData);
      setShowForm(false);
      setFormData({ category: 'General', subject: '', description: '' });
      fetchRequests();
    } catch (err) {
      alert('Failed to submit support request');
    }
  };

  return (
    <>
      <div className="w-full pb-10">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Help & Support</h1>
            <p className="text-zinc-400 mt-1">Get assistance with your bookings or account.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-yellow-600 text-zinc-50 px-4 py-2 rounded-md font-medium hover:bg-yellow-500 flex items-center">
            {showForm ? 'Cancel' : <><Plus className="w-4 h-4 mr-1" /> New Ticket</>}
          </button>
        </div>

        {showForm && (
          <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Submit a Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Category</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full border-zinc-700 rounded-md py-2 px-3 border focus:ring-yellow-600"
                >
                  <option>General Inquiry</option>
                  <option>Booking Issue</option>
                  <option>Payment Issue</option>
                  <option>Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Subject</label>
                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full border-zinc-700 rounded-md py-2 px-3 border focus:ring-yellow-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
                <textarea required rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-zinc-700 rounded-md py-2 px-3 border focus:ring-yellow-600"></textarea>
              </div>
              <button type="submit" className="bg-yellow-600 text-zinc-50 px-6 py-2 rounded-md font-medium hover:bg-yellow-500">Submit</button>
            </form>
          </div>
        )}
        
        {requests.length === 0 && !showForm ? (
          <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-10 text-center">
            <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="w-8 h-8 text-zinc-500" />
            </div>
            <h2 className="text-xl font-bold text-zinc-50 mb-2">No support tickets</h2>
            <p className="text-zinc-400">Need help? Create a new ticket and we'll assist you.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-zinc-50">{req.subject}</h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${req.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {req.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-yellow-500 mb-2">{req.category}</p>
                <p className="text-zinc-400 text-sm whitespace-pre-wrap">{req.description}</p>
                <p className="text-xs text-zinc-500 mt-4">Submitted on {new Date(req.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Support;
