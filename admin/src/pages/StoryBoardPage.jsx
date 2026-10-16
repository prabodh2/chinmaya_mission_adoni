import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquareQuote,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  User,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Lock,
  Sparkles,
  CheckCheck,
} from 'lucide-react';
import { adminThoughtService } from '../services/adminApi';

const COLOR_STYLES = {
  sky: { name: 'Sky Blue', bg: 'bg-[#E0F2FE]', border: 'border-[#BAE6FD]', text: 'text-[#0369A1]', tape: 'bg-[#BAE6FD]/80' },
  yellow: { name: 'Warm Yellow', bg: 'bg-[#FEF9C3]', border: 'border-[#FDE047]', text: 'text-[#854D0E]', tape: 'bg-[#FDE047]/80' },
  coral: { name: 'Soft Coral', bg: 'bg-[#FFE4E6]', border: 'border-[#FECDD3]', text: 'text-[#9F1239]', tape: 'bg-[#FECDD3]/80' },
  mint: { name: 'Mint Green', bg: 'bg-[#DCFCE7]', border: 'border-[#BBF7D0]', text: 'text-[#166534]', tape: 'bg-[#BBF7D0]/80' },
  lavender: { name: 'Lavender', bg: 'bg-[#F3E8FF]', border: 'border-[#E9D5FF]', text: 'text-[#6B21A8]', tape: 'bg-[#E9D5FF]/80' },
  peach: { name: 'Peach', bg: 'bg-[#FFEDD5]', border: 'border-[#FED7AA]', text: 'text-[#9A3412]', tape: 'bg-[#FED7AA]/80' },
  cream: { name: 'Warm Cream', bg: 'bg-[#FFFBEB]', border: 'border-[#FEF3C7]', text: 'text-[#78350F]', tape: 'bg-[#FEF3C7]/80' },
};

