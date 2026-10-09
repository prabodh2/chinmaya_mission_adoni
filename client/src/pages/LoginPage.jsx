import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatPhoneInput, getCleanPhoneNumber } from '../utils/phoneUtils';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  LogIn,
} from 'lucide-react';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const redirectUrl = searchParams.get('redirect') || '/my-activity';

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneInput(e.target.value);
    setPhone(formatted);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = getCleanPhoneNumber(phone);
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number starting with 6-9');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login({ phone: cleanPhone, password });
      if (res.success) {
        // Safe internal redirect
        const safeRedirect = redirectUrl.startsWith('/') && !redirectUrl.startsWith('//') ? redirectUrl : '/my-activity';
        navigate(safeRedirect, { replace: true });
      } else {
        setError(res.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred during login. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-[var(--bg-secondary)]/40 to-transparent">
      <div className="w-full max-w-md space-y-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--orange)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[var(--cyan)]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--orange)]/15 border border-[var(--orange)]/30 text-[var(--orange)] mb-2 shadow-inner">
            <LogIn className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-[var(--text-primary)] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
            Sign in to access your registrations, event passes, and community activities
          </p>
        </div>

        {/* Notice for protected action */}
        {redirectUrl && redirectUrl !== '/my-activity' && redirectUrl !== '/' && (
          <div className="p-3.5 rounded-2xl bg-[var(--orange)]/10 border border-[var(--orange)]/25 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[var(--orange)] shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--text-primary)] font-semibold leading-relaxed">
              Please sign in to proceed with your requested action. You will be redirected right back!
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-500 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-[var(--text-muted)] border-r border-[var(--border-color)] pr-2.5">
                <Phone className="w-4 h-4 text-[var(--orange)]" />
                <span className="text-xs font-bold text-[var(--text-primary)]">+91</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="98765 43210"
                maxLength={11}
                required
                className="w-full pl-20 pr-4 py-3.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--orange)] transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none text-[var(--text-muted)]">
                <Lock className="w-4 h-4 text-[var(--orange)]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--orange)] transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary py-3.5 rounded-2xl justify-center font-bold text-sm uppercase tracking-wider shadow-lg shadow-[var(--orange)]/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing In...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Footer / Switch to Signup */}
        <div className="text-center pt-4 border-t border-[var(--border-color)] relative z-10 space-y-3">
          <p className="text-xs text-[var(--text-muted)] font-medium">
            New to Chinmaya Mission Adoni?{' '}
            <Link
              to={`/signup${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
              className="text-[var(--orange)] font-bold hover:underline transition-colors ml-1"
            >
              Create an Account
            </Link>
          </p>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[var(--text-muted)] pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure 256-bit encrypted authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
