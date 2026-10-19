import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Heart,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Edit3,
  QrCode,
  Printer,
  ShieldCheck,
  UploadCloud,
  FileCheck,
  Trash2,
  Check,
  Smartphone,
  AlertTriangle,
} from 'lucide-react';
import { sevaBookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AMOUNT_PRESETS = [501, 1001, 2501, 5001, 11000, 25000];

export const DonationModal = ({
  isOpen,
  onClose,
  modalTitle = 'Explore Contribution Options',
  modalSubtitle = 'Pooja Sankalpa, Devotee Details & Contribution Record',
}) => {
  const { normalUser } = useAuth();
  const [step, setStep] = useState('form'); // 'form' | 'review' | 'proof' | 'confirmed'
  const [formData, setFormData] = useState({
    amount: '',
    name: normalUser?.fullName || '',
    phoneNumber: normalUser?.phone || '',
    email: normalUser?.email || '',
    dob: '',
    address: '',
    // Step 3 verification proof fields
    utrId: '',
    screenshot: '',
    screenshotPreview: '',
    screenshotSize: '',
  });

  // Sync devotee info when normalUser becomes available
  useEffect(() => {
    if (normalUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || normalUser.fullName || '',
        phoneNumber: prev.phoneNumber || normalUser.phone || '',
        email: prev.email || normalUser.email || '',
      }));
    }
  }, [normalUser]);

  const [errors, setErrors] = useState({});
  const [submittedReceipt, setSubmittedReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Step 1 Validation (Amount, Name, Phone, Email)
  const validateStep1 = () => {
    const newErrors = {};

    const numAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid donation amount (₹)';
    }

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

  // Step 3 Validation (UTR ID, Screenshot Upload)
  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.utrId.trim()) {
      newErrors.utrId = 'Please enter the 12-digit UTR ID / UPI Transaction Reference Number';
    } else if (formData.utrId.trim().length < 6) {
      newErrors.utrId = 'Please enter a valid transaction reference number';
    }

    if (!formData.screenshot) {
      newErrors.screenshot = 'Please upload a screenshot of your payment as transaction proof';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewClick = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep('review');
    }
  };

  const handleDonePaymentClick = () => {
    // Moves to Step 3 (Payment Proof form) as requested
    setStep('proof');
  };

  // File Upload Handler with FileReader preview
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setErrors((prev) => ({
        ...prev,
        screenshot: 'Please upload an image (PNG, JPG, JPEG) or PDF receipt',
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        screenshot: 'File size should be less than 5MB',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        screenshot: file.name,
        screenshotPreview: reader.result,
        screenshotSize: (file.size / 1024).toFixed(1) + ' KB',
      }));
      setErrors((prev) => ({ ...prev, screenshot: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setFormData((prev) => ({
      ...prev,
      screenshot: '',
      screenshotPreview: '',
      screenshotSize: '',
    }));
  };

  // Final Submission Handler with MongoDB Database Persistence
  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setStep3Errors((prev) => ({ ...prev, general: '' }));

    const refId = `CMS-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    const record = {
      refId,
      bookingType: 'DEVOTEE_CONTRIBUTION',
      templeName: 'Chinmaya Mission, Adoni',
      sevaName: 'Devotee Mission Contribution & Vedic Seva',
      amount: Number(formData.amount),
      name: formData.name.trim(),
      devoteeName: formData.name.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      phone: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      dob: formData.dob,
      date: formData.dob,
      address: formData.address.trim(),
      panNumber: (formData.panNumber || '').trim(),
      utrId: formData.utrId.trim(),
      screenshotName: formData.screenshot,
      submittedAt: new Date().toISOString(),
      status: 'Payment Proof Submitted (Verification Pending)',
      userId: normalUser?._id || undefined,
    };

    try {
      // 1. Persist to MongoDB Atlas Database
      const apiRes = await sevaBookingService.submitBooking(record);
      const savedDoc = apiRes.data?.data || record;

      // 2. Persist to localStorage for offline cache
      try {
        const existing = JSON.parse(localStorage.getItem('devotee_donations_history') || '[]');
        existing.unshift(savedDoc);
        localStorage.setItem('devotee_donations_history', JSON.stringify(existing.slice(0, 50)));
      } catch (_) {}

      // 3. Set confirmed receipt and progress step
      setSubmittedReceipt(savedDoc);
      setStep('confirmed');
    } catch (err) {
      console.error('Failed to persist donation record to database:', err);
      const errMsg =
        err.response?.data?.message ||
        'Unable to save your contribution record to the database. Please check your network and try again.';
      setStep3Errors((prev) => ({
        ...prev,
        general: errMsg,
        utrId: errMsg.toLowerCase().includes('utr') ? errMsg : prev.utrId,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const printRefId =
    submittedReceipt?.refId ||
    `DON-${Date.now().toString(36).slice(-5).toUpperCase()}`;

  const printAmount = submittedReceipt?.amount || formData.amount || 0;

  const printDateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      {/* DEDICATED 1-PAGE PRINTABLE DONATION RECEIPT (Rendered into document.body outside #root) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div id="donation-printable-receipt" aria-hidden="true">
            <style>{`
              @media screen {
                #donation-printable-receipt {
                  display: none !important;
                }
              }
              @media print {
                @page {
                  size: A4 portrait;
                  margin: 6mm 10mm;
                }
                html, body {
                  background: #ffffff !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  height: auto !important;
                  overflow: visible !important;
                }
                #root {
                  display: none !important;
                }
                #donation-printable-receipt {
                  display: block !important;
                  position: static !important;
                  width: 100% !important;
                  max-width: 190mm !important;
                  margin: 0 auto !important;
                  padding: 2mm 0 !important;
                  box-sizing: border-box !important;
                  background: #ffffff !important;
                  color: #0f172a !important;
                  page-break-after: avoid !important;
                  page-break-before: avoid !important;
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                #donation-printable-receipt * {
                  visibility: visible !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              }
            `}</style>
            <div
              style={{
                border: '2px solid #b45309',
                padding: '12px 16px',
                borderRadius: '8px',
                background: '#ffffff',
                pageBreakInside: 'avoid',
                breakInside: 'avoid',
              }}
            >
              {/* Header */}
              <div
                style={{
                  textAlign: 'center',
                  borderBottom: '2px solid #d97706',
                  paddingBottom: '8px',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    letterSpacing: '0.25em',
                    color: '#b45309',
                    textTransform: 'uppercase',
                  }}
                >
                  ॥ श्री चिन्मय मिशन आधोनी ॥
                </div>
                <h1
                  style={{
                    fontSize: '19px',
                    fontWeight: '900',
                    color: '#0f172a',
                    margin: '3px 0 2px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  CHINMAYA MISSION, ADONI
                </h1>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>
                  Official Sacred Contribution & Donation Acknowledgment
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '2px 10px',
                    background: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '9999px',
                    fontSize: '10px',
                    fontWeight: '800',
                    color: '#92400e',
                    textTransform: 'uppercase',
                  }}
                >
                  Tax Exemption & Seva Receipt
                </div>
              </div>

              {/* Reference & Date Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  fontSize: '11px',
                }}
              >
                <div>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Receipt / Ref No: </span>
                  <strong
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      color: '#b45309',
                    }}
                  >
                    {printRefId}
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Date: </span>
                  <strong>{printDateStr}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Status: </span>
                  <strong style={{ color: '#16a34a' }}>
                    {submittedReceipt
                      ? '✓ Payment Proof Submitted & Under Verification'
                      : '✓ Acknowledged & Under Accounts Verification'}
                  </strong>
                </div>
              </div>

              {/* Donation Amount Highlight Box */}
              <div
                style={{
                  background: '#fffbeb',
                  border: '1.5px solid #fcd34d',
                  borderRadius: '6px',
                  padding: '9px 12px',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        color: '#b45309',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Contribution Cause / Seva
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '800',
                        color: '#0f172a',
                        marginTop: '1px',
                      }}
                    >
                      {modalTitle || 'Support Our Mission'}
                    </div>
                    {submittedReceipt?.utrId || formData.utrId ? (
                      <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                        UTR / Txn ID:{' '}
                        <strong style={{ fontFamily: 'monospace' }}>
                          {submittedReceipt?.utrId || formData.utrId}
                        </strong>
                      </div>
                    ) : (
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        Payment Mode:{' '}
                        <strong style={{ fontFamily: 'monospace' }}>UPI / PhonePe QR</strong>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        color: '#b45309',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Donation Amount
                    </div>
                    <div
                      style={{
                        fontSize: '17px',
                        fontWeight: '900',
                        color: '#0f172a',
                        marginTop: '1px',
                      }}
                    >
                      ₹{Number(printAmount).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: '700' }}>
                      Eligible for 80G Tax Exemption
                    </div>
                  </div>
                </div>
              </div>

              {/* Devotee Details */}
              <div style={{ marginBottom: '10px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    color: '#0f172a',
                    letterSpacing: '0.06em',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '3px',
                    marginBottom: '5px',
                  }}
                >
                  Donor Information
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td
                        style={{
                          padding: '3.5px 6px',
                          width: '22%',
                          color: '#64748b',
                          fontWeight: '600',
                        }}
                      >
                        Donor Name:
                      </td>
                      <td
                        style={{
                          padding: '3.5px 6px',
                          width: '38%',
                          fontWeight: '700',
                          color: '#0f172a',
                        }}
                      >
                        {submittedReceipt?.name || formData.name || '—'}
                      </td>
                      <td
                        style={{
                          padding: '3.5px 6px',
                          width: '18%',
                          color: '#64748b',
                          fontWeight: '600',
                        }}
                      >
                        PAN Number:
                      </td>
                      <td
                        style={{
                          padding: '3.5px 6px',
                          width: '22%',
                          fontWeight: '700',
                          color: '#0f172a',
                        }}
                      >
                        {formData.panNumber || 'Not Provided'}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '3.5px 6px', color: '#64748b', fontWeight: '600' }}>
                        Phone Number:
                      </td>
                      <td style={{ padding: '3.5px 6px', fontWeight: '700', color: '#0f172a' }}>
                        {submittedReceipt?.phoneNumber || formData.phoneNumber || '—'}
                      </td>
                      <td style={{ padding: '3.5px 6px', color: '#64748b', fontWeight: '600' }}>
                        Email Address:
                      </td>
                      <td style={{ padding: '3.5px 6px', fontWeight: '600', color: '#0f172a' }}>
                        {submittedReceipt?.email || formData.email || '—'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3.5px 6px', color: '#64748b', fontWeight: '600' }}>
                        Address:
                      </td>
                      <td colSpan="3" style={{ padding: '3.5px 6px', color: '#334155' }}>
                        {submittedReceipt?.address || formData.address || 'Adoni, Andhra Pradesh'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Acknowledgement Notice */}
              <div
                style={{
                  background: '#f8fafc',
                  borderLeft: '3px solid #b45309',
                  padding: '6px 9px',
                  borderRadius: '4px',
                  marginBottom: '10px',
                  fontSize: '10px',
                  lineHeight: '1.4',
                  color: '#475569',
                }}
              >
                <strong style={{ color: '#0f172a' }}>Hari Om! </strong>
                Thank you for supporting Chinmaya Mission, Adoni. Your voluntary contribution will be
                utilized for noble dharmic, cultural, youth development, and spiritual activities. May
                Pujya Gurudev’s divine grace be with you and your family.
              </div>

              {/* Footer & Signature Section */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '8px',
                  fontSize: '10px',
                  color: '#64748b',
                }}
              >
                <div>
                  <div>
                    <strong>Chinmaya Mission, Adoni</strong>
                  </div>
                  <div>Near Arts College, Adoni, Andhra Pradesh - 518301</div>
                  <div>Helpline: +91 94402 85859 | Web: chinmayamissionadoni.org</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '130px',
                      borderBottom: '1px dashed #94a3b8',
                      height: '26px',
                      marginBottom: '2px',
                    }}
                  ></div>
                  <div
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      color: '#475569',
                    }}
                  >
                    Authorized Accounts Signature
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

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
                  {step === 'form' && modalTitle}
                  {step === 'review' && 'Review Donation & PhonePe QR'}
                  {step === 'proof' && 'Submit Payment Verification'}
                  {step === 'confirmed' && 'Contribution Received With Gratitude'}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#F4E8D3]/80">
                  {step === 'form' && modalSubtitle}
                  {step === 'review' && 'Verify details and scan the QR code to complete donation'}
                  {step === 'proof' && 'Enter your UTR ID and upload the payment screenshot'}
                  {step === 'confirmed' && 'May Pujya Gurudev bless you and your family'}
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

          {/* 3-Step Progress Indicator */}
          {step !== 'confirmed' && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
              {/* Step 1 */}
              <span
                className={`flex items-center gap-1.5 ${
                  step === 'form' ? 'text-[#E6BF70]' : 'text-slate-300'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[11px] ${
                    step === 'form'
                      ? 'bg-[#C89B59] text-[#0C1A30]'
                      : 'bg-emerald-600/80 text-white'
                  }`}
                >
                  {step !== 'form' ? '✓' : '1'}
                </span>
                <span>Details & Amount</span>
              </span>

              <div className="h-0.5 flex-1 mx-2 sm:mx-3 bg-white/20">
                <div
                  className={`h-full bg-[#C89B59] transition-all duration-300 ${
                    step === 'review' || step === 'proof' ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Step 2 */}
              <span
                className={`flex items-center gap-1.5 ${
                  step === 'review' ? 'text-[#E6BF70]' : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[11px] ${
                    step === 'review'
                      ? 'bg-[#C89B59] text-[#0C1A30]'
                      : step === 'proof'
                      ? 'bg-emerald-600/80 text-white'
                      : 'bg-white/20 text-slate-300'
                  }`}
                >
                  {step === 'proof' ? '✓' : '2'}
                </span>
                <span>Review & QR</span>
              </span>

              <div className="h-0.5 flex-1 mx-2 sm:mx-3 bg-white/20">
                <div
                  className={`h-full bg-[#C89B59] transition-all duration-300 ${
                    step === 'proof' ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Step 3 */}
              <span
                className={`flex items-center gap-1.5 ${
                  step === 'proof' ? 'text-[#E6BF70]' : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[11px] ${
                    step === 'proof'
                      ? 'bg-[#C89B59] text-[#0C1A30]'
                      : 'bg-white/20 text-slate-300'
                  }`}
                >
                  3
                </span>
                <span>Proof & UTR</span>
              </span>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-[#FAF7F2]">
          {/* ========================================================= */}
          {/* STEP 1: FORM INPUTS (Exact User Order)                    */}
          {/* ========================================================= */}
          {step === 'form' && (
            <form onSubmit={handleReviewClick} className="space-y-5">
              {/* Sacred Information Callout Banner */}
              <div className="bg-white p-4 rounded-xl border border-[#EAE0CE] text-xs sm:text-sm text-[#4A5568] leading-relaxed shadow-sm">
                <p className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#C89B59] shrink-0 mt-0.5" />
                  <span>
                    Please provide your sacred details for the <strong>Pooja Sankalpa</strong>,
                    temple blessings, and formal donation acknowledgement.
                  </span>
                </p>
              </div>

              {/* 1st Field: Enter the amount how much you will donate */}
              <div className="bg-white p-4 rounded-xl border border-[#EAE0CE] shadow-sm space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                  Enter Donation Amount (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-base">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="e.g., 501, 1001, 2500, 5000"
                    min="1"
                    className={`w-full pl-9 pr-3.5 py-3 bg-[#FAF7F2] rounded-xl border text-base font-bold text-[#0C1A30] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all ${
                      errors.amount ? 'border-red-400 bg-red-50/20' : 'border-[#D9CEBA]'
                    }`}
                    required
                  />
                </div>
                {errors.amount && (
                  <p className="text-xs text-red-500 font-medium">{errors.amount}</p>
                )}

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-500 font-semibold mr-1">
                    Quick Select:
                  </span>
                  {AMOUNT_PRESETS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, amount: String(amt) }));
                        if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        String(formData.amount) === String(amt)
                          ? 'bg-[#0C1A30] text-[#E6BF70] border border-[#C89B59] shadow-sm'
                          : 'bg-white border border-[#D9CEBA] text-slate-700 hover:border-[#C89B59] hover:bg-[#FAF5EA]'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 2nd Field: Name */}
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
                      placeholder="e.g., Ramesh Kummar"
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border text-sm text-[#0C1A30] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all ${
                        errors.name ? 'border-red-400 bg-red-50/20' : 'border-[#D9CEBA]'
                      }`}
                      required
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                </div>

                {/* 3rd & 4th Field: Phone Number */}
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

                {/* 5th Field: Email id */}
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
                      placeholder="e.g., rameshkummar@gmail.com"
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

                {/* 6th Field: Dob */}
                <div className="space-y-1.5 sm:col-span-2">
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

                {/* 7th Field: Address */}
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
          {/* STEP 2: REVIEW DETAILS & PHONEPE QR CODE                   */}
          {/* ========================================================= */}
          {step === 'review' && (
            <div className="space-y-6">
              {/* Devotee Details Summary Card */}
              <div className="bg-white rounded-2xl border-2 border-[#C89B59]/40 shadow-sm p-5 sm:p-6 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#EAE0CE] pb-3">
                  <div className="flex items-center gap-2 text-[#0C1A30]">
                    <ShieldCheck className="w-5 h-5 text-[#C89B59]" />
                    <h4 className="font-spiritual-heading font-bold text-base sm:text-lg">
                      Review Contribution Details
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

                {/* Prominent Amount Banner */}
                <div className="bg-gradient-to-r from-[#0C1A30] to-[#142845] p-4 rounded-xl text-white flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6BF70] block">
                      Pledged Donation Amount
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-white">
                      ₹{Number(formData.amount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right text-xs text-[#F4E8D3]/80">
                    <span>Tax Exemption 80G Eligible</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
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
                      Date of Birth (DOB)
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

              {/* PhonePe QR Code Container */}
              <div className="bg-gradient-to-br from-[#FAF5EA] to-[#F3E8D0] rounded-2xl border-2 border-dashed border-[#C89B59] p-5 sm:p-6 text-center space-y-4 shadow-inner">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#5f259f] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    पे
                  </div>
                  <h5 className="font-spiritual-heading font-bold text-lg text-[#0C1A30]">
                    PhonePe UPI QR Code
                  </h5>
                </div>

                <p className="text-xs sm:text-sm text-[#4A5568] max-w-md mx-auto">
                  Scan this QR code using <strong>PhonePe</strong>, Google Pay, Paytm, or any UPI
                  app to complete your donation of{' '}
                  <strong className="text-[#0C1A30]">
                    ₹{Number(formData.amount || 0).toLocaleString('en-IN')}
                  </strong>
                  .
                </p>

                {/* QR Code Graphic Box */}
                <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-[#C89B59] max-w-xs mx-auto shadow-sm text-center space-y-3">
                  <div className="w-44 h-44 sm:w-48 sm:h-48 mx-auto bg-gradient-to-br from-slate-50 to-[#FAF5EA] rounded-xl border border-[#EAE0CE] flex flex-col items-center justify-center p-3 relative">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-2 shadow-sm">
                      <QrCode className="w-9 h-9 text-[#5f259f]" />
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#5f259f] text-white text-[10px] font-bold tracking-wider uppercase mb-1">
                      PhonePe UPI
                    </span>
                    <p className="text-xs font-bold text-[#0C1A30]">
                      Pay ₹{Number(formData.amount || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      PhonePe QR will be placed here
                    </p>
                  </div>
                </div>

                {/* Instructional Note */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#C89B59]/40 text-xs font-bold text-[#8B6508]">
                  <span>✨ PhonePe QR code will be added here. Once paid, click Done below!</span>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-[#EAE0CE] text-xs text-slate-600 max-w-md mx-auto">
                  <p>
                    <strong>Next Step:</strong> After completing the payment, note your{' '}
                    <strong>12-digit UTR ID</strong> and take a screenshot of the payment receipt.
                    Then click <strong>"Done / I Have Paid"</strong> below.
                  </p>
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

                  {/* "Done" Button which redirects to Step 3 (Proof form) */}
                  <button
                    type="button"
                    onClick={handleDonePaymentClick}
                    className="btn-seva-register px-6 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0A192F]" />
                    <span>Done / I Have Paid</span>
                    <ArrowRight className="w-4 h-4 text-[#0A192F]" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: REDIRECT / PAYMENT PROOF SUBMISSION FORM           */}
          {/* ========================================================= */}
          {step === 'proof' && (
            <form onSubmit={handleSubmitProof} className="space-y-5">
              {step3Errors.general && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>{step3Errors.general}</span>
                </div>
              )}

              {/* Info Banner */}
              <div className="bg-white p-4 rounded-xl border border-[#EAE0CE] text-xs sm:text-sm text-[#4A5568] leading-relaxed shadow-sm">
                <p className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#C89B59] shrink-0 mt-0.5" />
                  <span>
                    Thank you for your payment! Please submit your <strong>UTR Reference ID</strong>{' '}
                    and upload the <strong>payment screenshot</strong> below for verification and
                    formal 80G tax receipt issuance.
                  </span>
                </p>
              </div>

              {/* Redirected Devotee Details Summary Card */}
              <div className="bg-white rounded-2xl border border-[#EAE0CE] p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#FAF5EA]">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Transferred Contribution Details
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Details Pre-filled
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">
                      Amount Paid
                    </span>
                    <span className="font-extrabold text-[#B8860B] text-base sm:text-lg">
                      ₹{Number(formData.amount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">
                      Devotee Name
                    </span>
                    <span className="font-bold text-[#0C1A30] truncate block">
                      {formData.name || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">
                      Phone Number
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formData.phoneNumber || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">
                      Email Address
                    </span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {formData.email || '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* UTR ID Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                  UTR ID / UPI Reference Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    name="utrId"
                    value={formData.utrId}
                    onChange={handleChange}
                    placeholder="e.g., 429812345678 (12-digit UTR from PhonePe / UPI receipt)"
                    maxLength={24}
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-white rounded-xl border text-sm text-[#0C1A30] font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C89B59] transition-all ${
                      errors.utrId ? 'border-red-400 bg-red-50/20' : 'border-[#D9CEBA]'
                    }`}
                    required
                  />
                </div>
                {errors.utrId ? (
                  <p className="text-xs text-red-500 font-medium">{errors.utrId}</p>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Find this 12-digit UTR in your PhonePe / banking transaction details
                  </p>
                )}
              </div>

              {/* Upload Screenshot of Payment */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0C1A30]">
                  Upload Screenshot of Payment <span className="text-red-500">*</span>
                </label>

                {!formData.screenshot ? (
                  <label
                    className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl bg-white hover:bg-slate-50 transition-all cursor-pointer ${
                      errors.screenshot ? 'border-red-400 bg-red-50/10' : 'border-[#D9CEBA]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FAF5EA] border border-[#C89B59]/30 flex items-center justify-center text-[#B8860B] mb-2">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#0C1A30]">
                      Click to upload payment screenshot
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      PNG, JPG, JPEG or PDF (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="bg-white rounded-2xl border-2 border-[#C89B59]/40 p-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {formData.screenshotPreview ? (
                        <img
                          src={formData.screenshotPreview}
                          alt="Payment Proof Preview"
                          className="w-14 h-14 rounded-lg object-cover border border-[#EAE0CE] shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                          <FileCheck className="w-7 h-7" />
                        </div>
                      )}
                      <div className="truncate">
                        <span className="text-xs font-bold text-[#0C1A30] block truncate">
                          {formData.screenshot}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-semibold block">
                          ✓ File ready to upload ({formData.screenshotSize})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveScreenshot}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Remove screenshot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {errors.screenshot && (
                  <p className="text-xs text-red-500 font-medium">{errors.screenshot}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="px-4 py-2.5 rounded-xl border border-[#C89B59] text-[#0C1A30] hover:bg-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to QR Code</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-seva-register px-6 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#0A192F]" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Payment Proof'}</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* STEP 4: CONFIRMED VIEW (Success Screen)                    */}
          {/* ========================================================= */}
          {step === 'confirmed' && (
            <div className="text-center py-6 sm:py-8 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h4 className="text-xl sm:text-2xl font-bold font-spiritual-heading text-[#0C1A30]">
                  Contribution &amp; Payment Proof Submitted!
                </h4>
                <p className="text-sm text-[#4A5568] leading-relaxed">
                  Hari Om, <strong>{formData.name}</strong>. Thank you for your generous
                  contribution of{' '}
                  <strong className="text-[#0C1A30]">
                    ₹{Number(formData.amount || 0).toLocaleString('en-IN')}
                  </strong>{' '}
                  to Chinmaya Mission.
                </p>
              </div>

              {/* Receipt Summary Card */}
              {submittedReceipt && (
                <div className="bg-white p-5 rounded-2xl border border-[#EAE0CE] max-w-md mx-auto text-xs text-slate-700 space-y-2.5 shadow-sm text-left">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      Donation Reference
                    </span>
                    <span className="font-mono font-bold text-[#B8860B] text-xs">
                      {submittedReceipt.refId}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Amount:</span>
                    <span className="font-extrabold text-[#0C1A30] text-sm">
                      ₹{Number(submittedReceipt.amount).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">UTR / Transaction ID:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {submittedReceipt.utrId}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Devotee Name:</span>
                    <span className="font-medium text-slate-800">{submittedReceipt.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Phone Number:</span>
                    <span className="font-medium text-slate-800">
                      {submittedReceipt.phoneNumber}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Payment Screenshot:</span>
                    <span className="font-medium text-emerald-600">✓ Uploaded &amp; Attached</span>
                  </div>

                  <div className="flex justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Verification Status:</span>
                    <span className="font-bold text-emerald-600">
                      ✓ Under Accounts Verification
                    </span>
                  </div>
                </div>
              )}

              {/* Tax Exemption Note */}
              <div className="bg-white p-4 rounded-xl border border-[#EAE0CE] max-w-md mx-auto text-xs text-slate-600 leading-relaxed shadow-sm">
                <p>
                  Official 80G tax exemption receipt and formal acknowledgement will be emailed to{' '}
                  <strong>{formData.email}</strong> once your UTR number is verified by our accounts
                  department.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Print Receipt</span>
                </button>
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
    </>
  );
};

export default DonationModal;
