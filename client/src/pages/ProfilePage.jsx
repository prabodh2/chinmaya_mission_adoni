import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Phone,
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
  HeartHandshake,
  Sparkles,
  Save,
  X,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile, changePassword, refreshUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    age: user?.age || '',
    profession: user?.profession || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        age: user.age || '',
        profession: user.profession || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!formData.fullName.trim()) {
      setProfileError('Full Name is required');
      return;
    }

    const parsedAge = parseInt(formData.age, 10);
    if (formData.age && (isNaN(parsedAge) || parsedAge < 5 || parsedAge > 120)) {
      setProfileError('Please enter a valid age between 5 and 120');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await updateProfile({
        fullName: formData.fullName.trim(),
        age: parsedAge || undefined,
        profession: formData.profession.trim(),
      });
      if (res.success) {
        setProfileSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setProfileSuccess(''), 4000);
      } else {
        setProfileError(res.message || 'Failed to update profile');
      }
    } catch (err) {
      setProfileError('An unexpected error occurred while updating profile.');
    } finally {
      setSavingProfile(false);
    }
  };

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
        setPasswordSuccess('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setTimeout(() => {
          setPasswordSuccess('');
          setShowPasswordModal(false);
        }, 2000);
      } else {
        setPasswordError(res.message || 'Failed to change password');
      }
    } catch (err) {
      setPasswordError('An unexpected error occurred while changing password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
        day: 'numeric',
      })
    : 'Active Member';

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--orange)]">
            ACCOUNT MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-[var(--text-primary)]">
            My Profile
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/my-activity"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:border-[var(--orange)] transition-colors text-decoration-none"
          >
            <Activity className="w-4 h-4 text-[var(--orange)]" />
            <span>View My Activity</span>
          </Link>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--orange)]/15 border border-[var(--orange)]/30 text-xs font-bold text-[var(--orange)] hover:bg-[var(--orange)] hover:text-white transition-all"
          >
            <KeyRound className="w-4 h-4" />
            <span>Change Password</span>
          </button>
        </div>
      </div>

      {/* Profile Success Alert */}
      {profileSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-500 font-semibold text-sm animate-in fade-in">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{profileSuccess}</span>
        </div>
      )}

      {/* Profile Error Alert */}
      {profileError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-500 font-semibold text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{profileError}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-6 sm:p-10 shadow-xl relative overflow-hidden backdrop-blur-md">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--orange)]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[var(--orange)] to-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-[var(--orange)]/30 shrink-0">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                  {user?.fullName || 'Community Member'}
                </h2>
                {user?.role === 'admin' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--cyan)]/20 text-[var(--cyan)] text-[10px] font-black uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[var(--orange)]" />
                <span>+91 {user?.phone}</span>
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">Member since {joinedDate}</p>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] hover:border-[var(--orange)] text-xs font-bold text-[var(--text-primary)] transition-all shadow-sm"
            >
              <Edit3 className="w-4 h-4 text-[var(--orange)]" />
              <span>Edit Details</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  fullName: user?.fullName || '',
                  age: user?.age || '',
                  profession: user?.profession || '',
                });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          )}
        </div>

        {/* Details Form / View */}
        <div className="pt-8">
          {!isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Full Name */}
              <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-1">
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[var(--orange)]" />
                  Full Name
                </span>
                <p className="text-sm font-black text-[var(--text-primary)]">{user?.fullName || '—'}</p>
              </div>

              {/* Age */}
              <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-1">
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[var(--orange)]" />
                  Age
                </span>
                <p className="text-sm font-black text-[var(--text-primary)]">
                  {user?.age ? `${user.age} years` : 'Not specified'}
                </p>
              </div>

              {/* Profession */}
              <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-1">
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[var(--orange)]" />
                  Profession / Role
                </span>
                <p className="text-sm font-black text-[var(--text-primary)]">{user?.profession || 'Not specified'}</p>
              </div>

              {/* Phone Number */}
              <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-1">
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[var(--orange)]" />
                  Primary Phone
                </span>
                <p className="text-sm font-black text-[var(--text-primary)]">+91 {user?.phone || '—'}</p>
              </div>

              {/* Email */}
              <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-1">
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--cyan)]" />
                  Account Status
                </span>
                <p className="text-sm font-black text-emerald-500 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Active & Verified
                </p>
              </div>

              {/* Account Security */}
              <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-1">
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  Security Level
                </span>
                <p className="text-sm font-black text-[var(--text-primary)]">Encrypted Password</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-[var(--orange)] transition-all shadow-inner"
                  />
                </div>

                {/* Age */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-[var(--orange)] transition-all shadow-inner"
                  />
                </div>

                {/* Profession */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Profession / Occupation
                  </label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    placeholder="e.g. Software Engineer, Student, Teacher"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-[var(--orange)] transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-primary py-3 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  {savingProfile ? (
                    <span>Saving...</span>
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
                  className="px-5 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--orange)]/15 text-[var(--orange)] mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black font-heading text-[var(--text-primary)]">
                Change Account Password
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Enter your current password and set a secure new password.
              </p>
            </div>

            {passwordSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-[var(--orange)]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  New Password (min 6 chars)
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-[var(--orange)]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-[var(--orange)]"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full btn-primary py-3 rounded-2xl justify-center font-bold text-xs uppercase tracking-wider"
                >
                  {savingPassword ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
