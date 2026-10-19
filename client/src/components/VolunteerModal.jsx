import React, { useState } from 'react';
import {
  X,
  User,
  Calendar,
  Phone,
  Mail,
  HeartHandshake,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { volunteerService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const INTEREST_SUGGESTIONS = [
  'Temple Seva',
  'Youth & CHYK Activities',
  'Festival & Event Coordination',
  'Balavihar & Education',
  'Community Service & Welfare',
  'Media & Digital Tech',
  'Logistics & Helpdesk',
];

export const VolunteerModal = ({ isOpen, onClose }) => {
  const { normalUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: normalUser?.fullName || '',
    dob: '',
    phone: normalUser?.phone || '',
    email: normalUser?.email || '',
    interest: '',
  });

  // Sync devotee info when normalUser becomes available
  React.useEffect(() => {
    if (normalUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || normalUser.fullName || '',
        phone: prev.phone || normalUser.phone || '',
        email: prev.email || normalUser.email || '',
      }));
    }
  }, [normalUser]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleInterestSuggestion = (tag) => {
    setFormData((prev) => {
      const current = prev.interest.trim();
      if (!current) return { ...prev, interest: tag };
      if (current.includes(tag)) return prev;
      return { ...prev, interest: `${current}, ${tag}` };
    });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.dob) {
      setErrorMessage('Please provide your date of birth.');
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.interest.trim()) {
      setErrorMessage('Please tell us about your interest in volunteering.');
      return;
    }

    setLoading(true);
    try {
      const res = await volunteerService.submitVolunteer({
        fullName: formData.fullName.trim(),
        dob: formData.dob,
        phone: cleanPhone,
        email: formData.email.trim().toLowerCase(),
        interest: formData.interest.trim(),
      });

      if (res.data?.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(res.data?.message || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Unable to connect to the server. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    setFormData({
      fullName: '',
      dob: '',
      phone: '',
      email: '',
      interest: '',
    });
    onClose();
  };

  // Max DOB is today
  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#ECE3D4] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Top Decorative Amber Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--orange,#FF8A3D)] via-[#FFA14A] to-[var(--yellow,#D97706)]" />

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between bg-gradient-to-b from-[#FFFDF9] to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--orange)]/10 text-[var(--orange)] flex items-center justify-center shrink-0 shadow-sm">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--orange)] block">
                PARTICIPATE IN SEVA
              </span>
              <h2 className="text-xl font-bold font-heading text-[#0A192F] leading-tight">
                Connect for Volunteering
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {isSuccess ? (
            /* Success Screen */
            <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-2xl font-bold text-[#0A192F] font-heading">
                  Thank You for Offering Seva!
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your volunteering application has been submitted successfully. Our mission coordinators
                  will review your details and connect with you shortly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-left text-xs space-y-1 text-slate-700 max-w-sm mx-auto">
                <p>
                  <strong className="text-slate-900">Name:</strong> {formData.fullName}
                </p>
                <p>
                  <strong className="text-slate-900">Phone:</strong> +91 {formData.phone}
                </p>
                <p>
                  <strong className="text-slate-900">Email:</strong> {formData.email}
                </p>
                <p>
                  <strong className="text-slate-900">Interest:</strong> {formData.interest}
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="btn-primary w-full max-w-xs mx-auto py-3 px-6 rounded-xl font-bold text-sm shadow-md cursor-pointer block"
              >
                Done
              </button>
            </div>
          ) : (
            /* Form Screen */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--orange)] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* DOB Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    name="dob"
                    max={todayDate}
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--orange)] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Phone & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setFormData((prev) => ({ ...prev, phone: val }));
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="10-digit number"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--orange)] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--orange)] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Interest in Volunteering Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  What is your interest in volunteering? <span className="text-red-500">*</span>
                </label>

                {/* Quick Selection Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {INTEREST_SUGGESTIONS.map((tag) => {
                    const isSelected = formData.interest.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleInterestSuggestion(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--orange)] text-white border-[var(--orange)]'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        + {tag}
                      </button>
                    );
                  })}
                </div>

                <textarea
                  name="interest"
                  rows={3}
                  value={formData.interest}
                  onChange={handleChange}
                  placeholder="Share details on how you would like to participate, your skills, availability, or areas of seva..."
                  required
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--orange)] focus:border-transparent transition-all leading-relaxed resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 px-6 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all hover:scale-[1.01]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Volunteering Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-500 leading-normal">
                By submitting, you agree to offer your seva in alignment with the values of Chinmaya Mission.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerModal;
