import React, { useState } from 'react';
import { X, Save, Lock } from 'lucide-react';
import { adminService } from '../../services/api';

export const RegistrationEditModal = ({ registration, onClose, onUpdated }) => {
  if (!registration) return null;

  const [form, setForm] = useState({
    fullName: registration.fullName || '',
    age: registration.age ?? '',
    standard: registration.standard || '',
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
        contactNumber: form.contactNumber.trim(),
        institutionName: form.institutionName.trim(),
        tShirtSize: form.tShirtSize,
        status: form.status,
      };

      const res = await adminService.updateRegistration(registration.registrationId, payload);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-[var(--orange)] block">
              EDIT REGISTRATION
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="text-xl font-black font-heading text-[var(--text-primary)] font-mono">
                {registration.registrationId}
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full border border-[var(--border-color)]">
                <Lock className="w-3 h-3 text-[var(--orange)]" /> ID Immutable
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-[var(--text-primary)] uppercase mb-1">
              Student / Participant Name *
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[var(--text-primary)] uppercase mb-1">
                Age
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="e.g. 14"
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--text-primary)] uppercase mb-1">
                Standard / Class
              </label>
              <input
                type="text"
                value={form.standard}
                onChange={(e) => setForm({ ...form, standard: e.target.value })}
                placeholder="e.g. 8th, 9th, 10th..."
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[var(--text-primary)] uppercase mb-1">
                Contact Phone Number *
              </label>
              <input
                type="tel"
                required
                value={form.contactNumber}
                onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-mono font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--text-primary)] uppercase mb-1">
                T-Shirt Size *
              </label>
              <select
                value={form.tShirtSize}
                onChange={(e) => setForm({ ...form, tShirtSize: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
              >
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((sz) => (
                  <option key={sz} value={sz}>{sz}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[var(--text-primary)] uppercase mb-1">
              School / College Name
            </label>
            <input
              type="text"
              value={form.institutionName}
              onChange={(e) => setForm({ ...form, institutionName: e.target.value })}
              className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
            />
          </div>

          <div>
            <label className="block font-bold text-[var(--text-primary)] uppercase mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
            >
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="btn-secondary py-2 px-4 text-xs"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'SAVING...' : 'SAVE CHANGES'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
