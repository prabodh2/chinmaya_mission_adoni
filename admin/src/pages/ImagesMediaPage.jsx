import React, { useEffect, useState } from 'react';
import { adminMediaService } from '../services/adminApi';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Filter,
  Plus,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

export const ImagesMediaPage = () => {
  const [mediaList, setMediaList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'General',
    file: null,
  });
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const [mediaRes, catRes] = await Promise.all([
        adminMediaService.getMedia({
          category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        }),
        adminMediaService.getCategories(),
      ]);

      if (mediaRes.data?.success) setMediaList(mediaRes.data.data.items || mediaRes.data.data);
      if (catRes.data?.success) setCategories(catRes.data.data);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedCategory]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      alert('Please select an image file to upload.');
      return;
    }

    setUploading(true);
    setFeedback({ type: null, message: '' });

    try {
      const formData = new FormData();
      formData.append('image', uploadForm.file);
      formData.append('title', uploadForm.title || 'Media Upload');
      formData.append('category', uploadForm.category || 'General');

      const res = await adminMediaService.uploadMedia(formData);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'Image asset uploaded successfully to media storage!',
        });
        setUploadForm({ title: '', category: 'General', file: null });
        fetchMedia();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to upload image.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently delete media item "${title || id}"?`)) return;

    try {
      const res = await adminMediaService.deleteMedia(id);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'Media item deleted from database.',
        });
        fetchMedia();
      }
    } catch (err) {
      alert('Failed to delete media');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black tracking-widest text-[#00B4D8] uppercase">
            CLOUD ASSETS & CDN
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            IMAGES & MEDIA LIBRARY
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium">
            Upload, browse, categorize, and retrieve image asset URLs for CMS and banners
          </p>
        </div>

        <button
          onClick={fetchMedia}
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

      {/* Upload Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Upload className="w-5 h-5 text-[#00B4D8]" />
          <h3 className="text-sm font-black font-heading text-white uppercase tracking-wider">
            Upload Image Asset
          </h3>
        </div>

        <form onSubmit={handleUpload} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Image Title / Description
              </label>
              <input
                type="text"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder="e.g. Marathon Finish Line 2026"
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              />
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Asset Category
              </label>
              <input
                type="text"
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                placeholder="e.g. Banners, Events, Logos, Posters"
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1">
              Select Image File *
            </label>
            <input
              type="file"
              required
              accept="image/*"
              onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] || null })}
              className="w-full py-2 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-[#94A3B8] focus:outline-none focus:border-[#00B4D8] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#00B4D8] file:text-white"
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={uploading}
              className="btn-primary text-xs py-2.5 px-5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Uploading Asset...' : 'Upload Image'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Media Filter & Library */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-black font-heading text-white">
            MEDIA ASSET REPOSITORY ({mediaList.length})
          </h3>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#94A3B8]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-[#1C2541] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            >
              <option value="ALL" className="bg-[#0B132B]">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#0B132B]">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-xs text-[#94A3B8] text-center py-8">Loading media library...</p>
        ) : mediaList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaList.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl bg-[#1C2541] border border-white/10 overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-[#0B132B] overflow-hidden group">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold text-white">
                    {item.category || 'General'}
                  </span>
                </div>

                <div className="p-3.5 space-y-2.5">
                  <div>
                    <h4 className="font-extrabold text-xs text-white truncate">{item.title}</h4>
                    <span className="text-[10px] text-[#64748B] block truncate">
                      {item.url}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <button
                      onClick={() => handleCopyUrl(item.url, item._id)}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#00B4D8] hover:underline"
                    >
                      {copiedId === item._id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      className="p-1 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#64748B] text-center py-8">No media items in this category.</p>
        )}
      </div>
    </div>
  );
};

export default ImagesMediaPage;
