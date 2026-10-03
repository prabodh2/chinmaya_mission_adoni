import React, { useState, useEffect } from 'react';
import { footerService } from '../../services/api';
import { Footer } from '../../components/Footer';
import { formatPhoneInput } from '../../utils/phoneUtils';
import {
  Save,
  RotateCcw,
  Eye,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertCircle,
  Settings,
  Layout,
  Link as LinkIcon,
  MapPin,
  Heart,
  Palette,
  Power,
  Phone,
  Mail,
} from 'lucide-react';

const DEFAULT_FORM_DATA = {
  isEnabled: true,
  disabledMessage: '',
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
      { label: 'What We Do', url: '/what-we-do', openInNewTab: false, enabled: true, displayOrder: 4 },
      { label: "Let's Connect", url: '/lets-connect', openInNewTab: false, enabled: true, displayOrder: 5 },
      { label: 'Marathon Registration', url: '/register', openInNewTab: false, enabled: true, displayOrder: 6 },
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
    googleMapsUrl: '',
    whatsappNumber: '',
    websiteUrl: '',
  },
  pledge: {
    heading: 'THE MARATHON PLEDGE',
    title: 'RUN FOR A DRUG-FREE FUTURE',
    description:
      '"I pledge to reject bad influences, honor my health, choose good friends, and build a brighter future for myself and Adoni."',
  },
  bottomFooter: {
    copyrightText: '© Chinmaya Mission Adoni.',
    privacyPolicy: { label: 'Privacy Policy', url: '/privacy' },
    termsConditions: { label: 'Terms & Conditions', url: '/terms' },
  },
  appearance: {
    backgroundColor: '#0B2340',
    textColor: '#CBD5E1',
    headingColor: '#FFC107',
    accentColor: '#F4511E',
    dividerColor: 'rgba(255, 255, 255, 0.1)',
    cardBackgroundColor: 'rgba(255, 255, 255, 0.05)',
    cardBorderColor: 'rgba(255, 255, 255, 0.1)',
  },
};

