import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Flame,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Edit3,
  QrCode,
  Printer,
  ShieldCheck,
} from 'lucide-react';

const NAKSHATRAS = [
  'Ashwini (అశ్విని)',
  'Bharani (భరణి)',
  'Krittika (కృత్తిక)',
  'Rohini (రోహిణి)',
  'Mrigashira (మృగశిర)',
  'Ardra (ఆర్ద్ర)',
  'Punarvasu (పునర్వసు)',
  'Pushya (పుష్య)',
  'Ashlesha (ఆశ్లేష)',
  'Magha (మఖ)',
  'Purva Phalguni / Pubba (పూర్వ ఫల్గుని)',
  'Uttara Phalguni / Uttara (ఉత్తర ఫల్గుని)',
  'Hasta (హస్త)',
  'Chitra (చిత్ర)',
  'Swati (స్వాతి)',
  'Vishakha (విశాఖ)',
  'Anuradha (అనూరాధ)',
  'Jyeshtha (జ్యేష్ఠ)',
  'Mula (మూల)',
  'Purva Ashadha (పూర్వాషాఢ)',
  'Uttara Ashadha (ఉత్తరాషాఢ)',
  'Shravana (శ్రవణ)',
  'Dhanishta (ధనిష్ట)',
  'Shatabhisha (శతభిష)',
  'Purva Bhadrapada (పూర్వాభాద్ర)',
  'Uttara Bhadrapada (ఉత్తరాభాద్ర)',
  'Revati (రేవతి)',
  'Not Sure / Other',
];

