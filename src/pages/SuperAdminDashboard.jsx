import { useState, useEffect } from 'react';
import { locations } from '../data/mockData';

function SuperAdminDashboard() {
  const [branchAdmins, setBranchAdmins] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    branchId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load branch admins on mount
  useEffect(() => {
    loadBranchAdmins();
  }, []);

  const loadBranchAdmins = () => {
    let admins = JSON.parse(localStorage.getItem('branch_admins') || '[]');
    
    // Add sample data if empty (for design purposes)
    if (admins.length === 0) {
      admins = [
        {
          id: 1,
          email: 'maria.santos@hhasia.com',
          password: 'alabang2026',
          fullName: 'Maria Santos',
          branchId: 1,
          role: 'branch_admin',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          email: 'juan.reyes@hhasia.com',
          password: 'laoag2026',
          fullName: 'Juan Reyes',
          branchId: 4,
          role: 'branch_admin',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('branch_admins', JSON.stringify(admins));
    }
    
    setBranchAdmins(admins);
  };



  const handleCreateAdmin = (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Get existing admins
    const admins = JSON.parse(localStorage.getItem('branch_admins') || '[]');
    
    // Check if email already exists
    if (admins.find(a => a.email === formData.email)) {
      setError('Email already registered');
      return;
    }

    // Check if branch already has an admin
    if (admins.find(a => a.branchId === parseInt(formData.branchId))) {
      setError('This branch already has an admin');
      return;
    }

    // Create new admin
    const newAdmin = {
      id: Date.now(),
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      branchId: parseInt(formData.branchId),
      role: 'branch_admin',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    admins.push(newAdmin);
    localStorage.setItem('branch_admins', JSON.stringify(admins));

    setSuccess('Branch admin created successfully!');
    setShowCreateModal(false);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      branchId: ''
    });
    loadBranchAdmins();
    
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      email: admin.email,
      password: '',
      confirmPassword: '',
      fullName: admin.fullName,
      branchId: admin.branchId.toString()
    });
    setShowCreateModal(true);
  };

  const handleUpdateAdmin = (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Get existing admins
    const admins = JSON.parse(localStorage.getItem('branch_admins') || '[]');
    
    // Update admin
    const updatedAdmins = admins.map(admin => {
      if (admin.id === editingAdmin.id) {
        return {
          ...admin,
          email: formData.email,
          password: formData.password || admin.password,
          fullName: formData.fullName,
          branchId: parseInt(formData.branchId)
        };
      }
      return admin;
    });

    localStorage.setItem('branch_admins', JSON.stringify(updatedAdmins));

    setSuccess('Branch admin updated successfully!');
    setShowCreateModal(false);
    setEditingAdmin(null);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      branchId: ''
    });
    loadBranchAdmins();
    
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteAdmin = (adminId) => {
    if (!confirm('Are you sure you want to delete this branch admin?')) {
      return;
    }

    const admins = JSON.parse(localStorage.getItem('branch_admins') || '[]');
    const updatedAdmins = admins.filter(a => a.id !== adminId);
    localStorage.setItem('branch_admins', JSON.stringify(updatedAdmins));

    setSuccess('Branch admin deleted successfully!');
    loadBranchAdmins();
    
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleToggleStatus = (adminId) => {
    const admins = JSON.parse(localStorage.getItem('branch_admins') || '[]');
    const updatedAdmins = admins.map(admin => {
      if (admin.id === adminId) {
        return {
          ...admin,
          status: admin.status === 'active' ? 'inactive' : 'active'
        };
      }
      return admin;
    });
    localStorage.setItem('branch_admins', JSON.stringify(updatedAdmins));
    loadBranchAdmins();
  };

  const getBranchName = (branchId) => {
    const branch = locations.find(l => l.id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingAdmin(null);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      branchId: ''
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-black to-brand-card">
      {/* Header */}
      <header className="bg-brand-black border-b border-brand-border sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-black uppercase text-white text-xl">
                Super Admin Dashboard
              </h1>
              <p className="text-brand-textMuted text-sm mt-1">
                Managing all branch administrators
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="px-4 py-2 bg-brand-raised hover:bg-brand-border text-white rounded-md text-sm font-semibold transition-colors"
              >
                Back to Site
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
            {success}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-brand-card border border-brand-border rounded-xl p-6">
            <p className="text-brand-textMuted text-sm mb-2">Total Branches</p>
            <p className="text-3xl font-bold text-white">{locations.length}</p>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-xl p-6">
            <p className="text-brand-textMuted text-sm mb-2">Active Admins</p>
            <p className="text-3xl font-bold text-green-400">
              {branchAdmins.filter(a => a.status === 'active').length}
            </p>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-xl p-6">
            <p className="text-brand-textMuted text-sm mb-2">Inactive Admins</p>
            <p className="text-3xl font-bold text-yellow-400">
              {branchAdmins.filter(a => a.status === 'inactive').length}
            </p>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-xl p-6">
            <p className="text-brand-textMuted text-sm mb-2">Unassigned Branches</p>
            <p className="text-3xl font-bold text-brand-textDim">
              {locations.filter(loc => !branchAdmins.find(a => a.branchId === loc.id)).length}
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Branch Administrators</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-brand-yellow text-brand-black rounded-md font-bold uppercase tracking-wider hover:bg-yellow-400 transition-colors shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Branch Admin
          </button>
        </div>

        {/* Admins Table */}
        <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
          {branchAdmins.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-brand-textDim mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-brand-textMuted text-lg mb-2">No branch admins yet</p>
              <p className="text-brand-textDim text-sm">Click "Add Branch Admin" to create one</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-raised border-b border-brand-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-brand-textMuted">
                      Admin
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-brand-textMuted">
                      Branch
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-brand-textMuted">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-brand-textMuted">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-brand-textMuted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {branchAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-brand-raised/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-semibold">{admin.fullName}</p>
                          <p className="text-brand-textDim text-sm">{admin.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">{getBranchName(admin.branchId)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(admin.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            admin.status === 'active'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                              : 'bg-gray-500/10 text-gray-400 border border-gray-500/30'
                          }`}
                        >
                          {admin.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-brand-textMuted text-sm">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditAdmin(admin)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-colors"
                          >
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

        {/* Unassigned Branches */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-white mb-4">Branches Without Admin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations
              .filter(loc => !branchAdmins.find(a => a.branchId === loc.id))
              .map((location) => (
                <div key={location.id} className="bg-brand-card border border-brand-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-semibold">{location.name}</p>
                      <p className="text-brand-textDim text-sm">{location.area}, {location.city}</p>
                      <p className={`text-xs mt-2 ${location.status === 'open' ? 'text-green-400' : 'text-gray-400'}`}>
                        {location.status === 'open' ? '● Open' : '● Coming Soon'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setFormData({ ...formData, branchId: location.id.toString() });
                        setShowCreateModal(true);
                      }}
                      className="px-3 py-1 bg-brand-yellow text-brand-black rounded text-xs font-bold hover:bg-yellow-400 transition-colors"
                    >
                      Assign Admin
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-brand-card border border-brand-border rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingAdmin ? 'Edit Branch Admin' : 'Create Branch Admin'}
              </h3>
              <button
                onClick={closeModal}
                className="text-brand-textMuted hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={editingAdmin ? handleUpdateAdmin : handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 rounded-md bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="admin@branch.com"
                  className="w-full px-4 py-3 rounded-md bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                  Branch
                </label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  required
                  disabled={!!editingAdmin}
                  className="w-full px-4 py-3 rounded-md bg-brand-raised border border-brand-border text-white focus:outline-none focus:border-brand-yellow transition-colors disabled:opacity-50"
                >
                  <option value="">Select a branch</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} - {location.area}
                    </option>
                  ))}
                </select>
                {editingAdmin && (
                  <p className="text-xs text-brand-textDim mt-1">
                    Branch cannot be changed. Delete and create new admin if needed.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                  Password {editingAdmin && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingAdmin}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-md bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>

              {(formData.password || !editingAdmin) && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required={!!formData.password || !editingAdmin}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-md bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-brand-raised hover:bg-brand-border text-white rounded-md font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-brand-yellow text-brand-black rounded-md font-bold uppercase tracking-wider hover:bg-yellow-400 transition-colors"
                >
                  {editingAdmin ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminDashboard;
