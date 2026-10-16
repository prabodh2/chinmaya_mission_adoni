import React, { useState, useEffect, useMemo } from 'react';
import { webContentService } from '../../services/api';
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
  HelpCircle,
  Sparkles,
  Link as LinkIcon,
  FileText,
  Eye,
  X,
  Shield,
  Tag,
  Calendar,
  Compass,
} from 'lucide-react';

export const UpdateContentManager = () => {
  // Website selection state
  const [selectedWebsite, setSelectedWebsite] = useState('');
  const [websites, setWebsites] = useState([
    {
      id: 'chinmaya',
      name: 'Chinmaya Mission Website',
      port: 5176,
      url: 'http://localhost:5176',
      description: 'Main spiritual, cultural, and community website for Chinmaya Mission & CHYK, Adoni.',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'marathon',
      name: 'Marathon Website',
      port: 5175,
      url: 'http://localhost:5175',
      description: 'Official registration portal for Anti-Drug Movement Marathon Run 2026, passes & reflections.',
      color: 'from-orange-500 to-amber-600',
    },
  ]);

  // Pages state
  const [pages, setPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [pageSearch, setPageSearch] = useState('');

  // Active page editing state
  const [activePage, setActivePage] = useState(null);
  const [initialPageData, setInitialPageData] = useState(null);
  const [loadingPageDetail, setLoadingPageDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: null, text: '' });
  const [uploadingFieldKey, setUploadingFieldKey] = useState(null);

  // New Page Modal State
  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState(false);
  const [newPageForm, setNewPageForm] = useState({
    pageTitle: '',
    pageSlug: '',
    route: '',
  });

  // Track expanded sections in editor
  const [expandedSections, setExpandedSections] = useState({});

  // 1. Fetch Pages whenever a website is selected
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
      const res = await webContentService.getPages(websiteId);
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
      showMessage('error', 'Could not load pages for the selected website. Please check your connection.');
    } finally {
      setLoadingPages(false);
    }
  };

  // 2. Fetch full page detail when selectedPageId changes
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
      const res = await webContentService.getPageById(pageId);
      if (res.data?.success && res.data.data) {
        const page = res.data.data;
        setActivePage(page);
        setInitialPageData(JSON.stringify(page));

        // Auto-expand all sections
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

  // Check unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (!activePage || !initialPageData) return false;
    return JSON.stringify(activePage) !== initialPageData;
  }, [activePage, initialPageData]);

  // Section toggle helper
  const toggleSectionExpand = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Field change handler
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

  // Repeated Item field change handler
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

  // Add repeated item to a section
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

  // Reorder repeated item
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

      // Update order field
      items.forEach((it, idx) => {
        it.order = idx + 1;
      });

      sec.items = items;
      sections[sectionIndex] = sec;
      updated.sections = sections;
      return updated;
    });
  };

  // Delete repeated item
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

  // Image Upload Handler
  const handleImageUpload = async (e, sectionIndex, fieldKey = null, itemIndex = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size exceeds 10MB limit.');
      return;
    }

    const uploadKey = fieldKey ? `${sectionIndex}-${fieldKey}` : `${sectionIndex}-item-${itemIndex}`;
    setUploadingFieldKey(uploadKey);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', `${selectedWebsite}_content`);

      const res = await webContentService.uploadPageImage(activePage._id, formData);
      if (res.data?.success && res.data.data?.url) {
        const uploadedUrl = res.data.data.url;
        if (fieldKey) {
          handleFieldChange(sectionIndex, fieldKey, uploadedUrl);
        } else if (itemIndex !== null) {
          handleItemFieldChange(sectionIndex, itemIndex, 'imageUrl', uploadedUrl);
        }
        showMessage('success', 'Image uploaded successfully!');
      } else {
        showMessage('error', 'Image upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      showMessage('error', err.response?.data?.message || 'Error uploading image file.');
    } finally {
      setUploadingFieldKey(null);
      e.target.value = '';
    }
  };

  // Save changes
  const handleSavePage = async () => {
    if (!activePage) return;
    setSaving(true);
    try {
      const res = await webContentService.updatePage(activePage._id, {
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
        showMessage('success', `Content for '${saved.pageTitle}' updated and published successfully!`);
        // Refresh page list metadata
        fetchWebsitePages(selectedWebsite, saved._id);
      } else {
        showMessage('error', res.data?.message || 'Failed to save page content.');
      }
    } catch (err) {
      console.error('Failed to save page:', err);
      showMessage('error', err.response?.data?.message || 'Server error while saving changes.');
    } finally {
      setSaving(false);
    }
  };

  // Discard changes
  const handleDiscardChanges = () => {
    if (!hasUnsavedChanges) return;
    if (window.confirm('Discard all unsaved changes on this page?')) {
      if (initialPageData) {
        setActivePage(JSON.parse(initialPageData));
        showMessage('info', 'Changes reverted.');
      }
    }
  };

  // Create New Dynamic Page
  const handleCreatePage = async (e) => {
    e.preventDefault();
    if (!newPageForm.pageTitle.trim()) {
      alert('Please enter a page title.');
      return;
    }

    try {
      const res = await webContentService.createPage({
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
      alert(err.response?.data?.message || 'Failed to create page. Please check slug uniqueness.');
    }
  };

  // Delete page
  const handleDeletePage = async () => {
    if (!activePage) return;
    if (activePage.isSystemPage) {
      alert(`Core system page '${activePage.pageTitle}' cannot be deleted.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete page '${activePage.pageTitle}'? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await webContentService.deletePage(activePage._id);
      if (res.data?.success) {
        showMessage('success', `Page '${activePage.pageTitle}' was deleted.`);
        setSelectedPageId(null);
        setActivePage(null);
        await fetchWebsitePages(selectedWebsite);
      }
    } catch (err) {
      console.error('Failed to delete page:', err);
      showMessage('error', err.response?.data?.message || 'Failed to delete page.');
    }
  };

  // Filtered pages for sidebar
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
      
      {/* 1. TOP HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0E1E38] via-[#142A4D] to-[#0E1E38] border border-cyan-500/20 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-black tracking-wider uppercase">
              <Globe className="w-3.5 h-3.5" />
              <span>Multi-Website Content Management System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
              Update Content
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              View, create, edit, update, and publish content and images across both Chinmaya Mission and Marathon public websites with real-time database persistence.
            </p>
          </div>

          {/* WEBSITE SELECTOR DROPDOWN */}
          <div className="min-w-[280px] sm:min-w-[340px] space-y-2">
            <label className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider block">
              SELECT TARGET WEBSITE:
            </label>
            <div className="relative">
              <select
                value={selectedWebsite}
                onChange={(e) => {
                  if (hasUnsavedChanges) {
                    if (!window.confirm('You have unsaved changes. Switching websites will lose these changes. Continue?')) {
                      return;
                    }
                  }
                  setSelectedWebsite(e.target.value);
                }}
                className="w-full py-3.5 px-4 pr-10 rounded-2xl bg-slate-900/90 border-2 border-cyan-500/40 text-white font-bold text-sm focus:outline-hidden focus:border-cyan-400 shadow-xl transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select a website
                </option>
                <option value="chinmaya">
                  1. Chinmaya Mission Website (Port 5176)
                </option>
                <option value="marathon">
                  2. Marathon Website (Port 5175)
                </option>
              </select>
              <ChevronDown className="w-5 h-5 text-cyan-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* STATUS NOTIFICATION TOAST */}
      {statusMessage.text && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
              : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Sparkles className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage({ type: null, text: '' })}
            className="p-1 hover:opacity-75 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. INITIAL PLACEHOLDER (NO WEBSITE SELECTED) */}
      {!selectedWebsite ? (
        <div className="p-8 sm:p-14 rounded-3xl bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border-color)] text-center space-y-8 shadow-xl">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-[var(--text-primary)]">
              Please Select a Website
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium leading-relaxed">
              Choose a website from the dropdown above or select one of the cards below to load its pages and begin editing content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            {websites.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWebsite(w.id)}
                className="group p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-cyan-500 transition-all shadow-md hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-black uppercase">
                      PORT {w.port}
                    </span>
                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-lg font-black font-heading text-[var(--text-primary)]">
                    {w.name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                    {w.description}
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-cyan-400 group-hover:underline">
                  {w.url}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* 3. MAIN WORKSPACE: SIDEBAR + CONTENT EDITOR */
        <div className="space-y-6">
          
          {/* ACTIVE WEBSITE CONTEXT BAR */}
          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider block">
                  MANAGING CONTENT FOR:
                </span>
                <span className="text-base font-black text-[var(--text-primary)]">
                  {currentWebsiteObj?.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={currentWebsiteObj?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 text-xs font-bold inline-flex items-center gap-1.5 transition-colors text-decoration-none"
              >
                <span>Visit Live Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedWebsite('')}
                className="px-3.5 py-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-color)] text-xs font-bold transition-colors"
              >
                Switch Website
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: PAGE NAVIGATION LIST (Cols 4 of 12) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-4 shadow-xl">
                
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-black font-heading text-[var(--text-primary)] uppercase tracking-wider">
                      Pages & Routes
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[10px] font-bold text-[var(--text-muted)]">
                    {pages.length} Pages
                  </span>
                </div>

                {/* Page Search Box */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={pageSearch}
                    onChange={(e) => setPageSearch(e.target.value)}
                    placeholder="Search pages or routes..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-primary)] focus:outline-hidden focus:border-cyan-400"
                  />
                </div>

                {/* Add Page Button */}
                <button
                  onClick={() => setIsAddPageModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Page</span>
                </button>

                {/* Page List */}
                <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
                  {loadingPages ? (
                    <div className="py-8 text-center text-xs font-bold text-[var(--text-muted)]">
                      Loading pages...
                    </div>
                  ) : filteredPages.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[var(--text-muted)]">
                      No matching pages found.
                    </div>
                  ) : (
                    filteredPages.map((p) => {
                      const isSelected = p._id === selectedPageId;
                      return (
                        <button
                          key={p._id}
                          onClick={() => {
                            if (hasUnsavedChanges) {
                              if (!window.confirm('You have unsaved changes on this page. Continue without saving?')) {
                                return;
                              }
                            }
                            setSelectedPageId(p._id);
                          }}
                          className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                              : 'bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)]'
                          }`}
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs truncate">
                                {p.pageTitle}
                              </span>
                              {p.isSystemPage ? (
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-500/20 text-slate-400'
                                }`}>
                                  CORE
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400">
                                  CUSTOM
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono opacity-80">
                              <span>{p.route}</span>
                              <span>•</span>
                              <span>{p.sectionCount} sections</span>
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white' : 'text-[var(--text-muted)]'}`} />
                        </button>
                      );
                    })
                  )}
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: ACTIVE PAGE EDITOR (Cols 8 of 12) */}
            <div className="lg:col-span-8 space-y-6">
              {loadingPageDetail ? (
                <div className="p-16 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center text-xs font-bold text-[var(--text-muted)]">
                  Loading page content...
                </div>
              ) : !activePage ? (
                <div className="p-16 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center text-xs font-bold text-[var(--text-muted)]">
                  Select a page from the left list to begin editing.
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Page Title & Action Bar */}
                  <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono">
                            {activePage.route}
                          </span>
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                            {activePage.status}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black font-heading text-[var(--text-primary)] mt-1">
                          {activePage.pageTitle}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Live page preview link */}
                        <a
                          href={`${currentWebsiteObj?.url}${activePage.route === '*' ? '' : activePage.route}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-bold inline-flex items-center gap-1.5 transition-colors text-decoration-none"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View Live</span>
                        </a>

                        {/* Discard Changes */}
                        {hasUnsavedChanges && (
                          <button
                            onClick={handleDiscardChanges}
                            className="px-3 py-2 rounded-xl bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Discard</span>
                          </button>
                        )}

                        {/* Save Button */}
                        <button
                          onClick={handleSavePage}
                          disabled={saving}
                          className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {saving ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Save & Publish</span>
                            </>
                          )}
                        </button>

                        {/* Delete Page button for custom pages */}
                        {!activePage.isSystemPage && (
                          <button
                            onClick={handleDeletePage}
                            className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 transition-colors cursor-pointer"
                            title="Delete this custom page"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Basic Meta Settings */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
                          Page Display Title:
                        </label>
                        <input
                          type="text"
                          value={activePage.pageTitle}
                          onChange={(e) => setActivePage({ ...activePage, pageTitle: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
                          Public URL Route:
                        </label>
                        <input
                          type="text"
                          value={activePage.route}
                          disabled={activePage.isSystemPage}
                          onChange={(e) => setActivePage({ ...activePage, route: e.target.value })}
                          className={`w-full p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-mono font-bold text-[var(--text-primary)] ${
                            activePage.isSystemPage ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
                          Publication Status:
                        </label>
                        <select
                          value={activePage.status}
                          onChange={(e) => setActivePage({ ...activePage, status: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] cursor-pointer"
                        >
                          <option value="PUBLISHED">Published (Visible Live)</option>
                          <option value="DRAFT">Draft (Under Review)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SECTIONS ACCORDION LIST */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
                        PAGE CONTENT SECTIONS ({activePage.sections?.length || 0})
                      </h3>
                      <span className="text-[10px] font-semibold text-[var(--text-muted)]">
                        Every heading, description, and repeated item is editable
                      </span>
                    </div>

                    {(activePage.sections || []).map((section, sIdx) => {
                      const isExpanded = expandedSections[section.sectionId] !== false;

                      return (
                        <div
                          key={section.sectionId || sIdx}
                          className="rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-hidden shadow-lg transition-all"
                        >
                          {/* Section Header Accordion Bar */}
                          <div
                            onClick={() => toggleSectionExpand(section.sectionId)}
                            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors select-none"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-black text-xs">
                                {sIdx + 1}
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-[var(--text-primary)]">
                                  {section.name}
                                </h4>
                                {section.description && (
                                  <p className="text-[11px] text-[var(--text-muted)] font-medium">
                                    {section.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-[var(--text-muted)] hidden sm:inline">
                                {section.fields?.length || 0} fields
                                {section.items?.length > 0 ? ` • ${section.items.length} items` : ''}
                              </span>
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-cyan-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                              )}
                            </div>
                          </div>

                          {/* Section Body */}
                          {isExpanded && (
                            <div className="p-5 sm:p-6 border-t border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-6">
                              
                              {/* 1. Standard Fields */}
                              {section.fields && section.fields.length > 0 && (
                                <div className="space-y-4">
                                  <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
                                    Section Content & Text Fields
                                  </h5>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {section.fields.map((field) => {
                                      const isFullWidth = field.type === 'textarea' || field.type === 'richtext' || field.key.includes('description') || field.key.includes('intro') || field.key.includes('p1') || field.key.includes('p2');

                                      return (
                                        <div
                                          key={field.key}
                                          className={`space-y-1.5 ${isFullWidth ? 'md:col-span-2' : ''}`}
                                        >
                                          <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-[var(--text-primary)]">
                                              {field.label}
                                            </label>
                                            <span className="text-[10px] font-mono text-[var(--text-muted)]">
                                              key: {field.key}
                                            </span>
                                          </div>

                                          {/* TEXTAREA FIELD */}
                                          {field.type === 'textarea' || field.type === 'richtext' ? (
                                            <textarea
                                              rows={4}
                                              value={field.value || ''}
                                              onChange={(e) => handleFieldChange(sIdx, field.key, e.target.value)}
                                              placeholder={field.placeholder || `Enter ${field.label}...`}
                                              className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] leading-relaxed focus:outline-hidden focus:border-cyan-400"
                                            />
                                          ) : field.type === 'image' ? (
                                            /* IMAGE FIELD WITH INSTANT PREVIEW & UPLOADER */
                                            <div className="space-y-2">
                                              <div className="flex gap-2">
                                                <input
                                                  type="text"
                                                  value={field.value || ''}
                                                  onChange={(e) => handleFieldChange(sIdx, field.key, e.target.value)}
                                                  placeholder="Paste Image URL or click Upload..."
                                                  className="w-full p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-cyan-400 font-mono"
                                                />
                                                <label className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer flex-shrink-0 transition-colors">
                                                  {uploadingFieldKey === `${sIdx}-${field.key}` ? (
                                                    <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                                  ) : (
                                                    <Upload className="w-3.5 h-3.5" />
                                                  )}
                                                  <span>Upload</span>
                                                  <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, sIdx, field.key)}
                                                    className="hidden"
                                                  />
                                                </label>
                                                {field.value && (
                                                  <button
                                                    onClick={() => handleFieldChange(sIdx, field.key, '')}
                                                    className="px-2.5 py-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
                                                    title="Remove image"
                                                  >
                                                    <X className="w-3.5 h-3.5" />
                                                  </button>
                                                )}
                                              </div>

                                              {/* Image Preview Thumbnail */}
                                              {field.value && (
                                                <div className="relative inline-block rounded-xl overflow-hidden border border-[var(--border-color)] bg-slate-900/40 p-1">
                                                  <img
                                                    src={field.value}
                                                    alt={field.label}
                                                    className="h-20 w-auto object-contain rounded-lg"
                                                    onError={(e) => {
                                                      e.currentTarget.style.display = 'none';
                                                    }}
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          ) : (
                                            /* STANDARD TEXT / LINK FIELD */
                                            <input
                                              type={field.type === 'number' ? 'number' : 'text'}
                                              value={field.value || ''}
                                              onChange={(e) => handleFieldChange(sIdx, field.key, e.target.value)}
                                              placeholder={field.placeholder || `Enter ${field.label}...`}
                                              className="w-full p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-cyan-400"
                                            />
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* 2. Repeated Items Manager (FAQs, Cards, Milestones, Festivals, etc.) */}
                              {section.items && (
                                <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                                        Repeated Items & Cards ({section.items.length})
                                      </h5>
                                      <p className="text-[10px] text-[var(--text-muted)]">
                                        Add, edit, reorder, or delete cards, FAQs, and items for this section.
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => handleAddRepeatedItem(sIdx)}
                                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Add Item</span>
                                    </button>
                                  </div>

                                  <div className="space-y-3">
                                    {section.items.map((item, itIdx) => (
                                      <div
                                        key={item.itemId || itIdx}
                                        className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-3"
                                      >
                                        <div className="flex items-center justify-between gap-2 border-b border-[var(--border-color)] pb-2">
                                          <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                                              {itIdx + 1}
                                            </span>
                                            <span className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-md">
                                              {item.title || `Item #${itIdx + 1}`}
                                            </span>
                                          </div>

                                          <div className="flex items-center gap-1">
                                            {/* Reorder Up */}
                                            <button
                                              onClick={() => handleReorderItem(sIdx, itIdx, 'up')}
                                              disabled={itIdx === 0}
                                              className="p-1 rounded-lg hover:bg-[var(--bg-secondary)] disabled:opacity-30 text-[var(--text-muted)] cursor-pointer"
                                              title="Move Up"
                                            >
                                              <ArrowUp className="w-3.5 h-3.5" />
                                            </button>
                                            {/* Reorder Down */}
                                            <button
                                              onClick={() => handleReorderItem(sIdx, itIdx, 'down')}
                                              disabled={itIdx === section.items.length - 1}
                                              className="p-1 rounded-lg hover:bg-[var(--bg-secondary)] disabled:opacity-30 text-[var(--text-muted)] cursor-pointer"
                                              title="Move Down"
                                            >
                                              <ArrowDown className="w-3.5 h-3.5" />
                                            </button>
                                            {/* Delete Item */}
                                            <button
                                              onClick={() => handleDeleteRepeatedItem(sIdx, itIdx)}
                                              className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 cursor-pointer ml-1"
                                              title="Delete Item"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>

                                        {/* Item Fields */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                          <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-[var(--text-muted)]">
                                              Title / Question / Milestone:
                                            </label>
                                            <input
                                              type="text"
                                              value={item.title || ''}
                                              onChange={(e) => handleItemFieldChange(sIdx, itIdx, 'title', e.target.value)}
                                              className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                                            />
                                          </div>

                                          <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-[var(--text-muted)]">
                                              Subtitle / Year / Badge:
                                            </label>
                                            <input
                                              type="text"
                                              value={item.subtitle || item.dateOrYear || ''}
                                              onChange={(e) => {
                                                handleItemFieldChange(sIdx, itIdx, 'subtitle', e.target.value);
                                                handleItemFieldChange(sIdx, itIdx, 'dateOrYear', e.target.value);
                                              }}
                                              className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                                            />
                                          </div>

                                          <div className="sm:col-span-2 space-y-1">
                                            <label className="text-[10px] font-bold text-[var(--text-muted)]">
                                              Description / Answer / Bio:
                                            </label>
                                            <textarea
                                              rows={2}
                                              value={item.description || ''}
                                              onChange={(e) => handleItemFieldChange(sIdx, itIdx, 'description', e.target.value)}
                                              className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                                            />
                                          </div>

                                          {/* Optional Image for Card */}
                                          <div className="sm:col-span-2 space-y-1">
                                            <label className="text-[10px] font-bold text-[var(--text-muted)]">
                                              Card Image URL:
                                            </label>
                                            <div className="flex gap-2">
                                              <input
                                                type="text"
                                                value={item.imageUrl || ''}
                                                onChange={(e) => handleItemFieldChange(sIdx, itIdx, 'imageUrl', e.target.value)}
                                                placeholder="/assets/... or https://..."
                                                className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)]"
                                              />
                                              <label className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center gap-1 cursor-pointer flex-shrink-0">
                                                <Upload className="w-3 h-3" />
                                                <span>Upload</span>
                                                <input
                                                  type="file"
                                                  accept="image/*"
                                                  onChange={(e) => handleImageUpload(e, sIdx, null, itIdx)}
                                                  className="hidden"
                                                />
                                              </label>
                                            </div>
                                          </div>
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

                  {/* BOTTOM SAVE STICKY BAR */}
                  <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 shadow-2xl flex items-center justify-between gap-4 text-white">
                    <div className="flex items-center gap-2">
                      {hasUnsavedChanges ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                          <span className="text-xs font-bold text-amber-300">
                            Unsaved changes on '{activePage.pageTitle}'
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs text-slate-300 font-medium">
                            All changes saved and up to date
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {hasUnsavedChanges && (
                        <button
                          onClick={handleDiscardChanges}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Discard
                        </button>
                      )}
                      <button
                        onClick={handleSavePage}
                        disabled={saving}
                        className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save & Publish</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* CREATE NEW DYNAMIC PAGE MODAL */}
      {isAddPageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black font-heading text-[var(--text-primary)]">
                  Add New Content Page
                </h3>
              </div>
              <button
                onClick={() => setIsAddPageModalOpen(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-primary)]">
                  Page Title: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Media Coverage or Volunteer Program"
                  value={newPageForm.pageTitle}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    setNewPageForm({
                      ...newPageForm,
                      pageTitle: title,
                      pageSlug: slug,
                      route: `/${slug}`,
                    });
                  }}
                  className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-primary)]">
                  URL Slug:
                </label>
                <input
                  type="text"
                  placeholder="e.g. media-coverage"
                  value={newPageForm.pageSlug}
                  onChange={(e) =>
                    setNewPageForm({
                      ...newPageForm,
                      pageSlug: e.target.value,
                      route: `/${e.target.value}`,
                    })
                  }
                  className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-mono font-bold text-[var(--text-primary)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-primary)]">
                  Public Route Path:
                </label>
                <input
                  type="text"
                  placeholder="e.g. /media-coverage"
                  value={newPageForm.route}
                  onChange={(e) => setNewPageForm({ ...newPageForm, route: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-mono font-bold text-[var(--text-primary)]"
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 text-[11px] text-cyan-300 border border-cyan-500/20">
                This page will be registered for <strong>{currentWebsiteObj?.name}</strong> and immediately manageable through the Update Content editor.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddPageModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] text-xs font-bold text-[var(--text-muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Page</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UpdateContentManager;
