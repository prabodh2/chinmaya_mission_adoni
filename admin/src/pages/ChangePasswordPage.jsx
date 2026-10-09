import React, { useState } from 'react';
import { adminAuthService } from '../services/adminApi';
import { KeyRound, Lock, Eye, EyeOff, Save, CheckCircle, AlertTriangle } from 'lucide-react';

export const ChangePasswordPage = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: null, message: '' });

    if (form.newPassword.length < 6) {
      setFeedback({
        type: 'error',
        message: 'New password must be at least 6 characters long.',
      });
      setSaving(false);
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      setFeedback({
        type: 'error',
        message: 'New password and confirmation do not match.',
      });
      setSaving(false);
      return;
    }

    try {
      const res = await adminAuthService.changePassword(form);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'Administrator password changed successfully!',
        });
        setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update administrator password.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto animate-in fade-in">
      <div>
        <span className="text-xs font-black tracking-widest text-[#00B4D8] uppercase">
          ACCOUNT SECURITY
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
          CHANGE ADMINISTRATOR PASSWORD
        </h2>
        <p className="text-xs text-[#94A3B8] font-medium">
          Update your secure access key for the Chinmaya Mission Adoni Admin Portal
        </p>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/15 border border-red-500/30 text-red-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-3xl bg-[#1C2541] border border-white/10 shadow-2xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-white uppercase mb-1.5">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                placeholder="Enter current administrator password"
                className="w-full py-3 pl-3 pr-10 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 text-[#94A3B8] hover:text-white"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1.5">
              New Password (Min 6 Characters) *
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                placeholder="Enter new strong password"
                className="w-full py-3 pl-3 pr-10 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-[#94A3B8] hover:text-white"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1.5">
              Confirm New Password *
            </label>
            <input
              type={showNew ? 'text' : 'password'}
              required
              value={form.confirmNewPassword}
              onChange={(e) => setForm({ ...form, confirmNewPassword: e.target.value })}
              placeholder="Re-type new password"
              className="w-full py-3 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full justify-center py-3 text-xs font-bold"
            >
              <KeyRound className="w-4 h-4" />
              <span>{saving ? 'Updating Password...' : 'Save New Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
