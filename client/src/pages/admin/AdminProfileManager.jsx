import React, { useEffect, useState } from 'react';
import {
  Shield,
  User,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Lock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Save,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminProfileManager = () => {
  const { adminUser, updateAdminUser } = useAuth();

  // Profile Form State
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    profession: '',
    age: '',
  });
  const [profileFeedback, setProfileFeedback] = useState({ type: null, message: '' });

  // Password Change Form State
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdFeedback, setPwdFeedback] = useState({ type: null, message: '' });

  const fetchAdminProfile = async () => {
    setLoadingProfile(true);
    setProfileFeedback({ type: null, message: '' });
    try {
      const res = await adminService.getProfile();
      if (res.data?.success) {
        const data = res.data.data;
        setProfile(data);
        setProfileForm({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          profession: data.profession || '',
          age: data.age || '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch admin profile:', err);
      setProfileFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to load administrator profile.',
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileFeedback({ type: null, message: '' });

    try {
      const res = await adminService.updateProfile(profileForm);
      if (res.data?.success) {
        const updated = res.data.data;
        setProfile(updated);
        if (updateAdminUser) {
          updateAdminUser(updated);
        }
        setProfileFeedback({
          type: 'success',
          message: 'Admin profile updated successfully!',
        });
      }
    } catch (err) {
      setProfileFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update admin profile.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSavingPwd(true);
    setPwdFeedback({ type: null, message: '' });

    if (pwdForm.newPassword.length < 6) {
      setPwdFeedback({
        type: 'error',
        message: 'New password must be at least 6 characters long.',
      });
      setSavingPwd(false);
      return;
    }

    if (pwdForm.newPassword !== pwdForm.confirmNewPassword) {
      setPwdFeedback({
        type: 'error',
        message: 'New passwords do not match.',
      });
      setSavingPwd(false);
      return;
    }

    try {
      const res = await adminService.changePassword(pwdForm);
      if (res.data?.success) {
        setPwdFeedback({
          type: 'success',
          message: 'Admin password changed successfully!',
        });
        setPwdForm({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      }
    } catch (err) {
      setPwdFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to change password. Check your current password.',
      });
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--orange)] text-white flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] text-[10px] font-extrabold uppercase">
              AUTHENTICATED ADMINISTRATOR
            </span>
            <h2 className="text-2xl font-black font-heading text-[var(--text-primary)]">
              Admin Profile & Security
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Manage your administrator credentials, contact information, and security settings.
            </p>
          </div>
        </div>

        <button
          onClick={fetchAdminProfile}
          className="btn-secondary py-2.5 px-4 text-xs flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingProfile ? 'animate-spin' : ''}`} />
          <span>REFRESH PROFILE</span>
        </button>
      </div>

      {loadingProfile ? (
        <div className="py-16 text-center text-[var(--text-muted)] font-bold">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[var(--orange)]" />
          Loading administrator profile...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Admin Identity Card */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[var(--orange)] to-amber-500 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-xl">
                {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'A'}
              </div>

              <div>
                <h3 className="text-lg font-black font-heading text-[var(--text-primary)]">
                  {profile?.fullName || 'Chinmaya Administrator'}
                </h3>
                <span className="text-xs font-mono font-bold text-[var(--orange)] block mt-0.5">
                  {profile?.email || profile?.phone}
                </span>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[var(--orange)]/15 text-[var(--orange)] border border-[var(--orange)]/30">
                  {profile?.role?.toUpperCase() || 'ADMIN'}
                </span>
              </div>

              <div className="border-t border-[var(--border-color)] pt-4 text-left space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)] font-bold">Admin ID:</span>
                  <span className="font-mono text-[10px] text-[var(--text-primary)]">{profile?._id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)] font-bold">Role:</span>
                  <span className="font-bold text-[var(--orange)] uppercase">{profile?.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)] font-bold">Created On:</span>
                  <span className="text-[var(--text-primary)]">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs space-y-2">
              <div className="flex items-center gap-2 text-[var(--orange)] font-extrabold">
                <Shield className="w-4 h-4 shrink-0" />
                <span>Security Assurance</span>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Your administrative privileges are strictly validated against verified server-side JWT session tokens.
                Profile updates here only affect your administrator account and do not modify any public website users.
              </p>
            </div>
          </div>

          {/* Right Column: Forms for Profile & Password */}
          <div className="lg:col-span-2 space-y-8">
            {/* Form 1: Edit Profile Details */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] space-y-6">
              <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
                <div className="p-2.5 rounded-xl bg-[var(--cyan)]/15 text-[var(--cyan)]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading text-[var(--text-primary)]">
                    Personal Information
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Update your name, contact details, and profession.
                  </p>
                </div>
              </div>

              {profileFeedback.message && (
                <div
                  className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
                    profileFeedback.type === 'error'
                      ? 'bg-red-500/10 border-red-500/30 text-red-500'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  }`}
                >
                  {profileFeedback.type === 'error' ? (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{profileFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[var(--text-muted)] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--cyan)]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--text-muted)] mb-1">
                      Phone Number (10 digits) *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono font-bold focus:outline-none focus:border-[var(--cyan)]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--text-muted)] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="admin@anti-drug-marathon.org"
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--text-muted)] mb-1">
                      Profession / Organization
                    </label>
                    <input
                      type="text"
                      value={profileForm.profession}
                      onChange={(e) => setProfileForm({ ...profileForm, profession: e.target.value })}
                      placeholder="e.g. Chinmaya Mission Volunteer"
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--text-muted)] mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={120}
                      value={profileForm.age}
                      onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--cyan)]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--text-muted)] mb-1">
                      Assigned Role (Protected)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={profile?.role?.toUpperCase() || 'ADMIN'}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] font-black uppercase cursor-not-allowed opacity-75"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn-primary py-2.5 px-6 text-xs font-extrabold flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingProfile ? 'SAVING CHANGES...' : 'SAVE PROFILE CHANGES'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Form 2: Change Password Form */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] space-y-6">
              <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
                <div className="p-2.5 rounded-xl bg-[var(--orange)]/15 text-[var(--orange)]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading text-[var(--text-primary)]">
                    Change Administrator Password
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Requires verification of your current password.
                  </p>
                </div>
              </div>

              {pwdFeedback.message && (
                <div
                  className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
                    pwdFeedback.type === 'error'
                      ? 'bg-red-500/10 border-red-500/30 text-red-500'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  }`}
                >
                  {pwdFeedback.type === 'error' ? (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{pwdFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[var(--text-muted)] mb-1">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPwd ? 'text' : 'password'}
                      required
                      value={pwdForm.currentPassword}
                      onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                      placeholder="Enter your current password"
                      className="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                      className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[var(--text-muted)] mb-1">
                      New Password (min 6 chars) *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPwd ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={pwdForm.newPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                        placeholder="Enter new strong password"
                        className="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPwd(!showNewPwd)}
                        className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      >
                        {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--text-muted)] mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={pwdForm.confirmNewPassword}
                      onChange={(e) => setPwdForm({ ...pwdForm, confirmNewPassword: e.target.value })}
                      placeholder="Repeat new password"
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingPwd}
                    className="py-2.5 px-6 rounded-xl bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-[var(--orange)]/20"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{savingPwd ? 'UPDATING PASSWORD...' : 'UPDATE PASSWORD'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
