import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { locations } from '../data/mockData';
import CalendarView from '../components/CalendarView';
import { useToast } from '../components/ToastProvider';
import { getBranchBookings, updateBookingStatus } from '../utils/supabase';

// Branch ID to branch code mapping for API sync
const BRANCH_ID_TO_CODE = {
  1: 'ALABANG',
  2: 'BICUTAN',
  3: 'BACOOR',
  4: 'SUCAT',
  5: 'SUCAT2',
  6: 'LAOAG'
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [viewMode, setViewMode] = useState('list'); // list or calendar
  const [showBayAssigner, setShowBayAssigner] = useState(false); // Bay assignment modal
  const [pendingApprovalId, setPendingApprovalId] = useState(null); // Booking being approved
  const [selectedBayForAssignment, setSelectedBayForAssignment] = useState(null); // Bay to assign
  const toast = useToast();
  
  // Check authentication and get current admin
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('currentAdmin') || 'null');
    
    if (!admin) {
      // Not logged in, redirect to login
      navigate('/admin/login');
      return;
    }
    
    // Check if it's a branch admin (not super admin)
    if (admin.role === 'branch_admin' && !admin.branchId) {
      // Invalid branch admin, redirect to login
      localStorage.removeItem('currentAdmin');
      navigate('/admin/login');
      return;
    }
    
    setCurrentAdmin(admin);
    loadAppointments(admin);
  }, [navigate]);

  const loadAppointments = async (admin) => {
    // First try to load from Supabase with customer and vehicle data
    try {
      if (admin.role === 'branch_admin' && admin.branchId) {
        const result = await getBranchBookings(admin.branchId);
        
        if (result.success && result.data.length > 0) {
          // Map Supabase data with joined customer/vehicle to local format for UI
          const allAppointments = result.data.map(booking => {
            // Handle nested customer data
            const customer = booking.customers || {};
            const vehicle = booking.vehicles || {};
            
            return {
              id: booking.id,
              branchId: booking.branch_id,
              customerName: customer.full_name || 'N/A',
              email: customer.email || '',
              phone: customer.phone || '',
              vehicleYear: vehicle.year || '',
              vehicleMake: vehicle.make || '',
              vehicleModel: vehicle.model || '',
              vehicleTrim: vehicle.trim || '',
              vehiclePlate: vehicle.plate_number || '',
              services: booking.services || [],
              date: booking.preferred_date,
              time: booking.preferred_time,
              mileage: booking.mileage || 0,
              notes: booking.customer_concern || '',
              status: booking.status,
              createdAt: booking.created_at,
              bayId: booking.bay_id,
              bayName: booking.bay_name
            };
          });
          
          // Also save to localStorage for offline access
          localStorage.setItem('appointments', JSON.stringify(allAppointments));
          setAppointments(allAppointments);
          return;
        }
      }
    } catch (err) {
      console.error('Error loading from Supabase:', err);
    }
    
    // Fallback to localStorage
    let allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    // Filter by branch if branch admin
    if (admin.role === 'branch_admin') {
      allAppointments = allAppointments.filter(apt => apt.branchId === admin.branchId);
    }
    
    setAppointments(allAppointments);
  };

  const updateAppointmentStatus = async (appointmentId, newStatus, bayId = null, bayName = null) => {
    console.log('Updating appointment status:', { appointmentId, newStatus });
    
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    console.log('Total appointments before update:', allAppointments.length);
    
    const updated = allAppointments.map(apt => {
      if (apt.id === appointmentId) {
        console.log('Found appointment to update:', apt);
        return { ...apt, status: newStatus, bayId: bayId || apt.bayId, bayName: bayName || apt.bayName };
      }
      return apt;
    });
    
    console.log('Total appointments after update:', updated.length);
    console.log('Updated appointment:', updated.find(apt => apt.id === appointmentId));
    
    localStorage.setItem('appointments', JSON.stringify(updated));
    setAppointments(updated);
    
    // Also update in Supabase
    try {
      const appointment = allAppointments.find(apt => apt.id === appointmentId);
      if (appointment && appointment.branchId) {
        const updates = { 
          status: newStatus,
          bay_id: bayId || appointment.bayId || null,
          bay_name: bayName || appointment.bayName || null
        };
        const result = await updateBookingStatus(appointmentId, updates);
        console.log('Supabase update result:', result.success ? 'SUCCESS' : 'FAILED');
      }
    } catch (err) {
      console.error('Error updating Supabase:', err);
    }
  };

  const initiateApproval = (id) => {
    // Get the appointment
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const appointment = allAppointments.find(apt => apt.id === id);
    
    if (!appointment) {
      toast.error('Appointment not found');
      return;
    }
    
    // Check if bay is already assigned
    if (appointment.bayId) {
      // Bay already assigned, approve directly
      approveAppointment(id);
    } else {
      // Show bay assignment modal
      setPendingApprovalId(id);
      setSelectedBayForAssignment(appointment.bayPreference || null);
      setShowBayAssigner(true);
    }
  };

  const approveAppointment = async (id, bayId = null, bayName = null) => {
    // Get the appointment data
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const appointment = allAppointments.find(apt => apt.id === id);
    
    if (!appointment) {
      toast.error('Appointment not found');
      return;
    }
    
    // Update with assigned bay if provided
    const updatedWithBay = allAppointments.map(apt => {
      if (apt.id === id) {
        return { 
          ...apt, 
          bayId: bayId || apt.bayId,
          bayName: bayName || apt.bayName,
          status: 'approved'
        };
      }
      return apt;
    });
    
    localStorage.setItem('appointments', JSON.stringify(updatedWithBay));
    setAppointments(updatedWithBay);
    
    // Get updated appointment
    const updatedAppointment = updatedWithBay.find(apt => apt.id === id);
    
    // Try to send to database API
    try {
      // Format payload to match API expectations (camelCase + branch code)
      const branchCode = BRANCH_ID_TO_CODE[updatedAppointment.branchId] || 'ALABANG';
      
      const apiPayload = {
        customerName: updatedAppointment.customerName,
        phone: updatedAppointment.phone,
        email: updatedAppointment.email,
        service: updatedAppointment.services?.[0] || '',
        serviceType: updatedAppointment.services?.join(', ') || '',
        vehicleMake: updatedAppointment.vehicleMake,
        vehicleModel: updatedAppointment.vehicleModel,
        vehicleYear: updatedAppointment.vehicleYear,
        plateNumber: updatedAppointment.plateNumber,
        preferredDate: updatedAppointment.date,
        preferredTime: updatedAppointment.time,
        branch: branchCode,  // Use branch code (string) not branch ID (int)
        notes: updatedAppointment.notes || '',
        status: 'approved',
        bayId: updatedAppointment.bayId || null,
        bayName: updatedAppointment.bayName || null,
      };
      
      console.log('Sending to database API:', JSON.stringify(apiPayload, null, 2));
      
      const response = await fetch('https://hh-asia-tyre-crm-inv-sys.vercel.app/api/public/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload),
      });
      
      let result;
      const responseText = await response.text();
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        result = { error: responseText };
      }
      
      console.log('API Response:', response.status, result);
      
      if (response.ok) {
        // Update appointment with API booking ID
        const updated = allAppointments.map(apt => 
          apt.id === id ? { ...apt, apiBookingId: result.data?.id || result.id, apiSuccess: true } : apt
        );
        localStorage.setItem('appointments', JSON.stringify(updated));
        setAppointments(updated);
        toast.success('Appointment approved and sent to database!');
      } else {
        console.warn('API booking failed:', result.error || responseText);
        toast.success('Appointment approved (saved locally)');
      }
    } catch (error) {
      console.error('Error sending to database:', error);
      toast.success('Appointment approved (saved locally, will sync when online)');
    }
    
    setFilter('all');
  };

  const rejectAppointment = (id) => {
    updateAppointmentStatus(id, 'rejected');
    setFilter('all'); // Switch to 'all' filter to show the rejected appointment
    toast.warning('Appointment rejected');
  };

  const retrySyncToDatabase = async (id) => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const appointment = allAppointments.find(apt => apt.id === id);
    
    if (!appointment) {
      toast.error('Appointment not found');
      return;
    }
    
    try {
      const branchCode = BRANCH_ID_TO_CODE[appointment.branchId] || 'ALABANG';
      
      const apiPayload = {
        customerName: appointment.customerName,
        phone: appointment.phone,
        email: appointment.email,
        service: appointment.services?.[0] || '',
        serviceType: appointment.services?.join(', ') || '',
        vehicleMake: appointment.vehicleMake,
        vehicleModel: appointment.vehicleModel,
        vehicleYear: appointment.vehicleYear,
        plateNumber: appointment.plateNumber,
        preferredDate: appointment.date,
        preferredTime: appointment.time,
        branch: branchCode,  // Use branch code
        notes: appointment.notes || '',
        status: appointment.status,
        bayId: appointment.bayId || null,
        bayName: appointment.bayName || null,
      };
      
      const response = await fetch('https://hh-asia-tyre-crm-inv-sys.vercel.app/api/public/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        const updated = allAppointments.map(apt => 
          apt.id === id ? { ...apt, apiBookingId: result.data?.id, apiSuccess: true } : apt
        );
        localStorage.setItem('appointments', JSON.stringify(updated));
        setAppointments(updated);
        toast.success('Successfully synced to database!');
      } else {
        toast.error('Failed to sync: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Retry sync error:', error);
      toast.error('Failed to sync. Please try again later.');
    }
  };

  const completeService = (id) => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updated = allAppointments.map(apt => {
      if (apt.id === id) {
        return { 
          ...apt, 
          status: 'completed',
          completedAt: new Date().toISOString()
        };
      }
      return apt;
    });
    localStorage.setItem('appointments', JSON.stringify(updated));
    setAppointments(updated);
    setFilter('all');
    toast.success('Service completed! Bay is now available.');
  };

  const startEditing = (appointment) => {
    setEditingAppointment(appointment.id);
    setEditForm({
      date: appointment.date,
      time: appointment.time,
      services: appointment.services,
      notes: appointment.notes || ''
    });
  };

  const saveEdit = (appointmentId) => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updated = allAppointments.map(apt => 
      apt.id === appointmentId ? { ...apt, ...editForm } : apt
    );
    localStorage.setItem('appointments', JSON.stringify(updated));
    setEditingAppointment(null);
    setEditForm({});
    setAppointments(updated);
  };

  const cancelEdit = () => {
    setEditingAppointment(null);
    setEditForm({});
  };

  const deleteAppointment = (id) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }
    
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updated = allAppointments.filter(apt => apt.id !== id);
    localStorage.setItem('appointments', JSON.stringify(updated));
    setAppointments(updated);
    toast.success('Booking deleted successfully');
  };

  const exportToCSV = () => {
    if (appointments.length === 0) {
      toast.error('No bookings to export');
      return;
    }

    // CSV Headers
    const headers = [
      'ID',
      'Customer Name',
      'Email',
      'Phone',
      'Vehicle Year',
      'Vehicle Make',
      'Vehicle Model',
      'Plate Number',
      'Services',
      'Date',
      'Time',
      'Status',
      'Bay ID',
      'Bay Name',
      'Notes',
      'Created At',
      'Completed At'
    ];

    // Convert appointments to CSV rows
    const rows = appointments.map(apt => [
      apt.id,
      `"${apt.customerName || ''}"`,
      `"${apt.email || ''}"`,
      `"${apt.phone || ''}"`,
      apt.vehicleYear || '',
      `"${apt.vehicleMake || ''}"`,
      `"${apt.vehicleModel || ''}"`,
      `"${apt.plateNumber || ''}"`,
      `"${(apt.services || []).join(', ')}"`,
      apt.date || '',
      apt.time || '',
      apt.status || '',
      apt.bayId || '',
      `"${apt.bayName || ''}"`,
      `"${(apt.notes || '').replace(/"/g, '""')}"`,
      apt.createdAt || '',
      apt.completedAt || ''
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    // Generate filename with date
    const today = new Date().toISOString().split('T')[0];
    const branchName = currentAdmin.role === 'branch_admin' 
      ? locations.find(l => l.id === currentAdmin.branchId)?.name.replace(/\s+/g, '_') || 'branch'
      : 'all_branches';
    
    link.setAttribute('download', `bookings_${branchName}_${today}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${appointments.length} bookings to CSV`);
  };

  // Filter appointments
  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === filter);

  // Stats
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    rejected: appointments.filter(a => a.status === 'rejected').length
  };

  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-brand-yellow border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-brand-textMuted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!appointments.length && appointments.length !== 0) return null;

  // Get branch info for branch admin
  const branchInfo = currentAdmin.role === 'branch_admin' 
    ? locations.find(l => l.id === currentAdmin.branchId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-black to-brand-card">
      {/* Header */}
      <header className="bg-brand-black border-b border-brand-border sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-black uppercase text-white text-xl">
                {currentAdmin.role === 'super_admin' ? 'Super Admin Dashboard' : 'Branch Admin Dashboard'}
              </h1>
              <p className="text-brand-textMuted text-sm mt-1">
                {currentAdmin.role === 'super_admin' ? (
                  <span className="text-brand-yellow font-semibold">All Branches</span>
                ) : (
                  <>
                    Managing: <span className="text-brand-yellow font-semibold">{branchInfo?.name}</span> • {branchInfo?.area}
                  </>
                )}
                {' • '}
                <span className="text-white">{currentAdmin.fullName}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/40 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/20 transition-colors"
                title="Export bookings to CSV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 bg-brand-raised border border-brand-border text-white px-4 py-2 rounded-lg hover:border-brand-yellow transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Site
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem('currentAdmin');
                  navigate('/admin/login');
                }}
                className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-brand-card border border-brand-border rounded-xl p-6">
            <div className="text-3xl font-display font-black text-white mb-1">{stats.total}</div>
            <div className="text-xs text-brand-textMuted uppercase tracking-wider">Total Appointments</div>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-xl p-6">
            <div className="text-3xl font-display font-black text-yellow-400 mb-1">{stats.pending}</div>
            <div className="text-xs text-brand-textMuted uppercase tracking-wider">Pending</div>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-xl p-6">
            <div className="text-3xl font-display font-black text-green-400 mb-1">{stats.approved}</div>
            <div className="text-xs text-brand-textMuted uppercase tracking-wider">Approved</div>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-xl p-6">
            <div className="text-3xl font-display font-black text-blue-400 mb-1">{stats.completed}</div>
            <div className="text-xs text-brand-textMuted uppercase tracking-wider">Completed</div>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-xl p-6">
            <div className="text-3xl font-display font-black text-red-400 mb-1">{stats.rejected}</div>
            <div className="text-xs text-brand-textMuted uppercase tracking-wider">Rejected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'completed', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-all ${
                  filter === status
                    ? 'bg-brand-yellow text-black shadow-[0_0_24px_rgba(255,215,0,0.3)]'
                    : 'bg-brand-card border border-brand-border text-brand-textMuted hover:border-brand-yellow/40'
                }`}
              >
                {status} {status !== 'all' && `(${stats[status]})`}
              </button>
            ))}
          </div>
          
          {/* View Toggle */}
          <div className="flex bg-brand-card border border-brand-border rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                viewMode === 'list'
                  ? 'bg-brand-yellow text-black'
                  : 'text-brand-textMuted hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                viewMode === 'calendar'
                  ? 'bg-brand-yellow text-black'
                  : 'text-brand-textMuted hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </button>
          </div>
        </div>

        {/* Appointments - Calendar or List View */}
        {viewMode === 'calendar' ? (
          <CalendarView 
            appointments={appointments} 
            onSelectAppointment={(apt) => {
              // Could open appointment details modal here
              console.log('Selected appointment:', apt);
            }}
          />
        ) : (
          <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-brand-textDim mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-brand-textMuted text-lg">No appointments found</p>
              <p className="text-brand-textDim text-sm mt-1">
                {filter === 'all' ? 'Appointments will appear here when customers book' : `No ${filter} appointments`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-raised border-b border-brand-border">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-textMuted">Customer</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-textMuted">Vehicle</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-textMuted">Service</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-textMuted">Bay</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-textMuted">Date & Time</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-textMuted">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-textMuted">DB Sync</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-textMuted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-brand-raised/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-white font-semibold">{apt.customerName}</div>
                        <div className="text-sm text-brand-textMuted">{apt.phone}</div>
                        <div className="text-xs text-brand-textDim">{apt.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{apt.vehicleYear} {apt.vehicleMake} {apt.vehicleModel}</div>
                        {apt.mileage && (
                          <div className="text-xs text-brand-textDim">{apt.mileage.toLocaleString()} km</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {apt.services?.map((service, idx) => (
                            <span key={idx} className="text-xs bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow px-2 py-1 rounded">
                              {service}
                            </span>
                          ))}
                          {apt.otherServices && (
                            <span className="text-xs bg-purple-500/10 border border-purple-500/30 text-purple-400 px-2 py-1 rounded">
                              Custom: {apt.otherServices}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {apt.bayName ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-brand-yellow/10 border border-brand-yellow/30 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-brand-yellow" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18.707a1 1 0 01-1.414 0L12 16.12V14h2.12l2.586 2.586a1 1 0 010 1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-white font-semibold text-sm">{apt.bayName}</div>
                              <div className="text-xs text-brand-textDim">Bay #{apt.bayId}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-brand-textDim text-xs">No bay assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{apt.date}</div>
                        <div className="text-sm text-brand-textMuted">{apt.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          apt.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/40' :
                          apt.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                          apt.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                          'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                        }`}>
                          {apt.status === 'completed' ? '✓ Completed' : apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {/* Database Sync Status */}
                        {apt.apiSuccess === true ? (
                          <div className="flex items-center gap-2" title={`Synced to database (ID: ${apt.apiBookingId || 'N/A'})`}>
                            <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-green-400 text-xs font-semibold">Synced</div>
                              <div className="text-brand-textDim text-[10px]">Database</div>
                            </div>
                          </div>
                        ) : apt.apiSuccess === false ? (
                          <div className="flex items-center gap-2" title="Failed to sync to database">
                            <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-red-400 text-xs font-semibold">Failed</div>
                              <div className="text-brand-textDim text-[10px]">Not synced</div>
                            </div>
                          </div>
                        ) : apt.status === 'approved' || apt.status === 'completed' ? (
                          <div className="flex items-center gap-2" title="Pending sync to database">
                            <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-yellow-400 text-xs font-semibold">Pending</div>
                              <div className="text-brand-textDim text-[10px]">Not synced</div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-brand-textDim text-xs">—</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {apt.status === 'pending' && (
                            <>
                              <button
                                onClick={() => initiateApproval(apt.id)}
                                className="bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-green-500/30 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectAppointment(apt.id)}
                                className="bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-red-500/30 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {apt.status === 'approved' && (
                            <button
                              onClick={() => completeService(apt.id)}
                              className="bg-blue-500/20 border border-blue-500/40 text-blue-400 px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-blue-500/30 transition-colors flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Complete Service
                            </button>
                          )}
                          {apt.status === 'completed' && (
                            <span className="text-blue-400 text-xs font-semibold px-3 py-1.5">
                              ✓ Service Done
                            </span>
                          )}
                          {apt.apiSuccess === false && (
                            <button
                              onClick={() => retrySyncToDatabase(apt.id)}
                              className="bg-purple-500/20 border border-purple-500/40 text-purple-400 px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-purple-500/30 transition-colors flex items-center gap-1"
                              title="Retry sending to database"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Retry Sync
                            </button>
                          )}
                          <button
                            onClick={() => startEditing(apt)}
                            className="bg-brand-raised border border-brand-border text-white px-3 py-1.5 rounded text-xs font-bold uppercase hover:border-brand-yellow transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteAppointment(apt.id)}
                            className="bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-red-500/30 transition-colors flex items-center gap-1"
                            title="Delete this booking permanently"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-7V7a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingAppointment && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-brand-border">
              <h2 className="font-display font-bold uppercase text-white text-xl">Edit Appointment</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-brand-raised border border-brand-border text-white focus:outline-none focus:border-brand-yellow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={editForm.time}
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-brand-raised border border-brand-border text-white focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                  Notes
                </label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={4}
                  placeholder="Add any special instructions or notes..."
                  className="w-full px-4 py-2 rounded-lg bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-brand-border flex gap-3">
              <button
                onClick={() => saveEdit(editingAppointment)}
                className="flex-1 bg-brand-yellow text-black py-3 rounded-lg font-display font-bold uppercase tracking-wider hover:bg-yellow-400 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 bg-brand-raised border border-brand-border text-white py-3 rounded-lg font-display font-bold uppercase tracking-wider hover:border-brand-yellow transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bay Assignment Modal (Shown during approval) */}
      {showBayAssigner && pendingApprovalId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-brand-card border border-brand-border rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-brand-border flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-black text-white mb-1">Assign Service Bay</h2>
                <p className="text-brand-textMuted text-sm">Select a bay for this booking before approving</p>
              </div>
              <button
                onClick={() => setShowBayAssigner(false)}
                className="text-brand-textMuted hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {(() => {
                const branch = locations.find(l => l.id === (currentAdmin.branchId || 1));
                if (!branch || !branch.serviceBays) {
                  return <div className="text-brand-textMuted text-center py-8">No bays configured</div>;
                }

                return (
                  <>
                    {/* Booking Info */}
                    <div className="mb-6 p-4 bg-brand-raised border border-brand-border rounded-lg">
                      <div className="text-sm text-brand-textMuted mb-2">Booking Details:</div>
                      <div className="text-white font-semibold">
                        {(() => {
                          const apt = JSON.parse(localStorage.getItem('appointments') || '[]').find(a => a.id === pendingApprovalId);
                          if (!apt) return '';
                          return `${apt.customerName} - ${apt.date} at ${apt.time}`;
                        })()}
                      </div>
                    </div>

                    {/* Bay Options */}
                    <div className="space-y-3 mb-6">
                      {branch.serviceBays.map((bay) => {
                        return (
                          <button
                            key={bay.id}
                            onClick={() => setSelectedBayForAssignment(bay.id)}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              selectedBayForAssignment === bay.id
                                ? 'bg-brand-yellow/10 border-brand-yellow shadow-[0_0_24px_rgba(255,215,0,0.2)]'
                                : 'bg-brand-raised border-brand-border hover:border-brand-yellow/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                  selectedBayForAssignment === bay.id
                                    ? 'bg-brand-yellow/20 border border-brand-yellow/40'
                                    : 'bg-gray-700 border border-gray-600'
                                }`}>
                                  <svg className={`w-6 h-6 ${selectedBayForAssignment === bay.id ? 'text-brand-yellow' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18.707a1 1 0 01-1.414 0L12 16.12V14h2.12l2.586 2.586a1 1 0 010 1.414z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div>
                                  <div className="text-white font-bold text-lg">{bay.name}</div>
                                  <div className="text-brand-textMuted text-sm">{bay.type}</div>
                                </div>
                              </div>
                              {selectedBayForAssignment === bay.id ? (
                                <svg className="w-6 h-6 text-brand-yellow" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <span className="text-brand-textMuted text-xs">Select</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          const apt = JSON.parse(localStorage.getItem('appointments') || '[]').find(a => a.id === pendingApprovalId);
                          const bayId = selectedBayForAssignment;
                          const bayName = bayId ? branch.serviceBays.find(b => b.id === bayId)?.name : null;
                          approveAppointment(pendingApprovalId, bayId, bayName);
                          setShowBayAssigner(false);
                          setPendingApprovalId(null);
                          setSelectedBayForAssignment(null);
                        }}
                        className="flex-1 bg-brand-yellow text-black py-3 rounded-lg font-display font-bold uppercase tracking-wider hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedBayForAssignment}
                      >
                        {selectedBayForAssignment ? 'Assign Bay & Approve' : 'Select a Bay First'}
                      </button>
                      <button
                        onClick={() => {
                          // Approve without bay assignment (will assign later)
                          approveAppointment(pendingApprovalId);
                          setShowBayAssigner(false);
                          setPendingApprovalId(null);
                        }}
                        className="px-6 bg-brand-raised border border-brand-border text-white py-3 rounded-lg font-display font-bold uppercase tracking-wider hover:border-brand-yellow transition-colors"
                      >
                        Skip for Now
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
