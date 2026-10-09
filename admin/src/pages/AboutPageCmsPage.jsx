import React, { useEffect, useState } from 'react';
import { adminContentService } from '../services/adminApi';
import { Save, RefreshCw, CheckCircle, AlertTriangle, Settings, FileText } from 'lucide-react';

export const AboutPageCmsPage = () => {
  const [form, setForm] = useState({
    hero: { title: '', subtitle: '', intro: '', imageUrl: '' },
    whoWeAre: { p1: '', p2: '' },
    chykSection: { imageUrl: '' },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await adminContentService.getContent('about_page');
      if (res.data?.success && res.data?.data) {
        setForm(res.data.data);
      }
    } catch (err) {
      console.warn('Using default about structure');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: null, message: '' });

    try {
      const res = await adminContentService.updateContent('about_page', form);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'About Page CMS updated and published live!',
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to update About Page content.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black tracking-widest text-[#00B4D8] uppercase">
            PUBLIC INFORMATION CMS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            ABOUT PAGE CMS
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium">
            Edit the mission statement, organization history, and hero copy
          </p>
        </div>

        <button
          onClick={fetchContent}
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
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-4 text-xs">
          <h3 className="text-sm font-black font-heading text-[#00B4D8] uppercase tracking-wider border-b border-white/10 pb-2">
            1. Hero Header Section
          </h3>

          <div>
            <label className="block font-bold text-white uppercase mb-1">
              Hero Title
            </label>
            <input
              type="text"
              value={form.hero?.title || ''}
              onChange={(e) => setForm({ ...form, hero: { ...form.hero, title: e.target.value } })}
              placeholder="About Chinmaya Mission Adoni"
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1">
              Hero Subtitle / Tagline
            </label>
            <input
              type="text"
              value={form.hero?.subtitle || ''}
              onChange={(e) => setForm({ ...form, hero: { ...form.hero, subtitle: e.target.value } })}
              placeholder="Empowering Youth • Promoting Values • Building Healthy Communities"
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1">
              Introductory Paragraph
            </label>
            <textarea
              rows="3"
              value={form.hero?.intro || ''}
              onChange={(e) => setForm({ ...form, hero: { ...form.hero, intro: e.target.value } })}
              placeholder="Introduction to the anti-drug movement and vision..."
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1">
              Hero Banner Image URL
            </label>
            <input
              type="text"
              value={form.hero?.imageUrl || ''}
              onChange={(e) => setForm({ ...form, hero: { ...form.hero, imageUrl: e.target.value } })}
              placeholder="https://res.cloudinary.com/..."
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>
        </div>

        {/* Who We Are Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-4 text-xs">
          <h3 className="text-sm font-black font-heading text-[#FF7B00] uppercase tracking-wider border-b border-white/10 pb-2">
            2. "Who We Are" Mission Narrative
          </h3>

          <div>
            <label className="block font-bold text-white uppercase mb-1">
              Paragraph 1
            </label>
            <textarea
              rows="4"
              value={form.whoWeAre?.p1 || ''}
              onChange={(e) => setForm({ ...form, whoWeAre: { ...form.whoWeAre, p1: e.target.value } })}
              placeholder="First narrative paragraph about Chinmaya Mission Adoni..."
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1">
              Paragraph 2
            </label>
            <textarea
              rows="4"
              value={form.whoWeAre?.p2 || ''}
              onChange={(e) => setForm({ ...form, whoWeAre: { ...form.whoWeAre, p2: e.target.value } })}
              placeholder="Second narrative paragraph about youth leadership and fitness..."
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full justify-center py-3 text-xs font-bold"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing Changes...' : 'Save About Page Content'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutPageCmsPage;
