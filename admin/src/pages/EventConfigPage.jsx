import React, { useEffect, useState } from 'react';
import { adminEventService } from '../services/adminApi';
import { Calendar, Save, RefreshCw, CheckCircle, AlertTriangle, Shield, Clock, MapPin } from 'lucide-react';

export const EventConfigPage = () => {
  const [eventForm, setEventForm] = useState({
    programName: '',
    slogan: '',
    venue: '',
    eventDate: '',
    registrationEndDate: '2026-11-30T23:59',
    registrationOpen: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  const fetchConfig = async () => {
    setLoading(true);
    setFeedback({ type: null, message: '' });
    try {
      const res = await adminEventService.getConfig();
      if (res.data?.success) {
        const cfg = res.data.data;
        setEventForm({
          programName: cfg.programName || '',
          slogan: cfg.slogan || '',
          venue: cfg.venue || '',
          eventDate: cfg.eventDate ? new Date(cfg.eventDate).toISOString().substring(0, 16) : '',
          registrationEndDate: cfg.registrationEndDate
            ? new Date(cfg.registrationEndDate).toISOString().substring(0, 16)
            : '2026-11-30T23:59',
          registrationOpen: cfg.registrationOpen !== false,
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to load event configuration.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: null, message: '' });

    try {
      const res = await adminEventService.updateConfig(eventForm);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'Event parameters and registration controls updated successfully!',
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update event parameters.',
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
            OPERATIONAL CONTROLS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            EVENT CONTROL & TIMELINES
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium">
            Configure marathon title, venue, dates, deadlines, and registration toggles
          </p>
        </div>

        <button
          onClick={fetchConfig}
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

      <div className="p-6 sm:p-8 rounded-3xl bg-[#1C2541] border border-white/10 shadow-2xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          <div>
            <label className="block font-bold text-white uppercase mb-1.5">
              Official Program Name *
            </label>
            <input
              type="text"
              required
              value={eventForm.programName}
              onChange={(e) => setEventForm({ ...eventForm, programName: e.target.value })}
              placeholder="ANTI-DRUG MOVEMENT MARATHON RUN 2026"
              className="w-full py-3 px-4 rounded-xl bg-[#0B132B] border border-white/10 font-bold text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1.5">
              Event Slogan / Theme Motto
            </label>
            <input
              type="text"
              value={eventForm.slogan}
              onChange={(e) => setEventForm({ ...eventForm, slogan: e.target.value })}
              placeholder="YOUR LIFE. YOUR CHOICE. SAY NO TO DRUGS."
              className="w-full py-3 px-4 rounded-xl bg-[#0B132B] border border-white/10 font-bold text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1.5">
              Marathon Venue & Assembly Ground
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#FF7B00] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={eventForm.venue}
                onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                placeholder="Arts College Ground / Chinmaya Mission Ashrama, Adoni"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B132B] border border-white/10 font-bold text-white focus:outline-none focus:border-[#00B4D8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white uppercase mb-1.5">
                Marathon Event Date & Start Time
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#00B4D8] absolute left-3.5 top-3.5" />
                <input
                  type="datetime-local"
                  value={eventForm.eventDate}
                  onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B132B] border border-white/10 font-bold text-white focus:outline-none focus:border-[#00B4D8]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1.5">
                Registration Deadline (Cut-off)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#FF7B00] absolute left-3.5 top-3.5" />
                <input
                  type="datetime-local"
                  value={eventForm.registrationEndDate}
                  onChange={(e) => setEventForm({ ...eventForm, registrationEndDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B132B] border border-white/10 font-bold text-white focus:outline-none focus:border-[#00B4D8]"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B132B] border border-white/10 flex items-center justify-between gap-4">
            <div>
              <span className="font-extrabold text-white text-xs block">
                Public Registration Status
              </span>
              <p className="text-[11px] text-[#94A3B8]">
                Enable or disable student registration forms on the public website
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={eventForm.registrationOpen}
                onChange={(e) => setEventForm({ ...eventForm, registrationOpen: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#243054] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00B4D8]"></div>
            </label>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full justify-center py-3 text-xs font-bold"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating Settings...' : 'Save Event Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventConfigPage;
