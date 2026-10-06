import React, { useEffect, useState } from 'react';
import { homepageService, bannerService } from '../../services/api';
import { applyDynamicTheme, defaultPosterTheme } from '../../utils/themeHelper';
import { SectionRenderer } from '../../components/homepage/SectionRenderer';
import {
  Shield,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  Palette,
  Layout,
  Wrench,
  Save,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Upload,
  Sparkles,
  Layers,
  Monitor,
} from 'lucide-react';

export const HomePageManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Main CMS State
  const [isEnabled, setIsEnabled] = useState(true);
  const [disabledTitle, setDisabledTitle] = useState('Website Updates In Progress');
  const [disabledMessage, setDisabledMessage] = useState(
    'The public homepage is currently undergoing scheduled updates. Please check back soon!'
  );
  const [disabledImage, setDisabledImage] = useState('');
  const [disabledContactButton, setDisabledContactButton] = useState(true);
  const [disabledContactUrl, setDisabledContactUrl] = useState('/lets-connect');

  // Theme State
  const [theme, setTheme] = useState(defaultPosterTheme);

  // Sections State
  const [sections, setSections] = useState([]);

  // Active View Tab: EDITOR vs PREVIEW
  const [activeTab, setActiveTab] = useState('EDITOR'); // 'EDITOR' | 'PREVIEW' | 'THEME' | 'SETTINGS'

  // Section Modal State
  const [editingSection, setEditingSection] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // New Section Form State
  const [newSection, setNewSection] = useState({
    type: 'custom',
    title: '',
    subtitle: '',
    description: '',
    badgeText: '',
    primaryButtonText: '',
    primaryButtonLink: '',
    secondaryButtonText: '',
    secondaryButtonLink: '',
    imageUrl: '',
    isEnabled: true,
  });

  useEffect(() => {
    loadAdminHomepage();
  }, []);

  const loadAdminHomepage = () => {
    setLoading(true);
    homepageService
      .getAdminHomepage()
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          const d = res.data.data;
          setIsEnabled(d.isEnabled ?? true);
          setDisabledTitle(d.disabledTitle || 'Website Updates In Progress');
          setDisabledMessage(d.disabledMessage || 'The public homepage is currently undergoing scheduled updates.');
          setDisabledImage(d.disabledImage || '');
          setDisabledContactButton(d.disabledContactButton ?? true);
          setDisabledContactUrl(d.disabledContactUrl || '/lets-connect');
          
          if (d.theme) {
            setTheme(d.theme);
            applyDynamicTheme(d.theme);
          }
          if (Array.isArray(d.sections)) {
            setSections([...d.sections].sort((a, b) => a.order - b.order));
          }
        }
      })
      .catch(() => {
        showFeedback('error', 'Failed to load homepage configuration.');
      })
      .finally(() => setLoading(false));
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  // Save All Changes
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const payload = {
        isEnabled,
        disabledTitle,
        disabledMessage,
        disabledImage,
        disabledContactButton,
        disabledContactUrl,
        theme,
        sections: sections.map((sec, idx) => ({ ...sec, order: idx + 1 })),
      };

      const res = await homepageService.updateHomepage(payload);
      if (res.data?.success) {
        showFeedback('success', 'Homepage configuration updated successfully!');
        applyDynamicTheme(theme);
        try {
          localStorage.setItem('cms_homepage_config', JSON.stringify(res.data.data || payload));
          localStorage.setItem('cms_last_updated', Date.now().toString());
          window.dispatchEvent(new Event('cms_updated'));
        } catch (_) {}
      }
    } catch (err) {
      showFeedback('error', 'Failed to save homepage settings.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle Global ON/OFF Status
  const handleToggleGlobalStatus = async () => {
    const nextStatus = !isEnabled;
    setIsEnabled(nextStatus);
    try {
      await homepageService.toggleStatus(nextStatus);
      showFeedback('success', `Homepage Visibility turned ${nextStatus ? 'ON' : 'OFF'}`);
    } catch (err) {
      setIsEnabled(!nextStatus);
      showFeedback('error', 'Failed to change global homepage status.');
    }
  };

  const saveSectionsToBackend = async (newSectionsList) => {
    try {
      const payload = {
        isEnabled,
        disabledTitle,
        disabledMessage,
        disabledImage,
        disabledContactButton,
        disabledContactUrl,
        theme,
        sections: newSectionsList.map((sec, idx) => ({ ...sec, order: idx + 1 })),
      };
      await homepageService.updateHomepage(payload);
    } catch (err) {
      console.error('Failed to auto-save sections to server:', err);
    }
  };

  // Section Handlers
  const handleToggleSection = (sectionId) => {
    const updated = sections.map((sec) =>
      sec.sectionId === sectionId ? { ...sec, isEnabled: !sec.isEnabled } : sec
    );
    setSections(updated);
    saveSectionsToBackend(updated);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newSecs = [...sections];
    const temp = newSecs[index - 1];
    newSecs[index - 1] = newSecs[index];
    newSecs[index] = temp;
    setSections(newSecs);
    saveSectionsToBackend(newSecs);
  };

  const handleMoveDown = (index) => {
    if (index === sections.length - 1) return;
    const newSecs = [...sections];
    const temp = newSecs[index + 1];
    newSecs[index + 1] = newSecs[index];
    newSecs[index] = temp;
    setSections(newSecs);
    saveSectionsToBackend(newSecs);
  };

  const handleDeleteSection = (sectionId) => {
    const updated = sections.filter((s) => s.sectionId !== sectionId);
    setSections(updated);
    setDeleteConfirmId(null);
    saveSectionsToBackend(updated);
    showFeedback('success', 'Section removed from homepage and saved!');
  };

  const handleAddSectionSubmit = async (e) => {
    e.preventDefault();
    const newSecObj = {
      ...newSection,
      sectionId: `section-${Date.now()}`,
      order: sections.length + 1,
    };
    const updated = [...sections, newSecObj];
    setSections(updated);
    setIsAddModalOpen(false);
    setNewSection({
      type: 'custom',
      title: '',
      subtitle: '',
      description: '',
      badgeText: '',
      primaryButtonText: '',
      primaryButtonLink: '',
      secondaryButtonText: '',
      secondaryButtonLink: '',
      imageUrl: '',
      isEnabled: true,
    });
    await saveSectionsToBackend(updated);
    showFeedback('success', 'New homepage section created and saved live!');
  };

  const handleUpdateSectionSubmit = async (e) => {
    e.preventDefault();
    if (!editingSection) return;

    const updated = sections.map((s) =>
      s.sectionId === editingSection.sectionId ? editingSection : s
    );
    setSections(updated);
    setEditingSection(null);
    await saveSectionsToBackend(updated);
    showFeedback('success', 'Section updated and saved to live homepage!');
  };

  // Image Upload Helper for Forms
  const handleFileUpload = async (file, targetSetter) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', 'Homepage Asset Image');
      formData.append('bannerType', 'HORIZONTAL');

      const res = await bannerService.uploadBanner(formData);
      if (res.data?.success && res.data?.data?.imageUrl) {
        targetSetter(res.data.data.imageUrl);
        showFeedback('success', 'Image uploaded successfully!');
      }
    } catch (err) {
      showFeedback('error', 'Image upload failed.');
    }
  };

  // Color Reset Handler
  const handleResetTheme = () => {
    setTheme(defaultPosterTheme);
    applyDynamicTheme(defaultPosterTheme);
    showFeedback('success', 'Theme colors reset to default Anti-Drug Marathon Poster palette.');
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[var(--cyan)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-[var(--text-muted)]">Loading Home Page CMS Manager...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Toast Feedback Notification */}
      {feedback.message && (
        <div
          className={`p-4 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-xl ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-500'
              : 'bg-red-500/15 border border-red-500/30 text-red-500'
          }`}
        >
          <span className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {feedback.message}
          </span>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="font-bold">
            [X]
          </button>
        </div>
      )}

      {/* TOP HEADER: GLOBAL HOMEPAGE VISIBILITY STATUS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-secondary)] border-2 border-[var(--cyan)]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
              isEnabled ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-red-500 shadow-red-500/30'
            }`}
          >
            {isEnabled ? <Eye className="w-7 h-7" /> : <EyeOff className="w-7 h-7" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  isEnabled
                    ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                    : 'bg-red-500/15 text-red-500 border border-red-500/30'
                }`}
              >
                {isEnabled ? '🟢 HOMEPAGE IS ONLINE' : '🔴 HOMEPAGE IS OFFLINE (MAINTENANCE)'}
              </span>
            </div>
            <h2 className="text-2xl font-black font-heading text-[var(--text-primary)]">
              HOMEPAGE VISIBILITY CONTROL
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-semibold">
              {isEnabled
                ? 'The public website is fully accessible to all visitors.'
                : 'The public website is currently displaying the maintenance unavailable screen.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleGlobalStatus}
            className={`px-6 py-3.5 rounded-2xl font-extrabold text-xs tracking-wider uppercase shadow-xl transition-all ${
              isEnabled
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
            }`}
          >
            {isEnabled ? 'TURN HOMEPAGE OFF' : 'TURN HOMEPAGE ON'}
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="btn-primary text-xs py-3.5 px-6 shadow-2xl bg-gradient-to-r from-[var(--cyan)] to-blue-600 text-white"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SAVING...' : 'SAVE ALL CHANGES'}</span>
          </button>
        </div>
      </div>

      {/* ADMIN CMS NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'EDITOR', label: '1. Sections & Content', icon: Layout },
            { id: 'THEME', label: '2. Website Appearance & Colors', icon: Palette },
            { id: 'SETTINGS', label: '3. Maintenance Mode Settings', icon: Wrench },
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-[var(--cyan)] text-white shadow-lg'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Preview Toggle Button */}
        <button
          onClick={() => setActiveTab(activeTab === 'PREVIEW' ? 'EDITOR' : 'PREVIEW')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-all ${
            activeTab === 'PREVIEW'
              ? 'bg-[var(--orange)] text-white border-[var(--orange)] shadow'
              : 'bg-[var(--bg-secondary)] text-[var(--orange)] border-[var(--orange)]/40 hover:bg-[var(--orange)]/10'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span>{activeTab === 'PREVIEW' ? 'CLOSE LIVE PREVIEW' : 'LIVE PREVIEW HOMEPAGE'}</span>
        </button>
      </div>

      {/* TAB 1: SECTIONS & CONTENT EDITOR */}
      {activeTab === 'EDITOR' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold font-heading text-[var(--text-primary)]">
                HOMEPAGE SECTIONS ({sections.length})
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-semibold">
                Manage section content, ordering, and visibility.
              </p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary text-xs py-2.5 px-5"
            >
              <Plus className="w-4 h-4" />
              <span>+ ADD NEW SECTION</span>
            </button>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            {sections.map((sec, idx) => (
              <div
                key={sec.sectionId || sec._id || idx}
                className={`p-6 rounded-3xl bg-[var(--bg-secondary)] border-2 transition-all shadow-lg ${
                  sec.isEnabled ? 'border-[var(--border-color)]' : 'border-red-500/30 opacity-60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Section Info */}
                  <div className="space-y-1 text-left flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[var(--cyan)]/15 text-[var(--cyan)] text-[10px] font-extrabold uppercase">
                        #{idx + 1} • {sec.type.toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          sec.isEnabled
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : 'bg-red-500/15 text-red-500'
                        }`}
                      >
                        {sec.isEnabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>

                    <h4 className="text-lg font-black font-heading text-[var(--text-primary)]">
                      {sec.title || 'Untitled Section'}
                    </h4>
                    {sec.subtitle && (
                      <p className="text-xs font-bold text-[var(--orange)]">{sec.subtitle}</p>
                    )}
                    {sec.description && (
                      <p className="text-xs text-[var(--text-muted)] line-clamp-2 max-w-2xl">
                        {sec.description}
                      </p>
                    )}
                  </div>

                  {/* Right Section Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    {/* Reorder Buttons */}
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="p-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] disabled:opacity-30 hover:bg-[var(--cyan)] hover:text-white transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === sections.length - 1}
                      className="p-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] disabled:opacity-30 hover:bg-[var(--cyan)] hover:text-white transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Enable / Disable Toggle */}
                    <button
                      onClick={() => handleToggleSection(sec.sectionId)}
                      className={`px-3 py-2 rounded-xl text-xs font-extrabold ${
                        sec.isEnabled
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                      }`}
                    >
                      {sec.isEnabled ? 'ON' : 'OFF'}
                    </button>

                    {/* Edit Section */}
                    <button
                      onClick={() => setEditingSection({ ...sec })}
                      className="p-2 rounded-xl bg-[var(--cyan)]/15 text-[var(--cyan)] hover:bg-[var(--cyan)] hover:text-white transition-colors"
                      title="Edit Section"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Delete Section */}
                    <button
                      onClick={() => setDeleteConfirmId(sec.sectionId)}
                      className="p-2 rounded-xl bg-red-500/15 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: WEBSITE APPEARANCE & COLORS */}
      {activeTab === 'THEME' && (
        <div className="glass-card p-8 rounded-3xl border border-[var(--border-color)] max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
            <div>
              <h3 className="text-xl font-extrabold font-heading text-[var(--text-primary)]">
                WEBSITE COLOR SCHEME (CSS VARIABLES)
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-semibold">
                Customize colors across the public homepage dynamically.
              </p>
            </div>

            <button
              onClick={handleResetTheme}
              className="btn-secondary py-2 px-4 text-xs border-[var(--yellow)] text-[var(--yellow)]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET TO POSTER THEME</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: 'primaryColor', label: 'Primary Brand Color' },
              { key: 'secondaryColor', label: 'Secondary Background' },
              { key: 'accentColor', label: 'Accent / Marathon Orange' },
              { key: 'backgroundColor', label: 'Main Page Background' },
              { key: 'textColor', label: 'Primary Text Color' },
              { key: 'buttonColor', label: 'Primary Button BG' },
              { key: 'buttonHoverColor', label: 'Button Hover Color' },
              { key: 'cardBackgroundColor', label: 'Card Background' },
              { key: 'headingColor', label: 'Heading Text Color' },
            ].map((colorItem) => (
              <div key={colorItem.key} className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-2">
                <label className="block text-xs font-extrabold text-[var(--text-primary)] uppercase">
                  {colorItem.label}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme[colorItem.key] || '#000000'}
                    onChange={(e) => {
                      const newT = { ...theme, [colorItem.key]: e.target.value };
                      setTheme(newT);
                      applyDynamicTheme(newT);
                    }}
                    className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent"
                  />
                  <input
                    type="text"
                    value={theme[colorItem.key] || '#000000'}
                    onChange={(e) => {
                      const newT = { ...theme, [colorItem.key]: e.target.value };
                      setTheme(newT);
                      applyDynamicTheme(newT);
                    }}
                    className="flex-grow py-2 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-mono font-bold text-[var(--text-primary)] uppercase"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="btn-primary text-xs py-3 px-8"
            >
              <span>{saving ? 'SAVING...' : 'SAVE THEME COLORS'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: MAINTENANCE MODE SETTINGS */}
      {activeTab === 'SETTINGS' && (
        <div className="glass-card p-8 rounded-3xl border border-[var(--border-color)] max-w-2xl mx-auto space-y-6">
          <h3 className="text-xl font-extrabold font-heading text-[var(--text-primary)]">
            MAINTENANCE & MAINTENANCE SCREEN SETTINGS
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)] uppercase">
                Maintenance Heading / Title
              </label>
              <input
                type="text"
                value={disabledTitle}
                onChange={(e) => setDisabledTitle(e.target.value)}
                placeholder="Website Updates In Progress"
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-bold text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)] uppercase">
                Maintenance Notice Message
              </label>
              <textarea
                rows={3}
                value={disabledMessage}
                onChange={(e) => setDisabledMessage(e.target.value)}
                placeholder="The public homepage is currently undergoing scheduled updates."
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)] uppercase">
                Banner Image URL (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={disabledImage}
                  onChange={(e) => setDisabledImage(e.target.value)}
                  placeholder="https://..."
                  className="flex-grow py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                />
                <label className="btn-secondary py-3 px-4 text-xs cursor-pointer flex-shrink-0">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files[0], setDisabledImage)}
                  />
                </label>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-[var(--text-primary)] text-sm">CONTACT BUTTON ON MAINTENANCE SCREEN</h4>
                <p className="text-[11px] text-[var(--text-muted)]">Allow users to contact organizers when homepage is OFF</p>
              </div>
              <button
                type="button"
                onClick={() => setDisabledContactButton(!disabledContactButton)}
                className={`py-2 px-5 rounded-full font-extrabold text-xs ${
                  disabledContactButton ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}
              >
                {disabledContactButton ? 'SHOW BUTTON' : 'HIDE BUTTON'}
              </button>
            </div>

            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="btn-primary w-full justify-center py-3.5 text-xs"
            >
              <span>{saving ? 'SAVING SETTINGS...' : 'SAVE MAINTENANCE SETTINGS'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE PREVIEW HOMEPAGE PANE */}
      {activeTab === 'PREVIEW' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[var(--orange)]/15 border border-[var(--orange)]/30 flex items-center justify-between">
            <span className="text-xs font-extrabold text-[var(--orange)] uppercase">
              LIVE HOMEPAGE PREVIEW (WITH CURRENT STYLES & SECTIONS)
            </span>
            <button
              onClick={() => setActiveTab('EDITOR')}
              className="btn-secondary py-1.5 px-3 text-xs"
            >
              BACK TO EDITOR
            </button>
          </div>

          <div className="border-4 border-[var(--cyan)] rounded-3xl overflow-hidden shadow-2xl bg-[var(--bg-primary)]">
            <div className="p-3 bg-[var(--bg-dark-section)] text-white text-xs font-mono font-bold flex items-center justify-between px-6">
              <span>https://anti-drug-marathon-adoni.org/ (Published Preview)</span>
              <span>STATUS: {isEnabled ? 'PUBLISHED ONLINE' : 'OFFLINE MODE'}</span>
            </div>

            <div className="min-h-[80vh] p-2">
              {isEnabled ? (
                sections
                  .filter((s) => s.isEnabled)
                  .map((sec) => (
                    <SectionRenderer key={sec.sectionId || sec._id} section={sec} />
                  ))
              ) : (
                <div className="py-16 text-center space-y-4 max-w-xl mx-auto">
                  <Wrench className="w-12 h-12 text-[var(--orange)] mx-auto" />
                  <h3 className="text-2xl font-bold">{disabledTitle}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{disabledMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW SECTION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h4 className="text-lg font-black font-heading text-[var(--text-primary)]">
                ADD NEW HOMEPAGE SECTION
              </h4>
              <button onClick={() => setIsAddModalOpen(false)} className="text-red-500 font-bold text-xs">
                CLOSE [X]
              </button>
            </div>

            <form onSubmit={handleAddSectionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-[var(--text-primary)]">Section Type</label>
                <select
                  value={newSection.type}
                  onChange={(e) => setNewSection({ ...newSection, type: e.target.value })}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-bold text-[var(--text-primary)]"
                >
                  <option value="hero">Hero Headline & Banner</option>
                  <option value="marathon">Marathon Info & Countdown</option>
                  <option value="about">About / Highlight Box</option>
                  <option value="pillars">Six Pillars Grid</option>
                  <option value="activities">Activities Showcase</option>
                  <option value="faq">FAQ Accordion</option>
                  <option value="cta">Registration Call To Action</option>
                  <option value="custom">Generic Custom Block</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-[var(--text-primary)]">Section Title</label>
                <input
                  type="text"
                  required
                  value={newSection.title}
                  onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                  placeholder="e.g. JOIN THE YOUTH MOVEMENT"
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-[var(--text-primary)]">Subtitle / Slogan</label>
                <input
                  type="text"
                  value={newSection.subtitle}
                  onChange={(e) => setNewSection({ ...newSection, subtitle: e.target.value })}
                  placeholder="e.g. YOUR LIFE. YOUR CHOICE."
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-[var(--text-primary)]">Description Text</label>
                <textarea
                  rows={3}
                  value={newSection.description}
                  onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                  placeholder="Enter detailed section description..."
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-[var(--text-primary)]">Primary Button Text</label>
                  <input
                    type="text"
                    value={newSection.primaryButtonText}
                    onChange={(e) => setNewSection({ ...newSection, primaryButtonText: e.target.value })}
                    placeholder="REGISTER NOW"
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-[var(--text-primary)]">Primary Button Link</label>
                  <input
                    type="text"
                    value={newSection.primaryButtonLink}
                    onChange={(e) => setNewSection({ ...newSection, primaryButtonLink: e.target.value })}
                    placeholder="/register"
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-[var(--text-primary)]">Image URL (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSection.imageUrl}
                    onChange={(e) => setNewSection({ ...newSection, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="flex-grow py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                  />
                  <label className="btn-secondary py-2 px-3 text-xs cursor-pointer flex-shrink-0">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files[0], (url) => setNewSection({ ...newSection, imageUrl: url }))}
                    />
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center py-3.5 text-xs">
                <span>CREATE SECTION</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT EXISTING SECTION MODAL */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h4 className="text-lg font-black font-heading text-[var(--text-primary)]">
                EDIT SECTION ({editingSection.type.toUpperCase()})
              </h4>
              <button onClick={() => setEditingSection(null)} className="text-red-500 font-bold text-xs">
                CLOSE [X]
              </button>
            </div>

            <form onSubmit={handleUpdateSectionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-[var(--text-primary)]">Section Title</label>
                <input
                  type="text"
                  required
                  value={editingSection.title || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-[var(--text-primary)]">Subtitle / Badge</label>
                <input
                  type="text"
                  value={editingSection.subtitle || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-[var(--text-primary)]">Description</label>
                <textarea
                  rows={3}
                  value={editingSection.description || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, description: e.target.value })}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-[var(--text-primary)]">Primary Button Text</label>
                  <input
                    type="text"
                    value={editingSection.primaryButtonText || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, primaryButtonText: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-[var(--text-primary)]">Primary Button Link</label>
                  <input
                    type="text"
                    value={editingSection.primaryButtonLink || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, primaryButtonLink: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-[var(--text-primary)]">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingSection.imageUrl || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, imageUrl: e.target.value })}
                    className="flex-grow py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                  />
                  <label className="btn-secondary py-2 px-3 text-xs cursor-pointer flex-shrink-0">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files[0], (url) => setEditingSection({ ...editingSection, imageUrl: url }))}
                    />
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center py-3.5 text-xs">
                <span>SAVE SECTION CHANGES</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-secondary)] border-2 border-red-500/40 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-bold text-[var(--text-primary)]">
              CONFIRM SECTION DELETION
            </h4>
            <p className="text-xs text-[var(--text-muted)]">
              Are you sure you want to delete this homepage section? This action will remove it from the page configuration.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-secondary w-1/2 justify-center py-2.5 text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={() => handleDeleteSection(deleteConfirmId)}
                className="w-1/2 py-2.5 rounded-2xl bg-red-500 text-white font-extrabold text-xs shadow-lg hover:bg-red-600 transition-colors"
              >
                YES, DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
