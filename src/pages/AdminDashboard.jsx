import { useState, useEffect } from 'react';
import { locations } from '../data/mockData';
import CalendarView from '../components/CalendarView';
import { useToast } from '../components/ToastProvider';

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [viewMode, setViewMode] = useState('list'); // list or calendar
  const toast = useToast();
  
  // Get current branch (default to first open branch for demo)
  const currentBranch = locations.find(l => l.id === 1) || locations[0];

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    // Load appointments from localStorage or use sample data
    let allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    // If no appointments, create sample data for design
    if (allAppointments.length === 0) {
      allAppointments = [
        {
          id: 1,
          branchId: 1,
          customerName: 'Juan Dela Cruz',
          email: 'juan@example.com',
          phone: '0917 123 4567',
          vehicleYear: '2020',
          vehicleMake: 'Toyota',
          vehicleModel: 'Vios',
          vehicleTrim: '1.5 G',
          services: ['Tire Rotation', 'Oil Change'],
          date: '2026-04-05',
          time: '10:00 AM',
          mileage: 50000,
          notes: '',
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          branchId: 1,
          customerName: 'Maria Santos',
          email: 'maria@example.com',
          phone: '0918 765 4321',
          vehicleYear: '2019',
          vehicleMake: 'Honda',
          vehicleModel: 'Civic',
          vehicleTrim: '1.8 S',
          services: ['Brake Inspection', 'Battery Check'],
          date: '2026-04-06',
          time: '2:00 PM',
          mileage: 65000,
          notes: 'Customer concerned about brake noise, needs early service',
          status: 'approved',
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          branchId: 1,
          customerName: 'Pedro Reyes',
          email: 'pedro@example.com',
          phone: '0919 234 5678',
          vehicleYear: '2021',
          vehicleMake: 'Mitsubishi',
          vehicleModel: 'Montero Sport',
          vehicleTrim: 'GLS',
          services: ['Wheel Alignment', 'Tire Replacement'],
          date: '2026-04-07',
          time: '9:00 AM',
          mileage: 30000,
          notes: '',
          status: 'rejected',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('appointments', JSON.stringify(allAppointments));
    }
    
    setAppointments(allAppointments);
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updated = allAppointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    );
    localStorage.setItem('appointments', JSON.stringify(updated));
    setAppointments(updated);
  };

  const approveAppointment = (id) => {
    updateAppointmentStatus(id, 'approved');
    toast.success('Appointment approved successfully!');
  };

  const rejectAppointment = (id) => {
    updateAppointmentStatus(id, 'rejected');
    toast.warning('Appointment rejected');
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

  // Filter appointments
  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === filter);

  // Stats
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    rejected: appointments.filter(a => a.status === 'rejected').length
  };

  if (!appointments.length) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-black to-brand-card">
      {/* Header */}
      <header className="bg-brand-black border-b border-brand-border sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-black uppercase text-white text-xl">
                Branch Admin Dashboard
              </h1>
              <p className="text-brand-textMuted text-sm mt-1">
                Managing: <span className="text-brand-yellow font-semibold">{currentBranch.name}</span> • {currentBranch.area}
              </p>
            </div>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-brand-raised border border-brand-border text-white px-4 py-2 rounded-lg hover:border-brand-yellow transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Site
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
            <div className="text-3xl font-display font-black text-red-400 mb-1">{stats.rejected}</div>
            <div className="text-xs text-brand-textMuted uppercase tracking-wider">Rejected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
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
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-textMuted">Date & Time</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-textMuted">Status</th>
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
                        <div className="text-white">{apt.date}</div>
                        <div className="text-sm text-brand-textMuted">{apt.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          apt.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/40' :
                          apt.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                          'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {apt.status === 'pending' && (
                            <>
                              <button
                                onClick={() => approveAppointment(apt.id)}
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
                          <button
                            onClick={() => startEditing(apt)}
                            className="bg-brand-raised border border-brand-border text-white px-3 py-1.5 rounded text-xs font-bold uppercase hover:border-brand-yellow transition-colors"
                          >
                            Edit
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
    </div>
  );
}

export default AdminDashboard;
