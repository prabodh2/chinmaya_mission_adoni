import React, { useState } from 'react';
import { contactService } from '../services/api';
import { MapPin, Phone, Mail, Send, CheckCircle, Flame, MessageSquare, Clock, ExternalLink } from 'lucide-react';
import { formatPhoneInput } from '../utils/phoneUtils';

export const LetsConnectPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

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
        setFormData({ fullName: '', email: '', phone: '', message: '' });
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
    <div className="min-h-screen py-16 px-4 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-xs tracking-widest uppercase border border-[var(--orange)]/30">
          <Flame className="w-4 h-4" />
          CONNECT & VOLUNTEER
        </span>
        <h1 className="text-4xl sm:text-5xl font-black font-heading text-[var(--text-primary)]">
          LET'S CONNECT <span className="text-[var(--orange)]">WITH ADONI</span>
        </h1>
        <p className="text-base text-[var(--text-muted)] font-medium">
          Have questions regarding marathon registration, school bulk participation, or volunteer opportunities? Reach out to our Chinmaya Mission Adoni team.
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
              <span>Message submitted successfully! Thank you for connecting with us.</span>
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
                placeholder="e.g. XYZ"
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
                  placeholder="xyz@example.com"
                  className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhoneInput(e.target.value) })}
                  placeholder="+91 98765 43210"
                  maxLength={15}
                  className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                Your Message / Inquiry *
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
              <span>{status.loading ? 'SUBMITTING...' : 'JOIN THE MOVEMENT'}</span>
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
                <div>
                  <h4 className="font-extrabold text-[var(--text-primary)]">Ashram Headquarters</h4>
                  <p>Chinmaya Mission Ashrama, Arts College Road, Adoni - 518301, Andhra Pradesh, India</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[var(--cyan)]/15 text-[var(--cyan)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[var(--text-primary)]">Helpline & Registration Desk</h4>
                  <p>+91 98765 43210 • +91 85122 34567</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[var(--green)]/15 text-[var(--green)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[var(--text-primary)]">Official Email</h4>
                  <p>contact@chinmayamissionadoni.org</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Card with Direct Google Maps Link */}
          <a
            href="https://maps.app.goo.gl/vU75mmpoXaYy68WK6"
            target="_blank"
            rel="noopener noreferrer"
            className="block group rounded-3xl overflow-hidden border-2 border-[var(--orange)]/40 hover:border-[var(--orange)] shadow-2xl relative h-72 text-decoration-none cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            title="Click to open Chinmaya Mission Adoni on Google Maps"
          >
            {/* Map Preview Image */}
            <img
              src="/assets/images/map-preview.jpg"
              alt="Chinmaya Mission Adoni Map Location"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Dark Gradient Overlay for Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B2340] via-[#0B2340]/75 to-black/50 group-hover:via-[#0B2340]/65 transition-colors" />

            {/* Overlay Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6 text-white space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[var(--orange)]/20 border border-[var(--orange)]/40 backdrop-blur-md flex items-center justify-center text-[var(--orange)] group-hover:bg-[var(--orange)] group-hover:text-white transition-colors shadow-lg">
                <MapPin className="w-7 h-7 animate-bounce" />
              </div>

              <div>
                <h4 className="text-xl font-black font-heading text-white tracking-wide">
                  ADONI, ANDHRA PRADESH
                </h4>
                <p className="text-xs text-slate-300 font-semibold mt-1">
                  Chinmaya Mission Adoni • Arts College Road
                </p>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--orange)] text-white text-xs font-extrabold shadow-xl group-hover:bg-[#FF7043] transition-colors">
                  <span>OPEN IN GOOGLE MAPS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </a>

        </div>

      </div>

    </div>
  );
};
