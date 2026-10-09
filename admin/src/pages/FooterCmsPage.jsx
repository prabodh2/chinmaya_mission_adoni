import React, { useState, useEffect } from 'react';
import { adminFooterService } from '../services/adminApi';
import {
  Save,
  RotateCcw,
  Eye,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle,
  Settings,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
} from 'lucide-react';

const DEFAULT_FORM_DATA = {
  isEnabled: true,
  brand: {
    title: 'ANTI-DRUG 2026',
    description:
      '"YOUR LIFE. YOUR CHOICE." — A youth-focused anti-drug movement inspiring health, strength, purpose, and clean living across Adoni.',
    logoUrl: '',
  },
  organizedBy: {
    heading: 'ORGANIZED BY:',
    text: 'Chinmaya Mission Adoni & Chinmaya Yuva Kendra Adoni',
  },
  quickNavigation: {
    heading: 'QUICK NAVIGATION',
    links: [
      { label: 'Home', url: '/', openInNewTab: false, enabled: true, displayOrder: 1 },
      { label: 'About Us', url: '/about', openInNewTab: false, enabled: true, displayOrder: 2 },
      { label: 'Activities Gallery', url: '/activities', openInNewTab: false, enabled: true, displayOrder: 3 },
      { label: "Let's Connect", url: '/lets-connect', openInNewTab: false, enabled: true, displayOrder: 4 },
      { label: 'Marathon Registration', url: '/register', openInNewTab: false, enabled: true, displayOrder: 5 },
    ],
  },
  contact: {
    heading: 'EVENT LOCATION & CONTACT',
    address: {
      line1: 'Chinmaya Mission Ashrama',
      line2: 'Arts College Road',
      city: 'Adoni',
      pincode: '518301',
      state: 'Andhra Pradesh',
      country: 'India',
    },
    phoneNumbers: ['+91 98765 43210', '+91 85122 34567'],
    emails: ['contact@chinmayamissionadoni.org'],
  },
};

export const FooterCmsPage = () => {
  const [form, setForm] = useState(DEFAULT_FORM_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  const fetchFooter = async () => {
    setLoading(true);
    try {
      const res = await adminFooterService.getAdminFooter();
      if (res.data?.success && res.data?.data) {
        setForm(res.data.data);
      }
    } catch (err) {
      console.warn('Using default footer template');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: null, message: '' });

    try {
      const res = await adminFooterService.updateFooter(form);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'Footer CMS settings published live successfully!',
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to update footer configuration.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black tracking-widest text-[#00B4D8] uppercase">
            WEBSITE FOOTER CMS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            FOOTER SETTINGS & CONTACT DETAILS
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium">
            Manage organization address, contact numbers, email addresses, and footer links
          </p>
        </div>

        <button
          onClick={fetchFooter}
          disabled={loading}
          className="btn-secondary text-xs py-2 px-3.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload</span>
        </button>
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
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Brand Information Card */}
        <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-4">
          <h3 className="text-sm font-black font-heading text-[#00B4D8] uppercase tracking-wider border-b border-white/10 pb-2">
            1. Brand Description & Tagline
          </h3>

          <div>
            <label className="block font-bold text-white uppercase mb-1">
              Footer Title
            </label>
            <input
              type="text"
              value={form.brand?.title || ''}
              onChange={(e) => setForm({ ...form, brand: { ...form.brand, title: e.target.value } })}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1">
              Footer Summary Text
            </label>
            <textarea
              rows="3"
              value={form.brand?.description || ''}
              onChange={(e) => setForm({ ...form, brand: { ...form.brand, description: e.target.value } })}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-4">
          <h3 className="text-sm font-black font-heading text-[#FF7B00] uppercase tracking-wider border-b border-white/10 pb-2">
            2. Ashram Location & Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                value={form.contact?.address?.line1 || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact: {
                      ...form.contact,
                      address: { ...form.contact.address, line1: e.target.value },
                    },
                  })
                }
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#FF7B00]"
              />
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                value={form.contact?.address?.line2 || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact: {
                      ...form.contact,
                      address: { ...form.contact.address, line2: e.target.value },
                    },
                  })
                }
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#FF7B00]"
              />
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                City & PIN Code
              </label>
              <input
                type="text"
                value={`${form.contact?.address?.city || 'Adoni'}, ${form.contact?.address?.pincode || '518301'}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setForm({
                    ...form,
                    contact: {
                      ...form.contact,
                      address: {
                        ...form.contact.address,
                        city: (parts[0] || '').trim(),
                        pincode: (parts[1] || '').trim(),
                      },
                    },
                  });
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#FF7B00]"
              />
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                State & Country
              </label>
              <input
                type="text"
                value={`${form.contact?.address?.state || 'Andhra Pradesh'}, ${form.contact?.address?.country || 'India'}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setForm({
                    ...form,
                    contact: {
                      ...form.contact,
                      address: {
                        ...form.contact.address,
                        state: (parts[0] || '').trim(),
                        country: (parts[1] || '').trim(),
                      },
                    },
                  });
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#FF7B00]"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full justify-center py-3 text-xs font-bold"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing Changes...' : 'Save & Publish Footer CMS'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FooterCmsPage;
