import React, { useEffect, useState } from 'react';
import { adminActivityService } from '../services/adminApi';
import {
  Sparkles,
  Upload,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  AlertTriangle,
} from 'lucide-react';

export const ActivitiesCmsPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Marathon Training',
    description: '',
    file: null,
  });
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await adminActivityService.getAllAdmin();
      if (res.data?.success) {
        setActivities(res.data.data);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to load activities.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) {
      alert('Please select an image file for the activity card.');
      return;
    }

    setUploading(true);
    setFeedback({ type: null, message: '' });

    try {
      const formData = new FormData();
      formData.append('image', form.file);
      formData.append('title', form.title);
      formData.append('category', form.category);
      formData.append('description', form.description);

      const res = await adminActivityService.createActivity(formData);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'Activity post published successfully!',
        });
        setForm({ title: '', category: 'Marathon Training', description: '', file: null });
        fetchActivities();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create activity post.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await adminActivityService.toggleStatus(id);
      if (res.data?.success) {
        fetchActivities();
      }
    } catch (err) {
      alert('Failed to update activity status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently delete activity "${title || id}"?`)) return;

    try {
      const res = await adminActivityService.deleteActivity(id);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'Activity deleted from database.',
        });
        fetchActivities();
      }
    } catch (err) {
      alert('Failed to delete activity');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black tracking-widest text-[#00B4D8] uppercase">
            COMMUNITY & EVENTS CMS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            ACTIVITIES GALLERY CMS
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium">
            Manage youth activities, marathon preparation workshops, and community events
          </p>
        </div>

        <button
          onClick={fetchActivities}
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

      {/* Form Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Plus className="w-5 h-5 text-[#00B4D8]" />
          <h3 className="text-sm font-black font-heading text-white uppercase tracking-wider">
            Add New Activity Post
          </h3>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Activity Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Anti-Drug Youth Awareness Rally"
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              />
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Marathon Training, Youth Workshop, Community Service"
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1">
              Short Description / Overview
            </label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Highlight the objectives and impact of this initiative..."
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1">
              Activity Photo File *
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
              <span>{uploading ? 'Publishing Post...' : 'Publish Activity Post'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Activities Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-black font-heading text-white">
          PUBLISHED ACTIVITIES ({activities.length})
        </h3>

        {loading ? (
          <p className="text-xs text-[#94A3B8] text-center py-8">Loading activities...</p>
        ) : activities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {activities.map((act) => (
              <div
                key={act._id}
                className="rounded-2xl bg-[#1C2541] border border-white/10 overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-[#0B132B] overflow-hidden">
                  <img
                    src={act.imageUrl}
                    alt={act.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#FF7B00]/90 text-[10px] font-bold text-white">
                    {act.category}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-extrabold text-sm text-white">{act.title}</h4>
                  <p className="text-xs text-[#94A3B8] line-clamp-2">{act.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleToggle(act._id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        act.isActive
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-zinc-500/15 text-zinc-400'
                      }`}
                    >
                      {act.isActive ? 'Published' : 'Draft'}
                    </button>

                    <button
                      onClick={() => handleDelete(act._id, act.title)}
                      className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete Activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#64748B] text-center py-8">No activities published yet.</p>
        )}
      </div>
    </div>
  );
};

export default ActivitiesCmsPage;
