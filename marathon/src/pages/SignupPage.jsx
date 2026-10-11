import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { formatPhoneInput, getCleanPhoneNumber } from '../utils/phoneUtils';
import {
  User,
  Calendar,
  Briefcase,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  UserPlus,
} from 'lucide-react';

export const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signup } = useAuth();

  const redirectUrl = searchParams.get('redirect') || '/register';

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    profession: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, phone: formatPhoneInput(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    const parsedAge = parseInt(formData.age, 10);
    if (!formData.age || isNaN(parsedAge) || parsedAge < 5 || parsedAge > 120) {
      newErrors.age = 'Age must be between 5 and 120 years';
    }

    if (!formData.profession.trim()) {
      newErrors.profession = 'Profession / Occupation is required';
    }

    const cleanPhone = getCleanPhoneNumber(formData.phone);
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      newErrors.phone = 'Valid 10-digit mobile number starting with 6-9 required';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      const cleanPhone = getCleanPhoneNumber(formData.phone);
      const res = await signup({
        fullName: formData.fullName.trim(),
        age: parseInt(formData.age, 10),
        profession: formData.profession.trim(),
        phone: cleanPhone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (res.success) {
        // Trigger celebratory confetti burst
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Safe internal redirect
        const safeRedirect = redirectUrl.startsWith('/') && !redirectUrl.startsWith('//') ? redirectUrl : '/my-activity';
        navigate(safeRedirect, { replace: true });
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
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-[var(--bg-secondary)]/40 to-transparent">
      <div className="w-full max-w-lg space-y-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--orange)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[var(--cyan)]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--orange)]/15 border border-[var(--orange)]/30 text-[var(--orange)] mb-2 shadow-inner">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-[var(--text-primary)] tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
            One account for all Chinmaya Mission Adoni events, services, and activities
          </p>
        </div>

        {/* Notice for protected action redirect */}
        {redirectUrl && redirectUrl !== '/my-activity' && redirectUrl !== '/' && (
          <div className="p-3.5 rounded-2xl bg-[var(--orange)]/10 border border-[var(--orange)]/25 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[var(--orange)] shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--text-primary)] font-semibold leading-relaxed">
              After creating your account, you will be taken immediately back to your requested action!
            </p>
          </div>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-500 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold leading-relaxed">{serverError}</p>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* 1. Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none text-[var(--text-muted)]">
                <User className="w-4 h-4 text-[var(--orange)]" />
              </div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Ramesh Sharma"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border text-[var(--text-primary)] font-semibold text-sm placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner ${
                  errors.fullName ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--orange)]'
                }`}
              />
            </div>
            {errors.fullName && <p className="text-[11px] font-semibold text-red-500 pl-1">{errors.fullName}</p>}
          </div>

          {/* 2. Age & Profession Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Age */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Age (in years) <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-[var(--text-muted)]">
                  <Calendar className="w-4 h-4 text-[var(--orange)]" />
                </div>
                <input
                  type="number"
                  name="age"
                  min="5"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 24"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border text-[var(--text-primary)] font-semibold text-sm placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner ${
                    errors.age ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--orange)]'
                  }`}
                />
              </div>
              {errors.age && <p className="text-[11px] font-semibold text-red-500 pl-1">{errors.age}</p>}
            </div>

            {/* Profession */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Profession <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-[var(--text-muted)]">
                  <Briefcase className="w-4 h-4 text-[var(--orange)]" />
                </div>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="e.g. Student, Engineer"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border text-[var(--text-primary)] font-semibold text-sm placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner ${
                    errors.profession ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--orange)]'
                  }`}
                />
              </div>
              {errors.profession && <p className="text-[11px] font-semibold text-red-500 pl-1">{errors.profession}</p>}
            </div>
          </div>

          {/* 3. Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-[var(--text-muted)] border-r border-[var(--border-color)] pr-2.5">
                <Phone className="w-4 h-4 text-[var(--orange)]" />
                <span className="text-xs font-bold text-[var(--text-primary)]">+91</span>
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="98765 43210"
                maxLength={11}
                required
                className={`w-full pl-20 pr-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border text-[var(--text-primary)] font-semibold text-sm placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner ${
                  errors.phone ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--orange)]'
                }`}
              />
            </div>
            {errors.phone && <p className="text-[11px] font-semibold text-red-500 pl-1">{errors.phone}</p>}
          </div>

          {/* 4. Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-[var(--text-muted)]">
                  <Lock className="w-4 h-4 text-[var(--orange)]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars"
                  required
                  className={`w-full pl-10 pr-10 py-3 rounded-2xl bg-[var(--bg-tertiary)] border text-[var(--text-primary)] font-semibold text-sm placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner ${
                    errors.password ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--orange)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] font-semibold text-red-500 pl-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-[var(--text-muted)]">
                  <Lock className="w-4 h-4 text-[var(--orange)]" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  className={`w-full pl-10 pr-10 py-3 rounded-2xl bg-[var(--bg-tertiary)] border text-[var(--text-primary)] font-semibold text-sm placeholder-[var(--text-muted)] focus:outline-none transition-all shadow-inner ${
                    errors.confirmPassword ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--orange)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] font-semibold text-red-500 pl-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary py-3.5 rounded-2xl justify-center font-bold text-sm uppercase tracking-wider shadow-lg shadow-[var(--orange)]/20 hover:scale-[1.01] active:scale-[0.99] transition-all mt-2"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Footer / Switch to Login */}
        <div className="text-center pt-4 border-t border-[var(--border-color)] relative z-10 space-y-3">
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Already have an account?{' '}
            <Link
              to={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
              className="text-[var(--orange)] font-bold hover:underline transition-colors ml-1"
            >
              Sign In
            </Link>
          </p>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[var(--text-muted)] pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>One account works for all events, services & passes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
