import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  // Escape key & body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

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

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className="bg-white border border-[#EBD6A2] rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-[#07162D]"
        onClick={(e) => e.stopPropagation()}
        style={{ color: '#07162D' }}
      >
        {/* Glow Accents */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#F0441D]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-[#FFD12D]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onClose) onClose();
          }}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 hover:text-red-600 border border-slate-200 flex items-center justify-center transition-all cursor-pointer z-50 shadow-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5 pointer-events-none stroke-[2.2]" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 mb-6 relative z-10 pt-1 px-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F0441D]/15 text-[#F0441D] mb-1 shadow-inner">
            {activeTab === 'LOGIN' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <h2
            className="text-xl sm:text-2xl font-black font-heading tracking-tight"
            style={{
              color: '#07162D',
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontSize: '22px',
              lineHeight: '1.25',
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
              margin: '6px 0 4px',
            }}
          >
            {title}
          </h2>
          <p
            className="text-xs sm:text-[13px] font-medium leading-relaxed"
            style={{ color: '#59616D' }}
          >
            {subtitle}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#FFFDF9] border border-[#EBD6A2] mb-5 relative z-10 shadow-sm">
          <button
            type="button"
            onClick={() => {
              setActiveTab('LOGIN');
              setServerError('');
              setErrors({});
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'LOGIN'
                ? 'bg-[#F0441D] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
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
                ? 'bg-[#F0441D] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-600 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Tab 1: Login Form */}
        {activeTab === 'LOGIN' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
            {/* Phone Number */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-800">
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center gap-1 pointer-events-none text-slate-500 border-r border-slate-200 pr-2">
                  <Phone className="w-3.5 h-3.5 text-[#F0441D]" />
                  <span className="text-xs font-bold text-slate-900">+91</span>
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
                  className={`w-full pl-20 pr-4 py-3 rounded-2xl bg-[#FFFDF9] border text-slate-900 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all shadow-inner ${
                    errors.phone ? 'border-red-500' : 'border-[#EBD6A2] focus:border-[#F0441D]'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[10px] text-red-500 font-semibold">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-800">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4 text-[#F0441D]" />
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
                  className={`w-full pl-10 pr-10 py-3 rounded-2xl bg-[#FFFDF9] border text-slate-900 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all shadow-inner ${
                    errors.password ? 'border-red-500' : 'border-[#EBD6A2] focus:border-[#F0441D]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-700 focus:outline-none cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-semibold">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl justify-center font-bold text-xs uppercase tracking-wider shadow-lg bg-[#F0441D] hover:bg-[#d93813] text-white shadow-orange-500/25 mt-1 cursor-pointer transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {submitting ? 'Signing In...' : 'Sign In & Continue'}
            </button>
          </form>
        ) : (
          /* Tab 2: Signup Form */
          <form onSubmit={handleSignupSubmit} className="space-y-3 relative z-10">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-800">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none text-slate-500">
                  <User className="w-3.5 h-3.5 text-[#F0441D]" />
                </div>
                <input
                  type="text"
                  value={signupData.fullName}
                  onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Sharma"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#EBD6A2] focus:border-[#F0441D] focus:bg-white text-slate-900 text-xs font-semibold focus:outline-none shadow-inner placeholder:text-slate-400"
                />
              </div>
              {errors.fullName && <p className="text-[10px] text-red-500 font-semibold">{errors.fullName}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-800">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-[#F0441D]" />
                </div>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  placeholder="devotee@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#EBD6A2] focus:border-[#F0441D] focus:bg-white text-slate-900 text-xs font-semibold focus:outline-none shadow-inner placeholder:text-slate-400"
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-semibold">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-800">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1 pointer-events-none text-slate-500 border-r border-slate-200 pr-2">
                  <Phone className="w-3.5 h-3.5 text-[#F0441D]" />
                  <span className="text-[11px] font-bold text-slate-900">+91</span>
                </div>
                <input
                  type="tel"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({ ...signupData, phone: formatPhoneInput(e.target.value) })}
                  placeholder="98765 43210"
                  maxLength={11}
                  required
                  className="w-full pl-18 pr-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#EBD6A2] focus:border-[#F0441D] focus:bg-white text-slate-900 text-xs font-semibold focus:outline-none shadow-inner placeholder:text-slate-400"
                />
              </div>
              {errors.phone && <p className="text-[10px] text-red-500 font-semibold">{errors.phone}</p>}
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  placeholder="Min 6 chars"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#EBD6A2] focus:border-[#F0441D] focus:bg-white text-slate-900 text-xs font-semibold focus:outline-none shadow-inner placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800">
                  Confirm <span className="text-red-500">*</span>
                </label>
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  placeholder="Re-enter"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#EBD6A2] focus:border-[#F0441D] focus:bg-white text-slate-900 text-xs font-semibold focus:outline-none shadow-inner placeholder:text-slate-400"
                />
              </div>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-semibold">{errors.password}</p>}
            {errors.confirmPassword && <p className="text-[10px] text-red-500 font-semibold">{errors.confirmPassword}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl justify-center font-bold text-xs uppercase tracking-wider shadow-lg bg-[#F0441D] hover:bg-[#d93813] text-white shadow-orange-500/25 mt-1 cursor-pointer transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {submitting ? 'Creating Account...' : 'Register & Continue'}
            </button>
          </form>
        )}

        {/* Security badge */}
        <div className="pt-4 mt-2 border-t border-slate-200/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted Account for Chinmaya Mission Adoni</span>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default AuthModal;

