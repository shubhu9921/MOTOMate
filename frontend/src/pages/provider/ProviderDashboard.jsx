import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';
import { 
  Car, MapPin, Calendar, Clock, Loader2, CheckCircle, 
  Map, PlayCircle, Settings
} from 'lucide-react';

const ProviderDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/provider/jobs');
      if (res.data.success) {
        setJobs(res.data.data.content || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (jobId, newStatus) => {
    try {
      const res = await api.put(`/provider/jobs/${jobId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchJobs(); // Refresh jobs
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ASSIGNED': return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Assigned</span>;
      case 'ON_THE_WAY': return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">On The Way</span>;
      case 'IN_PROGRESS': return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">In Progress</span>;
      case 'COMPLETED': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Completed</span>;
      case 'CANCELLED': return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Cancelled</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  const getNextActions = (job) => {
    switch (job.status) {
      case 'ASSIGNED':
        return (
          <button 
            onClick={() => updateStatus(job.id, 'ON_THE_WAY')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Map size={16} /> Start Travel
          </button>
        );
      case 'ON_THE_WAY':
        return (
          <button 
            onClick={() => updateStatus(job.id, 'IN_PROGRESS')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <PlayCircle size={16} /> Arrived / Start Service
          </button>
        );
      case 'IN_PROGRESS':
        return (
          <button 
            onClick={() => updateStatus(job.id, 'COMPLETED')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <CheckCircle size={16} /> Complete Service
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Provider Dashboard</h1>
          <p className="mt-2 text-slate-600">Manage your assigned car wash jobs</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-slate-100">
            <div className="mx-auto h-24 w-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
              <Settings size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Jobs Assigned</h3>
            <p className="text-slate-500 max-w-sm mx-auto">You currently have no jobs assigned. Take a break, and wait for new assignments.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map(job => (
              <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between md:justify-start gap-4">
                    <span className="font-bold text-slate-900 text-lg">Job #{job.id}</span>
                    {getStatusBadge(job.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                        <Car className="text-blue-600 h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{job.serviceName}</p>
                        <p className="text-xs text-slate-500">{job.vehicleName} ({job.vehicleNumber})</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                        <MapPin className="text-blue-600 h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Address</p>
                        <p className="text-xs text-slate-500">ID: {job.addressId} (Contact Admin)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                        <Calendar className="text-blue-600 h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{job.bookingDate}</p>
                        <p className="text-xs text-slate-500">Date</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                        <Clock className="text-blue-600 h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{job.bookingTime}</p>
                        <p className="text-xs text-slate-500">Time</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                    <p className="text-sm text-slate-500 mb-1">To Collect</p>
                    <p className="text-2xl font-bold text-slate-900">₹{job.totalAmount}</p>
                    <p className="text-xs text-slate-400 uppercase mt-1">{job.paymentMethod} • {job.paymentStatus}</p>
                  </div>
                  {getNextActions(job)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProviderDashboard;