export const StoryBoardPage = () => {
  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' | 'APPROVED'
  const [thoughts, setThoughts] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColorFilter, setSelectedColorFilter] = useState('ALL');

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectDialogItem, setRejectDialogItem] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const fetchData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const [statsRes, thoughtsRes] = await Promise.all([
        adminThoughtService.getStats(),
        adminThoughtService.getThoughts({ status: activeTab, limit: 100 }),
      ]);

      if (statsRes.data?.success) {
        setStats(statsRes.data.data);
      }

      if (thoughtsRes.data?.success) {
        setThoughts(thoughtsRes.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching admin thoughts:', err);
      showNotification('error', err.response?.data?.message || 'Failed to load story board data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleApprove = async (thought) => {
    setActionLoadingId(thought._id);
    try {
      const res = await adminThoughtService.approveThought(thought._id);
      if (res.data?.success) {
        showNotification('success', 'Thought approved and published successfully.');
        setThoughts((prev) => prev.filter((t) => t._id !== thought._id));
        setStats((prev) => ({
          ...prev,
          pending: Math.max(0, prev.pending - 1),
          approved: prev.approved + 1,
        }));
      }
    } catch (err) {
      console.error('Approval error:', err);
      showNotification('error', err.response?.data?.message || 'Failed to approve thought.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectDialogItem) return;
    const targetId = rejectDialogItem._id;
    setActionLoadingId(targetId);

    try {
      const res = await adminThoughtService.rejectThought(targetId);
      if (res.data?.success) {
        showNotification('success', 'Thought rejected and permanently deleted.');
        setThoughts((prev) => prev.filter((t) => t._id !== targetId));
        setStats((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          pending: rejectDialogItem.status === 'PENDING' ? Math.max(0, prev.pending - 1) : prev.pending,
          approved: rejectDialogItem.status === 'APPROVED' ? Math.max(0, prev.approved - 1) : prev.approved,
        }));
        setRejectDialogItem(null);
      }
    } catch (err) {
      console.error('Rejection error:', err);
      showNotification('error', err.response?.data?.message || 'Failed to reject and delete thought.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };

  const filteredThoughts = useMemo(() => {
    return thoughts.filter((t) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        t.content.toLowerCase().includes(q) ||
        (t.user?.fullName && t.user.fullName.toLowerCase().includes(q)) ||
        (t.user?.phone && t.user.phone.includes(q)) ||
        (t.user?.email && t.user.email.toLowerCase().includes(q));

      const matchesColor = selectedColorFilter === 'ALL' || t.color === selectedColorFilter;
      return matchesSearch && matchesColor;
    });
  }, [thoughts, searchTerm, selectedColorFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {notification && (
        <div
          className={`fixed top-20 right-6 z-50 px-5 py-3.5 rounded-2xl border shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/90 border-red-500/50 text-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="text-xs font-bold">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#00B4D8]/20 text-[#00B4D8] border border-[#00B4D8]/30">
              COMMUNITY MODERATION
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Admin Visibility Only</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            Story Board Moderation
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Review participant thoughts before they appear on the public Marathon Story Board. Submitter identities are shown below for administrative safety and are strictly hidden from the public.
          </p>
        </div>

        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="px-4 py-2.5 rounded-xl bg-[#243054] text-white hover:bg-[#00B4D8]/20 border border-white/10 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#00B4D8]' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-[#1C2541] border-2 border-amber-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
              PENDING REVIEW
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-white font-heading">
            {stats.pending}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Submissions awaiting approval
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#1C2541] border border-emerald-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              PUBLISHED ON BOARD
            </span>
            <CheckCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-white font-heading">
            {stats.approved}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Live anonymous stories on website
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#00B4D8]">
              TOTAL SUBMISSIONS
            </span>
            <MessageSquareQuote className="w-4 h-4 text-[#00B4D8]" />
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-white font-heading">
            {stats.total}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Community contributions in DB
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#1C2541] border border-white/10 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'PENDING'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Pending Review</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20 text-white font-mono">
              {stats.pending}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('APPROVED')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'APPROVED'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckCheck className="w-4 h-4" />
            <span>Published Stories</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20 text-white font-mono">
              {stats.approved}
            </span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search content or submitter..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#243054] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Color:</span>
            <button
              onClick={() => setSelectedColorFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedColorFilter === 'ALL'
                  ? 'bg-[#00B4D8] text-white'
                  : 'bg-[#243054] text-slate-300 border border-white/10'
              }`}
            >
              All
            </button>
            {Object.entries(COLOR_STYLES).map(([key, style]) => (
              <button
                key={key}
                onClick={() => setSelectedColorFilter(key)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                  selectedColorFilter === key
                    ? 'ring-2 ring-[#00B4D8] ' + style.bg + ' ' + style.text
                    : style.bg + ' ' + style.text + ' opacity-75 hover:opacity-100'
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions List */}
      {!loading && filteredThoughts.length > 0 && (
        <div className="space-y-4">
          {filteredThoughts.map((thought) => {
            const colorStyle = COLOR_STYLES[thought.color] || COLOR_STYLES.yellow;
            const isPending = thought.status === 'PENDING';
            const isActionLoading = actionLoadingId === thought._id;

            return (
              <div
                key={thought._id}
                className="p-5 sm:p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-md flex flex-col lg:flex-row items-stretch gap-6"
              >
                <div className="w-full lg:w-72 shrink-0 p-4 rounded-2xl bg-[#0B132B] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00B4D8] flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>SUBMITTER DETAILS</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isPending
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {thought.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400">FULL NAME</p>
                      <p className="font-extrabold text-white text-sm truncate">
                        {thought.user?.fullName || 'Registered Participant'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400">PHONE NUMBER</p>
                      <p className="font-mono font-bold text-white flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#00B4D8]" />
                        <span>+91 {thought.user?.phone || 'N/A'}</span>
                      </p>
                    </div>

                    {thought.user?.email && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400">EMAIL ADDRESS</p>
                        <p className="font-medium text-white truncate flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{thought.user.email}</span>
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-[10px] font-bold text-slate-400">SUBMITTED AT</p>
                      <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(thought.createdAt)}</span>
                      </p>
                    </div>

                    {thought.reviewedAt && (
                      <div className="pt-2 border-t border-white/10 text-[10px] text-emerald-400 font-semibold">
                        Approved by {thought.reviewedBy?.fullName || 'Admin'} on {formatDate(thought.reviewedAt)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div
                    className={`relative rounded-2xl border-2 p-5 ${colorStyle.bg} ${colorStyle.border} shadow-sm`}
                  >
                    <div
                      className={`absolute -top-2.5 left-8 w-14 h-4 ${colorStyle.tape} rounded-xs border border-black/5 pointer-events-none`}
                    />

                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10 text-[11px] font-bold">
                      <span className="uppercase tracking-wider text-black/60">
                        {colorStyle.name} Sticky Note
                      </span>
                      <span className="font-mono text-black/50">
                        {(thought.content || '').length} chars
                      </span>
                    </div>

                    <p
                      className={`text-sm sm:text-base leading-relaxed font-medium ${colorStyle.text} whitespace-pre-line`}
                    >
                      {thought.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {thought._id}
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setRejectDialogItem(thought)}
                        disabled={isActionLoading}
                        className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer"
                        title="Reject and permanently delete this thought"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{isPending ? 'Reject & Delete' : 'Delete'}</span>
                      </button>

                      {isPending && (
                        <button
                          onClick={() => handleApprove(thought)}
                          disabled={isActionLoading}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                        >
                          {isActionLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          <span>Approve & Publish</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog */}
      {rejectDialogItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-md bg-[#1C2541] border-2 border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
            role="alertdialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3 text-red-500">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black font-heading text-white">
                  Reject & Delete Thought?
                </h3>
                <p className="text-xs text-slate-400">
                  Destructive moderation action
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B132B] border border-white/10 text-xs text-slate-300 space-y-2">
              <p className="leading-relaxed">
                Are you sure you want to reject and permanently delete this thought?
              </p>
              <div className="p-3 rounded-xl bg-black/20 text-xs italic line-clamp-3 text-slate-400 font-serif">
                "{rejectDialogItem.content}"
              </div>
              <p className="text-[11px] text-red-400 font-semibold pt-1">
                This submission will be permanently removed from the database and will never appear on the public Story Board.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectDialogItem(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reject & Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryBoardPage;
