import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from 'lucide-react';
import Footer from '../components/Footer';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const response = await api.post('/contact', formData);
      if (response.data.success) {
        setStatus({ loading: false, success: true, error: '' });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.response?.data?.message || 'Failed to send message.' });
    }
  };

  return (
    <div className="bg-zinc-900 flex flex-col font-sans min-h-screen">
      
      <div className="bg-black text-zinc-50 py-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto px-4">
          Have questions or need assistance? We're here to help you with all your car care needs.
        </p>
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div>
            <h2 className="text-3xl font-bold text-zinc-50 mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-zinc-800 p-3 rounded-full mr-4">
                  <Phone className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-50">Phone</h3>
                  <p className="text-zinc-400 mt-1">+91 98765 43210</p>
                  <p className="text-sm text-zinc-400 mt-1">Mon-Sun from 8am to 8pm</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-zinc-800 p-3 rounded-full mr-4">
                  <Mail className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-50">Email</h3>
                  <p className="text-zinc-400 mt-1">support@motomate.com</p>
                  <p className="text-sm text-zinc-400 mt-1">We'll respond within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-zinc-800 p-3 rounded-full mr-4">
                  <MapPin className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-50">Service Area</h3>
                  <p className="text-zinc-400 mt-1">Currently serving major metropolitan areas.</p>
                  <p className="text-sm text-zinc-400 mt-1">Expanding to more cities soon.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 rounded-2xl shadow-sm border border-zinc-800 p-6">
            <h2 className="text-2xl font-bold text-zinc-50 mb-4">Send us a Message</h2>
            
            {status.success && (
              <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 border border-green-200">
                Thank you for your message! We will get back to you shortly.
              </div>
            )}
            
            {status.error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 border border-red-200">
                {status.error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-zinc-700 rounded-md focus:ring-yellow-600 focus:border-yellow-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Phone (Optional)</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border border-zinc-700 rounded-md focus:ring-yellow-600 focus:border-yellow-600" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border border-zinc-700 rounded-md focus:ring-yellow-600 focus:border-yellow-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Subject</label>
                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full p-2 border border-zinc-700 rounded-md focus:ring-yellow-600 focus:border-yellow-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Message</label>
                <textarea required rows="3" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full p-2 border border-zinc-700 rounded-md focus:ring-yellow-600 focus:border-yellow-600"></textarea>
              </div>
              <button disabled={status.loading} type="submit" className="w-full py-2.5 bg-yellow-600 text-zinc-50 font-bold rounded-md hover:bg-yellow-500 transition-colors flex justify-center items-center disabled:opacity-70">
                {status.loading ? 'Sending...' : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
              </button>
            </form>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
