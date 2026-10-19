import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { formatPhoneInput, getCleanPhoneNumber } from '../utils/phoneUtils';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  Edit3,
  KeyRound,
  Activity,
  Award,
  Sparkles,
  Save,
  X,
  Printer,
  Copy,
  RefreshCw,
  LogOut,
  ChevronRight,
  ExternalLink,
  Flame,
  Eye,
  EyeOff,
} from 'lucide-react';

export const ProfilePage = ({ initialTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, normalUser, updateProfile, changePassword, logoutUser, refreshUser } = useAuth();

  const activeUser = normalUser || user;

  const urlTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(() => {
    if (initialTab === 'bookings' || urlTab === 'bookings') return 'BOOKINGS';
    if (urlTab === 'activity') return 'ACTIVITY';
    if (urlTab === 'password') return 'PASSWORD';
    return 'PROFILE';
  });

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    fullName: activeUser?.fullName || '',
    email: activeUser?.email || '',
    phone: activeUser?.phone || '',
    age: activeUser?.age || '',
    profession: activeUser?.profession || '',
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Seva Bookings State
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Activity State
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Status Alerts
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Sync state when active user updates
  useEffect(() => {
    if (activeUser) {
      setProfileFormData({
        fullName: activeUser.fullName || '',
        email: activeUser.email || '',
        phone: activeUser.phone || '',
        age: activeUser.age || '',
        profession: activeUser.profession || '',
      });
    }
  }, [activeUser]);

  // Sync tab with URL
  useEffect(() => {
    if (urlTab === 'bookings') setActiveTab('BOOKINGS');
    else if (urlTab === 'activity') setActiveTab('ACTIVITY');
    else if (urlTab === 'password') setActiveTab('PASSWORD');
    else if (urlTab === 'profile') setActiveTab('PROFILE');
  }, [urlTab]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab: tab.toLowerCase() });
    setProfileError('');
    setProfileSuccess('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  // Fetch Seva Bookings
  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await userService.getSevaBookings();
      if (res.data?.success) {
        setBookings(res.data.data || []);
      }
    } catch (err) {
      console.warn('Failed to load user seva bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Fetch Activities
  const fetchActivities = async () => {
    setLoadingActivities(true);
    try {
      const res = await userService.getActivities();
      if (res.data?.success) {
        setActivities(res.data.data?.activities || []);
      }
    } catch (err) {
      console.warn('Failed to load user activities:', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'BOOKINGS') fetchBookings();
    if (activeTab === 'ACTIVITY') fetchActivities();
  }, [activeTab]);

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profileFormData.fullName.trim()) {
      setProfileError('Full Name is required');
      return;
    }

    const cleanEmail = profileFormData.email.trim().toLowerCase();
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setProfileError('Please enter a valid email address');
      return;
    }

    const cleanPhone = getCleanPhoneNumber(profileFormData.phone);
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      setProfileError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    let parsedAge = undefined;
    if (profileFormData.age) {
      parsedAge = parseInt(profileFormData.age, 10);
      if (isNaN(parsedAge) || parsedAge < 5 || parsedAge > 120) {
        setProfileError('Please enter a valid age between 5 and 120');
        return;
      }
    }

    setSavingProfile(true);
    try {
      const res = await updateProfile({
        fullName: profileFormData.fullName.trim(),
        email: cleanEmail || null,
        phone: cleanPhone,
        age: parsedAge,
        profession: profileFormData.profession.trim(),
      });

      if (res.success) {
        setProfileSuccess('Profile details saved successfully!');
        setIsEditing(false);
        setTimeout(() => setProfileSuccess(''), 4000);
      } else {
        setProfileError(res.message || 'Failed to update profile');
      }
    } catch (err) {
      setProfileError('An unexpected error occurred while saving profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword,
      });

      if (res.success) {
        setPasswordSuccess('Password changed successfully! Please use your new password next time you sign in.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setTimeout(() => setPasswordSuccess(''), 5000);
      } else {
        setPasswordError(res.message || 'Failed to change password');
      }
    } catch (err) {
      setPasswordError('An unexpected error occurred while changing password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrintReceipt = (booking) => {
    setSelectedBookingForReceipt(booking);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const joinedDate = activeUser?.createdAt
    ? new Date(activeUser.createdAt).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
        day: 'numeric',
      })
    : 'Active Devotee';

  return (
    <div className="min-h-[85vh] pt-3 sm:pt-4 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Top Header Card */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-6 sm:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--orange)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[var(--orange)] to-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-[var(--orange)]/30 shrink-0">
              {activeUser?.fullName ? activeUser.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black font-heading text-[var(--text-primary)]">
                  {activeUser?.fullName || 'Devotee Account'}
                </h1>
                {activeUser?.role === 'admin' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--cyan)]/20 text-[var(--cyan)] text-[10px] font-black uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-[var(--text-muted)] font-medium">
                <span className="flex items-center gap-1.5 text-[var(--text-primary)]">
                  <Phone className="w-3.5 h-3.5 text-[var(--orange)]" />
                  +91 {activeUser?.phone}
                </span>
                {activeUser?.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[var(--orange)]" />
                    {activeUser.email}
                  </span>
                )}
                <span className="text-[11px] text-[var(--text-muted)]">
                  Member since {joinedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logoutUser();
                navigate('/');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Sign Out of Your Account"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-x-auto shadow-sm">
        <button
          onClick={() => switchTab('PROFILE')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'PROFILE'
              ? 'bg-[var(--orange)] text-white shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Profile</span>
        </button>

        <button
          onClick={() => switchTab('BOOKINGS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'BOOKINGS'
              ? 'bg-[var(--orange)] text-white shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Seva Bookings & Donations</span>
        </button>

        <button
          onClick={() => switchTab('ACTIVITY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ACTIVITY'
              ? 'bg-[var(--orange)] text-white shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Activity & Passes</span>
        </button>

        <button
          onClick={() => switchTab('PASSWORD')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'PASSWORD'
              ? 'bg-[var(--orange)] text-white shadow-md'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Change Password</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: MY PROFILE */}
      {/* ============================================================== */}
      {activeTab === 'PROFILE' && (
        <div className="space-y-6">
          {profileSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-500 font-semibold text-sm animate-in fade-in">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-500 font-semibold text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-6 sm:p-10 shadow-xl relative backdrop-blur-md">
            <div className="flex items-center justify-between pb-6 border-b border-[var(--border-color)]">
              <div>
                <h2 className="text-xl font-black font-heading text-[var(--text-primary)]">
                  Personal Information
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Your registered details across Chinmaya Mission Adoni
                </p>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] hover:border-[var(--orange)] text-xs font-bold text-[var(--text-primary)] transition-all cursor-pointer shadow-sm"
                >
                  <Edit3 className="w-4 h-4 text-[var(--orange)]" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setProfileError('');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            <div className="pt-6">
              {!isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-1">
                    <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[var(--orange)]" />
                      Full Name
                    </span>
                    <p className="text-sm font-black text-[var(--text-primary)]">{activeUser?.fullName || '—'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-1">
                    <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[var(--orange)]" />
                      Email Address
                    </span>
                    <p className="text-sm font-black text-[var(--text-primary)]">{activeUser?.email || 'Not specified'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-1">
                    <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[var(--orange)]" />
                      Primary Phone
                    </span>
                    <p className="text-sm font-black text-[var(--text-primary)]">+91 {activeUser?.phone || '—'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-1">
                    <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[var(--orange)]" />
                      Age
                    </span>
                    <p className="text-sm font-black text-[var(--text-primary)]">
                      {activeUser?.age ? `${activeUser.age} years` : 'Not specified'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-1">
                    <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[var(--orange)]" />
                      Profession
                    </span>
                    <p className="text-sm font-black text-[var(--text-primary)]">
                      {activeUser?.profession || 'Not specified'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-1">
                    <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      Account Security
                    </span>
                    <p className="text-sm font-black text-emerald-500 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      Bcrypt Encrypted
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={profileFormData.fullName}
                        onChange={(e) => setProfileFormData({ ...profileFormData, fullName: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-[var(--orange)] transition-all shadow-inner"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileFormData.email}
                        onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                        placeholder="devotee@example.com"
                        className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-[var(--orange)] transition-all shadow-inner"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-xs font-bold text-[var(--text-primary)] border-r border-[var(--border-color)] pr-2">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={profileFormData.phone}
                          onChange={(e) => setProfileFormData({ ...profileFormData, phone: formatPhoneInput(e.target.value) })}
                          required
                          maxLength={11}
                          className="w-full pl-16 pr-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-[var(--orange)] transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    {/* Age */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="120"
                        value={profileFormData.age}
                        onChange={(e) => setProfileFormData({ ...profileFormData, age: e.target.value })}
                        placeholder="e.g. 28"
                        className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-[var(--orange)] transition-all shadow-inner"
                      />
                    </div>

                    {/* Profession */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                        Profession / Role
                      </label>
                      <input
                        type="text"
                        value={profileFormData.profession}
                        onChange={(e) => setProfileFormData({ ...profileFormData, profession: e.target.value })}
                        placeholder="e.g. Engineer, Student, Teacher"
                        className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-[var(--orange)] transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="btn-primary py-3 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      {savingProfile ? (
                        <span>Saving Changes...</span>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MY SEVA BOOKINGS & DONATIONS */}
      {/* ============================================================== */}
      {activeTab === 'BOOKINGS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black font-heading text-[var(--text-primary)]">
                My Seva Bookings & Devotee Contributions
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                All temple pujas, sevas, and mission donations registered with your phone number (+91 {activeUser?.phone})
              </p>
            </div>

            <button
              onClick={fetchBookings}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:border-[var(--orange)] transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[var(--orange)] ${loadingBookings ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loadingBookings ? (
            <div className="p-12 text-center rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="w-8 h-8 border-3 border-[var(--orange)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-[var(--text-muted)]">Loading your sacred seva bookings from database...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center mx-auto shadow-inner">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[var(--text-primary)]">No Seva Bookings Yet</h3>
                <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                  You haven't booked any temple sevas or submitted contributions yet. Explore our sacred temples to participate in daily pujas, abhishekam, and sankalpa.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  to="/chinmaya-sanjeevaraya"
                  className="btn-primary py-2.5 px-4 rounded-xl text-xs font-bold text-decoration-none shadow-sm"
                >
                  Chinmaya Sanjeevaraya Temple
                </Link>
                <Link
                  to="/shri-shantamalleshwara-swami-temple"
                  className="px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:border-[var(--orange)] text-decoration-none transition-colors"
                >
                  Shri Shantamalleshwara Temple
                </Link>
                <Link
                  to="/support-our-mission"
                  className="px-4 py-2.5 rounded-xl bg-[var(--orange)]/15 border border-[var(--orange)]/30 text-xs font-bold text-[var(--orange)] hover:bg-[var(--orange)] hover:text-white text-decoration-none transition-all"
                >
                  Support Our Mission
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {bookings.map((booking) => (
                <div
                  key={booking._id || booking.bookingId}
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--orange)]/15 text-[var(--orange)]">
                        {booking.templeName || 'Chinmaya Mission'}
                      </span>
                      <h3 className="text-lg font-black text-[var(--text-primary)] leading-snug">
                        {booking.sevaName}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] font-medium">
                        Devotee: <span className="text-[var(--text-primary)] font-bold">{booking.devoteeName}</span>
                        {booking.gotram && ` • Gotram: ${booking.gotram}`}
                        {booking.nakshatra && ` • Nakshatra: ${booking.nakshatra}`}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-[var(--orange)]">₹{booking.amount}</span>
                      <span className="block text-[10px] font-bold text-emerald-600">PAID</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[var(--bg-tertiary)] text-[11px]">
                    <div>
                      <span className="text-[var(--text-muted)] font-semibold block">Booking Reference:</span>
                      <div className="flex items-center gap-1 font-mono font-bold text-[var(--text-primary)]">
                        <span>{booking.bookingId}</span>
                        <button
                          onClick={() => handleCopy(booking.bookingId, booking.bookingId)}
                          className="p-1 hover:text-[var(--orange)] cursor-pointer"
                          title="Copy Reference ID"
                        >
                          {copiedId === booking.bookingId ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] font-semibold block">Date of Seva:</span>
                      <span className="font-bold text-[var(--text-primary)]">{booking.date || 'Scheduled'}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-[var(--border-color)]/60 flex items-center justify-between">
                      <span className="text-[var(--text-muted)] font-semibold">Bank UTR / UPI Ref:</span>
                      <span className="font-mono text-[var(--text-primary)] font-bold">{booking.utrId || '—'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-bold text-emerald-600">
                        {booking.status === 'CONFIRMED'
                          ? 'Confirmed'
                          : booking.status === 'COMPLETED'
                          ? 'Completed'
                          : 'Verification Pending'}
                      </span>
                    </div>

                    <button
                      onClick={() => handlePrintReceipt(booking)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--orange)]/15 border border-[var(--orange)]/30 text-[var(--orange)] hover:bg-[var(--orange)] hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: ACTIVITY & PASSES */}
      {/* ============================================================== */}
      {activeTab === 'ACTIVITY' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black font-heading text-[var(--text-primary)]">
                My Community Activity & Submissions
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Marathon event registrations, volunteer applications, and contact inquiries
              </p>
            </div>

            <button
              onClick={fetchActivities}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:border-[var(--orange)] transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[var(--orange)] ${loadingActivities ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loadingActivities ? (
            <div className="p-12 text-center rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="w-8 h-8 border-3 border-[var(--orange)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-[var(--text-muted)]">Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-12 text-center rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-3">
              <Award className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
              <h3 className="text-base font-black text-[var(--text-primary)]">No Activity Found</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                No marathon registrations or volunteer applications were found for this account.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center shrink-0">
                      {act.activityType === 'SEVA_BOOKING' ? (
                        <Calendar className="w-5 h-5" />
                      ) : act.activityType === 'EVENT_REGISTRATION' ? (
                        <Award className="w-5 h-5" />
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-[var(--text-primary)]">
                        {act.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-medium">
                        <span>Ref: {act.referenceNumber}</span>
                        <span>•</span>
                        <span>{new Date(act.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)]">
                    {act.badgeText}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: CHANGE PASSWORD */}
      {/* ============================================================== */}
      {activeTab === 'PASSWORD' && (
        <div className="space-y-6 max-w-xl">
          <div>
            <h2 className="text-xl font-black font-heading text-[var(--text-primary)]">
              Change Account Password
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Ensure your account is protected with a secure, unique password
            </p>
          </div>

          {passwordSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-500 font-semibold text-sm animate-in fade-in">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-500 font-semibold text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-6 sm:p-8 shadow-xl backdrop-blur-md">
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {/* Current Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-[var(--text-muted)]">
                    <Lock className="w-4 h-4 text-[var(--orange)]" />
                  </div>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-[var(--orange)] shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-[var(--text-muted)]">
                    <KeyRound className="w-4 h-4 text-[var(--orange)]" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Min 6 characters (different from current)"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-[var(--orange)] shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-[var(--text-muted)]">
                    <KeyRound className="w-4 h-4 text-[var(--orange)]" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmNewPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                    placeholder="Re-enter new password"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-[var(--orange)] shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full btn-primary py-3.5 rounded-2xl justify-center font-bold text-xs uppercase tracking-wider shadow-md shadow-[var(--orange)]/20 mt-2 cursor-pointer"
              >
                {savingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1-PAGE PRINTABLE RECEIPT PORTAL */}
      {/* ============================================================== */}
      {selectedBookingForReceipt &&
        typeof document !== 'undefined' &&
        createPortal(
          <div id="user-booking-printable-receipt" aria-hidden="true">
            <style>{`
              @media screen {
                #user-booking-printable-receipt { display: none !important; }
              }
              @media print {
                @page {
                  size: A4 portrait;
                  margin: 8mm;
                }
                html, body {
                  background: #FFFFFF !important;
                  color: #000000 !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                body > *:not(#user-booking-printable-receipt) {
                  display: none !important;
                }
                #user-booking-printable-receipt {
                  display: block !important;
                  position: absolute !important;
                  top: 0 !important;
                  left: 0 !important;
                  width: 100% !important;
                  box-sizing: border-box !important;
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
                }
                .print-card {
                  border: 2px solid #E27B1E !important;
                  border-radius: 12px !important;
                  padding: 16px 20px !important;
                  background: #FFFFFF !important;
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                }
              }
            `}</style>
            <div className="print-card">
              {/* Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #E27B1E', paddingBottom: '10px', marginBottom: '12px' }}>
                <h1 style={{ margin: 0, fontSize: '18pt', fontWeight: '900', color: '#E27B1E', textTransform: 'uppercase' }}>
                  {selectedBookingForReceipt.templeName || 'Chinmaya Mission, Adoni'}
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: '9pt', color: '#4A5568', fontWeight: 'bold' }}>
                  CHINMAYA MISSION & CHINMAYA YUVA KENDRA, ADONI (KMS)
                </p>
                <div style={{ display: 'inline-block', marginTop: '6px', padding: '3px 12px', background: '#FFF5EB', border: '1px solid #E27B1E', borderRadius: '14px', fontSize: '9pt', fontWeight: 'bold', color: '#E27B1E' }}>
                  {selectedBookingForReceipt.bookingType === 'DEVOTEE_CONTRIBUTION' ? 'OFFICIAL CONTRIBUTION RECEIPT' : 'SACRED SEVA BOOKING RECEIPT'}
                </div>
              </div>

              {/* Summary Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '12px', fontSize: '9pt' }}>
                <div>
                  <span style={{ color: '#64748B', fontWeight: '600' }}>Receipt No: </span>
                  <strong style={{ color: '#0F172A', fontFamily: 'monospace' }}>{selectedBookingForReceipt.bookingId}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontWeight: '600' }}>Date: </span>
                  <strong>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontWeight: '600' }}>Status: </span>
                  <strong style={{ color: '#16A34A' }}>RECORDED IN ATLAS</strong>
                </div>
              </div>

              {/* Devotee & Seva Grid */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5pt', marginBottom: '14px' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '6px 8px', color: '#64748B', width: '30%', fontWeight: '600' }}>Devotee Name</td>
                    <td style={{ padding: '6px 8px', fontWeight: 'bold', color: '#0F172A' }}>{selectedBookingForReceipt.devoteeName}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '6px 8px', color: '#64748B', fontWeight: '600' }}>Primary Phone</td>
                    <td style={{ padding: '6px 8px', fontWeight: 'bold', color: '#0F172A' }}>+91 {selectedBookingForReceipt.phone}</td>
                  </tr>
                  {selectedBookingForReceipt.email && (
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '6px 8px', color: '#64748B', fontWeight: '600' }}>Email Address</td>
                      <td style={{ padding: '6px 8px', color: '#0F172A' }}>{selectedBookingForReceipt.email}</td>
                    </tr>
                  )}
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '6px 8px', color: '#64748B', fontWeight: '600' }}>Seva / Contribution</td>
                    <td style={{ padding: '6px 8px', fontWeight: 'bold', color: '#E27B1E' }}>{selectedBookingForReceipt.sevaName}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '6px 8px', color: '#64748B', fontWeight: '600' }}>Seva Scheduled Date</td>
                    <td style={{ padding: '6px 8px', fontWeight: 'bold', color: '#0F172A' }}>{selectedBookingForReceipt.date || 'As Scheduled by Priest'}</td>
                  </tr>
                  {selectedBookingForReceipt.gotram && (
                    <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '6px 8px', color: '#64748B', fontWeight: '600' }}>Gotram & Nakshatram</td>
                      <td style={{ padding: '6px 8px', color: '#0F172A' }}>
                        {selectedBookingForReceipt.gotram} {selectedBookingForReceipt.nakshatra ? ` / ${selectedBookingForReceipt.nakshatra}` : ''}
                      </td>
                    </tr>
                  )}
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '6px 8px', color: '#64748B', fontWeight: '600' }}>Bank UTR / UPI Ref</td>
                    <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontWeight: 'bold', color: '#0F172A' }}>{selectedBookingForReceipt.utrId}</td>
                  </tr>
                  <tr style={{ background: '#FFF5EB' }}>
                    <td style={{ padding: '8px', color: '#E27B1E', fontWeight: '900', fontSize: '11pt' }}>Contribution Amount</td>
                    <td style={{ padding: '8px', fontWeight: '900', fontSize: '12pt', color: '#E27B1E' }}>₹{selectedBookingForReceipt.amount}</td>
                  </tr>
                </tbody>
              </table>

              {/* Footer Stamp & Blessings */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '8.5pt', color: '#64748B' }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: 'bold', color: '#E27B1E' }}>Om Tat Sat</p>
                  <p style={{ margin: 0 }}>May the Lord bless you and your family with health, wisdom, and peace.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 'bold', color: '#0F172A' }}>Chinmaya Mission, Adoni</p>
                  <p style={{ margin: 0, fontStyle: 'italic' }}>Computer Generated Receipt</p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ProfilePage;
