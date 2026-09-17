import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Car, MapPin, Calendar, Clock, Loader2, CheckCircle, 
  Map, PlayCircle, Settings
} from 'lucide-react';

const ProviderDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otpInputs, setOtpInputs] = useState({});
  const [verifying, setVerifying] = useState(null);
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedJobForPayment, setSelectedJobForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [amountReceived, setAmountReceived] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchAssignments();
    // Simulate updating location
    updateLocation();
  }, []);

  const updateLocation = async () => {
    try {
      // Dummy location - in real app, use navigator.geolocation
      await api.put('/provider/location', { latitude: 19.0760, longitude: 72.8777 });
    } catch (e) { console.error(e); }
  };

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/provider/assignments/pending');
      if (res.data.success) {
        setAssignments(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  const respondToAssignment = async (assignmentId, status) => {
    try {
      const res = await api.post(`/provider/assignments/${assignmentId}/respond`, { status, reason: 'Provider selected ' + status });
      if (res.data.success) {
        fetchAssignments();
        fetchJobs();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to respond to assignment');
    }
  };

  const handleCompleteService = (job) => {
    if (job.paymentStatus !== 'PAID' && job.paymentMethod === 'CASH') {
      setSelectedJobForPayment(job);
      setAmountReceived(job.totalAmount);
      setShowPaymentModal(true);
    } else {
      updateStatus(job.id, 'COMPLETED');
    }
  };

  const submitOfflinePayment = async () => {
    try {
      await api.put(`/provider/jobs/${selectedJobForPayment.id}/payment/offline`, {
        amountReceived,
        paymentMethod
      });
      setShowPaymentModal(false);
      setSelectedJobForPayment(null);
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record payment');
    }
  };

  const handleOtpChange = (jobId, value) => {
    setOtpInputs(prev => ({ ...prev, [jobId]: value }));
  };

  const verifyOtp = async (jobId) => {
    const otp = otpInputs[jobId];
    if (!otp) return alert('Please enter OTP');
    
    setVerifying(jobId);
    try {
      const res = await api.post(`/provider/jobs/${jobId}/verify`, { otp });
      if (res.data.success) {
        alert('OTP Verified Successfully!');
        fetchJobs();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setVerifying(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ASSIGNED': return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Assigned</span>;
      case 'ON_THE_WAY': return <span className="px-3 py-1 bg-zinc-800 text-blue-800 rounded-full text-xs font-semibold">On The Way</span>;
      case 'IN_PROGRESS': return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">In Progress</span>;
      case 'COMPLETED': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Completed</span>;
      case 'CANCELLED': return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Cancelled</span>;
      default: return <span className="px-3 py-1 bg-zinc-800 text-zinc-100 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  const getNextActions = (job) => {
    switch (job.status) {
      case 'ASSIGNED':
        return (
          <button 
            onClick={() => updateStatus(job.id, 'ON_THE_WAY')}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-zinc-50 rounded-lg hover:bg-yellow-500 transition"
          >
            <Map size={16} /> Start Travel
          </button>
        );
      case 'ON_THE_WAY':
        return (
          <button 
            onClick={() => updateStatus(job.id, 'IN_PROGRESS')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-zinc-50 rounded-lg hover:bg-purple-700 transition"
          >
            <PlayCircle size={16} /> Arrived / Start Service
          </button>
        );
      case 'IN_PROGRESS':
        return (
          <button 
            onClick={() => handleCompleteService(job)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-zinc-50 rounded-lg hover:bg-green-700 transition"
          >
            <CheckCircle size={16} /> Complete Service
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <>
<main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-zinc-50">Provider Dashboard</h1>
          <p className="mt-2 text-zinc-400">Manage your assigned car wash jobs</p>
        </div>

        {assignments.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </span>
              New Job Assignments
            </h2>
            <div className="space-y-4">
              {assignments.map(a => (
                <div key={a.id} className="bg-zinc-900 border border-yellow-500/30 rounded-xl p-5 shadow-lg">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-50">{a.serviceName}</h3>
                      <p className="text-zinc-400 text-sm mt-1">{a.customerName} • {a.vehicleName} ({a.vehicleNumber})</p>
                      <div className="flex gap-4 mt-3 text-sm text-zinc-300">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {a.bookingDate}</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> {a.bookingTime}</span>
                        <span className="flex items-center gap-1"><MapPin size={14}/> {a.distanceKm.toFixed(1)} km away</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[150px]">
                      {a.isMandatory && (
                        <div className="text-xs bg-red-500/10 text-red-400 p-2 rounded border border-red-500/20 mb-1 text-center font-semibold">
                          Within 5 KM (Mandatory)
                        </div>
                      )}
                      <button 
                        onClick={() => respondToAssignment(a.id, 'ACCEPTED')}
                        className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-zinc-50 font-bold rounded-lg transition"
                      >
                        Accept
                      </button>
                      {!a.isMandatory && (
                        <button 
                          onClick={() => respondToAssignment(a.id, 'REJECTED')}
                          className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg transition"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-yellow-500 h-10 w-10" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-zinc-950 p-12 text-center rounded-2xl shadow-sm border border-zinc-800">
            <div className="mx-auto h-24 w-24 bg-zinc-900 text-yellow-500 rounded-full flex items-center justify-center mb-6">
              <Settings size={40} />
            </div>
            <h3 className="text-xl font-bold text-zinc-50 mb-2">No Jobs Assigned</h3>
            <p className="text-zinc-400 max-w-sm mx-auto">You currently have no jobs assigned. Take a break, and wait for new assignments.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map(job => (
              <div key={job.id} className="bg-zinc-950 rounded-2xl shadow-sm border border-zinc-800 p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between md:justify-start gap-4 border-b border-zinc-800 pb-4 mb-2">
                    <span className="font-bold text-zinc-50 text-lg">Job #{job.id}</span>
                    {getStatusBadge(job.status)}
                  </div>
                  
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold uppercase shrink-0">
                      {(job.customerName || 'C')[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-50">{job.customerName || 'Customer'}</h4>
                      <p className="text-sm text-zinc-400">{job.customerPhone || 'No phone provided'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-zinc-900 rounded-lg shrink-0">
                        <Car className="text-yellow-500 h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-50">{job.serviceName}</p>
                        <p className="text-xs text-zinc-400">{job.vehicleName} ({job.vehicleNumber})</p>
                        {job.vehicleImageUrl && (
                          <img src={job.vehicleImageUrl} alt="Vehicle" className="mt-2 h-16 w-24 object-cover rounded border border-zinc-800" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-zinc-900 rounded-lg shrink-0">
                        <MapPin className="text-yellow-500 h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-50">Address</p>
                        <p className="text-xs text-zinc-400 line-clamp-2">
                          {job.addressLine ? `${job.addressLine}, ${job.city}, ${job.pincode}` : `ID: ${job.addressId} (Contact Admin)`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-zinc-900 rounded-lg shrink-0">
                        <Calendar className="text-yellow-500 h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-50">{job.bookingDate}</p>
                        <p className="text-xs text-zinc-400">Date</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-zinc-900 rounded-lg shrink-0">
                        <Clock className="text-yellow-500 h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-50">{job.bookingTime}</p>
                        <p className="text-xs text-zinc-400">Time</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
                    <p className="text-sm text-zinc-400 mb-1">To Collect</p>
                    <p className="text-2xl font-bold text-zinc-50">₹{job.totalAmount}</p>
                    <p className="text-xs text-zinc-500 uppercase mt-1">{job.paymentMethod} • {job.paymentStatus}</p>
                  </div>

                  {!job.isVerified && job.status !== 'COMPLETED' && job.status !== 'CANCELLED' && (
                    <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20 text-center">
                      <p className="text-xs font-bold text-yellow-500 mb-2">VERIFICATION REQUIRED</p>
                      <input 
                        type="text" 
                        placeholder="Enter 4-digit OTP" 
                        maxLength={4}
                        value={otpInputs[job.id] || ''}
                        onChange={(e) => handleOtpChange(job.id, e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-center text-zinc-50 font-black tracking-widest mb-2"
                      />
                      <button 
                        onClick={() => verifyOtp(job.id)}
                        disabled={verifying === job.id}
                        className="w-full text-xs py-2 bg-yellow-600 text-zinc-50 rounded hover:bg-yellow-500 transition font-bold disabled:opacity-50"
                      >
                        {verifying === job.id ? 'VERIFYING...' : 'VERIFY OTP'}
                      </button>
                    </div>
                  )}

                  {getNextActions(job)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {showPaymentModal && selectedJobForPayment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-950 rounded-2xl w-full max-w-md p-6 shadow-xl border border-zinc-800">
            <h3 className="text-xl font-bold text-zinc-50 mb-4">Complete Service & Collect Payment</h3>
            <p className="text-sm text-zinc-400 mb-6">Record offline payment for Job #{selectedJobForPayment.id}</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Amount Due</label>
                <div className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-zinc-50 font-bold cursor-not-allowed">
                  ₹{selectedJobForPayment.totalAmount}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Amount Received</label>
                <input 
                  type="number"
                  disabled
                  value={amountReceived}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-zinc-50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Payment Method</label>
                <select 
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-zinc-50 focus:ring-yellow-600 focus:border-yellow-600"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="OTHER_OFFLINE">Other Offline</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-zinc-400 font-medium hover:bg-zinc-800 rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                onClick={submitOfflinePayment}
                className="px-4 py-2 bg-green-600 text-zinc-50 font-medium rounded-lg hover:bg-green-500 transition"
              >
                Confirm Payment & Complete
              </button>
            </div>
          </div>
        </div>
      )}

      </>
  );
};

export default ProviderDashboard;
