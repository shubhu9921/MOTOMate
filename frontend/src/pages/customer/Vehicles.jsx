import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Car } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ vehicleNumber: '', vehicleType: 'HATCHBACK', brand: '', model: '', color: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const vehicleTypes = ['HATCHBACK', 'SEDAN', 'SUV', 'MUV', 'OTHER'];

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles');
      if (response.data.success) {
        setVehicles(response.data.data);
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
        await api.put(`/vehicles/${editingId}`, formData);
      } else {
        await api.post('/vehicles', formData);
      }
      setFormData({ vehicleNumber: '', vehicleType: 'HATCHBACK', brand: '', model: '', color: '' });
      setShowForm(false);
      setEditingId(null);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving vehicle');
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      vehicleNumber: vehicle.vehicleNumber,
      vehicleType: vehicle.vehicleType,
      brand: vehicle.brand,
      model: vehicle.model,
      color: vehicle.color
    });
    setEditingId(vehicle.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchVehicles();
      } catch (err) {
        alert('Failed to delete vehicle');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Vehicles</h1>
            <p className="text-slate-600 mt-1">Add and manage your cars for service.</p>
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
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Number (e.g., MH12AB1234)</label>
                  <input required type="text" value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} className="w-full border-slate-300 rounded-md py-2 px-3 border focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Type</label>
                  <select value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} className="w-full border-slate-300 rounded-md py-2 px-3 border focus:ring-blue-500 focus:border-blue-500">
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Brand (e.g., Hyundai)</label>
                  <input required type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full border-slate-300 rounded-md py-2 px-3 border focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Model (e.g., Creta)</label>
                  <input required type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full border-slate-300 rounded-md py-2 px-3 border focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                  <input required type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full border-slate-300 rounded-md py-2 px-3 border focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => {setShowForm(false); setEditingId(null);}} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Vehicle</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mb-6">
            <button onClick={() => {setFormData({vehicleNumber:'', vehicleType:'HATCHBACK', brand:'', model:'', color:''}); setShowForm(true);}} className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
              <Plus className="w-4 h-4 mr-2" /> Add New Vehicle
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <p>Loading vehicles...</p>
          ) : vehicles.length === 0 && !showForm ? (
            <div className="col-span-full text-center py-10 bg-white rounded-xl border border-slate-200 shadow-sm">
              <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">No vehicles found</h3>
              <p className="text-slate-500">Add your car details to proceed with booking.</p>
            </div>
          ) : (
            vehicles.map(vehicle => (
              <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative">
                <div className="flex items-start">
                  <div className="bg-blue-50 p-3 rounded-full mr-4 flex-shrink-0">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{vehicle.brand} {vehicle.model}</h3>
                    <div className="mt-1 space-y-1">
                      <p className="text-slate-600 text-sm"><span className="font-medium text-slate-700">Number:</span> <span className="uppercase">{vehicle.vehicleNumber}</span></p>
                      <p className="text-slate-600 text-sm"><span className="font-medium text-slate-700">Type:</span> {vehicle.vehicleType}</p>
                      <p className="text-slate-600 text-sm"><span className="font-medium text-slate-700">Color:</span> {vehicle.color}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => handleEdit(vehicle)} className="text-slate-400 hover:text-blue-600 p-1 bg-slate-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(vehicle.id)} className="text-slate-400 hover:text-red-600 p-1 bg-slate-50 rounded">
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

export default Vehicles;
