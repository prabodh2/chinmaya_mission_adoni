import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { loginAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await loginAdmin(email, password);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-[var(--bg-dark-section)]">
      <div className="bg-[var(--bg-secondary)] border-2 border-[var(--cyan)]/40 p-8 sm:p-10 rounded-3xl max-w-md w-full shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[var(--cyan)] text-white flex items-center justify-center mx-auto shadow-lg shadow-[var(--cyan)]/30">
            <Shield className="w-8 h-8" />
          </div>
          <span className="px-3 py-1 rounded-full bg-[var(--cyan)]/15 text-[var(--cyan)] font-extrabold text-[10px] tracking-widest uppercase">
            RESTRICTED ACCESS
          </span>
          <h2 className="text-2xl font-black font-heading text-[var(--text-primary)]">
            ADMINISTRATOR LOGIN
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-semibold">
            Chinmaya Mission Adoni Marathon Control Panel
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
              Admin Email / Username
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-[var(--cyan)] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@anti-drug-marathon.org"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-[var(--orange)] absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-4 text-sm bg-gradient-to-r from-[var(--cyan)] to-blue-600 text-white shadow-2xl"
          >
            <KeyRound className="w-4 h-4" />
            <span>{loading ? 'AUTHENTICATING ADMIN...' : 'LOG IN TO ADMIN PANEL'}</span>
          </button>
        </form>

        <div className="text-center pt-3 text-[11px] text-[var(--text-muted)]">
          Demo Admin Credentials: <br />
          <span className="font-mono text-[var(--cyan)] font-bold">admin@anti-drug-marathon.org</span> / <span className="font-mono text-[var(--orange)] font-bold">adminpassword123</span>
        </div>

      </div>
    </div>
  );
};
