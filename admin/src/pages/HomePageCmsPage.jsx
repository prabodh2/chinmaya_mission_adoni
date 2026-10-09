import React, { useEffect, useState } from 'react';
import { adminHomepageService } from '../services/adminApi';
import {
  Layout,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Palette,
  Eye,
  Settings,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export const HomePageCmsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  // Main CMS State
  const [isEnabled, setIsEnabled] = useState(true);
  const [disabledTitle, setDisabledTitle] = useState('Website Updates In Progress');
  const [disabledMessage, setDisabledMessage] = useState(
    'The public homepage is currently undergoing scheduled updates. Please check back soon!'
  );
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState('SECTIONS'); // SECTIONS | THEME | MAINTENANCE

  // Theme Settings
  const [theme, setTheme] = useState({
    primaryColor: '#0B2340',
    secondaryColor: '#FF7A00',
    accentColor: '#00B4D8',
    backgroundColor: '#FFFFFF',
    textColor: '#0B2340',
  });

  const fetchHomepage = async () => {
    setLoading(true);
    try {
      const res = await adminHomepageService.getAdminHomepage();
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        setIsEnabled(d.isEnabled !== false);
        setDisabledTitle(d.disabledTitle || 'Website Updates In Progress');
        setDisabledMessage(d.disabledMessage || '');
        if (d.sections) setSections(d.sections);
        if (d.theme) setTheme(d.theme);
      }
    } catch (err) {
      console.error('Failed to load homepage config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepage();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setFeedback({ type: null, message: '' });
    try {
      const res = await adminHomepageService.updateHomepage({
        isEnabled,
        disabledTitle,
        disabledMessage,
        theme,
        sections,
      });
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'Homepage CMS configuration published successfully!',
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save homepage settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSection = (idx) => {
    const updated = [...sections];
    updated[idx].isEnabled = !updated[idx].isEnabled;
    setSections(updated);
  };

  const handleMoveSection = (idx, direction) => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sections.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...sections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSections(updated);
  };

  const handleDeleteSection = (idx) => {
    if (!window.confirm('Are you sure you want to remove this section from the homepage?')) return;
    const updated = sections.filter((_, i) => i !== idx);
    setSections(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black tracking-widest text-[#00B4D8] uppercase">
            PUBLIC HOMEPAGE CMS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            HOME PAGE BUILDER & THEME
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium">
            Customize homepage section visibility, sequence order, maintenance mode, and color themes
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="btn-primary text-xs py-2.5 px-5"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
          </button>
          <button
            onClick={fetchHomepage}
            disabled={loading}
            className="btn-secondary text-xs py-2.5 px-3"
            title="Reload Config"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
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

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#1C2541] border border-white/10">
        {[
          { id: 'SECTIONS', label: 'Page Sections' },
          { id: 'THEME', label: 'Color Palette & Styling' },
          { id: 'MAINTENANCE', label: 'Maintenance & Status' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#00B4D8] text-white shadow-md'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#243054]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: SECTIONS MANAGER */}
      {activeTab === 'SECTIONS' && (
        <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-black font-heading text-white uppercase tracking-wider">
              Homepage Layout Sections ({sections.length})
            </h3>
            <span className="text-[11px] text-[#94A3B8]">
              Use arrows to re-order sections
            </span>
          </div>

          {sections.length > 0 ? (
            <div className="space-y-3">
              {sections.map((sec, idx) => (
                <div
                  key={sec._id || sec.id || idx}
                  className="p-4 rounded-2xl bg-[#0B132B] border border-white/10 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#243054] text-white flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-black text-white text-sm">
                        {sec.title || sec.type || `Section ${idx + 1}`}
                      </h4>
                      <span className="text-[10px] text-[#00B4D8] font-mono">
                        Type: {sec.type || 'Custom'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Move Up */}
                    <button
                      onClick={() => handleMoveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-[#243054] text-white hover:bg-[#00B4D8] disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => handleMoveSection(idx, 'down')}
                      disabled={idx === sections.length - 1}
                      className="p-1.5 rounded-lg bg-[#243054] text-white hover:bg-[#00B4D8] disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle Status */}
                    <button
                      onClick={() => handleToggleSection(idx)}
                      className={`px-3 py-1 rounded-lg font-bold text-[10px] ${
                        sec.isEnabled !== false
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-zinc-500/15 text-zinc-400'
                      }`}
                    >
                      {sec.isEnabled !== false ? 'Visible' : 'Hidden'}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteSection(idx)}
                      className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white"
                      title="Delete Section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#64748B] text-center py-6">
              Default system sections active on homepage.
            </p>
          )}
        </div>
      )}

      {/* TAB 2: THEME CUSTOMIZER */}
      {activeTab === 'THEME' && (
        <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-5 text-xs">
          <h3 className="text-sm font-black font-heading text-white uppercase tracking-wider border-b border-white/10 pb-3">
            Brand Color Palette Tokens
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.primaryColor || '#0B2340'}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.primaryColor || '#0B2340'}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-mono text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Secondary (Orange Glow)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.secondaryColor || '#FF7A00'}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.secondaryColor || '#FF7A00'}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-mono text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Accent Color (Cyan)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.accentColor || '#00B4D8'}
                  onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.accentColor || '#00B4D8'}
                  onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-mono text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Background Tint
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.backgroundColor || '#FFFFFF'}
                  onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.backgroundColor || '#FFFFFF'}
                  onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-mono text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MAINTENANCE STATUS */}
      {activeTab === 'MAINTENANCE' && (
        <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-5 text-xs">
          <h3 className="text-sm font-black font-heading text-white uppercase tracking-wider border-b border-white/10 pb-3">
            Public Homepage Accessibility
          </h3>

          <div className="p-4 rounded-2xl bg-[#0B132B] border border-white/10 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white text-sm">Homepage Live Status</h4>
              <p className="text-[#94A3B8] text-xs">
                When turned off, visitors will see the maintenance message configured below.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#243054] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00B4D8]"></div>
            </label>
          </div>

          {!isEnabled && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="block font-bold text-white uppercase mb-1">
                  Maintenance Screen Title
                </label>
                <input
                  type="text"
                  value={disabledTitle}
                  onChange={(e) => setDisabledTitle(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
                />
              </div>

              <div>
                <label className="block font-bold text-white uppercase mb-1">
                  Maintenance Message
                </label>
                <textarea
                  rows="3"
                  value={disabledMessage}
                  onChange={(e) => setDisabledMessage(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePageCmsPage;
