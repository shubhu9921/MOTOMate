import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { VALIDATION_RULES, validateField } from '../../utils/validation';
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
    
    let errorMsg = validateField(formData.addressLine, { required: true, maxLength: 200 }, "Address Line")
      || validateField(formData.city, { required: true, maxLength: 100 }, "City")
      || validateField(formData.state, { required: true, maxLength: 100 }, "State")
      || validateField(formData.pincode, { ...VALIDATION_RULES.PINCODE, required: true }, "Pincode");
      
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    
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
    <>
      <div className="w-full pb-10">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Manage Addresses</h1>
            <p className="text-zinc-400 mt-1">Saved locations for your car wash services.</p>
          </div>
          <Link to="/profile" className="text-yellow-500 hover:underline">Back to Profile</Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md mb-6 border border-red-200">
            {error}
          </div>
        )}

        {showForm ? (
          <div className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Address Line</label>
                <input required type="text" value={formData.addressLine} onChange={e => setFormData({...formData, addressLine: e.target.value})} className="w-full border-zinc-700 rounded-md py-2 px-3 border focus:ring-yellow-600 focus:border-yellow-600" placeholder="Apt, Building, Street" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">City</label>
                  <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border-zinc-700 rounded-md py-2 px-3 border focus:ring-yellow-600 focus:border-yellow-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">State</label>
                  <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full border-zinc-700 rounded-md py-2 px-3 border focus:ring-yellow-600 focus:border-yellow-600" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Pincode (6 digits)</label>
                <input required type="text" pattern="^[1-9][0-9]{5}$" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full border-zinc-700 rounded-md py-2 px-3 border focus:ring-yellow-600 focus:border-yellow-600" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => {setShowForm(false); setEditingId(null);}} className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-md hover:bg-zinc-800">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-yellow-600 text-zinc-50 rounded-md hover:bg-yellow-500">Save Address</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mb-6">
            <button onClick={() => {setFormData({addressLine:'', city:'', state:'', pincode:''}); setShowForm(true);}} className="inline-flex items-center bg-yellow-600 text-zinc-50 px-4 py-2 rounded-md hover:bg-yellow-500 font-medium">
              <Plus className="w-4 h-4 mr-2" /> Add New Address
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <p>Loading addresses...</p>
          ) : addresses.length === 0 && !showForm ? (
            <div className="col-span-full text-center py-10 bg-zinc-950 rounded-xl border border-zinc-800 shadow-sm">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-zinc-50 mb-1">No addresses found</h3>
              <p className="text-zinc-400">Add an address to easily book services at your doorstep.</p>
            </div>
          ) : (
            addresses.map(address => (
              <div key={address.id} className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-5 relative">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-zinc-50">{address.addressLine}</p>
                    <p className="text-zinc-400 text-sm mt-1">{address.city}, {address.state}</p>
                    <p className="text-zinc-400 text-sm">{address.pincode}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => handleEdit(address)} className="text-zinc-500 hover:text-yellow-400 p-1 bg-zinc-900 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(address.id)} className="text-zinc-500 hover:text-red-600 p-1 bg-zinc-900 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Addresses;
