import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Shield, Lock, Mail, KeyRound, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export const AdminLoginPage = () => {
  const [searchParams] = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { login, loading, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const hasAccessDenied = searchParams.get('error') === 'access_denied';
  const hasExpired = searchParams.get('error') === 'session_expired';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (hasAccessDenied) {
      setError('Access denied: Administrator permissions are required to access this system.');
    } else if (hasExpired) {
      setError('Your administrator session has expired. Please log in again.');
    }
  }, [hasAccessDenied, hasExpired]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(identifier, password);
    if (res.success) {
      const safeRedirect = redirectUrl.startsWith('/') && !redirectUrl.startsWith('/login')
        ? redirectUrl
        : '/dashboard';
      navigate(safeRedirect, { replace: true });
    } else {
      setError(res.message || 'Access denied: Invalid administrator credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[#0B132B] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00B4D8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-[#1C2541]/90 backdrop-blur-xl border-2 border-[#00B4D8]/30 p-8 sm:p-10 rounded-3xl max-w-md w-full shadow-2xl space-y-6 relative z-10">
        
        {/* Branding */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00B4D8] to-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-[#00B4D8]/30">
            <Shield className="w-9 h-9" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-[#00B4D8]/15 text-[#00B4D8] font-extrabold text-[10px] tracking-widest uppercase">
              RESTRICTED PORTAL
            </span>
            <h2 className="text-2xl font-black font-heading text-white mt-1">
              ADMINISTRATOR LOGIN
            </h2>
            <p className="text-xs text-[#94A3B8] font-semibold">
              Chinmaya Mission Adoni Marathon Control Panel
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold text-center flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#F8FAFC] mb-1.5 uppercase tracking-wider">
              Admin Email / Phone / Identifier
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-[#00B4D8] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@anti-drug-marathon.org"
                autoComplete="username"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#0B132B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00B4D8] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#F8FAFC] mb-1.5 uppercase tracking-wider">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-[#FF7B00] absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-11 pr-11 py-3 rounded-2xl bg-[#0B132B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00B4D8] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#94A3B8] hover:text-white transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3.5 text-sm bg-gradient-to-r from-[#00B4D8] to-blue-600 text-white shadow-xl mt-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>{loading ? 'AUTHENTICATING...' : 'LOG IN TO ADMIN PANEL'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/10">
          <p className="text-[11px] text-[#64748B]">
            Authorized personnel only. All access attempts are recorded.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;
