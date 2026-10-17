import React, { useState, useEffect, useMemo } from 'react';
import { adminWebContentService } from '../services/adminApi';
import {
  Globe,
  Layers,
  Search,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  Eye,
  X,
  FileText,
} from 'lucide-react';

export const UpdateContentPage = () => {
  const [selectedWebsite, setSelectedWebsite] = useState('');
  const [websites] = useState([
    {
      id: 'chinmaya',
      name: 'Chinmaya Mission Website',
      port: 5176,
      url: 'http://localhost:5176',
      description: 'Main spiritual, cultural, and community website for Chinmaya Mission & CHYK, Adoni.',
    },
    {
      id: 'marathon',
      name: 'Marathon Website',
      port: 5175,
      url: 'http://localhost:5175',
      description: 'Official registration portal for Anti-Drug Movement Marathon Run 2026, passes & reflections.',
    },
  ]);

  const [pages, setPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [pageSearch, setPageSearch] = useState('');

  const [activePage, setActivePage] = useState(null);
  const [initialPageData, setInitialPageData] = useState(null);
  const [loadingPageDetail, setLoadingPageDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: null, text: '' });
  const [uploadingFieldKey, setUploadingFieldKey] = useState(null);

  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState(false);
  const [newPageForm, setNewPageForm] = useState({
    pageTitle: '',
    pageSlug: '',
    route: '',
  });

  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (!selectedWebsite) {
      setPages([]);
      setSelectedPageId(null);
      setActivePage(null);
      return;
    }
    fetchWebsitePages(selectedWebsite);
  }, [selectedWebsite]);

  const fetchWebsitePages = async (websiteId, preserveSelectedId = null) => {
    setLoadingPages(true);
    try {
      const res = await adminWebContentService.getPages(websiteId);
      if (res.data?.success) {
        const fetchedPages = res.data.data || [];
        setPages(fetchedPages);

        if (fetchedPages.length > 0) {
          const targetId = preserveSelectedId || (fetchedPages.some((p) => p._id === selectedPageId) ? selectedPageId : fetchedPages[0]._id);
          setSelectedPageId(targetId);
        } else {
          setSelectedPageId(null);
          setActivePage(null);
        }
      }
    } catch (err) {
      console.error('Failed to load website pages:', err);
      showMessage('error', 'Could not load pages for the selected website.');
    } finally {
      setLoadingPages(false);
    }
  };

  useEffect(() => {
    if (!selectedPageId) {
      setActivePage(null);
      setInitialPageData(null);
      return;
    }
    fetchPageDetail(selectedPageId);
  }, [selectedPageId]);

  const fetchPageDetail = async (pageId) => {
    setLoadingPageDetail(true);
    try {
      const res = await adminWebContentService.getPageById(pageId);
      if (res.data?.success && res.data.data) {
        const page = res.data.data;
        setActivePage(page);
        setInitialPageData(JSON.stringify(page));

        const exp = {};
        (page.sections || []).forEach((s) => {
          exp[s.sectionId] = true;
        });
        setExpandedSections(exp);
      }
    } catch (err) {
      console.error('Failed to load page detail:', err);
      showMessage('error', 'Failed to retrieve page details.');
    } finally {
      setLoadingPageDetail(false);
    }
  };

  const showMessage = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage({ type: null, text: '' });
    }, 6000);
  };

  const hasUnsavedChanges = useMemo(() => {
    if (!activePage || !initialPageData) return false;
    return JSON.stringify(activePage) !== initialPageData;
  }, [activePage, initialPageData]);

  const toggleSectionExpand = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleFieldChange = (sectionIndex, fieldKey, newValue) => {
    setActivePage((prev) => {
      const updated = { ...prev };
      const sections = [...updated.sections];
      const sec = { ...sections[sectionIndex] };
      const fields = [...sec.fields];
      const fieldIdx = fields.findIndex((f) => f.key === fieldKey);
      if (fieldIdx !== -1) {
        fields[fieldIdx] = { ...fields[fieldIdx], value: newValue };
        sec.fields = fields;
        sections[sectionIndex] = sec;
        updated.sections = sections;
      }
      return updated;
    });
  };

  const handleItemFieldChange = (sectionIndex, itemIndex, itemKey, newValue) => {
    setActivePage((prev) => {
      const updated = { ...prev };
      const sections = [...updated.sections];
      const sec = { ...sections[sectionIndex] };
      const items = [...sec.items];
      items[itemIndex] = { ...items[itemIndex], [itemKey]: newValue };
      sec.items = items;
      sections[sectionIndex] = sec;
      updated.sections = sections;
      return updated;
    });
  };

  const handleAddRepeatedItem = (sectionIndex) => {
    setActivePage((prev) => {
      const updated = { ...prev };
      const sections = [...updated.sections];
      const sec = { ...sections[sectionIndex] };
      const items = [...(sec.items || [])];
      items.push({
        itemId: `item-${Date.now()}`,
        title: 'New Item Title',
        subtitle: '',
        description: '',
        imageUrl: '',
        imageAlt: '',
        linkUrl: '',
        linkLabel: '',
        badge: '',
        dateOrYear: '',
        order: items.length + 1,
      });
      sec.items = items;
      sections[sectionIndex] = sec;
      updated.sections = sections;
      return updated;
    });
  };

  const handleReorderItem = (sectionIndex, itemIndex, direction) => {
    setActivePage((prev) => {
      const updated = { ...prev };
      const sections = [...updated.sections];
      const sec = { ...sections[sectionIndex] };
      const items = [...sec.items];
      const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return prev;

      const temp = items[itemIndex];
      items[itemIndex] = items[targetIndex];
      items[targetIndex] = temp;

      items.forEach((it, idx) => {
        it.order = idx + 1;
      });

      sec.items = items;
      sections[sectionIndex] = sec;
      updated.sections = sections;
      return updated;
    });
  };

  const handleDeleteRepeatedItem = (sectionIndex, itemIndex) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setActivePage((prev) => {
      const updated = { ...prev };
      const sections = [...updated.sections];
      const sec = { ...sections[sectionIndex] };
      sec.items = sec.items.filter((_, idx) => idx !== itemIndex);
      sections[sectionIndex] = sec;
      updated.sections = sections;
      return updated;
    });
  };

  const handleImageUpload = async (e, sectionIndex, fieldKey = null, itemIndex = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }

    const uploadKey = fieldKey ? `${sectionIndex}-${fieldKey}` : `${sectionIndex}-item-${itemIndex}`;
    setUploadingFieldKey(uploadKey);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', `${selectedWebsite}_content`);

      const res = await adminWebContentService.uploadPageImage(activePage._id, formData);
      if (res.data?.success && res.data.data?.url) {
        const uploadedUrl = res.data.data.url;
        if (fieldKey) {
          handleFieldChange(sectionIndex, fieldKey, uploadedUrl);
        } else if (itemIndex !== null) {
          handleItemFieldChange(sectionIndex, itemIndex, 'imageUrl', uploadedUrl);
        }
        showMessage('success', 'Image uploaded successfully!');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      showMessage('error', err.response?.data?.message || 'Error uploading image.');
    } finally {
      setUploadingFieldKey(null);
      e.target.value = '';
    }
  };

  const handleSavePage = async () => {
    if (!activePage) return;
    setSaving(true);
    try {
      const res = await adminWebContentService.updatePage(activePage._id, {
        pageTitle: activePage.pageTitle,
        route: activePage.route,
        status: activePage.status,
        sections: activePage.sections,
        seo: activePage.seo,
      });

      if (res.data?.success) {
        const saved = res.data.data;
        setActivePage(saved);
        setInitialPageData(JSON.stringify(saved));
        try {
          localStorage.removeItem(`cached_cms_${saved.website}_${saved.pageSlug}`);
          localStorage.setItem('cms_last_updated', Date.now().toString());
          window.dispatchEvent(new Event('cms_updated'));
        } catch (_) {}
        showMessage('success', `Content for '${saved.pageTitle}' updated and published successfully!`);
        fetchWebsitePages(selectedWebsite, saved._id);
      }
    } catch (err) {
      console.error('Failed to save page:', err);
      showMessage('error', err.response?.data?.message || 'Server error while saving changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    if (!hasUnsavedChanges) return;
    if (window.confirm('Discard all unsaved changes on this page?')) {
      if (initialPageData) {
        setActivePage(JSON.parse(initialPageData));
        showMessage('info', 'Changes reverted.');
      }
    }
  };

  const handleCreatePage = async (e) => {
    e.preventDefault();
    if (!newPageForm.pageTitle.trim()) return;

    try {
      const res = await adminWebContentService.createPage({
        website: selectedWebsite,
        pageTitle: newPageForm.pageTitle.trim(),
        pageSlug: newPageForm.pageSlug.trim(),
        route: newPageForm.route.trim(),
        sections: [
          {
            sectionId: 'main_content',
            name: 'Main Content Section',
            description: 'Custom content section for this page.',
            order: 1,
            isEnabled: true,
            fields: [
              { key: 'heading', label: 'Section Heading', type: 'text', value: newPageForm.pageTitle },
              { key: 'body', label: 'Main Content Body', type: 'textarea', value: 'Add your custom content here...' },
              { key: 'imageUrl', label: 'Featured Image URL', type: 'image', value: '' },
            ],
            items: [],
          },
        ],
      });

      if (res.data?.success && res.data.data) {
        const created = res.data.data;
        setIsAddPageModalOpen(false);
        setNewPageForm({ pageTitle: '', pageSlug: '', route: '' });
        showMessage('success', `Page '${created.pageTitle}' created successfully!`);
        await fetchWebsitePages(selectedWebsite, created._id);
      }
    } catch (err) {
      console.error('Failed to create page:', err);
      alert(err.response?.data?.message || 'Failed to create page.');
    }
  };

  const handleDeletePage = async () => {
    if (!activePage || activePage.isSystemPage) return;
    if (!window.confirm(`Permanently delete page '${activePage.pageTitle}'?`)) return;

    try {
      const res = await adminWebContentService.deletePage(activePage._id);
      if (res.data?.success) {
        showMessage('success', `Page '${activePage.pageTitle}' was deleted.`);
        setSelectedPageId(null);
        setActivePage(null);
        await fetchWebsitePages(selectedWebsite);
      }
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to delete page.');
    }
  };

  const filteredPages = useMemo(() => {
    if (!pageSearch.trim()) return pages;
    const q = pageSearch.toLowerCase().trim();
    return pages.filter(
      (p) =>
        (p.pageTitle && p.pageTitle.toLowerCase().includes(q)) ||
        (p.pageSlug && p.pageSlug.toLowerCase().includes(q)) ||
        (p.route && p.route.toLowerCase().includes(q))
    );
  }, [pages, pageSearch]);

  const currentWebsiteObj = websites.find((w) => w.id === selectedWebsite);

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1C2541] via-[#243054] to-[#1C2541] border border-cyan-500/20 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase">
              <Globe className="w-3.5 h-3.5" />
              <span>Multi-Website Content CMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
              Update Content
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              Manage, edit, and publish content and media across both Chinmaya Mission and Marathon public websites.
            </p>
          </div>

          {/* Website Selection Dropdown */}
          <div className="min-w-[280px] sm:min-w-[340px] space-y-2">
            <label className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider block">
              SELECT TARGET WEBSITE:
            </label>
            <div className="relative">
              <select
                value={selectedWebsite}
                onChange={(e) => {
                  if (hasUnsavedChanges) {
                    if (!window.confirm('You have unsaved changes. Switch website anyway?')) return;
                  }
                  setSelectedWebsite(e.target.value);
                }}
                className="w-full py-3 px-4 pr-10 rounded-2xl bg-[#0B132B] border-2 border-cyan-500/40 text-white font-bold text-sm focus:outline-hidden focus:border-cyan-400 shadow-xl appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select a website
                </option>
                <option value="chinmaya">Chinmaya Mission Website (Port 5176)</option>
                <option value="marathon">Marathon Website (Port 5175)</option>
              </select>
              <ChevronDown className="w-5 h-5 text-cyan-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {statusMessage.text && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-lg ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
              : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage({ type: null, text: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Placeholder when no website selected */}
      {!selectedWebsite ? (
        <div className="p-8 sm:p-14 rounded-3xl bg-[#1C2541]/50 border-2 border-dashed border-white/10 text-center space-y-8 shadow-xl">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
              Please Select a Website
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Choose a website from the dropdown above or click one of the options below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            {websites.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWebsite(w.id)}
                className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 hover:border-cyan-500 transition-all shadow-md hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-black uppercase">
                    PORT {w.port}
                  </span>
                  <h4 className="text-lg font-black font-heading text-white">{w.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{w.description}</p>
                </div>
                <div className="text-xs font-mono font-bold text-cyan-400">{w.url}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Workspace */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#1C2541] border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  MANAGING:
                </span>
                <span className="text-base font-black text-white">{currentWebsiteObj?.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={currentWebsiteObj?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 text-xs font-bold inline-flex items-center gap-1.5 text-decoration-none"
              >
                <span>Visit Live Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedWebsite('')}
                className="px-3.5 py-2 rounded-xl bg-[#0B132B] hover:bg-[#243054] text-slate-300 border border-white/10 text-xs font-bold"
              >
                Switch Website
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sidebar Pages */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-3xl bg-[#1C2541] border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-black font-heading text-white uppercase">
                      Pages & Routes
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#0B132B] text-[10px] font-bold text-slate-400">
                    {pages.length} Pages
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={pageSearch}
                    onChange={(e) => setPageSearch(e.target.value)}
                    placeholder="Search pages or routes..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0B132B] border border-white/10 text-xs text-white"
                  />
                </div>

                <button
                  onClick={() => setIsAddPageModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Page</span>
                </button>

                <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
                  {loadingPages ? (
                    <div className="py-8 text-center text-xs font-bold text-slate-400">
                      Loading pages...
                    </div>
                  ) : (
                    filteredPages.map((p) => {
                      const isSelected = p._id === selectedPageId;
                      return (
                        <button
                          key={p._id}
                          onClick={() => {
                            if (hasUnsavedChanges) {
                              if (!window.confirm('Unsaved changes will be lost. Continue?')) return;
                            }
                            setSelectedPageId(p._id);
                          }}
                          className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500 text-white shadow-lg'
                              : 'bg-[#0B132B] text-white hover:bg-[#243054] border border-white/5'
                          }`}
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs truncate">{p.pageTitle}</span>
                              <span className="text-[9px] font-bold px-1.5 rounded bg-white/20">
                                {p.isSystemPage ? 'CORE' : 'CUSTOM'}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono opacity-80">{p.route}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Page Editor */}
            <div className="lg:col-span-8 space-y-6">
              {!activePage ? (
                <div className="p-16 rounded-3xl bg-[#1C2541] text-center text-xs font-bold text-slate-400">
                  Select a page from the list to begin editing.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Top bar */}
                  <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">
                          {activePage.route}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black font-heading text-white mt-1">
                          {activePage.pageTitle}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={`${currentWebsiteObj?.url}${activePage.route === '*' ? '' : activePage.route}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-[#0B132B] border border-white/10 text-white text-xs font-bold inline-flex items-center gap-1.5 text-decoration-none"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View Live</span>
                        </a>

                        {hasUnsavedChanges && (
                          <button
                            onClick={handleDiscardChanges}
                            className="px-3 py-2 rounded-xl bg-slate-700 text-slate-300 text-xs font-bold"
                          >
                            <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                            Discard
                          </button>
                        )}

                        <button
                          onClick={handleSavePage}
                          disabled={saving}
                          className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
                        </button>

                        {!activePage.isSystemPage && (
                          <button
                            onClick={handleDeletePage}
                            className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Page Title:</label>
                        <input
                          type="text"
                          value={activePage.pageTitle}
                          onChange={(e) => setActivePage({ ...activePage, pageTitle: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-[#0B132B] border border-white/10 text-xs font-bold text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Status:</label>
                        <select
                          value={activePage.status}
                          onChange={(e) => setActivePage({ ...activePage, status: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-[#0B132B] border border-white/10 text-xs font-bold text-white"
                        >
                          <option value="PUBLISHED">Published</option>
                          <option value="DRAFT">Draft</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="space-y-4">
                    {(activePage.sections || []).map((section, sIdx) => {
                      const isExpanded = expandedSections[section.sectionId] !== false;

                      return (
                        <div key={section.sectionId || sIdx} className="rounded-3xl bg-[#1C2541] border border-white/10 overflow-hidden shadow-lg">
                          <div
                            onClick={() => toggleSectionExpand(section.sectionId)}
                            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#243054] select-none"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-black text-xs">
                                {sIdx + 1}
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-white">{section.name}</h4>
                                {section.description && (
                                  <p className="text-[11px] text-slate-400">{section.description}</p>
                                )}
                              </div>
                            </div>
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                          </div>

                          {isExpanded && (
                            <div className="p-5 sm:p-6 border-t border-white/10 bg-[#0B132B]/60 space-y-6">
                              {/* Fields */}
                              {section.fields && section.fields.length > 0 && (
                                <div className="space-y-4">
                                  <h5 className="text-[11px] font-extrabold uppercase text-cyan-400">Content Fields</h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {section.fields.map((field) => {
                                      const isFull = field.type === 'textarea' || field.type === 'richtext' || field.key.includes('description');
                                      return (
                                        <div key={field.key} className={`space-y-1.5 ${isFull ? 'md:col-span-2' : ''}`}>
                                          <label className="text-xs font-bold text-white block">{field.label}</label>
                                          {field.type === 'textarea' || field.type === 'richtext' ? (
                                            <textarea
                                              rows={3}
                                              value={field.value || ''}
                                              onChange={(e) => handleFieldChange(sIdx, field.key, e.target.value)}
                                              className="w-full p-3 rounded-xl bg-[#0B132B] border border-white/10 text-xs text-white"
                                            />
                                          ) : field.type === 'image' ? (
                                            <div className="space-y-2">
                                              <div className="flex gap-2">
                                                <input
                                                  type="text"
                                                  value={field.value || ''}
                                                  onChange={(e) => handleFieldChange(sIdx, field.key, e.target.value)}
                                                  className="w-full p-2.5 rounded-xl bg-[#0B132B] border border-white/10 text-xs text-white font-mono"
                                                />
                                                <label className="px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer">
                                                  <Upload className="w-3.5 h-3.5" />
                                                  <span>Upload</span>
                                                  <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, sIdx, field.key)}
                                                    className="hidden"
                                                  />
                                                </label>
                                              </div>
                                              {field.value && (
                                                <img src={field.value} alt="" className="h-20 rounded-lg object-contain border border-white/10 p-1" />
                                              )}
                                            </div>
                                          ) : (
                                            <input
                                              type="text"
                                              value={field.value || ''}
                                              onChange={(e) => handleFieldChange(sIdx, field.key, e.target.value)}
                                              className="w-full p-2.5 rounded-xl bg-[#0B132B] border border-white/10 text-xs text-white"
                                            />
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Items */}
                              {section.items && (
                                <div className="space-y-4 pt-4 border-t border-white/10">
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-[11px] font-extrabold uppercase text-amber-400">
                                      Repeated Items ({section.items.length})
                                    </h5>
                                    <button
                                      onClick={() => handleAddRepeatedItem(sIdx)}
                                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Add Item</span>
                                    </button>
                                  </div>

                                  <div className="space-y-3">
                                    {section.items.map((item, itIdx) => (
                                      <div key={item.itemId || itIdx} className="p-4 rounded-2xl bg-[#0B132B] border border-white/10 space-y-3">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                          <span className="text-xs font-bold text-white">{item.title || `Item #${itIdx + 1}`}</span>
                                          <div className="flex items-center gap-1">
                                            <button onClick={() => handleReorderItem(sIdx, itIdx, 'up')} disabled={itIdx === 0} className="p-1 text-slate-400 hover:text-white">
                                              <ArrowUp className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => handleReorderItem(sIdx, itIdx, 'down')} disabled={itIdx === section.items.length - 1} className="p-1 text-slate-400 hover:text-white">
                                              <ArrowDown className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => handleDeleteRepeatedItem(sIdx, itIdx)} className="p-1 text-rose-400 hover:bg-rose-500/20 rounded">
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          <input
                                            type="text"
                                            value={item.title || ''}
                                            placeholder="Item Title"
                                            onChange={(e) => handleItemFieldChange(sIdx, itIdx, 'title', e.target.value)}
                                            className="w-full p-2 rounded-lg bg-[#1C2541] border border-white/10 text-xs text-white"
                                          />
                                          <input
                                            type="text"
                                            value={item.subtitle || item.dateOrYear || ''}
                                            placeholder="Subtitle / Badge / Year"
                                            onChange={(e) => {
                                              handleItemFieldChange(sIdx, itIdx, 'subtitle', e.target.value);
                                              handleItemFieldChange(sIdx, itIdx, 'dateOrYear', e.target.value);
                                            }}
                                            className="w-full p-2 rounded-lg bg-[#1C2541] border border-white/10 text-xs text-white"
                                          />
                                          <textarea
                                            rows={2}
                                            value={item.description || ''}
                                            placeholder="Description"
                                            onChange={(e) => handleItemFieldChange(sIdx, itIdx, 'description', e.target.value)}
                                            className="sm:col-span-2 w-full p-2 rounded-lg bg-[#1C2541] border border-white/10 text-xs text-white"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Page Modal */}
      {isAddPageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#1C2541] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 text-white">
            <h3 className="text-base font-black">Add New Content Page</h3>
            <form onSubmit={handleCreatePage} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Page Title"
                value={newPageForm.pageTitle}
                onChange={(e) => {
                  const t = e.target.value;
                  const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  setNewPageForm({ pageTitle: t, pageSlug: slug, route: `/${slug}` });
                }}
                className="w-full p-2.5 rounded-xl bg-[#0B132B] border border-white/10 text-xs text-white"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddPageModalOpen(false)} className="px-4 py-2 bg-slate-700 text-xs rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-xs font-bold rounded-xl">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UpdateContentPage;
