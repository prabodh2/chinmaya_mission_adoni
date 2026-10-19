import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatPhoneInput, getCleanPhoneNumber } from '../../utils/phoneUtils';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const AuthModal = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Sign In Required',
  subtitle = 'Please sign in or create an account to proceed with this action.',
}) => {
  const { login, signup } = useAuth();

  const [activeTab, setActiveTab] = useState('LOGIN'); // 'LOGIN' | 'SIGNUP'
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});

  // Login Form State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup Form State
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setErrors({});

    const cleanPhone = getCleanPhoneNumber(loginPhone);
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      setErrors({ phone: 'Enter a valid 10-digit mobile number' });
      return;
    }

    if (!loginPassword) {
      setErrors({ password: 'Password is required' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await login({ phone: cleanPhone, password: loginPassword });
      if (res.success) {
        if (onSuccess) onSuccess(res.user);
        if (onClose) onClose();
      } else {
        setServerError(res.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setErrors({});

    const newErrors = {};
    if (!signupData.fullName.trim()) newErrors.fullName = 'Full Name is required';

    const cleanEmail = signupData.email.trim().toLowerCase();
    if (!cleanEmail) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = 'Valid email address is required';
    }

    const cleanPhone = getCleanPhoneNumber(signupData.phone);
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      newErrors.phone = 'Valid 10-digit mobile number starting with 6-9 required';
    }

    if (!signupData.password || signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await signup({
        fullName: signupData.fullName.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
      });

      if (res.success) {
        if (onSuccess) onSuccess(res.user);
        if (onClose) onClose();
      } else {
        setServerError(res.message || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-[var(--text-primary)]">
        {/* Glow Accents */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--orange)]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[var(--cyan)]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-red-500 hover:border-red-500/30 transition-all cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 mb-6 relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--orange)]/15 text-[var(--orange)] mb-1 shadow-inner">
            {activeTab === 'LOGIN' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] mb-5 relative z-10">
          <button
            type="button"
            onClick={() => {
              setActiveTab('LOGIN');
              setServerError('');
              setErrors({});
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'LOGIN'
                ? 'bg-[var(--orange)] text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('SIGNUP');
              setServerError('');
              setErrors({});
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'SIGNUP'
                ? 'bg-[var(--orange)] text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-500 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Tab 1: Login Form */}
        {activeTab === 'LOGIN' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
            {/* Phone Number */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center gap-1 pointer-events-none text-[var(--text-muted)] border-r border-[var(--border-color)] pr-2">
                  <Phone className="w-3.5 h-3.5 text-[var(--orange)]" />
                  <span className="text-xs font-bold text-[var(--text-primary)]">+91</span>
                </div>
                <input
                  type="tel"
                  value={loginPhone}
                  onChange={(e) => {
                    setLoginPhone(formatPhoneInput(e.target.value));
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="98765 43210"
                  maxLength={11}
                  required
                  className={`w-full pl-20 pr-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border text-sm font-semibold placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner ${
                    errors.phone ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--orange)]'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[10px] text-red-500 font-semibold">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-[var(--text-muted)]">
                  <Lock className="w-4 h-4 text-[var(--orange)]" />
                </div>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="••••••••"
                  required
                  className={`w-full pl-10 pr-10 py-3 rounded-2xl bg-[var(--bg-tertiary)] border text-sm font-semibold placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner ${
                    errors.password ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--orange)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-semibold">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-3 rounded-2xl justify-center font-bold text-xs uppercase tracking-wider shadow-md shadow-[var(--orange)]/20 mt-1 cursor-pointer"
            >
              {submitting ? 'Signing In...' : 'Sign In & Continue'}
            </button>
          </form>
        ) : (
          /* Tab 2: Signup Form */
          <form onSubmit={handleSignupSubmit} className="space-y-3 relative z-10">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none text-[var(--text-muted)]">
                  <User className="w-3.5 h-3.5 text-[var(--orange)]" />
                </div>
                <input
                  type="text"
                  value={signupData.fullName}
                  onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Sharma"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--orange)] text-xs font-semibold focus:outline-none shadow-inner"
                />
              </div>
              {errors.fullName && <p className="text-[10px] text-red-500 font-semibold">{errors.fullName}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none text-[var(--text-muted)]">
                  <Mail className="w-3.5 h-3.5 text-[var(--orange)]" />
                </div>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  placeholder="devotee@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--orange)] text-xs font-semibold focus:outline-none shadow-inner"
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-semibold">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1 pointer-events-none text-[var(--text-muted)] border-r border-[var(--border-color)] pr-2">
                  <Phone className="w-3.5 h-3.5 text-[var(--orange)]" />
                  <span className="text-[11px] font-bold text-[var(--text-primary)]">+91</span>
                </div>
                <input
                  type="tel"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({ ...signupData, phone: formatPhoneInput(e.target.value) })}
                  placeholder="98765 43210"
                  maxLength={11}
                  required
                  className="w-full pl-18 pr-3 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--orange)] text-xs font-semibold focus:outline-none shadow-inner"
                />
              </div>
              {errors.phone && <p className="text-[10px] text-red-500 font-semibold">{errors.phone}</p>}
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  placeholder="Min 6 chars"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--orange)] text-xs font-semibold focus:outline-none shadow-inner"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Confirm <span className="text-red-500">*</span>
                </label>
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  placeholder="Re-enter"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--orange)] text-xs font-semibold focus:outline-none shadow-inner"
                />
              </div>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-semibold">{errors.password}</p>}
            {errors.confirmPassword && <p className="text-[10px] text-red-500 font-semibold">{errors.confirmPassword}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-3 rounded-2xl justify-center font-bold text-xs uppercase tracking-wider shadow-md shadow-[var(--orange)]/20 mt-1 cursor-pointer"
            >
              {submitting ? 'Creating Account...' : 'Register & Continue'}
            </button>
          </form>
        )}

        {/* Security badge */}
        <div className="pt-4 mt-2 border-t border-[var(--border-color)]/60 flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted Account for Chinmaya Mission Adoni</span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
