import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { registrationService, eventService } from '../services/api';
import { SearchableSelect } from '../components/SearchableSelect';
import { RegistrationReceiptModal } from '../components/RegistrationReceiptModal';
import { MarathonRouteMap } from '../components/MarathonRouteMap';
import { adoniInstitutionsList } from '../utils/constants';
import { formatPhoneInput, getCleanPhoneNumber } from '../utils/phoneUtils';
import {
  Award,
  CheckCircle,
  FileSpreadsheet,
  Download,
  Upload,
  User,
  Building,
  AlertCircle,
  Phone,
  Calendar,
  Shirt,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const RegistrationPage = () => {
  const location = useLocation();
  const [tab, setTab] = useState('INDIVIDUAL'); // 'INDIVIDUAL' | 'BULK'
  const [institutions, setInstitutions] = useState(adoniInstitutionsList);
  const [eventConfig, setEventConfig] = useState(null);

  // Individual Form State
  const [indForm, setIndForm] = useState({
    fullName: '',
    dateOfBirth: '',
    isStudent: false,
    institutionName: '',
    otherInstitution: '',
    contactNumber: '',
    tShirtSize: 'M',
    agreeTerms: false,
  });
  const [indErrors, setIndErrors] = useState({});
  const [indSubmitting, setIndSubmitting] = useState(false);

  // Bulk Form State
  const [bulkForm, setBulkForm] = useState({
    contactPersonName: '',
    phone: '',
    institutionType: 'SCHOOL',
    institutionName: '',
  });
  const [bulkFile, setBulkFile] = useState(null);
  const [parsedData, setParsedData] = useState(null); // { totalRows, validRows, invalidRows, preview }
  const [bulkParsing, setBulkParsing] = useState(false);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [bulkStatus, setBulkStatus] = useState({ success: false, message: null, error: null });

  // Receipt Modal State
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    if (location.hash === '#marathon-map') {
      setTimeout(() => {
        const el = document.getElementById('marathon-map');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
    } else {
      window.scrollTo(0, 0);
    }

    // Fetch Event Config & Institutions list
    eventService.getConfig().then((res) => {
      if (res.data?.success) setEventConfig(res.data.data);
    }).catch(() => {});

    registrationService.getInstitutions().then((res) => {
      if (res.data?.success && res.data.data.length > 0) {
        setInstitutions(res.data.data);
      }
    }).catch(() => {});
  }, [location.hash]);

  const isRegistrationOpen = eventConfig ? eventConfig.registrationOpen : true;

  // Individual Validation
  const validateIndividual = () => {
    const errs = {};
    if (!indForm.fullName.trim()) errs.fullName = 'Full Name is required';

    const cleanPhone = getCleanPhoneNumber(indForm.contactNumber);
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      errs.contactNumber = 'Valid 10-digit Indian mobile number required (starts with 6-9)';
    }

    if (indForm.isStudent) {
      if (!indForm.institutionName) {
        errs.institutionName = 'Please select your School/College';
      } else if (indForm.institutionName === 'OTHER' && !indForm.otherInstitution.trim()) {
        errs.otherInstitution = 'Please enter your institution name';
      }
    }

    if (!indForm.tShirtSize) errs.tShirtSize = 'Please select a T-shirt size';
    if (!indForm.agreeTerms) errs.agreeTerms = 'You must agree to the Terms & Conditions';

    setIndErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Individual Registration
  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    if (!validateIndividual()) return;

    setIndSubmitting(true);
    try {
      const finalInstitution =
        indForm.isStudent
          ? indForm.institutionName === 'OTHER'
            ? indForm.otherInstitution
            : indForm.institutionName
          : 'N/A';

      const payload = {
        fullName: indForm.fullName,
        dateOfBirth: indForm.dateOfBirth,
        isStudent: indForm.isStudent,
        institutionName: finalInstitution,
        contactNumber: indForm.contactNumber,
        tShirtSize: indForm.tShirtSize,
      };

      const res = await registrationService.submitForm(payload);
      if (res.data?.success) {
        // Trigger celebratory confetti burst!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        setReceiptData(res.data.data);

        // Reset Form
        setIndForm({
          fullName: '',
          dateOfBirth: '',
          isStudent: false,
          institutionName: '',
          otherInstitution: '',
          contactNumber: '',
          tShirtSize: 'M',
          agreeTerms: false,
        });
        setIndErrors({});
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration submission failed. Please try again.');
    } finally {
      setIndSubmitting(false);
    }
  };

  // Bulk File Upload & Client Parse
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBulkFile(file);
    setBulkParsing(true);
    setBulkStatus({ success: false, message: null, error: null });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await registrationService.parseFile(formData);
      if (res.data?.success) {
        setParsedData(res.data.data);
      }
    } catch (err) {
      setBulkStatus({
        success: false,
        message: null,
        error: err.response?.data?.message || 'Failed to parse file preview',
      });
    } finally {
      setBulkParsing(false);
    }
  };

  // Download Sample Excel/CSV Template
  const downloadSampleTemplate = () => {
    const csvContent =
      'Full Name,Date of Birth,Phone Number,T-Shirt Size\n' +
      'Ramesh Kumar,2006-05-15,9876543210,M\n' +
      'Sowmya Reddy,2007-08-20,9123456789,S\n' +
      'Karthik V,2005-11-10,9988776655,L\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Anti_Drug_Marathon_Student_Bulk_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit Bulk Batch
  const handleBulkSubmit = async (e) => {
    e.preventDefault();

    if (!isRegistrationOpen) {
      alert('Marathon registration is currently closed by the organizers.');
      return;
    }
    if (!bulkForm.contactPersonName.trim()) {
      alert('Please enter Contact Person Name');
      return;
    }
    const cleanPhone = getCleanPhoneNumber(bulkForm.phone);
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      alert('Please enter a valid 10-digit Indian phone number starting with 6-9');
      return;
    }
    if (!bulkForm.institutionName.trim()) {
      alert('Please enter School or College Name');
      return;
    }
    if (!bulkFile) {
      alert('Please upload a spreadsheet file (.xlsx, .xls, .csv) with student records');
      return;
    }
    if (parsedData && parsedData.validRows === 0) {
      alert('The uploaded spreadsheet does not contain any valid student rows. Please check the file.');
      return;
    }

    setBulkSubmitting(true);
    setBulkStatus({ success: false, message: null, error: null });

    try {
      const formData = new FormData();
      formData.append('contactPersonName', bulkForm.contactPersonName.trim());
      formData.append('phone', cleanPhone);
      formData.append('institutionType', bulkForm.institutionType);
      formData.append('institutionName', bulkForm.institutionName.trim());
      formData.append('file', bulkFile);
      if (parsedData?.preview) {
        formData.append(
          'studentsData',
          JSON.stringify(parsedData.preview.filter((row) => row.isValid))
        );
      }

      const res = await registrationService.submitBulk(formData);
      if (res.data?.success) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        setBulkStatus({
          success: true,
          message:
            res.data.message ||
            `Successfully submitted bulk registration for ${bulkForm.institutionName}!`,
          error: null,
        });
        setParsedData(null);
        setBulkFile(null);
        setBulkForm({
          contactPersonName: '',
          phone: '',
          institutionType: 'SCHOOL',
          institutionName: '',
        });
      }
    } catch (err) {
      setBulkStatus({
        success: false,
        message: null,
        error:
          err.response?.data?.message ||
          'Bulk registration submission failed. Please check your spreadsheet file and try again.',
      });
    } finally {
      setBulkSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 max-w-5xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-extrabold text-xs tracking-widest uppercase border ${
          isRegistrationOpen
            ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
            : 'bg-red-500/15 text-red-500 border-red-500/30'
        }`}>
          <CheckCircle className="w-4 h-4" />
          {isRegistrationOpen ? 'REGISTRATION OPEN' : 'REGISTRATION CLOSED'}
        </span>

        <h1 className="text-4xl sm:text-5xl font-black font-heading text-[var(--text-primary)]">
          MARATHON <span className="text-[var(--orange)]">REGISTRATION</span>
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] font-medium">
          These details will be used to generate your official marathon pass and certificate.
        </p>
      </div>

      {/* Registration Mode Tab Toggle */}
      <div className="flex items-center justify-center p-1.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] max-w-md mx-auto">
        <button
          onClick={() => setTab('INDIVIDUAL')}
          className={`w-1/2 py-3 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            tab === 'INDIVIDUAL'
              ? 'bg-[var(--orange)] text-white shadow-lg shadow-[var(--orange)]/30'
              : 'text-[var(--text-primary)] hover:text-[var(--orange)]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>INDIVIDUAL FORM</span>
        </button>

        <button
          onClick={() => setTab('BULK')}
          className={`w-1/2 py-3 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            tab === 'BULK'
              ? 'bg-[var(--cyan)] text-white shadow-lg shadow-[var(--cyan)]/30'
              : 'text-[var(--text-primary)] hover:text-[var(--cyan)]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>SCHOOL / COLLEGE BULK</span>
        </button>
      </div>

      {/* TAB 1: INDIVIDUAL REGISTRATION FORM */}
      {tab === 'INDIVIDUAL' && (
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-[var(--border-color)] shadow-2xl relative overflow-hidden">
          
          {!isRegistrationOpen && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 font-extrabold text-xs mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>Marathon registration is currently closed by the organizers. Please check back later.</span>
            </div>
          )}

          <form onSubmit={handleIndividualSubmit} className="space-y-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                Full Name (For Certificate) *
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-[var(--orange)] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  disabled={!isRegistrationOpen}
                  value={indForm.fullName}
                  onChange={(e) => setIndForm({ ...indForm, fullName: e.target.value })}
                  placeholder="Enter your full name as it should appear on certificate"
                  className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border text-sm text-[var(--text-primary)] focus:outline-none ${
                    indErrors.fullName ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--orange)]'
                  }`}
                />
              </div>
              {indErrors.fullName && <p className="text-xs text-red-500 font-bold mt-1">{indErrors.fullName}</p>}
            </div>

            {/* Date of Birth & Student Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 text-[var(--cyan)] absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    disabled={!isRegistrationOpen}
                    value={indForm.dateOfBirth}
                    onChange={(e) => setIndForm({ ...indForm, dateOfBirth: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Are you a Student? *
                </label>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    disabled={!isRegistrationOpen}
                    onClick={() => setIndForm({ ...indForm, isStudent: true })}
                    className={`py-3 px-4 rounded-2xl text-xs font-extrabold border transition-all ${
                      indForm.isStudent
                        ? 'bg-[var(--orange)]/15 border-[var(--orange)] text-[var(--orange)]'
                        : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]'
                    }`}
                  >
                    YES, I AM A STUDENT
                  </button>

                  <button
                    type="button"
                    disabled={!isRegistrationOpen}
                    onClick={() => setIndForm({ ...indForm, isStudent: false, institutionName: '', otherInstitution: '' })}
                    className={`py-3 px-4 rounded-2xl text-xs font-extrabold border transition-all ${
                      !indForm.isStudent
                        ? 'bg-[var(--cyan)]/15 border-[var(--cyan)] text-[var(--cyan)]'
                        : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]'
                    }`}
                  >
                    NO, INDIVIDUAL
                  </button>
                </div>
              </div>

            </div>

            {/* Institution Searchable Dropdown if Student */}
            {indForm.isStudent && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                    School / College Name in Adoni *
                  </label>
                  <SearchableSelect
                    options={[...institutions, 'OTHER']}
                    value={indForm.institutionName}
                    onChange={(val) => setIndForm({ ...indForm, institutionName: val })}
                    error={indErrors.institutionName}
                  />
                </div>

                {indForm.institutionName === 'OTHER' && (
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                      Specify School / College Name *
                    </label>
                    <input
                      type="text"
                      value={indForm.otherInstitution}
                      onChange={(e) => setIndForm({ ...indForm, otherInstitution: e.target.value })}
                      placeholder="Type your institution name..."
                      className="w-full py-3.5 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                    />
                    {indErrors.otherInstitution && (
                      <p className="text-xs text-red-500 font-bold mt-1">{indErrors.otherInstitution}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Contact Number & T-Shirt Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Contact Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-[var(--green)] absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    disabled={!isRegistrationOpen}
                    value={indForm.contactNumber}
                    onChange={(e) => setIndForm({ ...indForm, contactNumber: formatPhoneInput(e.target.value) })}
                    placeholder="+91 98765 43210"
                    maxLength={15}
                    className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border text-sm text-[var(--text-primary)] focus:outline-none ${
                      indErrors.contactNumber ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--orange)]'
                    }`}
                  />
                </div>
                {indErrors.contactNumber && <p className="text-xs text-red-500 font-bold mt-1">{indErrors.contactNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  T-Shirt Size *
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      disabled={!isRegistrationOpen}
                      onClick={() => setIndForm({ ...indForm, tShirtSize: size })}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                        indForm.tShirtSize === size
                          ? 'bg-[var(--orange)] text-white border-[var(--orange)] shadow-md'
                          : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={!isRegistrationOpen}
                  checked={indForm.agreeTerms}
                  onChange={(e) => setIndForm({ ...indForm, agreeTerms: e.target.checked })}
                  className="w-5 h-5 mt-0.5 text-[var(--orange)] rounded accent-[var(--orange)]"
                />
                <span className="text-xs text-[var(--text-muted)] font-semibold leading-relaxed">
                  I hereby declare that I am physically fit to participate in the Anti-Drug Movement Marathon Run 2026. I agree to the event rules, terms and conditions.
                </span>
              </label>
              {indErrors.agreeTerms && <p className="text-xs text-red-500 font-bold mt-1">{indErrors.agreeTerms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isRegistrationOpen || !indForm.agreeTerms || indSubmitting}
              className="btn-primary w-full justify-center py-4 text-base shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Award className="w-5 h-5" />
              <span>{indSubmitting ? 'SUBMITTING REGISTRATION...' : 'SUBMIT MARATHON REGISTRATION'}</span>
            </button>

          </form>
        </div>
      )}

      {/* TAB 2: SCHOOL & COLLEGE BULK REGISTRATION */}
      {tab === 'BULK' && (
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-[var(--border-color)] shadow-2xl space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
            <div>
              <h3 className="text-2xl font-extrabold font-heading text-[var(--text-primary)]">
                INSTITUTION BULK STUDENT REGISTRATION
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                Upload student records via Excel (.xlsx, .xls) or CSV template.
              </p>
            </div>
            
            <button
              type="button"
              onClick={downloadSampleTemplate}
              className="btn-secondary py-2.5 px-5 text-xs text-decoration-none border-[var(--cyan)] text-[var(--cyan)]"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD SAMPLE TEMPLATE</span>
            </button>
          </div>

          {bulkStatus.success && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 font-extrabold text-xs flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{bulkStatus.message}</span>
            </div>
          )}

          {bulkStatus.error && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 font-extrabold text-xs">
              {bulkStatus.error}
            </div>
          )}

          <form onSubmit={handleBulkSubmit} className="space-y-6">
            
            {/* Institution Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  required
                  value={bulkForm.contactPersonName}
                  onChange={(e) => setBulkForm({ ...bulkForm, contactPersonName: e.target.value })}
                  placeholder="e.g. Principal / Sports Director"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={bulkForm.phone}
                  onChange={(e) => setBulkForm({ ...bulkForm, phone: formatPhoneInput(e.target.value) })}
                  placeholder="+91 98765 43210"
                  maxLength={15}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Institution Type *
                </label>
                <select
                  value={bulkForm.institutionType}
                  onChange={(e) => setBulkForm({ ...bulkForm, institutionType: e.target.value })}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                >
                  <option value="SCHOOL">SCHOOL</option>
                  <option value="COLLEGE">COLLEGE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Institution / School / College Name *
                </label>
                <input
                  type="text"
                  required
                  value={bulkForm.institutionName}
                  onChange={(e) => setBulkForm({ ...bulkForm, institutionName: e.target.value })}
                  placeholder="e.g. Stonehill International School"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                />
              </div>
            </div>

            {/* Drag & Drop File Upload Box & Attached File Display */}
            {bulkFile ? (
              <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border-2 border-[var(--cyan)] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--cyan)]/15 text-[var(--cyan)] flex items-center justify-center flex-shrink-0">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[var(--text-primary)]">
                      {bulkFile.name}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
                      <span>{(bulkFile.size / 1024).toFixed(1)} KB</span>
                      <span>•</span>
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Sheet attached & ready to submit
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="btn-secondary py-2 px-4 text-xs cursor-pointer border-[var(--cyan)] text-[var(--cyan)] hover:bg-[var(--cyan)]/10">
                    <span>CHANGE FILE</span>
                    <input
                      type="file"
                      accept=".csv, .xls, .xlsx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setBulkFile(null);
                      setParsedData(null);
                    }}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-xs font-bold"
                    title="Remove File"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl border-2 border-dashed border-[var(--cyan)]/40 bg-[var(--bg-primary)] text-center space-y-4 relative hover:border-[var(--cyan)] transition-colors">
                <Upload className="w-10 h-10 text-[var(--cyan)] mx-auto animate-bounce" />
                <div>
                  <h4 className="text-sm font-extrabold text-[var(--text-primary)] font-heading">
                    UPLOAD SPREADSHEET FILE (.xlsx, .xls, .csv) *
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Drag and drop file here or click to browse from device
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv, .xls, .xlsx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            )}

            {bulkParsing && (
              <p className="text-center text-xs font-bold text-[var(--cyan)] animate-pulse">
                Parsing spreadsheet and validating student rows...
              </p>
            )}

            {/* Validation & Preview Summary Table */}
            {parsedData && (
              <div className="space-y-4 pt-4 border-t border-[var(--border-color)] animate-in fade-in">
                
                {/* Stats Summary Pills */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                    <span className="text-xs font-bold text-[var(--text-muted)] block">TOTAL ROWS</span>
                    <span className="text-xl font-black text-[var(--text-primary)]">{parsedData.totalRows}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
                    <span className="text-xs font-bold text-emerald-500 block">VALID ROWS</span>
                    <span className="text-xl font-black text-emerald-500">{parsedData.validRows}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-red-500/15 border border-red-500/30">
                    <span className="text-xs font-bold text-red-500 block">INVALID ROWS</span>
                    <span className="text-xl font-black text-red-500">{parsedData.invalidRows}</span>
                  </div>
                </div>

                {/* Rows Table */}
                <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-extrabold uppercase sticky top-0">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">T-Shirt Size</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]/30 text-[var(--text-primary)]">
                      {parsedData.preview.map((row, idx) => (
                        <tr key={idx} className={row.isValid ? '' : 'bg-red-500/10'}>
                          <td className="p-3 font-bold">{row.rowNumber}</td>
                          <td className="p-3 font-semibold">{row.fullName || '—'}</td>
                          <td className="p-3">{row.phone || '—'}</td>
                          <td className="p-3 font-bold text-[var(--orange)]">{row.tShirtSize}</td>
                          <td className="p-3">
                            {row.isValid ? (
                              <span className="text-emerald-500 font-extrabold flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> VALID
                              </span>
                            ) : (
                              <span className="text-red-500 font-extrabold flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {row.error}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* Always Visible Submit Button for School / College Bulk Form */}
            <button
              type="submit"
              disabled={bulkSubmitting || !isRegistrationOpen}
              className="btn-primary w-full justify-center py-4 text-base bg-gradient-to-r from-[var(--cyan)] to-blue-600 text-white shadow-2xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Building className="w-5 h-5" />
              <span>
                {bulkSubmitting
                  ? 'SUBMITTING REGISTRATION & UPLOADING SHEET...'
                  : parsedData?.validRows
                  ? `SUBMIT ${parsedData.validRows} STUDENT REGISTRATIONS`
                  : 'SUBMIT SCHOOL / COLLEGE REGISTRATION'}
              </span>
            </button>

          </form>

        </div>
      )}

      {/* 7KM Marathon Interactive Route Map */}
      <div className="pt-10 border-t border-[var(--border-color)]">
        <MarathonRouteMap />
      </div>

      {/* Confirmation Pass Receipt Modal */}
      {receiptData && (
        <RegistrationReceiptModal
          data={receiptData}
          onClose={() => setReceiptData(null)}
        />
      )}

    </div>
  );
};