export const FooterManager = () => {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newLink, setNewLink] = useState({ label: '', url: '', openInNewTab: false, enabled: true });
  const [statusMessage, setStatusMessage] = useState({ type: null, text: '' });

  useEffect(() => {
    fetchAdminFooter();
  }, []);

  const fetchAdminFooter = async () => {
    setLoading(true);
    try {
      const res = await footerService.getAdminFooter();
      if (res.data?.success && res.data?.data) {
        setFormData(res.data.data);
      }
    } catch (err) {
      console.error('[Footer CMS Fetch Error]:', err);
      showNotification('error', 'Failed to load footer configuration from server.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage({ type: null, text: '' });
    }, 4000);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await footerService.updateFooter(formData);
      if (res.data?.success) {
        setFormData(res.data.data);
        showNotification('success', 'Footer configuration updated successfully!');
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to update footer configuration.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete the footer configuration? Safe defaults will be displayed.'
    );
    if (!confirmDelete) return;

    try {
      await footerService.deleteFooter(formData._id);
      setFormData(DEFAULT_FORM_DATA);
      showNotification('success', 'Footer configuration deleted successfully.');
    } catch (err) {
      showNotification('error', 'Failed to delete footer configuration.');
    }
  };

  // Helper State Modifiers
  const updateNestedState = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateAddressState = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        address: {
          ...prev.contact.address,
          [field]: value,
        },
      },
    }));
  };

  // Quick Navigation Link Controls
  const handleAddLink = () => {
    if (!newLink.label || !newLink.url) return;
    const links = [...(formData.quickNavigation?.links || [])];
    links.push({
      ...newLink,
      displayOrder: links.length + 1,
    });
    updateNestedState('quickNavigation', 'links', links);
    setNewLink({ label: '', url: '', openInNewTab: false, enabled: true });
  };

  const handleUpdateLink = (index, field, value) => {
    const links = [...(formData.quickNavigation?.links || [])];
    links[index][field] = value;
    updateNestedState('quickNavigation', 'links', links);
  };

  const handleDeleteLink = (index) => {
    const links = [...(formData.quickNavigation?.links || [])].filter((_, i) => i !== index);
    updateNestedState('quickNavigation', 'links', links);
  };

  const handleMoveLink = (index, direction) => {
    const links = [...(formData.quickNavigation?.links || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= links.length) return;
    const temp = links[index];
    links[index] = links[targetIndex];
    links[targetIndex] = temp;
    // Update display order
    links.forEach((item, idx) => {
      item.displayOrder = idx + 1;
    });
    updateNestedState('quickNavigation', 'links', links);
  };

  // Contact Phone & Email Arrays
  const handleAddPhone = () => {
    if (!newPhone.trim()) return;
    const phones = [...(formData.contact?.phoneNumbers || []), newPhone.trim()];
    updateNestedState('contact', 'phoneNumbers', phones);
    setNewPhone('');
  };

  const handleDeletePhone = (index) => {
    const phones = [...(formData.contact?.phoneNumbers || [])].filter((_, i) => i !== index);
    updateNestedState('contact', 'phoneNumbers', phones);
  };

  const handleAddEmail = () => {
    if (!newEmail.trim()) return;
    const emails = [...(formData.contact?.emails || []), newEmail.trim()];
    updateNestedState('contact', 'emails', emails);
    setNewEmail('');
  };

  const handleDeleteEmail = (index) => {
    const emails = [...(formData.contact?.emails || [])].filter((_, i) => i !== index);
    updateNestedState('contact', 'emails', emails);
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-[var(--orange)] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Loading Footer CMS Settings...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Notification Banner */}
      {statusMessage.text && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 shadow-md ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500'
              : 'bg-red-500/15 border-red-500/30 text-red-500'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div>
          <h2 className="text-xl font-black font-heading text-[var(--text-primary)]">
            FOOTER MANAGEMENT CMS
          </h2>
          <p className="text-xs font-semibold text-[var(--text-muted)]">
            Manage links, contacts, pledge statement, status, and custom visual styling.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`btn-secondary text-xs py-2.5 px-4 ${
              showPreview ? 'bg-[var(--cyan)]/20 text-[var(--cyan)] border-[var(--cyan)]/40' : ''
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showPreview ? 'Hide Live Preview' : 'Preview Footer'}</span>
          </button>

          <button
            onClick={handleDelete}
            className="p-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
            title="Delete Footer Config"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setFormData(DEFAULT_FORM_DATA)}
            className="p-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] transition-colors"
            title="Reset Defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-xs py-2.5 px-6 shadow-xl"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Footer Changes'}</span>
          </button>
        </div>
      </div>

      {/* Live Preview Box */}
      {showPreview && (
        <div className="space-y-3 p-4 bg-[var(--bg-tertiary)] border-2 border-[var(--cyan)]/30 rounded-3xl">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-black uppercase text-[var(--cyan)] tracking-wider">
              LIVE FOOTER PREVIEW
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-bold">
              Matches public website layout
            </span>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-color)]">
            <Footer overrideData={formData} />
          </div>
        </div>
      )}

      {/* Accordions / Section Cards */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* A. FOOTER STATUS */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-3">
              <Power className="w-5 h-5 text-[var(--orange)]" />
              <h3 className="text-base font-extrabold font-heading text-[var(--text-primary)]">
                A. FOOTER STATUS & ACCESSIBILITY
              </h3>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {formData.isEnabled ? 'ENABLED (ON)' : 'DISABLED (OFF)'}
              </span>
              <input
                type="checkbox"
                checked={formData.isEnabled}
                onChange={(e) => setFormData((prev) => ({ ...prev, isEnabled: e.target.checked }))}
                className="w-5 h-5 accent-[var(--orange)]"
              />
            </label>
          </div>

          {!formData.isEnabled && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-[var(--text-muted)]">
                Footer Disabled Notice Message (Optional — leave blank to hide footer completely):
              </label>
              <input
                type="text"
                value={formData.disabledMessage || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, disabledMessage: e.target.value }))}
                placeholder="e.g. Website updates in progress..."
                className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
              />
            </div>
          )}
        </div>

        {/* B. BRAND / INTRODUCTION */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
            <Layout className="w-5 h-5 text-[var(--cyan)]" />
            <h3 className="text-base font-extrabold font-heading text-[var(--text-primary)]">
              B. BRAND TITLE & DESCRIPTION
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)]">Brand Title:</label>
              <input
                type="text"
                value={formData.brand?.title || ''}
                onChange={(e) => updateNestedState('brand', 'title', e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-[var(--text-muted)]">Brand Description / Motto:</label>
              <textarea
                rows={2}
                value={formData.brand?.description || ''}
                onChange={(e) => updateNestedState('brand', 'description', e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>

        {/* C. ORGANIZED BY */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
            <Heart className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-extrabold font-heading text-[var(--text-primary)]">
              C. ORGANIZED BY SECTION
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)]">Section Heading:</label>
              <input
                type="text"
                value={formData.organizedBy?.heading || ''}
                onChange={(e) => updateNestedState('organizedBy', 'heading', e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)]">Organization Name:</label>
              <input
                type="text"
                value={formData.organizedBy?.text || ''}
                onChange={(e) => updateNestedState('organizedBy', 'text', e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>

        {/* D. QUICK NAVIGATION */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-3">
              <LinkIcon className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-extrabold font-heading text-[var(--text-primary)]">
                D. QUICK NAVIGATION LINKS
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-[var(--text-muted)]">Section Heading:</label>
              <input
                type="text"
                value={formData.quickNavigation?.heading || ''}
                onChange={(e) => updateNestedState('quickNavigation', 'heading', e.target.value)}
                className="p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
              />
            </div>
          </div>

          {/* Existing Links List */}
          <div className="space-y-3">
            {(formData.quickNavigation?.links || []).map((link, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="w-6 h-6 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] font-extrabold text-[var(--orange)]">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleUpdateLink(idx, 'label', e.target.value)}
                    placeholder="Link Label"
                    className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] flex-grow"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => handleUpdateLink(idx, 'url', e.target.value)}
                    placeholder="/route"
                    className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] w-36 sm:w-48"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-muted)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={link.enabled !== false}
                      onChange={(e) => handleUpdateLink(idx, 'enabled', e.target.checked)}
                      className="w-4 h-4 accent-[var(--orange)]"
                    />
                    <span>Active</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-muted)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={link.openInNewTab || false}
                      onChange={(e) => handleUpdateLink(idx, 'openInNewTab', e.target.checked)}
                      className="w-4 h-4 accent-[var(--orange)]"
                    />
                    <span>New Tab</span>
                  </label>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveLink(idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--orange)]/20 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveLink(idx, 1)}
                      disabled={idx === (formData.quickNavigation?.links?.length || 0) - 1}
                      className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--orange)]/20 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteLink(idx)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Link Bar */}
          <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs font-extrabold text-[var(--orange)] uppercase">ADD NEW LINK:</span>
            <input
              type="text"
              placeholder="Link Label (e.g. Gallery)"
              value={newLink.label}
              onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
              className="p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] flex-grow"
            />
            <input
              type="text"
              placeholder="URL Path (e.g. /activities)"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] w-40"
            />
            <button
              type="button"
              onClick={handleAddLink}
              className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Link</span>
            </button>
          </div>
        </div>

        {/* E. EVENT LOCATION & CONTACT */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-extrabold font-heading text-[var(--text-primary)]">
                E. EVENT LOCATION & CONTACT DETAILS
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-[var(--text-muted)]">Address Line 1:</label>
              <input
                type="text"
                value={formData.contact?.address?.line1 || ''}
                onChange={(e) => updateAddressState('line1', e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)]">Address Line 2:</label>
              <input
                type="text"
                value={formData.contact?.address?.line2 || ''}
                onChange={(e) => updateAddressState('line2', e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)]">City:</label>
              <input
                type="text"
                value={formData.contact?.address?.city || ''}
                onChange={(e) => updateAddressState('city', e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)]">Pincode:</label>
              <input
                type="text"
                value={formData.contact?.address?.pincode || ''}
                onChange={(e) => updateAddressState('pincode', e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)]">State:</label>
              <input
                type="text"
                value={formData.contact?.address?.state || ''}
                onChange={(e) => updateAddressState('state', e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
              />
            </div>
          </div>

          {/* Multiple Phone Numbers */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Contact Phone Numbers:</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {(formData.contact?.phoneNumbers || []).map((phone, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold">
                  <span>{phone}</span>
                  <button type="button" onClick={() => handleDeletePhone(idx)} className="text-red-500 hover:text-red-400">
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={newPhone}
                onChange={(e) => setNewPhone(formatPhoneInput(e.target.value))}
                maxLength={15}
                className="p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] w-48"
              />
              <button type="button" onClick={handleAddPhone} className="btn-secondary py-2 px-3 text-xs">
                + Add Phone
              </button>
            </div>
          </div>

          {/* Multiple Email Addresses */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Contact Email Addresses:</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {(formData.contact?.emails || []).map((email, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold">
                  <span>{email}</span>
                  <button type="button" onClick={() => handleDeleteEmail(idx)} className="text-red-500 hover:text-red-400">
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="contact@chinmayamissionadoni.org"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] w-64"
              />
              <button type="button" onClick={handleAddEmail} className="btn-secondary py-2 px-3 text-xs">
                + Add Email
              </button>
            </div>
          </div>

          {/* Optional Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)]">Google Maps URL (Optional):</label>
              <input
                type="text"
                value={formData.contact?.googleMapsUrl || ''}
                onChange={(e) => updateNestedState('contact', 'googleMapsUrl', e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)]">WhatsApp Number (Optional):</label>
              <input
                type="text"
                value={formData.contact?.whatsappNumber || ''}
                onChange={(e) => updateNestedState('contact', 'whatsappNumber', e.target.value)}
                placeholder="+919876543210"
                className="w-full p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)]">Website URL (Optional):</label>
              <input
                type="text"
                value={formData.contact?.websiteUrl || ''}
                onChange={(e) => updateNestedState('contact', 'websiteUrl', e.target.value)}
                placeholder="https://..."
                className="w-full p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>

        {/* F. MARATHON PLEDGE */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
            <Heart className="w-5 h-5 text-[var(--orange)]" />
            <h3 className="text-base font-extrabold font-heading text-[var(--text-primary)]">
              F. THE MARATHON PLEDGE CARD
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)]">Section Heading:</label>
              <input
                type="text"
                value={formData.pledge?.heading || ''}
                onChange={(e) => updateNestedState('pledge', 'heading', e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)]">Pledge Card Title:</label>
              <input
                type="text"
                value={formData.pledge?.title || ''}
                onChange={(e) => updateNestedState('pledge', 'title', e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-[var(--text-muted)]">Pledge Text / Description:</label>
              <textarea
                rows={2}
                value={formData.pledge?.description || ''}
                onChange={(e) => updateNestedState('pledge', 'description', e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
              />
            </div>
          </div>
        </div>

        {/* G. BOTTOM FOOTER */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
            <Settings className="w-5 h-5 text-purple-500" />
            <h3 className="text-base font-extrabold font-heading text-[var(--text-primary)]">
              G. BOTTOM FOOTER & COPYRIGHT
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)]">Copyright Text:</label>
              <input
                type="text"
                value={formData.bottomFooter?.copyrightText || ''}
                onChange={(e) => updateNestedState('bottomFooter', 'copyrightText', e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)]">Privacy Policy Label & Route:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.bottomFooter?.privacyPolicy?.label || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bottomFooter: {
                        ...prev.bottomFooter,
                        privacyPolicy: { ...prev.bottomFooter.privacyPolicy, label: e.target.value },
                      },
                    }))
                  }
                  className="w-1/2 p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                />
                <input
                  type="text"
                  value={formData.bottomFooter?.privacyPolicy?.url || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bottomFooter: {
                        ...prev.bottomFooter,
                        privacyPolicy: { ...prev.bottomFooter.privacyPolicy, url: e.target.value },
                      },
                    }))
                  }
                  className="w-1/2 p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)]">Terms & Conditions Label & Route:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.bottomFooter?.termsConditions?.label || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bottomFooter: {
                        ...prev.bottomFooter,
                        termsConditions: { ...prev.bottomFooter.termsConditions, label: e.target.value },
                      },
                    }))
                  }
                  className="w-1/2 p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                />
                <input
                  type="text"
                  value={formData.bottomFooter?.termsConditions?.url || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bottomFooter: {
                        ...prev.bottomFooter,
                        termsConditions: { ...prev.bottomFooter.termsConditions, url: e.target.value },
                      },
                    }))
                  }
                  className="w-1/2 p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* H. FOOTER APPEARANCE / SETTINGS */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
            <Palette className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-extrabold font-heading text-[var(--text-primary)]">
              H. FOOTER APPEARANCE & COLORS
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--text-muted)]">Background Color:</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.appearance?.backgroundColor || '#0B2340'}
                  onChange={(e) => updateNestedState('appearance', 'backgroundColor', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0"
                />
                <span className="text-xs font-mono text-[var(--text-primary)]">
                  {formData.appearance?.backgroundColor || '#0B2340'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--text-muted)]">Text Color:</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.appearance?.textColor || '#CBD5E1'}
                  onChange={(e) => updateNestedState('appearance', 'textColor', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0"
                />
                <span className="text-xs font-mono text-[var(--text-primary)]">
                  {formData.appearance?.textColor || '#CBD5E1'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--text-muted)]">Heading Color:</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.appearance?.headingColor || '#FFC107'}
                  onChange={(e) => updateNestedState('appearance', 'headingColor', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0"
                />
                <span className="text-xs font-mono text-[var(--text-primary)]">
                  {formData.appearance?.headingColor || '#FFC107'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--text-muted)]">Accent Color:</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.appearance?.accentColor || '#F4511E'}
                  onChange={(e) => updateNestedState('appearance', 'accentColor', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0"
                />
                <span className="text-xs font-mono text-[var(--text-primary)]">
                  {formData.appearance?.accentColor || '#F4511E'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="pt-4 flex justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-sm py-3 px-8 shadow-2xl"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Footer Changes'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default FooterManager;
