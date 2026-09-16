import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ addressLine: '', city: '', state: '', pincode: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/addresses');
      if (response.data.success) {
        setAddresses(response.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (editingId) {
        await api.put(`/addresses/${editingId}`, formData);
      } else {
        await api.post('/addresses', formData);
      }
      setFormData({ addressLine: '', city: '', state: '', pincode: '' });
      setShowForm(false);
      setEditingId(null);
      fetchAddresses();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving address');
    }
  };

  const handleEdit = (address) => {
    setFormData({
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pincode: address.pincode
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await api.delete(`/addresses/${id}`);
        fetchAddresses();
      } catch (err) {
        alert('Failed to delete address');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Addresses</h1>
            <p className="text-slate-600 mt-1">Saved locations for your car wash services.</p>
          </div>
          <Link to="/profile" className="text-blue-600 hover:underline">Back to Profile</Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md mb-6 border border-red-200">
            {error}
          </div>
        )}

        {showForm ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address Line</label>
                <input required type="text" value={formData.addressLine} onChange={e => setFormData({...formData, addressLine: e.target.value})} className="w-full border-slate-300 rounded-md py-2 px-3 border focus:ring-blue-500 focus:border-blue-500" placeholder="Apt, Building, Street" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border-slate-300 rounded-md py-2 px-3 border focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                  <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full border-slate-300 rounded-md py-2 px-3 border focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pincode (6 digits)</label>
                <input required type="text" pattern="^[1-9][0-9]{5}$" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full border-slate-300 rounded-md py-2 px-3 border focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => {setShowForm(false); setEditingId(null);}} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Address</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mb-6">
            <button onClick={() => {setFormData({addressLine:'', city:'', state:'', pincode:''}); setShowForm(true);}} className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
              <Plus className="w-4 h-4 mr-2" /> Add New Address
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <p>Loading addresses...</p>
          ) : addresses.length === 0 && !showForm ? (
            <div className="col-span-full text-center py-10 bg-white rounded-xl border border-slate-200 shadow-sm">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">No addresses found</h3>
              <p className="text-slate-500">Add an address to easily book services at your doorstep.</p>
            </div>
          ) : (
            addresses.map(address => (
              <div key={address.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">{address.addressLine}</p>
                    <p className="text-slate-600 text-sm mt-1">{address.city}, {address.state}</p>
                    <p className="text-slate-500 text-sm">{address.pincode}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => handleEdit(address)} className="text-slate-400 hover:text-blue-600 p-1 bg-slate-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(address.id)} className="text-slate-400 hover:text-red-600 p-1 bg-slate-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default Addresses;
