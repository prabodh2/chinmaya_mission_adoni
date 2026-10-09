import React, { useEffect, useState } from 'react';
import { adminBannerService } from '../services/adminApi';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  AlertTriangle,
} from 'lucide-react';

export const BannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    bannerType: 'HORIZONTAL',
    file: null,
  });
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await adminBannerService.getAllAdmin();
      if (res.data?.success) {
        setBanners(res.data.data);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to load banners.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) {
      alert('Please select an image file to upload.');
      return;
    }

    setUploading(true);
    setFeedback({ type: null, message: '' });

    try {
      const formData = new FormData();
      formData.append('image', form.file);
      formData.append('title', form.title || `${form.bannerType} Banner`);
      formData.append('bannerType', form.bannerType);

      const res = await adminBannerService.uploadBanner(formData);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'Banner uploaded and published successfully!',
        });
        setForm({ title: '', bannerType: 'HORIZONTAL', file: null });
        fetchBanners();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to upload banner.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await adminBannerService.toggleStatus(id);
      if (res.data?.success) {
        fetchBanners();
      }
    } catch (err) {
      alert('Failed to update banner status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently delete banner "${title || id}"?`)) return;

    try {
      const res = await adminBannerService.deleteBanner(id);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'Banner deleted from database.',
        });
        fetchBanners();
      }
    } catch (err) {
      alert('Failed to delete banner');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black tracking-widest text-[#00B4D8] uppercase">
            VISUAL CAMPAIGNS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            BANNER UPLOADS & SLIDERS
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium">
            Upload horizontal and vertical promotional event banners
          </p>
        </div>

        <button
          onClick={fetchBanners}
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

      {/* Upload Form Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Upload className="w-5 h-5 text-[#00B4D8]" />
          <h3 className="text-sm font-black font-heading text-white uppercase tracking-wider">
            Upload New Banner
          </h3>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Banner Title / Label
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Marathon Kickoff Main Banner"
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              />
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Orientation / Type
              </label>
              <select
                value={form.bannerType}
                onChange={(e) => setForm({ ...form, bannerType: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              >
                <option value="HORIZONTAL" className="bg-[#0B132B]">Horizontal Banner (16:9 / Landscape)</option>
                <option value="VERTICAL" className="bg-[#0B132B]">Vertical Poster (9:16 / Portrait)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1">
              Select Banner Image File *
            </label>
            <input
              type="file"
              required
              accept="image/*"
              onChange={(e) => setForm({ ...form, file: e.target.files[0] || null })}
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
              <span>{uploading ? 'Uploading Banner...' : 'Upload & Publish Banner'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Banners Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-black font-heading text-white">
          ACTIVE BANNER LIBRARY ({banners.length})
        </h3>

        {loading ? (
          <p className="text-xs text-[#94A3B8] text-center py-8">Loading banners...</p>
        ) : banners.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="rounded-2xl bg-[#1C2541] border border-white/10 overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-[#0B132B] overflow-hidden">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white">
                    {banner.bannerType}
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-white truncate">{banner.title}</h4>
                    <span className="text-[10px] text-[#64748B]">
                      Added on {new Date(banner.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <button
                      onClick={() => handleToggle(banner._id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        banner.isActive
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-zinc-500/15 text-zinc-400'
                      }`}
                    >
                      {banner.isActive ? 'Active' : 'Disabled'}
                    </button>

                    <button
                      onClick={() => handleDelete(banner._id, banner.title)}
                      className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#64748B] text-center py-8">No banners uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default BannersPage;