export const DonationModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('form'); // 'form' | 'review' | 'confirmed'
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    phoneNumber: '',
    gotram: '',
    nakshatra: '',
    address: '',
    email: '',
  });

  const [errors, setErrors] = useState({});

  // Reset or lock scroll when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('form');
      setErrors({});
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please enter your phone number';
    } else if (!/^[0-9+-\s()]{7,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email ID';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewClick = (e) => {
    e.preventDefault();
    if (validate()) {
      setStep('review');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleConfirm = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('devotee_donations_history') || '[]');
      existing.unshift({
        ...formData,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('devotee_donations_history', JSON.stringify(existing.slice(0, 50)));
    } catch (_) {}
    setStep('confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#061527]/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#EAE0CE] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden z-10 transition-all transform scale-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0C1A30] via-[#142845] to-[#0C1A30] text-white p-5 sm:p-6 relative border-b border-[#C89B59]/30 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#C89B59]/20 border border-[#C89B59]/40 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-[#E6BF70] fill-current" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-spiritual-heading text-white tracking-wide">
                  {step === 'review'
                    ? 'Review Donation Details'
                    : step === 'confirmed'
                    ? 'Sankalpa Registered'
                    : 'Devotee Donation Details'}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#F4E8D3]/80">
                  {step === 'review'
                    ? 'Verify your sacred details before offering seva'
                    : step === 'confirmed'
                    ? 'May Pujya Gurudev bless you and your family'
                    : 'Pooja Sankalpa & Contribution Record'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Progress Pill */}
          {step !== 'confirmed' && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#E6BF70]">
                <span className="w-5 h-5 rounded-full bg-[#C89B59] text-[#0C1A30] font-bold flex items-center justify-center text-[11px]">
                  1
                </span>
                <span>Devotee Details</span>
              </span>
              <div className="h-0.5 flex-1 mx-3 bg-white/20">
                <div
                  className={`h-full bg-[#C89B59] transition-all duration-300 ${
                    step === 'review' ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
              <span
                className={`flex items-center gap-1.5 ${
                  step === 'review' ? 'text-[#E6BF70]' : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[11px] ${
                    step === 'review'
                      ? 'bg-[#C89B59] text-[#0C1A30]'
                      : 'bg-white/20 text-slate-300'
                  }`}
                >
                  2
                </span>
                <span>Review & QR</span>
              </span>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-[#FAF7F2]">
          {/* ========================================================= */}
          {/* STEP 1: FORM INPUTS                                       */}
          {/* ========================================================= */}
          {step === 'form' && (
            <form onSubmit={handleReviewClick} className="space-y-5">
              <div className="bg-white p-4 rounded-xl border border-[#EAE0CE] text-xs sm:text-sm text-[#4A5568] leading-relaxed shadow-sm">
                <p className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#C89B59] shrink-0 mt-0.5" />
                  <span>
                    Please provide your sacred details for the <strong>Pooja Sankalpa</strong>,
                    temple blessings, and formal donation acknowledgement.
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Srikanth Sharma"
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border text-sm text-[#0C1A30] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all ${
                        errors.name ? 'border-red-400 bg-red-50/20' : 'border-[#D9CEBA]'
                      }`}
                      required
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                </div>

                {/* 2. Phone Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="e.g., +91 98765 43210"
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border text-sm text-[#0C1A30] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all ${
                        errors.phoneNumber ? 'border-red-400 bg-red-50/20' : 'border-[#D9CEBA]'
                      }`}
                      required
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-xs text-red-500 font-medium">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* 3. Email ID */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g., devotee@gmail.com"
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border text-sm text-[#0C1A30] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all ${
                        errors.email ? 'border-red-400 bg-red-50/20' : 'border-[#D9CEBA]'
                      }`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 font-medium">{errors.email}</p>
                  )}
                </div>

                {/* 4. Date of Birth */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                    Date of Birth (DOB)
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border border-[#D9CEBA] text-sm text-[#0C1A30] focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all"
                    />
                  </div>
                </div>

                {/* 5. Gotram */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                    Gotram (గోత్రం)
                  </label>
                  <div className="relative">
                    <Flame className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="gotram"
                      value={formData.gotram}
                      onChange={handleChange}
                      placeholder="e.g., Bharadwaja, Kaundinya, Kashyapa"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border border-[#D9CEBA] text-sm text-[#0C1A30] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all"
                    />
                  </div>
                </div>

                {/* 6. Nakshatra */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                    Nakshatra (నక్షత్రం)
                  </label>
                  <div className="relative">
                    <Sparkles className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      name="nakshatra"
                      value={formData.nakshatra}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border border-[#D9CEBA] text-sm text-[#0C1A30] focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all cursor-pointer appearance-none"
                    >
                      <option value="">-- Select Birth Star / Nakshatra --</option>
                      {NAKSHATRAS.map((nak) => (
                        <option key={nak} value={nak}>
                          {nak}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 7. Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                    Address (నివాసం)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Door No, Street, City, State, Pincode"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border border-[#D9CEBA] text-sm text-[#0C1A30] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-seva-register px-6 py-2.5 text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Review Details</span>
                  <ArrowRight className="w-4 h-4 text-[#0A192F]" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* STEP 2: REVIEW DETAILS VIEW                               */}
          {/* ========================================================= */}
          {step === 'review' && (
            <div className="space-y-6">
              {/* Review Card */}
              <div className="bg-white rounded-2xl border-2 border-[#C89B59]/40 shadow-sm p-5 sm:p-6 space-y-5 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#EAE0CE] pb-3">
                  <div className="flex items-center gap-2 text-[#0C1A30]">
                    <ShieldCheck className="w-5 h-5 text-[#C89B59]" />
                    <h4 className="font-spiritual-heading font-bold text-base sm:text-lg">
                      Sankalpa & Devotee Summary
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#B8860B] hover:text-[#8B6508] bg-[#FAF5EA] px-3 py-1.5 rounded-lg border border-[#C89B59]/30 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Devotee Name
                    </span>
                    <span className="font-bold text-[#0C1A30] text-base">
                      {formData.name || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Phone Number
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formData.phoneNumber || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Email Address
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formData.email || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Date of Birth
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formData.dob
                        ? new Date(formData.dob).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Not Specified'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Gotram
                    </span>
                    <span className="font-semibold text-[#0C1A30]">
                      {formData.gotram || 'Not Specified'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Nakshatra (Birth Star)
                    </span>
                    <span className="font-semibold text-[#0C1A30]">
                      {formData.nakshatra || 'Not Specified'}
                    </span>
                  </div>

                  <div className="sm:col-span-2 pt-1 border-t border-slate-100">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Residential Address
                    </span>
                    <span className="font-medium text-slate-700 leading-relaxed">
                      {formData.address || 'Not Specified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code Placeholder Container */}
              <div className="bg-gradient-to-br from-[#FAF5EA] to-[#F3E8D0] rounded-2xl border-2 border-dashed border-[#C89B59] p-6 text-center space-y-3 shadow-inner">
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#C89B59]/40 flex items-center justify-center mx-auto text-[#0C1A30] shadow-sm">
                  <QrCode className="w-8 h-8 text-[#C89B59]" />
                </div>
                <div className="space-y-1">
                  <h5 className="font-spiritual-heading font-bold text-base text-[#0C1A30]">
                    Payment QR Code
                  </h5>
                  <p className="text-xs sm:text-sm text-[#4A5568] max-w-md mx-auto">
                    The official donation payment QR code will be displayed here for direct UPI / Net Banking transfer.
                  </p>
                </div>
                <div className="inline-block px-3.5 py-1.5 rounded-full bg-white/80 border border-[#C89B59]/40 text-xs font-bold text-[#8B6508]">
                  ✨ QR Code will be printed / activated here shortly
                </div>
              </div>

              {/* Bottom Review Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="px-4 py-2.5 rounded-xl border border-[#C89B59] text-[#0C1A30] hover:bg-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Edit</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    title="Print Devotee Summary"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                    <span>Print</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="btn-seva-register px-6 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0A192F]" />
                    <span>Confirm & Finish</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: CONFIRMED VIEW                                    */}
          {/* ========================================================= */}
          {step === 'confirmed' && (
            <div className="text-center py-6 sm:py-8 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h4 className="text-xl sm:text-2xl font-bold font-spiritual-heading text-[#0C1A30]">
                  Sankalpa Registered With Gratitude!
                </h4>
                <p className="text-sm text-[#4A5568] leading-relaxed">
                  Hari Om, <strong>{formData.name}</strong>. Thank you for your heartfelt intention to support Chinmaya Mission. Your details have been noted for pooja blessings.
                </p>
              </div>

              {/* QR Notice */}
              <div className="bg-white p-4 rounded-xl border border-[#EAE0CE] max-w-md mx-auto text-xs text-slate-600 leading-relaxed shadow-sm">
                <p>
                  Official receipt and tax exemption acknowledgement will be shared on <strong>{formData.email}</strong> once your donation is received via the upcoming QR code or bank transfer.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-seva-register px-8 py-2.5 text-sm font-bold cursor-pointer shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
