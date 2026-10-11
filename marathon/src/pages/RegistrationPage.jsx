import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { registrationService, eventService } from '../services/api';
import { SearchableSelect } from '../components/SearchableSelect';
import { EntryPassModal } from '../components/EntryPassModal';
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
  Users,
  Building,
  AlertCircle,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  Shirt,
  Sparkles,
  ShieldCheck,
  LogIn,
  UserPlus,
  Trash2,
  HelpCircle,
} from 'lucide-react';

export const RegistrationPage = () => {
  const { user, isAuthenticated, isUserAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState('INDIVIDUAL'); // 'INDIVIDUAL' | 'BULK'

  const [institutions, setInstitutions] = useState(adoniInstitutionsList);
  const [eventConfig, setEventConfig] = useState(null);

  // Participant 1 (Primary User) Form State
  const [indForm, setIndForm] = useState({
    fullName: '',
    age: '',
    standard: '',
    profession: '',
    isStudent: false,
    institutionName: '',
    otherInstitution: '',
    contactNumber: '',
    tShirtSize: 'M',
    agreeTerms: false,
  });
  const [indErrors, setIndErrors] = useState({});

  // Add a Friend Feature State
  const [hasFriend, setHasFriend] = useState(false);
  const [friendForm, setFriendForm] = useState({
    fullName: '',
    age: '',
    standard: '',
    profession: '',
    isStudent: false,
    institutionName: '',
    otherInstitution: '',
    contactNumber: '',
    tShirtSize: 'M',
    agreeTerms: false,
  });
  const [friendErrors, setFriendErrors] = useState({});

  const [indSubmitting, setIndSubmitting] = useState(false);

  // Bulk Form State (School & College Coordinators)
  const [bulkForm, setBulkForm] = useState({
    contactPersonName: '',
    phone: '',
    institutionType: 'SCHOOL',
    institutionName: '',
  });
  const [bulkFile, setBulkFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [bulkParsing, setBulkParsing] = useState(false);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [bulkStatus, setBulkStatus] = useState({ success: false, message: null, error: null });

  // Receipt / Entry Pass Modal State
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

  // Pre-fill Participant 1 fields from authenticated user session
  useEffect(() => {
    if (user) {
      setIndForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        age: prev.age || (user.age ? String(user.age) : ''),
        profession: prev.profession || user.profession || '',
        contactNumber: prev.contactNumber || (user.phone ? formatPhoneInput(user.phone) : ''),
      }));
      setBulkForm((prev) => ({
        ...prev,
        contactPersonName: prev.contactPersonName || user.fullName || '',
        phone: prev.phone || (user.phone ? formatPhoneInput(user.phone) : ''),
      }));
    }
  }, [user]);

  const isPastDeadline = eventConfig?.registrationEndDate
    ? new Date() > new Date(eventConfig.registrationEndDate)
    : false;
  const isRegistrationOpen = eventConfig
    ? eventConfig.registrationOpen && !isPastDeadline
    : true;

  // Validate Participant 1 Form
  const validateParticipant1 = () => {
    const errs = {};
    if (!indForm.fullName.trim()) errs.fullName = 'Full Name is required for certificate';

    const cleanPhone = getCleanPhoneNumber(indForm.contactNumber);
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      errs.contactNumber = 'Valid 10-digit Indian mobile number required (starting with 6-9)';
    }

    if (indForm.isStudent) {
      if (!indForm.institutionName) {
        errs.institutionName = 'Please select your School/College';
      } else if (indForm.institutionName === 'OTHER' && !indForm.otherInstitution.trim()) {
        errs.otherInstitution = 'Please enter your institution name';
      }
    }

    if (!indForm.tShirtSize) errs.tShirtSize = 'Please select a T-shirt size';
    if (!indForm.agreeTerms) errs.agreeTerms = 'You must accept the physical fitness declaration and event rules';

    setIndErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate Participant 2 (Friend) Form
  const validateParticipant2 = () => {
    const errs = {};
    if (!friendForm.fullName.trim()) errs.fullName = "Friend's Full Name is required for certificate";

    const cleanPhone = getCleanPhoneNumber(friendForm.contactNumber);
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      errs.contactNumber = 'Valid 10-digit Indian mobile number required (starting with 6-9)';
    }

    if (friendForm.isStudent) {
      if (!friendForm.institutionName) {
        errs.institutionName = 'Please select your friend\'s School/College';
      } else if (friendForm.institutionName === 'OTHER' && !friendForm.otherInstitution.trim()) {
        errs.otherInstitution = 'Please enter your friend\'s institution name';
      }
    }

    if (!friendForm.tShirtSize) errs.tShirtSize = 'Please select a T-shirt size for friend';
    if (!friendForm.agreeTerms) errs.agreeTerms = 'Friend must accept the physical fitness declaration and event rules';

    setFriendErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle Remove Friend button with confirmation if data was entered
  const handleRemoveFriend = () => {
    const hasData =
      friendForm.fullName.trim() ||
      friendForm.contactNumber.trim() ||
      friendForm.profession.trim() ||
      friendForm.age.trim();

    if (hasData) {
      const confirmRemove = window.confirm(
        'Are you sure you want to remove your friend? Any entered friend details will be cleared.'
      );
      if (!confirmRemove) return;
    }

    setHasFriend(false);
    setFriendForm({
      fullName: '',
      age: '',
      standard: '',
      profession: '',
      isStudent: false,
      institutionName: '',
      otherInstitution: '',
      contactNumber: '',
      tShirtSize: 'M',
      agreeTerms: false,
    });
    setFriendErrors({});
  };

  // Submit Registration (Individual or Group)
  const handleIndividualSubmit = async (e) => {
    e.preventDefault();

    const p1Valid = validateParticipant1();
    let p2Valid = true;

    if (hasFriend) {
      p2Valid = validateParticipant2();
    }

    if (!p1Valid || !p2Valid) {
      return;
    }

    setIndSubmitting(true);
    try {
      const finalPrimaryInstitution =
        indForm.isStudent
          ? indForm.institutionName === 'OTHER'
            ? indForm.otherInstitution
            : indForm.institutionName
          : 'N/A';

      if (hasFriend) {
        // Group registration submission
        const finalFriendInstitution =
          friendForm.isStudent
            ? friendForm.institutionName === 'OTHER'
              ? friendForm.otherInstitution
              : friendForm.institutionName
            : 'N/A';

        const payload = {
          primary: {
            fullName: indForm.fullName.trim(),
            age: indForm.age ? parseInt(indForm.age, 10) : undefined,
            standard: indForm.standard || undefined,
            profession: indForm.profession ? indForm.profession.trim() : undefined,
            isStudent: indForm.isStudent,
            institutionName: finalPrimaryInstitution,
            contactNumber: indForm.contactNumber,
            tShirtSize: indForm.tShirtSize,
          },
          friend: {
            fullName: friendForm.fullName.trim(),
            age: friendForm.age ? parseInt(friendForm.age, 10) : undefined,
            standard: friendForm.standard || undefined,
            profession: friendForm.profession ? friendForm.profession.trim() : undefined,
            isStudent: friendForm.isStudent,
            institutionName: finalFriendInstitution,
            contactNumber: friendForm.contactNumber,
            tShirtSize: friendForm.tShirtSize,
          },
        };

        const res = await registrationService.submitIndividual(payload);
        if (res.data?.success) {
          confetti({
            particleCount: 140,
            spread: 80,
            origin: { y: 0.6 },
          });

          setReceiptData(res.data.data);

          // Reset friend form
          setHasFriend(false);
          setFriendForm({
            fullName: '',
            age: '',
            standard: '',
            profession: '',
            isStudent: false,
            institutionName: '',
            otherInstitution: '',
            contactNumber: '',
            tShirtSize: 'M',
            agreeTerms: false,
          });
          setIndErrors({});
          setFriendErrors({});
        }
      } else {
        // Single participant submission
        const payload = {
          fullName: indForm.fullName.trim(),
          age: indForm.age ? parseInt(indForm.age, 10) : undefined,
          standard: indForm.standard || undefined,
          profession: indForm.profession ? indForm.profession.trim() : undefined,
          isStudent: indForm.isStudent,
          institutionName: finalPrimaryInstitution,
          contactNumber: indForm.contactNumber,
          tShirtSize: indForm.tShirtSize,
        };

        const res = await registrationService.submitForm(payload);
        if (res.data?.success) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });

          setReceiptData(res.data.data);
          setIndErrors({});
        }
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
      'Student Name,Age,Standard / Class,Parent\'s Phone Number,School / College,T-Shirt Size\n' +
      'Dummy Name 1,13,8th,+91 9876543212,XYZ High School,S\n' +
      'Dummy Name 2,14,9th,+91 9123456780,ABC Public School,M\n' +
      'Dummy Name 3,15,10th,+91 9988776655,PQR High School,L\n' +
      'Dummy Name 4,13,8th,+91 9012345678,Sunrise High School,S\n' +
      'Dummy Name 5,14,9th,+91 9090909090,Green Valley School,M\n';

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
            `Successfully submitted ${parsedData?.validRows || ''} student registrations!`,
          error: null,
        });

        // Reset
        setBulkFile(null);
        setParsedData(null);
      }
    } catch (err) {
      setBulkStatus({
        success: false,
        message: null,
        error: err.response?.data?.message || 'Bulk registration submission failed.',
      });
    } finally {
      setBulkSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold text-[11px] tracking-widest uppercase bg-[var(--cyan)]/15 text-[var(--cyan)] border border-[var(--cyan)]/30">
            <Sparkles className="w-3.5 h-3.5" />
            OFFICIAL REGISTRATION
          </span>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-extrabold text-xs tracking-wider uppercase border bg-[var(--orange)]/15 text-[var(--orange)] border-[var(--orange)]/30">
            <Calendar className="w-4 h-4" />
            LAST DAY TO REGISTER: 30/11/2026
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-[var(--text-primary)]">
          MARATHON <span className="text-[var(--orange)]">REGISTRATION</span>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium max-w-xl mx-auto">
          Last date of registration is <strong className="text-[var(--text-primary)] font-bold">30 November 2026 (30/11/2026)</strong>. Details will be used to generate your official marathon pass and certificate.
        </p>

        {/* Authenticated Member Session Banner */}
        <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-sm">
              {user?.fullName?.charAt(0) || '✓'}
            </div>
            <div className="text-left">
              <span className="font-bold text-[var(--text-primary)]">Logged in as {user?.fullName}</span>
              <span className="text-[var(--text-muted)] block text-[11px]">+91 {user?.phone} • Your pass will be saved to My Passes</span>
            </div>
          </div>
          <Link
            to="/my-activity"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-[11px] hover:bg-emerald-600 transition-colors text-decoration-none whitespace-nowrap"
          >
            My Passes & Activity →
          </Link>
        </div>
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
          <span>INDIVIDUAL / FRIEND FORM</span>
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
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-[var(--border-color)] shadow-2xl relative overflow-hidden space-y-8">
          
          {!isRegistrationOpen && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 font-extrabold text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>
                {isPastDeadline
                  ? 'Marathon registration is now closed. The last date to register was 30 November 2026 (30/11/2026).'
                  : 'Marathon registration is currently closed by the organizers. Please check back later.'}
              </span>
            </div>
          )}

          <form onSubmit={handleIndividualSubmit} className="space-y-8">
            
            {/* ======================================================== */}
            {/* SECTION: PARTICIPANT 1 (YOUR REGISTRATION) */}
            {/* ======================================================== */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[var(--orange)] text-white flex items-center justify-center font-black text-xs">
                    1
                  </span>
                  <h3 className="text-base sm:text-lg font-black font-heading text-[var(--text-primary)]">
                    {hasFriend ? 'Participant 1 — Your Registration' : 'Participant Details'}
                  </h3>
                </div>
                {hasFriend && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-[10px] uppercase tracking-wider">
                    Primary Registrant
                  </span>
                )}
              </div>

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

              {/* Age & Profession / Occupation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    disabled={!isRegistrationOpen}
                    value={indForm.age}
                    onChange={(e) => setIndForm({ ...indForm, age: e.target.value })}
                    placeholder="e.g. 18"
                    className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                    Profession / Occupation
                  </label>
                  <div className="relative">
                    <Briefcase className="w-5 h-5 text-[var(--cyan)] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      disabled={!isRegistrationOpen}
                      value={indForm.profession}
                      onChange={(e) => setIndForm({ ...indForm, profession: e.target.value })}
                      placeholder="Student, Teacher, Engineer, Business, etc."
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                    />
                  </div>
                </div>
              </div>

              {/* Student Toggle */}
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
                        ? 'bg-[var(--orange)]/15 border-[var(--orange)] text-[var(--orange)] shadow-sm'
                        : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]'
                    }`}
                  >
                    YES, I AM A STUDENT
                  </button>

                  <button
                    type="button"
                    disabled={!isRegistrationOpen}
                    onClick={() => setIndForm({ ...indForm, isStudent: false, standard: '', institutionName: '', otherInstitution: '' })}
                    className={`py-3 px-4 rounded-2xl text-xs font-extrabold border transition-all ${
                      !indForm.isStudent
                        ? 'bg-[var(--cyan)]/15 border-[var(--cyan)] text-[var(--cyan)] shadow-sm'
                        : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]'
                    }`}
                  >
                    NO, INDIVIDUAL
                  </button>
                </div>
              </div>

              {/* Student Specific Fields */}
              {indForm.isStudent && (
                <div className="space-y-4 p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                      Standard / Class
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-5 h-5 text-[var(--orange)] absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        disabled={!isRegistrationOpen}
                        value={indForm.standard}
                        onChange={(e) => setIndForm({ ...indForm, standard: e.target.value })}
                        placeholder="e.g. 8th, 9th, 10th, Inter, Degree..."
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                      />
                    </div>
                  </div>

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
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-[var(--text-muted)] border-r border-[var(--border-color)] pr-2.5">
                      <Phone className="w-4 h-4 text-[var(--orange)]" />
                      <span className="text-xs font-bold text-[var(--text-primary)]">+91</span>
                    </div>
                    <input
                      type="tel"
                      required
                      disabled={!isRegistrationOpen}
                      value={indForm.contactNumber}
                      onChange={(e) => setIndForm({ ...indForm, contactNumber: formatPhoneInput(e.target.value) })}
                      placeholder="98765 43210"
                      maxLength={12}
                      className={`w-full pl-20 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border text-sm text-[var(--text-primary)] focus:outline-none ${
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
                    {['S', 'M', 'L', 'XL'].map((size) => (
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
                  {indErrors.tShirtSize && <p className="text-xs text-red-500 font-bold mt-1">{indErrors.tShirtSize}</p>}
                </div>
              </div>

              {/* Participant 1 Terms Checkbox */}
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
            </div>

            {/* ======================================================== */}
            {/* ADD A FRIEND BUTTON OR PARTICIPANT 2 FORM */}
            {/* ======================================================== */}
            {!hasFriend ? (
              <div className="pt-2 pb-2">
                <button
                  type="button"
                  disabled={!isRegistrationOpen}
                  onClick={() => setHasFriend(true)}
                  className="w-full py-4 px-5 rounded-2xl border-2 border-dashed border-[var(--orange)] bg-[var(--orange)]/10 hover:bg-[var(--orange)]/20 text-[var(--orange)] transition-all font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>+ ADD A FRIEND TO THIS REGISTRATION</span>
                </button>
                <p className="text-[11px] text-[var(--text-muted)] text-center mt-2 font-medium">
                  Register a friend along with you in a single step. Both of you will receive separate unique entry passes!
                </p>
              </div>
            ) : (
              <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-tertiary)]/60 border-2 border-[var(--orange)]/40 shadow-inner space-y-6 animate-in slide-in-from-top-3">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-[var(--cyan)] text-white flex items-center justify-center font-black text-xs">
                      2
                    </span>
                    <h3 className="text-base sm:text-lg font-black font-heading text-[var(--text-primary)]">
                      Participant 2 — Friend's Registration
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFriend}
                    className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-red-500/10 transition-colors"
                    title="Remove Friend"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Friend</span>
                  </button>
                </div>

                {/* Friend Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                    Friend's Full Name (For Certificate) *
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-[var(--cyan)] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      disabled={!isRegistrationOpen}
                      value={friendForm.fullName}
                      onChange={(e) => setFriendForm({ ...friendForm, fullName: e.target.value })}
                      placeholder="Enter your friend's full name as it should appear on certificate"
                      className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border text-sm text-[var(--text-primary)] focus:outline-none ${
                        friendErrors.fullName ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--cyan)]'
                      }`}
                    />
                  </div>
                  {friendErrors.fullName && <p className="text-xs text-red-500 font-bold mt-1">{friendErrors.fullName}</p>}
                </div>

                {/* Friend Age & Profession */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                      Friend's Age (Years)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      disabled={!isRegistrationOpen}
                      value={friendForm.age}
                      onChange={(e) => setFriendForm({ ...friendForm, age: e.target.value })}
                      placeholder="e.g. 19"
                      className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                      Friend's Profession / Occupation
                    </label>
                    <div className="relative">
                      <Briefcase className="w-5 h-5 text-[var(--cyan)] absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        disabled={!isRegistrationOpen}
                        value={friendForm.profession}
                        onChange={(e) => setFriendForm({ ...friendForm, profession: e.target.value })}
                        placeholder="Student, Teacher, Engineer, etc."
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Friend Student Toggle (Independent) */}
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                    Is your Friend a Student? *
                  </label>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      disabled={!isRegistrationOpen}
                      onClick={() => setFriendForm({ ...friendForm, isStudent: true })}
                      className={`py-3 px-4 rounded-2xl text-xs font-extrabold border transition-all ${
                        friendForm.isStudent
                          ? 'bg-[var(--orange)]/15 border-[var(--orange)] text-[var(--orange)] shadow-sm'
                          : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]'
                      }`}
                    >
                      YES, FRIEND IS A STUDENT
                    </button>

                    <button
                      type="button"
                      disabled={!isRegistrationOpen}
                      onClick={() => setFriendForm({ ...friendForm, isStudent: false, standard: '', institutionName: '', otherInstitution: '' })}
                      className={`py-3 px-4 rounded-2xl text-xs font-extrabold border transition-all ${
                        !friendForm.isStudent
                          ? 'bg-[var(--cyan)]/15 border-[var(--cyan)] text-[var(--cyan)] shadow-sm'
                          : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]'
                      }`}
                    >
                      NO, INDIVIDUAL
                    </button>
                  </div>
                </div>

                {/* Friend Student Specific Fields */}
                {friendForm.isStudent && (
                  <div className="space-y-4 p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] animate-in fade-in">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                        Standard / Class
                      </label>
                      <div className="relative">
                        <GraduationCap className="w-5 h-5 text-[var(--orange)] absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          disabled={!isRegistrationOpen}
                          value={friendForm.standard}
                          onChange={(e) => setFriendForm({ ...friendForm, standard: e.target.value })}
                          placeholder="e.g. 8th, 9th, 10th, Inter, Degree..."
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                        School / College Name in Adoni *
                      </label>
                      <SearchableSelect
                        options={[...institutions, 'OTHER']}
                        value={friendForm.institutionName}
                        onChange={(val) => setFriendForm({ ...friendForm, institutionName: val })}
                        error={friendErrors.institutionName}
                      />
                    </div>

                    {friendForm.institutionName === 'OTHER' && (
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                          Specify School / College Name *
                        </label>
                        <input
                          type="text"
                          value={friendForm.otherInstitution}
                          onChange={(e) => setFriendForm({ ...friendForm, otherInstitution: e.target.value })}
                          placeholder="Type your friend's institution name..."
                          className="w-full py-3.5 px-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                        />
                        {friendErrors.otherInstitution && (
                          <p className="text-xs text-red-500 font-bold mt-1">{friendErrors.otherInstitution}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Friend Contact Number & T-Shirt Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                      Friend's Contact Mobile Number *
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-[var(--text-muted)] border-r border-[var(--border-color)] pr-2.5">
                        <Phone className="w-4 h-4 text-[var(--cyan)]" />
                        <span className="text-xs font-bold text-[var(--text-primary)]">+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        disabled={!isRegistrationOpen}
                        value={friendForm.contactNumber}
                        onChange={(e) => setFriendForm({ ...friendForm, contactNumber: formatPhoneInput(e.target.value) })}
                        placeholder="98765 43210"
                        maxLength={12}
                        className={`w-full pl-20 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border text-sm text-[var(--text-primary)] focus:outline-none ${
                          friendErrors.contactNumber ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--cyan)]'
                        }`}
                      />
                    </div>
                    {friendErrors.contactNumber && <p className="text-xs text-red-500 font-bold mt-1">{friendErrors.contactNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                      Friend's T-Shirt Size *
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {['S', 'M', 'L', 'XL'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          disabled={!isRegistrationOpen}
                          onClick={() => setFriendForm({ ...friendForm, tShirtSize: size })}
                          className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                            friendForm.tShirtSize === size
                              ? 'bg-[var(--cyan)] text-white border-[var(--cyan)] shadow-md'
                              : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {friendErrors.tShirtSize && <p className="text-xs text-red-500 font-bold mt-1">{friendErrors.tShirtSize}</p>}
                  </div>
                </div>

                {/* Friend Terms Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={!isRegistrationOpen}
                      checked={friendForm.agreeTerms}
                      onChange={(e) => setFriendForm({ ...friendForm, agreeTerms: e.target.checked })}
                      className="w-5 h-5 mt-0.5 text-[var(--cyan)] rounded accent-[var(--cyan)]"
                    />
                    <span className="text-xs text-[var(--text-muted)] font-semibold leading-relaxed">
                      I declare on behalf of Participant 2 (Friend) that they are physically fit to participate in the Anti-Drug Movement Marathon Run 2026 and agree to the event rules, terms and conditions.
                    </span>
                  </label>
                  {friendErrors.agreeTerms && <p className="text-xs text-red-500 font-bold mt-1">{friendErrors.agreeTerms}</p>}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isRegistrationOpen || !indForm.agreeTerms || (hasFriend && !friendForm.agreeTerms) || indSubmitting}
                className="btn-primary w-full justify-center py-4 text-base shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-black"
              >
                <Award className="w-5 h-5" />
                <span>
                  {indSubmitting
                    ? 'SUBMITTING REGISTRATION...'
                    : hasFriend
                    ? 'SUBMIT REGISTRATION (YOU + FRIEND)'
                    : 'SUBMIT MARATHON REGISTRATION'}
                </span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 2: SCHOOL & COLLEGE BULK REGISTRATION */}
      {tab === 'BULK' && (
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-[var(--border-color)] shadow-2xl space-y-8">
          <div className="border-b border-[var(--border-color)] pb-4 space-y-1">
            <h3 className="text-xl font-black font-heading text-[var(--text-primary)]">
              School & College Bulk Student Upload
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Institutions can download the template, add student records, and upload to register all participants in one single batch.
            </p>
          </div>

          {bulkStatus.success && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 font-bold text-xs flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{bulkStatus.message}</span>
            </div>
          )}

          {bulkStatus.error && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 font-bold text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{bulkStatus.error}</span>
            </div>
          )}

          <form onSubmit={handleBulkSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Contact Person / Coordinator Name *
                </label>
                <input
                  type="text"
                  required
                  value={bulkForm.contactPersonName}
                  onChange={(e) => setBulkForm({ ...bulkForm, contactPersonName: e.target.value })}
                  placeholder="Principal, Sports Director, Teacher..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Coordinator Mobile Number *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-[var(--text-muted)] border-r border-[var(--border-color)] pr-2.5">
                    <Phone className="w-4 h-4 text-[var(--cyan)]" />
                    <span className="text-xs font-bold text-[var(--text-primary)]">+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={bulkForm.phone}
                    onChange={(e) => setBulkForm({ ...bulkForm, phone: formatPhoneInput(e.target.value) })}
                    placeholder="98765 43210"
                    maxLength={12}
                    className="w-full pl-20 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                  />
                </div>
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
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                >
                  <option value="SCHOOL">School</option>
                  <option value="COLLEGE">Junior / Degree College</option>
                  <option value="OTHER">Other Institution</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  School / College Name *
                </label>
                <input
                  type="text"
                  required
                  value={bulkForm.institutionName}
                  onChange={(e) => setBulkForm({ ...bulkForm, institutionName: e.target.value })}
                  placeholder="e.g. St. Joseph's High School, Adoni"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                />
              </div>
            </div>

            {/* Template Download & Upload Area */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-black text-[var(--text-primary)]">Spreadsheet File (.xlsx, .xls, .csv)</h4>
                  <p className="text-xs text-[var(--text-muted)] font-medium">
                    Upload your filled student list with columns: Student Name, Age, Standard, Phone Number, T-Shirt Size
                  </p>
                </div>
                <button
                  type="button"
                  onClick={downloadSampleTemplate}
                  className="px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--cyan)] text-xs font-bold text-[var(--text-primary)] flex items-center gap-2 whitespace-nowrap transition-colors"
                >
                  <Download className="w-4 h-4 text-[var(--cyan)]" />
                  <span>Download Sample Template</span>
                </button>
              </div>

              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="w-full text-xs text-[var(--text-muted)] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[var(--cyan)] file:text-white hover:file:bg-[var(--cyan)]/90 cursor-pointer"
              />

              {bulkParsing && (
                <div className="text-xs font-bold text-[var(--cyan)] flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-[var(--cyan)] border-t-transparent rounded-full animate-spin" />
                  <span>Parsing and validating student records...</span>
                </div>
              )}

              {parsedData && (
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs space-y-1">
                  <span className="font-extrabold text-[var(--text-primary)] block">File Validation Summary:</span>
                  <div className="flex items-center gap-4 text-[11px] font-bold">
                    <span className="text-emerald-500">✓ Valid Rows: {parsedData.validRows}</span>
                    <span className="text-red-500">✗ Invalid Rows: {parsedData.invalidRows}</span>
                    <span className="text-[var(--text-muted)]">Total Rows: {parsedData.totalRows}</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!isRegistrationOpen || bulkSubmitting || !bulkFile}
              className="btn-primary w-full justify-center py-4 text-base shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[var(--cyan)] to-blue-600 text-white"
            >
              <Upload className="w-5 h-5" />
              <span>{bulkSubmitting ? 'UPLOADING AND REGISTERING BATCH...' : 'SUBMIT BULK BATCH REGISTRATION'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Marathon Route Map Section */}
      <div id="marathon-map" className="pt-6">
        <MarathonRouteMap />
      </div>

      {/* Entry Pass Modal upon Successful Registration */}
      {receiptData && (
        <EntryPassModal
          data={receiptData}
          eventConfig={eventConfig}
          onClose={() => setReceiptData(null)}
        />
      )}

    </div>
  );
};

export default RegistrationPage;
