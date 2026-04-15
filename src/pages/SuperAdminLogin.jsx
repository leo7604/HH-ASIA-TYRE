import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifySuperAdminPassword, createSuperAdmin, updateSuperAdminLastLogin } from '../utils/supabase';

function SuperAdminLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if already logged in
  useEffect(() => {
    const session = localStorage.getItem('superadmin_session');
    if (session) {
      navigate('/super-admin');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Verify credentials using Supabase
      const result = await verifySuperAdminPassword(formData.email, formData.password);
      
      if (result.success) {
        const admin = result.data;
        
        // Update last login
        await updateSuperAdminLastLogin(admin.id);
        
        // Create session
        localStorage.setItem('superadmin_session', JSON.stringify({
          id: admin.id,
          email: admin.email,
          fullName: admin.full_name,
          role: 'super_admin',
          loginTime: new Date().toISOString()
        }));
        
        navigate('/super-admin');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      // Check if email already exists in Supabase
      const existingResult = await verifySuperAdminPassword(formData.email, '');
      if (existingResult.success || existingResult.error !== 'Admin not found') {
        setError('Email already registered');
        return;
      }

      // Create new super admin in Supabase
      const result = await createSuperAdmin({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: ''
      });

      if (result.success) {
        setSuccess('Account created successfully! Please login.');
        setIsLogin(true);
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: ''
        });
      } else {
        setError(result.error?.message || 'Failed to create account');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin(e);
    } else {
      handleSignup(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-black via-gray-900 to-brand-card flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-brand-yellow rounded-lg flex items-center justify-center font-display font-black text-xl text-white shadow-[0_0_20px_rgba(255,215,0,0.4)]">
              HH
            </div>
          </div>
          <h1 className="font-display font-black text-3xl text-white uppercase tracking-tight">
            Super Admin
          </h1>
          <p className="text-brand-textMuted mt-2">
            Manage Branch Administrators
          </p>
        </div>

        {/* Login/Signup Card */}
        <div className="bg-brand-card border border-brand-border rounded-xl p-8 shadow-2xl">
          {/* Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-brand-raised rounded-lg">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                isLogin
                  ? 'bg-brand-yellow text-brand-black'
                  : 'text-brand-textMuted hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                !isLogin
                  ? 'bg-brand-yellow text-brand-black'
                  : 'text-brand-textMuted hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-md bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@hhasia.com"
                className="w-full px-4 py-3 rounded-md bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-md bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-md bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-yellow text-brand-black py-3 px-6 rounded-md font-bold uppercase tracking-wider hover:bg-yellow-400 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-brand-border">
            <p className="text-xs text-brand-textDim text-center">
              {isLogin 
                ? "Don't have an account? Switch to Sign Up"
                : "Already have an account? Switch to Login"
              }
            </p>
          </div>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-brand-textMuted hover:text-brand-yellow transition-colors"
          >
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminLogin;
