import React, { useState } from 'react';
import { X, Save, Lock } from 'lucide-react';
import { adminRegistrationService } from '../services/adminApi';

export const RegistrationEditModal = ({ registration, onClose, onUpdated }) => {
  if (!registration) return null;

  const [form, setForm] = useState({
    fullName: registration.fullName || '',
    age: registration.age ?? '',
    standard: registration.standard || '',
    profession: registration.profession || '',
    contactNumber: registration.contactNumber || '',
    institutionName: registration.institutionName || '',
    tShirtSize: registration.tShirtSize || 'M',
    status: registration.status || 'CONFIRMED',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setError('Student name is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        fullName: form.fullName.trim(),
        age: form.age !== '' ? parseInt(form.age, 10) : null,
        standard: form.standard ? form.standard.trim() : null,
        profession: form.profession ? form.profession.trim() : null,
        contactNumber: form.contactNumber.trim(),
        institutionName: form.institutionName.trim(),
        tShirtSize: form.tShirtSize,
        status: form.status,
      };

      const res = await adminRegistrationService.updateRegistration(
        registration.registrationId || registration._id,
        payload
      );
      if (res.data?.success) {
        if (onUpdated) onUpdated(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update registration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#1C2541] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-[#FF7B00] block">
              EDIT REGISTRATION
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="text-xl font-black font-heading text-white font-mono">
                {registration.registrationId}
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#94A3B8] bg-[#243054] px-2 py-0.5 rounded-full border border-white/10">
                <Lock className="w-3 h-3 text-[#FF7B00]" /> ID Immutable
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#243054] text-[#94A3B8] hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-white uppercase mb-1">
              Participant Name *
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Contact Phone *
              </label>
              <input
                type="text"
                required
                value={form.contactNumber}
                onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
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
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Class / Standard
              </label>
              <input
                type="text"
                value={form.standard}
                onChange={(e) => setForm({ ...form, standard: e.target.value })}
                placeholder="e.g. 10th Class, B.Tech 2nd Year"
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              />
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Profession
              </label>
              <input
                type="text"
                value={form.profession}
                onChange={(e) => setForm({ ...form, profession: e.target.value })}
                placeholder="Student, Teacher, etc."
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1">
              School / College Name
            </label>
            <input
              type="text"
              value={form.institutionName}
              onChange={(e) => setForm({ ...form, institutionName: e.target.value })}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-white uppercase mb-1">
                T-Shirt Size
              </label>
              <select
                value={form.tShirtSize}
                onChange={(e) => setForm({ ...form, tShirtSize: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              >
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((s) => (
                  <option key={s} value={s} className="bg-[#0B132B]">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              >
                <option value="CONFIRMED" className="bg-[#0B132B]">CONFIRMED</option>
                <option value="CANCELLED" className="bg-[#0B132B]">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2.5 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-xs py-2.5 px-5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
