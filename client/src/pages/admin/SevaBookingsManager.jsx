import React, { useState, useEffect } from 'react';
import { sevaBookingService } from '../../services/api';
import {
  Landmark,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  Trash2,
  ExternalLink,
  Sparkles,
  User,
  AlertCircle,
  Eye,
  X,
  FileSpreadsheet,
  Check,
  ShieldCheck,
  CreditCard,
  Building,
  MessageCircle,
  Copy,
  Ticket,
  ChevronDown,
} from 'lucide-react';

export const SevaBookingsManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // 3 Primary Categories requested by Admin
  // 1) Chinmaya Sanjeevaraya Seva Bookings
  // 2) Shri Shantha Malleshwara Seva Bookings
  // 3) Supports Our Mission
  const [categoryFilter, setCategoryFilter] = useState('SANJEEVARAYA');
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [stats, setStats] = useState({ totalRecords: 0, totalAmount: 0 });

  const fetchBookings = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await sevaBookingService.getAllAdmin({
        search: searchTerm,
        status: statusFilter,
        temple: categoryFilter,
      });

      if (res.data?.success) {
        setBookings(res.data.data.bookings || []);
        if (res.data.data.stats) {
          setStats(res.data.data.stats);
        }
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to load bookings from database.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [categoryFilter, statusFilter]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleCopyPass = (passId) => {
    if (!passId) return;
    navigator.clipboard.writeText(passId);
    setCopiedId(passId);
    showNotification('success', `Pass ID ${passId} copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // WhatsApp Redirect Handler: Redirects to devotee WhatsApp & mentions Booking Pass ID
  const handleWhatsAppRedirect = (booking) => {
    const rawPhone = booking.phone || booking.phoneNumber || '';
    const cleanPhone = rawPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      showNotification('error', 'No valid phone number found for this booking.');
      return;
    }

    const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const passId = booking.bookingId || booking.refId || 'N/A';
    const name = booking.devoteeName || booking.name || 'Devotee';
    const seva = booking.sevaName || 'Devotional Seva';
    const temple = booking.templeName || 'Chinmaya Mission, Adoni';
    const amount = Number(booking.amount || 0).toLocaleString('en-IN');
    const dateStr = booking.date || (booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN') : '');

    const message = `Hari Om ${name} ji! 🙏

Greetings from *Chinmaya Mission, Adoni*.

Here are the confirmed details of your Seva Booking:
🎫 *Booking Pass / Ref ID:* ${passId}
🛕 *Seva Booked:* ${seva}
📍 *Temple / Center:* ${temple}
💰 *Amount Paid:* ₹${amount}
📅 *Date / Sankalpa:* ${dateStr}
✨ *Status:* ${booking.status || 'Payment Proof Received'}

Thank you for your sacred offering and devotion. May the divine blessings always be with you and your family! 🙏

_Chinmaya Mission, Adoni_`;

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionLoadingId(id);
    try {
      const res = await sevaBookingService.updateStatus(id, newStatus);
      if (res.data?.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
        showNotification('success', `Status updated to ${newStatus}`);
        if (selectedBooking && selectedBooking._id === id) {
          setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
        }
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
      const res = await sevaBookingService.deleteBooking(id);
      if (res.data?.success) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        setStats((prev) => ({ ...prev, totalRecords: Math.max(0, prev.totalRecords - 1) }));
        setDeleteConfirmId(null);
        if (selectedBooking?._id === id) setSelectedBooking(null);
        showNotification('success', 'Booking record deleted successfully from database');
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete record');
    } finally {
      setActionLoadingId(null);
    }
  };

  // CSV Export for filtered bookings
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      showNotification('error', 'No bookings to export.');
      return;
    }

    const headers = ['Booking Pass ID', 'Date', 'Devotee Name', 'Email', 'Phone', 'Seva Booked', 'Temple / Cause', 'Amount', 'UTR ID', 'Status'];
    const rows = bookings.map((b) => [
      `"${b.bookingId || b.refId || ''}"`,
      `"${new Date(b.createdAt).toLocaleDateString('en-IN')}"`,
      `"${(b.devoteeName || b.name || '').replace(/"/g, '""')}"`,
      `"${b.email || ''}"`,
      `"${b.phone || ''}"`,
      `"${(b.sevaName || '').replace(/"/g, '""')}"`,
      `"${(b.templeName || '').replace(/"/g, '""')}"`,
      `"${b.amount || 0}"`,
      `"${b.utrId || ''}"`,
      `"${b.status || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bookings_${categoryFilter.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryTitle = () => {
    switch (categoryFilter) {
      case 'SANJEEVARAYA':
        return 'Chinmaya Sanjeevaraya Seva Bookings';
      case 'SHANTAMALLESHWARA':
        return 'Shri Shantha Malleshwara Seva Bookings';
      case 'SUPPORT_OUR_MISSION':
        return 'Supports Our Mission (Devotee Contributions)';
      default:
        return 'All Seva Bookings & Contributions';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-extrabold flex items-center justify-between border shadow-xl animate-in fade-in ${
            notification.type === 'error'
              ? 'bg-red-500/15 border-red-500/30 text-red-600'
              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header and Stats */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 text-[var(--orange)] mb-1">
              <Landmark className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest font-heading">
                BOOKINGS MANAGEMENT CONSOLE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-[var(--text-primary)]">
              {getCategoryTitle()}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Live records persisted in MongoDB Atlas. Select any category from the dropdown below to view devotee passes, seva details, and initiate direct WhatsApp pass dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-extrabold text-[var(--text-primary)] hover:border-[var(--orange)] flex items-center gap-2 transition-all cursor-pointer"
              title="Export filtered records to CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => fetchBookings(true)}
              disabled={refreshing}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-extrabold text-[var(--text-primary)] hover:border-[var(--orange)] flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. PRIMARY CATEGORY SELECTION DROPDOWN (PROMPT SPECIFIED)  */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-primary)] border-2 border-[var(--orange)] shadow-lg space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--orange)] flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                <span>Select Bookings Category:</span>
              </label>
              
              <div className="relative max-w-xl">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full appearance-none py-3 pl-4 pr-10 rounded-xl bg-white text-slate-900 border-2 border-[var(--orange)] font-extrabold text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--orange)] cursor-pointer"
                >
                  <option value="SANJEEVARAYA">1) Chinmaya Sanjeevaraya Seva Bookings</option>
                  <option value="SHANTAMALLESHWARA">2) Shri Shantha Malleshwara Seva Bookings</option>
                  <option value="SUPPORT_OUR_MISSION">3) Supports Our Mission</option>
                  <option value="ALL">All Bookings &amp; Contributions</option>
                </select>
                <ChevronDown className="w-5 h-5 text-slate-600 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Quick Filter Pill Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-5">
              {[
                { id: 'SANJEEVARAYA', label: '1) Chinmaya Sanjeevaraya' },
                { id: 'SHANTAMALLESHWARA', label: '2) Shri Shantha Malleshwara' },
                { id: 'SUPPORT_OUR_MISSION', label: '3) Supports Our Mission' },
                { id: 'ALL', label: 'All' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    categoryFilter === cat.id
                      ? 'bg-[var(--orange)] text-white shadow-md'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-slate-100 border border-[var(--border-color)]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Category Bookings
            </span>
            <span className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-heading mt-1 block">
              {bookings.length}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Total Amount
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-500 font-heading mt-1 block">
              ₹{Number(stats.totalAmount || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Pending Proofs
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-600 font-heading mt-1 block">
              {bookings.filter((b) => b.status?.includes('Pending')).length}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Confirmed Passes
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600 font-heading mt-1 block">
              {bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Devotee Name, Email, Phone, Pass ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-xs focus:outline-none focus:border-[var(--orange)]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[var(--orange)] text-white font-extrabold text-xs shadow-sm cursor-pointer hover:opacity-90 transition-all shrink-0"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-bold text-[var(--text-primary)] cursor-pointer text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="Payment Proof Submitted (Verification Pending)">Pending Verification</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table: Displays Pass, Name, Email, Phone, Seva Booked, WhatsApp Link */}
      <div className="glass-card rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[var(--orange)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-[var(--text-muted)]">Loading bookings from MongoDB Atlas...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Ticket className="w-12 h-12 text-[var(--text-muted)]/40 mx-auto" />
            <p className="text-sm font-bold text-[var(--text-primary)]">No bookings found in this category.</p>
            <p className="text-xs text-[var(--text-muted)]">
              Devotee submissions for <strong>{getCategoryTitle()}</strong> will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--text-primary)]">
              <thead className="bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] uppercase tracking-wider text-[11px] font-black text-[var(--text-muted)]">
                <tr>
                  <th className="py-3.5 px-4">Pass / Ref ID</th>
                  <th className="py-3.5 px-4">Devotee Name</th>
                  <th className="py-3.5 px-4">Contact Info (Email &amp; Phone)</th>
                  <th className="py-3.5 px-4">Seva Booked</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4 text-center">WhatsApp Connection</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {bookings.map((booking) => {
                  const passId = booking.bookingId || booking.refId;
                  return (
                    <tr key={booking._id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                      {/* 1. Pass / Ref ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 block text-xs">
                            {passId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyPass(passId)}
                            className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-amber-100 transition-colors"
                            title="Copy Pass ID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[11px] text-[var(--text-muted)] block mt-1">
                          {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>

                      {/* 2. Devotee Name */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-[var(--text-primary)] text-sm block">
                          {booking.devoteeName || booking.name}
                        </span>
                        {booking.gotram && (
                          <span className="text-[11px] text-[var(--text-muted)] block">
                            Gotram: {booking.gotram}
                          </span>
                        )}
                      </td>

                      {/* 3. Contact Info: Email & Phone Number */}
                      <td className="py-3.5 px-4 space-y-1">
                        <a
                          href={`tel:${booking.phone}`}
                          className="font-semibold text-slate-800 hover:text-[var(--orange)] flex items-center gap-1.5 transition-colors"
                          title="Call Devotee"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{booking.phone}</span>
                        </a>

                        {booking.email ? (
                          <a
                            href={`mailto:${booking.email}`}
                            className="text-[11px] text-[var(--text-muted)] hover:text-[var(--orange)] flex items-center gap-1.5 transition-colors"
                            title="Email Devotee"
                          >
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[180px]">{booking.email}</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic block">No email provided</span>
                        )}
                      </td>

                      {/* 4. Which Seva They Have Booked */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-[#0C1A30] text-xs block">
                          {booking.sevaName}
                        </span>
                        <span className="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium inline-block mt-0.5 border border-amber-200/60">
                          {booking.templeName}
                        </span>
                      </td>

                      {/* 5. Amount & Payment Proof UTR */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-amber-600 font-heading text-sm block">
                          ₹{Number(booking.amount || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          UTR: {booking.utrId}
                        </span>
                      </td>

                      {/* 6. WhatsApp Connection with Pass Mention (PROMPT SPECIFIED) */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleWhatsAppRedirect(booking)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-sm transition-all hover:scale-105 cursor-pointer"
                          title={`Send Seva Pass ${passId} to WhatsApp`}
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </button>
                      </td>

                      {/* 7. Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            booking.status === 'CONFIRMED' || booking.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : booking.status === 'CANCELLED'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span>{booking.status}</span>
                        </span>
                      </td>

                      {/* 8. Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--cyan)] hover:text-white transition-colors cursor-pointer"
                            title="View Full Booking Pass"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {booking.status !== 'CONFIRMED' && (
                            <button
                              onClick={() => handleStatusChange(booking._id, 'CONFIRMED')}
                              disabled={actionLoadingId === booking._id}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-colors cursor-pointer"
                              title="Mark as Confirmed"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => setDeleteConfirmId(booking._id)}
                            disabled={actionLoadingId === booking._id}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center border border-slate-200">
            <Trash2 className="w-10 h-10 text-red-500 mx-auto" />
            <h4 className="text-base font-extrabold text-slate-900">Delete Booking Record?</h4>
            <p className="text-xs text-slate-500">
              This will permanently delete this record from the database. This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Booking Pass & Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-[var(--orange)] uppercase tracking-wider block">
                  {selectedBooking.bookingType === 'DEVOTEE_CONTRIBUTION' ? 'CONTRIBUTION PASS' : 'SEVA BOOKING PASS'}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-xl font-black text-slate-900 font-mono">
                    {selectedBooking.bookingId || selectedBooking.refId}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleCopyPass(selectedBooking.bookingId || selectedBooking.refId)}
                    className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-amber-100 transition-colors"
                    title="Copy Pass ID"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* WhatsApp Quick Dispatch Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-emerald-900 block">Dispatch Pass on WhatsApp</span>
                  <span className="text-[11px] text-emerald-700 block">Sends pass code {selectedBooking.bookingId} to {selectedBooking.phone}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleWhatsAppRedirect(selectedBooking)}
                  className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Send Pass</span>
                </button>
              </div>

              {/* Devotee Info */}
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider">Devotee Information</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Devotee Name</span>
                    <span className="font-bold">{selectedBooking.devoteeName || selectedBooking.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone Number</span>
                    <a href={`tel:${selectedBooking.phone}`} className="font-bold text-[var(--orange)] hover:underline">
                      {selectedBooking.phone}
                    </a>
                  </div>
                  {selectedBooking.email && (
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[10px]">Email ID</span>
                      <a href={`mailto:${selectedBooking.email}`} className="font-bold text-slate-700 hover:underline">
                        {selectedBooking.email}
                      </a>
                    </div>
                  )}
                  {selectedBooking.gotram && (
                    <div>
                      <span className="text-slate-400 block text-[10px]">Gotram</span>
                      <span className="font-bold">{selectedBooking.gotram}</span>
                    </div>
                  )}
                  {selectedBooking.nakshatra && (
                    <div>
                      <span className="text-slate-400 block text-[10px]">Nakshatra</span>
                      <span className="font-bold">{selectedBooking.nakshatra}</span>
                    </div>
                  )}
                  {selectedBooking.address && (
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[10px]">Address</span>
                      <span className="font-medium">{selectedBooking.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Seva Offering Details */}
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider">Seva Offering Details</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Seva Booked</span>
                    <span className="font-bold">{selectedBooking.sevaName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Temple / Center</span>
                    <span className="font-bold">{selectedBooking.templeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Offering Amount</span>
                    <span className="font-black text-amber-600 text-sm">₹{Number(selectedBooking.amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Booking Date</span>
                    <span className="font-medium">{new Date(selectedBooking.createdAt).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Transaction & Proof */}
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider">Payment Verification</h4>
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">UTR / Reference ID:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedBooking.utrId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Status:</span>
                    <span className="font-bold text-emerald-600">{selectedBooking.status}</span>
                  </div>
                  {selectedBooking.screenshotName && (
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400">Payment Screenshot:</span>
                      <span className="text-cyan-700 font-medium">{selectedBooking.screenshotName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update Options */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Update Booking Status</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedBooking._id, 'CONFIRMED')}
                    className="py-2 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 cursor-pointer shadow-sm text-center"
                  >
                    Confirm Pass
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedBooking._id, 'COMPLETED')}
                    className="py-2 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer shadow-sm text-center"
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedBooking._id, 'CANCELLED')}
                    className="py-2 px-3 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 cursor-pointer shadow-sm text-center"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SevaBookingsManager;
