import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Car } from 'lucide-react';
import { VALIDATION_RULES, validateField } from '../../utils/validation';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ vehicleNumber: '', vehicleType: 'HATCHBACK', brand: '', model: '', color: '', vehicleImageUrl: '', numberPlateImageUrl: '', cleaningAreaImageUrl: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const vehicleTypes = ['HATCHBACK', 'SEDAN', 'SUV', 'MUV', 'LUXURY', 'BIKE', 'OTHER'];

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
    
    let errorMsg = validateField(formData.vehicleNumber, { ...VALIDATION_RULES.VEHICLE_REGISTRATION, required: true }, "Vehicle Number")
      || validateField(formData.brand, { required: true, maxLength: 50 }, "Brand")
      || validateField(formData.model, { required: true, maxLength: 50 }, "Model")
      || validateField(formData.color, { required: true, maxLength: 30 }, "Color");
      
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    
    try {
      if (editingId) {
        await api.put(`/vehicles/${editingId}`, formData);
      } else {
        await api.post('/vehicles', formData);
      }
      setFormData({ vehicleNumber: '', vehicleType: 'HATCHBACK', brand: '', model: '', color: '', vehicleImageUrl: '', numberPlateImageUrl: '', cleaningAreaImageUrl: '' });
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
      color: vehicle.color,
      vehicleImageUrl: vehicle.vehicleImageUrl || '',
      numberPlateImageUrl: vehicle.numberPlateImageUrl || '',
      cleaningAreaImageUrl: vehicle.cleaningAreaImageUrl || ''
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

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="w-full pb-10">
        <div className="mb-8 flex justify-between items-end border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Manage Vehicles</h1>
            <p className="text-zinc-400 mt-1">Add and manage your cars for service.</p>
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
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Vehicle Number (e.g., MH12AB1234)</label>
                  <input required type="text" value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} className="w-full bg-zinc-950 border-zinc-700 rounded-md py-2 px-3 border focus:ring-yellow-600 focus:border-yellow-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Vehicle Type</label>
                  <select value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} className="w-full bg-zinc-950 border-zinc-700 rounded-md py-2 px-3 border focus:ring-yellow-600 focus:border-yellow-600">
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Brand (e.g., Hyundai)</label>
                  <input required type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-zinc-950 border-zinc-700 rounded-md py-2 px-3 border focus:ring-yellow-600 focus:border-yellow-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Model (e.g., Creta)</label>
                  <input required type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full bg-zinc-950 border-zinc-700 rounded-md py-2 px-3 border focus:ring-yellow-600 focus:border-yellow-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Color</label>
                  <input required type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full bg-zinc-950 border-zinc-700 rounded-md py-2 px-3 border focus:ring-yellow-600 focus:border-yellow-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Vehicle Image (Camera/Gallery) *</label>
                  <input required={!editingId} type="file" accept="image/*" capture="environment" onChange={e => handleImageUpload(e, 'vehicleImageUrl')} className="w-full bg-zinc-950 border-zinc-700 rounded-md py-1.5 px-3 border focus:ring-yellow-600 focus:border-yellow-600 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  {formData.vehicleImageUrl && <img src={formData.vehicleImageUrl} alt="Vehicle" className="mt-2 h-20 w-32 object-cover rounded-md border border-zinc-800" />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Number Plate Image (Camera/Gallery) *</label>
                  <input required={!editingId} type="file" accept="image/*" capture="environment" onChange={e => handleImageUpload(e, 'numberPlateImageUrl')} className="w-full bg-zinc-950 border-zinc-700 rounded-md py-1.5 px-3 border focus:ring-yellow-600 focus:border-yellow-600 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  {formData.numberPlateImageUrl && <img src={formData.numberPlateImageUrl} alt="Number Plate" className="mt-2 h-20 w-32 object-cover rounded-md border border-zinc-800" />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Area to Clean Image (Optional)</label>
                  <input type="file" accept="image/*" capture="environment" onChange={e => handleImageUpload(e, 'cleaningAreaImageUrl')} className="w-full bg-zinc-950 border-zinc-700 rounded-md py-1.5 px-3 border focus:ring-yellow-600 focus:border-yellow-600 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  {formData.cleaningAreaImageUrl && <img src={formData.cleaningAreaImageUrl} alt="Cleaning Area" className="mt-2 h-20 w-32 object-cover rounded-md border border-zinc-800" />}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => {setShowForm(false); setEditingId(null);}} className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-md hover:bg-zinc-800">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-yellow-600 text-zinc-50 rounded-md hover:bg-yellow-500">Save Vehicle</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mb-6">
            <button onClick={() => {setFormData({vehicleNumber:'', vehicleType:'HATCHBACK', brand:'', model:'', color:'', vehicleImageUrl:'', numberPlateImageUrl:'', cleaningAreaImageUrl:''}); setShowForm(true);}} className="inline-flex items-center bg-yellow-600 text-zinc-50 px-4 py-2 rounded-md hover:bg-yellow-500 font-medium">
              <Plus className="w-4 h-4 mr-2" /> Add New Vehicle
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <p>Loading vehicles...</p>
          ) : vehicles.length === 0 && !showForm ? (
            <div className="col-span-full text-center py-10 bg-zinc-950 rounded-xl border border-zinc-800 shadow-sm">
              <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-zinc-50 mb-1">No vehicles found</h3>
              <p className="text-zinc-400">Add your car details to proceed with booking.</p>
            </div>
          ) : (
            vehicles.map(vehicle => (
              <div key={vehicle.id} className="bg-zinc-950 rounded-xl shadow-sm border border-zinc-800 p-5 relative">
                <div className="flex items-start">
                  <div className="bg-zinc-900 p-3 rounded-full mr-4 flex-shrink-0">
                    <Car className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-zinc-50">{vehicle.brand} {vehicle.model}</h3>
                    <div className="mt-1 space-y-1">
                      <p className="text-zinc-400 text-sm"><span className="font-medium text-zinc-300">Number:</span> <span className="uppercase">{vehicle.vehicleNumber}</span></p>
                      <p className="text-zinc-400 text-sm"><span className="font-medium text-zinc-300">Type:</span> {vehicle.vehicleType}</p>
                      <p className="text-zinc-400 text-sm"><span className="font-medium text-zinc-300">Color:</span> {vehicle.color}</p>
                    </div>
                    {(vehicle.vehicleImageUrl || vehicle.numberPlateImageUrl || vehicle.cleaningAreaImageUrl) && (
                      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                        {vehicle.vehicleImageUrl && (
                          <div className="flex-shrink-0 relative group">
                            <img src={vehicle.vehicleImageUrl} alt="Vehicle" className="h-16 w-24 object-cover rounded border border-zinc-800" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity">
                              <span className="text-[10px] text-zinc-50 font-medium">Vehicle</span>
                            </div>
                          </div>
                        )}
                        {vehicle.numberPlateImageUrl && (
                          <div className="flex-shrink-0 relative group">
                            <img src={vehicle.numberPlateImageUrl} alt="Number Plate" className="h-16 w-24 object-cover rounded border border-zinc-800" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity">
                              <span className="text-[10px] text-zinc-50 font-medium">Number Plate</span>
                            </div>
                          </div>
                        )}
                        {vehicle.cleaningAreaImageUrl && (
                          <div className="flex-shrink-0 relative group">
                            <img src={vehicle.cleaningAreaImageUrl} alt="Cleaning Area" className="h-16 w-24 object-cover rounded border border-zinc-800" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity">
                              <span className="text-[10px] text-zinc-50 font-medium">Cleaning Area</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => handleEdit(vehicle)} className="text-zinc-500 hover:text-yellow-400 p-1 bg-zinc-900 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(vehicle.id)} className="text-zinc-500 hover:text-red-600 p-1 bg-zinc-900 rounded">
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

export default Vehicles;
