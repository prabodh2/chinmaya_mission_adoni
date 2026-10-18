import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contactService, webContentService } from '../services/api';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  Flame,
  MessageSquare,
  Clock,
  ExternalLink,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';
import { formatPhoneInput } from '../utils/phoneUtils';

export const LetsConnectPage = () => {
  const { user, isAuthenticated } = useAuth();

  const [pageData, setPageData] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_cms_chinmaya_lets_connect');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    webContentService
      .getPublicPage('chinmaya', 'lets-connect')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setPageData(res.data.data);
          try {
            localStorage.setItem('cached_cms_chinmaya_lets_connect', JSON.stringify(res.data.data));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const f = pageData?.fieldsMap || {};

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    message: '',
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || (user.phone ? formatPhoneInput(user.phone) : ''),
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await contactService.submitMessage(formData);
      if (res.data?.success) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({
          fullName: user?.fullName || '',
          email: user?.email || '',
          phone: user?.phone ? formatPhoneInput(user.phone) : '',
          category: 'General Inquiry',
          message: '',
        });
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Failed to send message',
      });
    }
  };

  return (
    <div className="min-h-screen pt-2 sm:pt-4 pb-14 px-4 max-w-7xl mx-auto space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2.5">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-xs tracking-widest uppercase border border-[var(--orange)]/30">
          <Flame className="w-4 h-4" />
          {f.contact_info?.eyebrow || 'CONNECT & VOLUNTEER'}
        </span>
        <h1 className="text-4xl sm:text-5xl font-black font-heading text-[var(--text-primary)] leading-tight">
          <span>{f.contact_info?.heading || "LET'S CONNECT WITH"}</span>
          <span className="block text-[var(--orange)] mt-1 sm:mt-2">CHINMAYA MISSION</span>
        </h1>
        <p className="text-base text-[var(--text-muted)] font-medium">
          {f.contact_info?.subtitle ? f.contact_info.subtitle.replace(/,\s*Adoni/gi, '') : 'Have questions regarding marathon registration, volunteering opportunities, youth programs, or community activities? Reach out to our Chinmaya Mission team.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Form */}
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-[var(--border-color)] shadow-2xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold font-heading text-[var(--text-primary)]">
              JOIN THE MOVEMENT
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Fill out the form below and our volunteer coordination team will get in touch.
            </p>
          </div>

          {status.success && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 font-extrabold text-xs flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Message submitted successfully! Our team will contact you shortly.</span>
            </div>
          )}

          {status.error && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 font-extrabold text-xs">
              {status.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar"
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ramesh@example.com"
                  className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Contact Number *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-[var(--text-muted)] border-r border-[var(--border-color)] pr-2.5">
                    <Phone className="w-4 h-4 text-[var(--orange)]" />
                    <span className="text-xs font-bold text-[var(--text-primary)]">+91</span>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: formatPhoneInput(e.target.value) })}
                    placeholder="98765 43210"
                    maxLength={12}
                    className="w-full pl-20 pr-4 py-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                Inquiry / Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Volunteering & Event Help">Volunteering & Event Help</option>
                <option value="Marathon Registration Inquiry">Marathon Registration Inquiry</option>
                <option value="Youth Programs & CHYK">Youth Programs & CHYK</option>
                <option value="Spiritual Classes & Discourses">Spiritual Classes & Discourses</option>
                <option value="Community Service">Community Service Offerings</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                Your Message *
              </label>
              <textarea
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we assist you or how would you like to volunteer?"
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="btn-primary w-full justify-center text-sm py-3.5"
            >
              <Send className="w-4 h-4" />
              <span>{status.loading ? 'SUBMITTING...' : 'SEND MESSAGE'}</span>
            </button>
          </form>
        </div>

        {/* Location & Details Side */}
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-[var(--border-color)] shadow-xl space-y-6">
            <h3 className="text-xl font-extrabold font-heading text-[var(--text-primary)]">
              ORGANIZATION DETAILS
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-[var(--text-muted)] font-medium">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  {f.contact_info?.address && !f.contact_info.address.includes('Chinmaya Mission Cultural Complex') ? (
                    f.contact_info.address.split('\n').filter(Boolean).map((line, idx) => (
                      <p key={idx} className="m-0 leading-normal">{line}</p>
                    ))
                  ) : (
                    <>
                      <p className="m-0 leading-normal">Chinmaya Cultural Complex,</p>
                      <p className="m-0 leading-normal">Near Arts College Road,</p>
                      <p className="m-0 leading-normal">Adoni - 518301.</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[var(--cyan)]/15 text-[var(--cyan)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p>{f.contact_info?.phone || '+91 94402 85934 / +91 98490 12345'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p>{f.contact_info?.email || 'chinmayamissionadoni@gmail.com'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetsConnectPage;
