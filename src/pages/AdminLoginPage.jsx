import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { locations } from '../data/mockData';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    handleLogin();
    setLoading(false);
  };

  const handleLogin = () => {
    // Check Super Admin credentials
    if (formData.email === 'superadmin@hhasia.com' && formData.password === 'SuperAdmin2024!') {
      localStorage.setItem('currentAdmin', JSON.stringify({
        id: 0,
        fullName: 'Super Administrator',
        email: 'superadmin@hhasia.com',
        role: 'super_admin',
        branchId: null,
        branchName: 'All Branches'
      }));
      navigate('/super-admin');
      return;
    }

    // Authentication for Branch Admin using localStorage
    const admins = JSON.parse(localStorage.getItem('branchAdmins') || '[]');
    const admin = admins.find(a => a.email === formData.email && a.password === formData.password);

    if (admin) {
      // Store session
      localStorage.setItem('currentAdmin', JSON.stringify(admin));
      navigate('/admin');
    } else {
      setError('Invalid email or password. Contact Super Admin for access.');
    }
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
            Admin Login
          </h1>
          <p className="text-brand-textMuted text-sm">
            Access your branch dashboard
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
                'Sign In'
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-brand-border">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
              <p className="text-blue-300 text-sm mb-2">Need Access?</p>
              <p className="text-blue-200 text-xs">
                Contact the Super Administrator to create your branch admin account
              </p>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-4 bg-brand-raised border border-brand-border rounded-lg p-4">
            <p className="text-brand-textMuted text-xs text-center mb-2 font-semibold uppercase">Super Admin Demo:</p>
            <p className="text-brand-textDim text-xs text-center font-mono">superadmin@hhasia.com</p>
            <p className="text-brand-textDim text-xs text-center font-mono">SuperAdmin2024!</p>
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
