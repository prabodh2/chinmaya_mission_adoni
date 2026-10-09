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
import { adminAuthService } from '../services/adminApi';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminProfilePage = () => {
  const { adminUser, updateProfile: updateContextProfile } = useAdminAuth();

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
      const res = await adminAuthService.getProfile();
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
      const res = await adminAuthService.updateProfile(profileForm);
      if (res.data?.success) {
        const updated = res.data.data;
        setProfile(updated);
        if (updateContextProfile) {
          updateContextProfile(profileForm);
        }
        setProfileFeedback({
          type: 'success',
          message: 'Admin profile details updated successfully!',
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
      const res = await adminAuthService.changePassword(pwdForm);
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
        message: err.response?.data?.message || 'Failed to change password. Please verify current password.',
      });
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black tracking-widest text-[#00B4D8] uppercase">
            ADMINISTRATIVE IDENTITY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            ADMINISTRATOR PROFILE
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium">
            Manage your administrator credentials and security settings
          </p>
        </div>

        <button
          onClick={fetchAdminProfile}
          disabled={loadingProfile}
          className="btn-secondary text-xs py-2 px-3.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingProfile ? 'animate-spin' : ''}`} />
          <span>Reload</span>
        </button>
      </div>

      {/* Admin Card Info */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1C2541] to-[#243054] border border-[#00B4D8]/30 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#00B4D8] to-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-[#00B4D8]/30 shrink-0">
          {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'A'}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-xl font-black font-heading text-white">
              {profile?.fullName || 'Chinmaya Administrator'}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00B4D8]/20 text-[#00B4D8] border border-[#00B4D8]/40 text-[10px] font-black uppercase">
              ROLE: ADMIN
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono">
            {profile?.email || 'admin@anti-drug-marathon.org'} • +91 {profile?.phone || '9876543210'}
          </p>
          <p className="text-[11px] text-[#64748B]">
            Administrator Account ID: <code className="text-[#00B4D8] font-mono">{profile?._id}</code>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Profile Details Form */}
        <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
            <User className="w-5 h-5 text-[#00B4D8]" />
            <h4 className="text-sm font-black font-heading text-white uppercase tracking-wider">
              Profile Information
            </h4>
          </div>

          {profileFeedback.message && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                profileFeedback.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/15 border border-red-500/30 text-red-400'
              }`}
            >
              {profileFeedback.type === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span>{profileFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              />
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                placeholder="admin@anti-drug-marathon.org"
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              />
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Mobile Phone (+91)
              </label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="10-digit number"
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-white uppercase mb-1">
                  Profession
                </label>
                <input
                  type="text"
                  value={profileForm.profession}
                  onChange={(e) => setProfileForm({ ...profileForm, profession: e.target.value })}
                  placeholder="e.g. Administrator"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
                />
              </div>

              <div>
                <label className="block font-bold text-white uppercase mb-1">
                  Age
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={profileForm.age}
                  onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="btn-primary w-full justify-center py-2.5 text-xs font-bold"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingProfile ? 'Saving Details...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Security & Password Update */}
        <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
            <KeyRound className="w-5 h-5 text-[#FF7B00]" />
            <h4 className="text-sm font-black font-heading text-white uppercase tracking-wider">
              Change Admin Password
            </h4>
          </div>

          {pwdFeedback.message && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                pwdFeedback.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/15 border border-red-500/30 text-red-400'
              }`}
            >
              {pwdFeedback.type === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span>{pwdFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPwd ? 'text' : 'password'}
                  required
                  value={pwdForm.currentPassword}
                  onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full py-2.5 pl-3 pr-10 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#FF7B00]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                  className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-white"
                >
                  {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                New Password (Min 6 Characters) *
              </label>
              <div className="relative">
                <input
                  type={showNewPwd ? 'text' : 'password'}
                  required
                  value={pwdForm.newPassword}
                  onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                  placeholder="Enter new strong password"
                  className="w-full py-2.5 pl-3 pr-10 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#FF7B00]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                  className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-white"
                >
                  {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Confirm New Password *
              </label>
              <input
                type={showNewPwd ? 'text' : 'password'}
                required
                value={pwdForm.confirmNewPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, confirmNewPassword: e.target.value })}
                placeholder="Re-enter new password"
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#FF7B00]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPwd}
                className="btn-primary w-full justify-center py-2.5 text-xs font-bold bg-gradient-to-r from-[#FF7B00] to-amber-600"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{savingPwd ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
