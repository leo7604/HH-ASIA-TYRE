import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { locations } from '../data/mockData';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    branchId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter only open branches
  const availableBranches = locations.filter(l => l.status === 'open');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
    setLoading(false);
  };

  const handleLogin = () => {
    // Authentication using localStorage
    const admins = JSON.parse(localStorage.getItem('branchAdmins') || '[]');
    const admin = admins.find(a => a.email === formData.email && a.password === formData.password);

    if (admin) {
      // Store session
      localStorage.setItem('currentAdmin', JSON.stringify(admin));
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleSignup = () => {
    // Validation
    if (!formData.branchId) {
      setError('Please select a branch to manage');
      return;
    }

    // Check if branch already has an admin
    const admins = JSON.parse(localStorage.getItem('branchAdmins') || '[]');
    const branchHasAdmin = admins.some(a => a.branchId === parseInt(formData.branchId));

    if (branchHasAdmin) {
      setError('This branch already has an admin assigned');
      return;
    }

    // Create new admin
    const branch = locations.find(l => l.id === parseInt(formData.branchId));
    const newAdmin = {
      id: Date.now(),
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      branchId: parseInt(formData.branchId),
      branchName: branch?.name || 'Unknown Branch',
      role: 'branch_admin',
      createdAt: new Date().toISOString()
    };

    admins.push(newAdmin);
    localStorage.setItem('branchAdmins', JSON.stringify(admins));
    
    // Auto login after signup
    localStorage.setItem('currentAdmin', JSON.stringify(newAdmin));
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-black via-brand-raised to-brand-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-yellow rounded-full mb-4">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="font-display font-black uppercase text-white text-2xl mb-2">
            Branch Admin {isLogin ? 'Login' : 'Sign Up'}
          </h1>
          <p className="text-brand-textMuted text-sm">
            {isLogin ? 'Access your branch dashboard' : 'Register as a branch administrator'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-brand-card border border-brand-border rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Signup Fields */}
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                    Full Name <span className="text-brand-yellow">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Juan Dela Cruz"
                    className="w-full px-4 py-3 rounded-lg bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                    Phone Number <span className="text-brand-yellow">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0917 123 4567"
                    className="w-full px-4 py-3 rounded-lg bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                    Select Branch to Manage <span className="text-brand-yellow">*</span>
                  </label>
                  <select
                    required
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-brand-raised border border-brand-border text-white focus:outline-none focus:border-brand-yellow transition-colors"
                  >
                    <option value="">Choose a branch...</option>
                    {availableBranches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name} - {branch.area}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-brand-textDim mt-1">
                    Note: Each branch can only have one admin
                  </p>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                Email Address <span className="text-brand-yellow">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@hhasia.com"
                className="w-full px-4 py-3 rounded-lg bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                Password <span className="text-brand-yellow">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-brand-yellow text-black py-3.5 rounded-lg font-display font-bold uppercase tracking-wider transition-all shadow-[0_0_24px_rgba(255,215,0,0.3)] hover:-translate-y-0.5 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 pt-6 border-t border-brand-border text-center">
            <p className="text-brand-textMuted text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ email: '', password: '', fullName: '', phone: '', branchId: '' });
                }}
                className="text-brand-yellow hover:underline font-semibold"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-brand-textMuted hover:text-brand-yellow text-sm transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
