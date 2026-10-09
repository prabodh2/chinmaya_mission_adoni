import React, { useState, useEffect, useMemo } from 'react';
import { contactService } from '../../services/api';
import {
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Download,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  Trash2,
  ExternalLink,
  MessageCircle,
  Sparkles,
  User,
  Tag,
  AlertCircle,
  CheckCheck,
  Eye,
  X,
  Send,
} from 'lucide-react';

export const LetsConnectManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchMessages = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await contactService.getMessagesAdmin();
      if (res.data?.success) {
        setMessages(res.data.data || []);
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionLoadingId(id);
    try {
      const res = await contactService.updateStatus(id, newStatus);
      if (res.data?.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
        );
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage((prev) => ({ ...prev, status: newStatus }));
        }
        showNotification('success', `Status updated to ${newStatus}`);
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    setActionLoadingId(id);
    try {
      const res = await contactService.deleteMessage(id);
      if (res.data?.success) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
        setDeleteConfirmId(null);
        showNotification('success', 'Message deleted successfully');
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete message');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredMessages.length === 0) {
      showNotification('error', 'No messages to export');
      return;
    }

    let csv = 'Message ID,Date,Full Name,Email,Phone,Category,Status,Message Content\n';
    filteredMessages.forEach((m) => {
      const cleanMsg = (m.message || '').replace(/"/g, '""').replace(/\n/g, ' ');
      csv += `"${m._id}","${new Date(m.createdAt).toLocaleString()}","${m.fullName || ''}","${m.email || ''}","${m.phone || ''}","${m.category || 'General Inquiry'}","${m.status || 'NEW'}","${cleanMsg}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LetsConnect_Messages_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('success', 'Exported messages to CSV');
  };

  // KPIs
  const stats = useMemo(() => {
    const total = messages.length;
    const newCount = messages.filter((m) => m.status === 'NEW').length;
    const readCount = messages.filter((m) => m.status === 'READ').length;
    const respondedCount = messages.filter((m) => m.status === 'RESPONDED').length;
    return { total, newCount, readCount, respondedCount };
  }, [messages]);

  // Categories present in the dataset
  const categoriesList = useMemo(() => {
    const defaultCategories = [
      'General Inquiry',
      'Volunteering & Event Help',
      'Marathon Registration Inquiry',
      'Youth Programs & CHYK',
      'Spiritual Classes & Discourses',
      'Community Service',
    ];
    const uniqueInMsgs = Array.from(new Set(messages.map((m) => m.category).filter(Boolean)));
    return Array.from(new Set([...defaultCategories, ...uniqueInMsgs]));
  }, [messages]);

  // Filtered & Sorted Messages
  const filteredMessages = useMemo(() => {
    return messages
      .filter((m) => {
        const q = searchTerm.trim().toLowerCase();
        const matchesSearch =
          !q ||
          (m.fullName && m.fullName.toLowerCase().includes(q)) ||
          (m.email && m.email.toLowerCase().includes(q)) ||
          (m.phone && m.phone.toLowerCase().includes(q)) ||
          (m.message && m.message.toLowerCase().includes(q)) ||
          (m.category && m.category.toLowerCase().includes(q));

        const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
        const matchesCategory = categoryFilter === 'ALL' || m.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
      });
  }, [messages, searchTerm, statusFilter, categoryFilter, sortOrder]);

  // Clean raw phone for whatsapp link
  const getWhatsAppLink = (phone, name) => {
    if (!phone) return '#';
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
    const text = encodeURIComponent(`Hello ${name || ''}, Greetings from Chinmaya Mission Adoni! We received your message regarding: `);
    return `https://wa.me/${fullPhone}?text=${text}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-500 border border-amber-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            NEW
          </span>
        );
      case 'READ':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-500/15 text-blue-500 border border-blue-500/30">
            <Eye className="w-3.5 h-3.5" />
            READ
          </span>
        );
      case 'RESPONDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
            <CheckCheck className="w-3.5 h-3.5" />
            RESPONDED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-500/15 text-gray-400">
            {status}
          </span>
        );
    }
  };

  const getCategoryBadgeClass = (category) => {
    if (!category) return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
    const c = category.toLowerCase();
    if (c.includes('marathon')) return 'bg-[var(--orange)]/15 text-[var(--orange)] border-[var(--orange)]/30';
    if (c.includes('volunteer')) return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
    if (c.includes('youth') || c.includes('chyk')) return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    if (c.includes('spiritual')) return 'bg-[var(--cyan)]/15 text-[var(--cyan)] border-[var(--cyan)]/30';
    return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-extrabold border transition-all animate-in slide-in-from-top-4 ${
            notification.type === 'success'
              ? 'bg-emerald-500 text-white border-emerald-400'
              : 'bg-red-500 text-white border-red-400'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--orange)] to-amber-600 text-white flex items-center justify-center shadow-lg shadow-[var(--orange)]/20">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] text-[10px] font-extrabold uppercase border border-[var(--orange)]/30">
                INQUIRIES & CONTACT
              </span>
              {stats.newCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                  {stats.newCount} NEW
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-[var(--text-primary)] mt-1">
              LET'S CONNECT INBOX
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-semibold mt-0.5">
              Manage, review, and respond to all inquiries submitted through the Let's Connect page.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => fetchMessages(true)}
            disabled={refreshing}
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[var(--orange)]' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter('ALL')}
          className={`cursor-pointer p-5 rounded-3xl bg-[var(--bg-secondary)] border transition-all ${
            statusFilter === 'ALL'
              ? 'border-[var(--orange)] shadow-lg shadow-[var(--orange)]/10'
              : 'border-[var(--border-color)] hover:border-[var(--border-color)]/80'
          }`}
        >
          <span className="text-[11px] font-extrabold text-[var(--text-muted)] block uppercase">
            Total Inquiries
          </span>
          <h3 className="text-3xl font-black text-[var(--text-primary)] font-heading mt-1">
            {stats.total}
          </h3>
        </div>

        <div
          onClick={() => setStatusFilter('NEW')}
          className={`cursor-pointer p-5 rounded-3xl bg-[var(--bg-secondary)] border transition-all ${
            statusFilter === 'NEW'
              ? 'border-amber-500 shadow-lg shadow-amber-500/10'
              : 'border-[var(--border-color)] hover:border-[var(--border-color)]/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-amber-500 block uppercase">
              New / Unread
            </span>
            {stats.newCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </div>
          <h3 className="text-3xl font-black text-amber-500 font-heading mt-1">
            {stats.newCount}
          </h3>
        </div>

        <div
          onClick={() => setStatusFilter('READ')}
          className={`cursor-pointer p-5 rounded-3xl bg-[var(--bg-secondary)] border transition-all ${
            statusFilter === 'READ'
              ? 'border-blue-500 shadow-lg shadow-blue-500/10'
              : 'border-[var(--border-color)] hover:border-[var(--border-color)]/80'
          }`}
        >
          <span className="text-[11px] font-extrabold text-blue-400 block uppercase">
            Marked As Read
          </span>
          <h3 className="text-3xl font-black text-blue-400 font-heading mt-1">
            {stats.readCount}
          </h3>
        </div>

        <div
          onClick={() => setStatusFilter('RESPONDED')}
          className={`cursor-pointer p-5 rounded-3xl bg-[var(--bg-secondary)] border transition-all ${
            statusFilter === 'RESPONDED'
              ? 'border-emerald-500 shadow-lg shadow-emerald-500/10'
              : 'border-[var(--border-color)] hover:border-[var(--border-color)]/80'
          }`}
        >
          <span className="text-[11px] font-extrabold text-emerald-500 block uppercase">
            Responded
          </span>
          <h3 className="text-3xl font-black text-emerald-500 font-heading mt-1">
            {stats.respondedCount}
          </h3>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="glass-card p-5 rounded-3xl border border-[var(--border-color)] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="md:col-span-2 relative flex items-center">
            <Search className="w-4 h-4 absolute left-4 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone (+91), or message text..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)] placeholder:text-[var(--text-muted)] font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2.5 px-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)] font-bold"
            >
              <option value="ALL">All Categories ({messages.length})</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full py-2.5 px-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)] font-bold"
            >
              <option value="NEWEST">Sort: Newest First</option>
              <option value="OLDEST">Sort: Oldest First</option>
            </select>
          </div>
        </div>

        {/* Status Pill Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border-color)]/40 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[var(--text-muted)] font-bold mr-1">Status:</span>
            {[
              { id: 'ALL', label: 'All Statuses', count: stats.total },
              { id: 'NEW', label: 'New', count: stats.newCount },
              { id: 'READ', label: 'Read', count: stats.readCount },
              { id: 'RESPONDED', label: 'Responded', count: stats.respondedCount },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  statusFilter === st.id
                    ? 'bg-[var(--orange)] text-white shadow-md'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {st.label} ({st.count})
              </button>
            ))}
          </div>

          <div className="text-[var(--text-muted)] font-bold">
            Showing <strong className="text-[var(--text-primary)]">{filteredMessages.length}</strong> of{' '}
            {messages.length} messages
          </div>
        </div>
      </div>

      {/* Messages List / Grid */}
      {loading ? (
        <div className="glass-card p-16 rounded-3xl border border-[var(--border-color)] text-center space-y-4">
          <RefreshCw className="w-8 h-8 mx-auto text-[var(--orange)] animate-spin" />
          <p className="text-sm font-extrabold text-[var(--text-primary)]">Loading inquiries...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="glass-card p-16 rounded-3xl border border-[var(--border-color)] text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-[var(--text-primary)] font-heading">
            No Messages Found
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
            {searchTerm || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
              ? 'No messages matched your current filters. Try resetting the search or category filter.'
              : 'Messages submitted through the public "Let\'s Connect" page will show up here.'}
          </p>
          {(searchTerm || statusFilter !== 'ALL' || categoryFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
              }}
              className="btn-secondary text-xs py-2 px-4"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => {
            const initial = (msg.fullName || 'U').charAt(0).toUpperCase();
            const dateStr = new Date(msg.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const timeStr = new Date(msg.createdAt).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={msg._id}
                className={`glass-card p-6 sm:p-7 rounded-3xl border transition-all duration-200 space-y-5 ${
                  msg.status === 'NEW'
                    ? 'border-amber-500/50 bg-gradient-to-r from-amber-500/[0.03] to-transparent shadow-lg shadow-amber-500/5'
                    : 'border-[var(--border-color)] hover:border-[var(--border-color)]/80'
                }`}
              >
                {/* Header: Sender Info & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)]/40 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--orange)] to-amber-600 text-white font-black text-lg flex items-center justify-center shadow-md flex-shrink-0">
                      {initial}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h4 className="text-base sm:text-lg font-black text-[var(--text-primary)] font-heading">
                          {msg.fullName}
                        </h4>
                        <span
                          className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold border ${getCategoryBadgeClass(
                            msg.category
                          )}`}
                        >
                          {msg.category || 'General Inquiry'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-medium mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {dateStr} at {timeStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(msg.status)}

                    {/* Quick status toggle dropdown */}
                    <select
                      value={msg.status}
                      disabled={actionLoadingId === msg._id}
                      onChange={(e) => handleStatusChange(msg._id, e.target.value)}
                      className="py-1.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--orange)]"
                    >
                      <option value="NEW">Status: NEW</option>
                      <option value="READ">Status: READ</option>
                      <option value="RESPONDED">Status: RESPONDED</option>
                    </select>
                  </div>
                </div>

                {/* Contact Info Pills */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <a
                    href={`mailto:${msg.email}`}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[var(--orange)]" />
                    <span>{msg.email}</span>
                  </a>

                  <a
                    href={`tel:${msg.phone}`}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[var(--cyan)]" />
                    <span>+91 {msg.phone}</span>
                  </a>

                  {msg.phone && (
                    <a
                      href={getWhatsAppLink(msg.phone, msg.fullName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold hover:bg-emerald-500/20 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  )}
                </div>

                {/* Message Body */}
                <div className="p-4 rounded-2xl bg-[var(--bg-primary)]/80 border border-[var(--border-color)]/60 text-sm text-[var(--text-primary)] font-medium leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </div>

                {/* Bottom Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {msg.status !== 'READ' && (
                      <button
                        onClick={() => handleStatusChange(msg._id, 'READ')}
                        disabled={actionLoadingId === msg._id}
                        className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        <span>Mark as Read</span>
                      </button>
                    )}

                    {msg.status !== 'RESPONDED' && (
                      <button
                        onClick={() => handleStatusChange(msg._id, 'RESPONDED')}
                        disabled={actionLoadingId === msg._id}
                        className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark as Responded</span>
                      </button>
                    )}

                    <a
                      href={`mailto:${msg.email}?subject=${encodeURIComponent(
                        `Response from Chinmaya Mission Adoni: ${msg.category || 'Your Inquiry'}`
                      )}&body=${encodeURIComponent(
                        `Dear ${msg.fullName},\n\nThank you for reaching out to Chinmaya Mission Adoni regarding "${msg.category}".\n\nIn response to your inquiry:\n> ${msg.message}\n\n`
                      )}`}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-[var(--orange)] border-[var(--orange)]/30 hover:bg-[var(--orange)]/10"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>
                  </div>

                  <div>
                    {deleteConfirmId === msg._id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-red-500">Confirm delete?</span>
                        <button
                          onClick={() => handleDelete(msg._id)}
                          disabled={actionLoadingId === msg._id}
                          className="px-3 py-1 rounded-xl bg-red-500 text-white font-black text-xs hover:bg-red-600 transition-colors"
                        >
                          {actionLoadingId === msg._id ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-3 py-1 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-muted)] font-bold text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(msg._id)}
                        className="p-2 rounded-xl text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors text-xs font-bold flex items-center gap-1"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LetsConnectManager;
