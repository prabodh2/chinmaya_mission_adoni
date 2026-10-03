import React, { useState, useEffect, useRef } from 'react';
import { mediaService } from '../../services/api';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Edit2,
  Trash2,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Upload,
  AlertTriangle,
  X,
  Tag,
  Folder,
  Globe,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  FileText,
  Maximize2,
} from 'lucide-react';

const CATEGORIES = [
  'ALL',
  'Home',
  'About',
  'Activities',
  'What We Do',
  "Let's Connect",
  'Marathon',
  'Registration',
  'Banner',
  'Footer',
  'Gallery',
  'Other',
];

const PAGES = [
  'ALL',
  'Home',
  'About',
  'Activities',
  'What We Do',
  "Let's Connect",
  'Registration',
  'General',
];

export const AdminImagesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 24, total: 0, pages: 1 });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Filter States
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [pageFilter, setPageFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Selected Item
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    caption: '',
    altText: 'Anti-Drug Movement Marathon 2026 Asset',
    category: 'Home',
    page: 'Home',
    section: 'Hero Banner',
    tags: '',
    status: 'ACTIVE',
    displayOrder: 0,
    file: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: null, text: null });
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  const replaceFileInputRef = useRef(null);

  // Fetch Media List
  const fetchMedia = async (pageNo = 1) => {
    setLoading(true);
    try {
      const res = await mediaService.getMedia({
        search,
        category: categoryFilter,
        pageName: pageFilter,
        status: statusFilter,
        page: pageNo,
        limit: pagination.limit,
      });

      if (res.data?.success && res.data?.data) {
        setItems(res.data.data.items || []);
        setPagination(res.data.data.pagination || { page: pageNo, limit: 24, total: 0, pages: 1 });
      }
    } catch (err) {
      console.error('Failed to load media assets:', err);
      setStatusMsg({ type: 'error', text: 'Failed to load media assets. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia(1);
  }, [categoryFilter, pageFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMedia(1);
  };

  // Preview File & Calculate Image Dimensions
  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Unsupported file format. Please select an image (JPG, PNG, WEBP, SVG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size is too large. Maximum allowed size is 10MB.');
      return;
    }

    setForm((prev) => ({ ...prev, file }));
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Read Dimensions
    const img = new Image();
    img.onload = () => {
      setPreviewDimensions({ width: img.width, height: img.height });
    };
    img.src = objectUrl;
  };

  // Create Image Record
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) {
      alert('Please select an image file to upload.');
      return;
    }

    setSubmitting(true);
    setStatusMsg({ type: null, text: null });

    try {
      const formData = new FormData();
      formData.append('image', form.file);
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('caption', form.caption);
      formData.append('altText', form.altText);
      formData.append('category', form.category);
      formData.append('page', form.page);
      formData.append('section', form.section);
      formData.append('tags', form.tags);
      formData.append('status', form.status);
      formData.append('displayOrder', form.displayOrder);
      formData.append('width', previewDimensions.width);
      formData.append('height', previewDimensions.height);

      const res = await mediaService.uploadMedia(formData);
      if (res.data?.success) {
        setStatusMsg({ type: 'success', text: 'Image uploaded and saved to Media Library!' });
        setShowAddModal(false);
        resetForm();
        fetchMedia(1);
      }
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to upload image. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Image & Metadata Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMedia) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (form.file) {
        formData.append('image', form.file);
      }
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('caption', form.caption);
      formData.append('altText', form.altText);
      formData.append('category', form.category);
      formData.append('page', form.page);
      formData.append('section', form.section);
      formData.append('tags', form.tags);
      formData.append('status', form.status);
      formData.append('displayOrder', form.displayOrder);

      const res = await mediaService.updateMedia(selectedMedia._id, formData);

      if (res.data?.success) {
        setStatusMsg({
          type: 'success',
          text: form.file
            ? 'Image file and metadata updated successfully!'
            : 'Image metadata updated successfully!',
        });
        setShowEditModal(false);
        fetchMedia(pagination.page);
      }
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update image asset.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Replace Image File Submit
  const handleReplaceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMedia || !form.file) {
      alert('Please select a replacement image file.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', form.file);

      const res = await mediaService.replaceMediaFile(selectedMedia._id, formData);
      if (res.data?.success) {
        setStatusMsg({ type: 'success', text: 'Image file replaced successfully!' });
        setShowReplaceModal(false);
        fetchMedia(pagination.page);
      }
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to replace image file.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Media
  const handleDeleteConfirm = async (force = false) => {
    if (!selectedMedia) return;

    setSubmitting(true);
    try {
      const res = await mediaService.deleteMedia(selectedMedia._id, force);
      if (res.data?.success) {
        setStatusMsg({ type: 'success', text: 'Media asset deleted successfully.' });
        setShowDeleteModal(false);
        fetchMedia(pagination.page);
      }
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.requiresConfirmation) {
        if (window.confirm(`${errData.message}\n\nDo you want to proceed with deleting it anyway?`)) {
          handleDeleteConfirm(true);
        }
      } else {
        alert(errData?.message || 'Failed to delete image asset.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (item) => {
    setSelectedMedia(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      caption: item.caption || '',
      altText: item.altText || '',
      category: item.category || 'Home',
      page: item.page || 'Home',
      section: item.section || 'General',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      status: item.status || 'ACTIVE',
      displayOrder: item.displayOrder || 0,
      file: null,
    });
    setPreviewUrl(item.url);
    setShowEditModal(true);
  };

  const openReplaceModal = (item) => {
    setSelectedMedia(item);
    setForm((prev) => ({ ...prev, file: null }));
    setPreviewUrl(item.url);
    setShowReplaceModal(true);
  };

  const openDetailsModal = (item) => {
    setSelectedMedia(item);
    setShowDetailsModal(true);
  };

  const openDeleteModal = (item) => {
    setSelectedMedia(item);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      caption: '',
      altText: 'Anti-Drug Movement Marathon 2026 Asset',
      category: 'Home',
      page: 'Home',
      section: 'Hero Banner',
      tags: '',
      status: 'ACTIVE',
      displayOrder: 0,
      file: null,
    });
    setPreviewUrl(null);
    setPreviewDimensions({ width: 0, height: 0 });
    setSelectedMedia(null);
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--cyan)]/15 text-[var(--cyan)] font-extrabold text-xs tracking-wider uppercase mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>CENTRALIZED MEDIA CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-[var(--text-primary)]">
            IMAGES & MEDIA LIBRARY
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium mt-1">
            Manage, upload, optimize, and organize image assets used across the entire website.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="btn-primary py-3 px-6 text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW IMAGE</span>
        </button>
      </div>

      {/* Status Notifications */}
      {statusMsg.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-extrabold flex items-center justify-between gap-3 shadow-md ${
            statusMsg.type === 'error'
              ? 'bg-red-500/15 border border-red-500/30 text-red-500'
              : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-500'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span>{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg({ type: null, text: null })} className="p-1 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SEARCH & FILTERS CONTROLS */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-5 flex items-center relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images by name, title, tags, page..."
              className="w-full py-2.5 pl-10 pr-24 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
            />
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5" />
            <button
              type="submit"
              className="absolute right-2 px-3 py-1 rounded-xl bg-[var(--cyan)] text-white font-extrabold text-[11px] hover:bg-blue-600 transition-colors"
            >
              SEARCH
            </button>
          </form>

          {/* Category Filter */}
          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--text-muted)] whitespace-nowrap hidden sm:inline">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2.5 px-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)] cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2 flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2.5 px-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)] cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="md:col-span-2 flex items-center justify-end gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl border transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[var(--cyan)]/15 border-[var(--cyan)] text-[var(--cyan)]'
                  : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-muted)]'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2.5 rounded-xl border transition-colors ${
                viewMode === 'table'
                  ? 'bg-[var(--cyan)]/15 border-[var(--cyan)] text-[var(--cyan)]'
                  : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-muted)]'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* MEDIA ASSETS CONTAINER */}
      {loading ? (
        <div className="p-16 text-center space-y-4 glass-card rounded-3xl">
          <div className="w-10 h-10 border-4 border-[var(--cyan)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase">
            Loading Media Library...
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-16 text-center space-y-4 glass-card rounded-3xl border border-[var(--border-color)]">
          <ImageIcon className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
          <h3 className="text-lg font-extrabold text-[var(--text-primary)] font-heading">
            No Images Found
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            No media assets match your search or filter criteria. Click below to add a new image.
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="btn-primary py-2.5 px-6 text-xs text-decoration-none"
          >
            <Plus className="w-4 h-4" />
            <span>ADD FIRST IMAGE</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="glass-card rounded-3xl overflow-hidden border border-[var(--border-color)] hover:border-[var(--cyan)]/60 transition-all shadow-md group flex flex-col justify-between"
            >
              <div>
                {/* Image Preview Window */}
                <div className="relative aspect-[4/3] bg-[var(--bg-primary)] overflow-hidden border-b border-[var(--border-color)]">
                  <img
                    src={item.url}
                    alt={item.altText || item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-extrabold text-[10px] tracking-wider uppercase border border-white/20">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        item.status === 'ACTIVE'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-600 text-slate-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-extrabold font-heading text-[var(--text-primary)] truncate" title={item.title || item.fileName}>
                    {item.title || item.fileName}
                  </h4>

                  <p className="text-[11px] text-[var(--text-muted)] font-medium truncate">
                    File: <span className="font-bold text-[var(--text-primary)]">{item.originalFileName || item.fileName}</span>
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-bold text-[var(--text-muted)] pt-1 border-t border-[var(--border-color)]/40">
                    <span className="text-[var(--cyan)] font-extrabold">
                      Used: {item.page} → {item.section}
                    </span>
                    <span>{formatFileSize(item.fileSize)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-[var(--bg-tertiary)]/50 border-t border-[var(--border-color)] grid grid-cols-4 gap-1 text-center">
                <button
                  onClick={() => openDetailsModal(item)}
                  className="p-2 rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] hover:text-[var(--cyan)] transition-colors border border-[var(--border-color)]"
                  title="View Image Details"
                >
                  <Eye className="w-3.5 h-3.5 mx-auto" />
                </button>
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] hover:text-[var(--orange)] transition-colors border border-[var(--border-color)]"
                  title="Edit Image Metadata"
                >
                  <Edit2 className="w-3.5 h-3.5 mx-auto" />
                </button>
                <button
                  onClick={() => openReplaceModal(item)}
                  className="p-2 rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] hover:text-emerald-500 transition-colors border border-[var(--border-color)]"
                  title="Replace Image File"
                >
                  <RefreshCw className="w-3.5 h-3.5 mx-auto" />
                </button>
                <button
                  onClick={() => openDeleteModal(item)}
                  className="p-2 rounded-xl bg-[var(--bg-primary)] text-red-500 hover:bg-red-500/10 transition-colors border border-[var(--border-color)]"
                  title="Delete Image"
                >
                  <Trash2 className="w-3.5 h-3.5 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="glass-card rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-extrabold uppercase tracking-wider border-b border-[var(--border-color)]">
                <tr>
                  <th className="p-3">Preview</th>
                  <th className="p-3">Title & File</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Used In Location</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]/40 text-[var(--text-primary)]">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-[var(--bg-tertiary)]/40 transition-colors">
                    <td className="p-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-primary)] flex-shrink-0">
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-extrabold text-[var(--text-primary)]">{item.title || item.fileName}</p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate max-w-xs">{item.originalFileName || item.fileName}</p>
                    </td>
                    <td className="p-3 font-extrabold text-[var(--cyan)]">{item.category}</td>
                    <td className="p-3 font-semibold">{item.page} → {item.section}</td>
                    <td className="p-3 font-medium text-[var(--text-muted)]">{formatFileSize(item.fileSize)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${item.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'bg-slate-500/20 text-slate-400'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openDetailsModal(item)} className="p-1.5 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--cyan)]">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEditModal(item)} className="p-1.5 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--orange)]">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => openDeleteModal(item)} className="p-1.5 rounded-lg hover:bg-[var(--bg-primary)] text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAGINATION BAR */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-muted)]">
          <span>
            Showing Page {pagination.page} of {pagination.pages} ({pagination.total} total items)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchMedia(pagination.page - 1)}
              className="p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] disabled:opacity-40 hover:border-[var(--cyan)] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchMedia(pagination.page + 1)}
              className="p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] disabled:opacity-40 hover:border-[var(--cyan)] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD IMAGE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="glass-card w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
              <h3 className="text-xl font-black font-heading text-[var(--text-primary)] flex items-center gap-2">
                <Upload className="w-5 h-5 text-[var(--cyan)]" />
                <span>ADD NEW IMAGE TO MEDIA LIBRARY</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              
              {/* File Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 rounded-2xl border-2 border-dashed border-[var(--cyan)]/50 bg-[var(--bg-primary)] text-center space-y-3 cursor-pointer hover:border-[var(--cyan)] transition-colors relative"
              >
                {previewUrl ? (
                  <div className="space-y-2">
                    <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded-xl object-contain shadow-md" />
                    <p className="text-xs font-bold text-[var(--cyan)]">
                      {form.file?.name} ({formatFileSize(form.file?.size)})
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-[var(--cyan)] mx-auto animate-bounce" />
                    <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      Click or Drag & Drop Image Here (.jpg, .png, .webp, .svg)
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">Maximum file size: 10 MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="hidden"
                />
              </div>

              {/* Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Image Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Marathon Runners at Flag Off"
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Alt Text (Accessibility) *</label>
                  <input
                    type="text"
                    required
                    value={form.altText}
                    onChange={(e) => setForm({ ...form, altText: e.target.value })}
                    placeholder="e.g. Youth participants holding anti-drug banners"
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)]"
                  >
                    {CATEGORIES.filter((c) => c !== 'ALL').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Target Page</label>
                  <select
                    value={form.page}
                    onChange={(e) => setForm({ ...form, page: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)]"
                  >
                    {PAGES.filter((p) => p !== 'ALL').map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Target Section</label>
                  <input
                    type="text"
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    placeholder="e.g. Hero Banner"
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional detailed description for CMS reference..."
                  className="w-full py-2 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="marathon, hero, banner, runners"
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)]"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary py-2.5 px-5 text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2.5 px-6 text-xs"
                >
                  {submitting ? 'UPLOADING...' : 'SAVE TO MEDIA LIBRARY'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT IMAGE & METADATA */}
      {showEditModal && selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="glass-card w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h3 className="text-lg font-black font-heading text-[var(--text-primary)] flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[var(--cyan)]" />
                <span>EDIT IMAGE & CONTENT DETAILS</span>
              </h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              
              {/* Image Preview & Change Image Option */}
              <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[var(--text-primary)] uppercase tracking-wider">
                    Current / Preview Image
                  </span>
                  {form.file && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, file: null }));
                        setPreviewUrl(selectedMedia.url);
                      }}
                      className="text-[11px] font-bold text-[var(--orange)] hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Undo / Keep Original Image</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-secondary)] flex-shrink-0 relative group">
                    <img
                      src={previewUrl || selectedMedia.url}
                      alt={form.title || 'Preview'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow space-y-2 w-full">
                    <div
                      onClick={() => editFileInputRef.current?.click()}
                      className="p-3 rounded-xl border-2 border-dashed border-[var(--cyan)]/50 hover:border-[var(--cyan)] bg-[var(--bg-secondary)] text-center cursor-pointer transition-colors space-y-1"
                    >
                      <Upload className="w-5 h-5 text-[var(--cyan)] mx-auto" />
                      <p className="font-bold text-[var(--text-primary)] text-xs">
                        {form.file ? form.file.name : 'Click or Drag & Drop to Change Image File'}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {form.file ? `${formatFileSize(form.file.size)} • Ready to upload on save` : 'Leave empty to keep existing image file'}
                      </p>
                    </div>

                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      onChange={(e) => handleFileChange(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Title & Alt Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Alt Text (Accessibility) *</label>
                  <input
                    type="text"
                    required
                    value={form.altText}
                    onChange={(e) => setForm({ ...form, altText: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                  />
                </div>
              </div>

              {/* Category, Page, Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)]"
                  >
                    {CATEGORIES.filter((c) => c !== 'ALL').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Target Page</label>
                  <select
                    value={form.page}
                    onChange={(e) => setForm({ ...form, page: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)]"
                  >
                    {PAGES.filter((p) => p !== 'ALL').map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Target Section</label>
                  <input
                    type="text"
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                />
              </div>

              {/* Tags & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)]"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary py-2.5 px-5 text-xs">
                  CANCEL
                </button>
                <button type="submit" disabled={submitting} className="btn-primary py-2.5 px-6 text-xs shadow-lg">
                  {submitting ? 'SAVING CHANGES...' : 'SAVE & UPDATE CONTENT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REPLACE IMAGE FILE */}
      {showReplaceModal && selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="glass-card w-full max-w-md p-6 rounded-3xl border border-[var(--border-color)] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h3 className="text-lg font-black font-heading text-[var(--text-primary)]">
                REPLACE IMAGE FILE
              </h3>
              <button onClick={() => setShowReplaceModal(false)} className="p-1 hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReplaceSubmit} className="space-y-4">
              <p className="text-xs text-[var(--text-muted)]">
                Replace the underlying image file for <span className="font-extrabold text-[var(--text-primary)]">{selectedMedia.title || selectedMedia.fileName}</span>. All existing metadata will be preserved.
              </p>

              <div
                onClick={() => replaceFileInputRef.current?.click()}
                className="p-6 rounded-2xl border-2 border-dashed border-[var(--cyan)]/50 bg-[var(--bg-primary)] text-center space-y-2 cursor-pointer hover:border-[var(--cyan)]"
              >
                <Upload className="w-8 h-8 text-[var(--cyan)] mx-auto animate-bounce" />
                <p className="text-xs font-bold text-[var(--text-primary)]">
                  {form.file ? form.file.name : 'Select Replacement Image File'}
                </p>
                <input
                  ref={replaceFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                  className="hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setShowReplaceModal(false)} className="btn-secondary py-2 px-4 text-xs">
                  CANCEL
                </button>
                <button type="submit" disabled={submitting || !form.file} className="btn-primary py-2 px-5 text-xs">
                  {submitting ? 'REPLACING...' : 'CONFIRM REPLACEMENT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: IMAGE DETAILS */}
      {showDetailsModal && selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="glass-card w-full max-w-3xl p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h3 className="text-lg font-black font-heading text-[var(--text-primary)] flex items-center gap-2">
                <Eye className="w-5 h-5 text-[var(--cyan)]" />
                <span>IMAGE ASSET DETAILS</span>
              </h3>
              <button onClick={() => setShowDetailsModal(false)} className="p-1 hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-primary)] max-h-80 flex items-center justify-center">
                <img src={selectedMedia.url} alt={selectedMedia.title} className="w-full h-full object-contain" />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[var(--text-muted)] font-bold uppercase block">Title</span>
                  <p className="font-black text-base text-[var(--text-primary)]">{selectedMedia.title || 'N/A'}</p>
                </div>

                <div>
                  <span className="text-[var(--text-muted)] font-bold uppercase block">Alt Text</span>
                  <p className="font-semibold text-[var(--text-primary)]">{selectedMedia.altText}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-color)]">
                  <div>
                    <span className="text-[var(--text-muted)] font-bold uppercase block">Category</span>
                    <p className="font-extrabold text-[var(--cyan)]">{selectedMedia.category}</p>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] font-bold uppercase block">Status</span>
                    <p className="font-extrabold text-emerald-500">{selectedMedia.status}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-color)]">
                  <div>
                    <span className="text-[var(--text-muted)] font-bold uppercase block">Used In</span>
                    <p className="font-bold text-[var(--text-primary)]">{selectedMedia.page} → {selectedMedia.section}</p>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] font-bold uppercase block">File Size</span>
                    <p className="font-semibold text-[var(--text-primary)]">{formatFileSize(selectedMedia.fileSize)}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-color)]">
                  <span className="text-[var(--text-muted)] font-bold uppercase block mb-1">Public URL</span>
                  <a
                    href={selectedMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--cyan)] font-semibold underline truncate block max-w-full"
                  >
                    {selectedMedia.url}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end border-t border-[var(--border-color)]">
              <button onClick={() => setShowDetailsModal(false)} className="btn-secondary py-2 px-5 text-xs">
                CLOSE DETAILS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: DELETE CONFIRMATION */}
      {showDeleteModal && selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 rounded-3xl border border-[var(--border-color)] shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-500 pb-3 border-b border-[var(--border-color)]">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-lg font-black font-heading">DELETE IMAGE CONFIRMATION</h3>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
              <img src={selectedMedia.url} alt={selectedMedia.title} className="w-14 h-14 object-cover rounded-xl" />
              <div className="text-xs">
                <p className="font-extrabold text-[var(--text-primary)]">{selectedMedia.title || selectedMedia.fileName}</p>
                <p className="text-[var(--text-muted)]">Location: {selectedMedia.page} → {selectedMedia.section}</p>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Are you sure you want to delete this media asset? Deleting it will permanently remove it from the central library.
            </p>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[var(--border-color)]">
              <button onClick={() => setShowDeleteModal(false)} className="btn-secondary py-2 px-4 text-xs">
                CANCEL
              </button>
              <button onClick={() => handleDeleteConfirm(false)} disabled={submitting} className="btn-primary py-2 px-5 text-xs bg-red-600 hover:bg-red-700">
                {submitting ? 'DELETING...' : 'CONFIRM DELETE'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminImagesPage;
