import React, { useState, useEffect, useMemo } from 'react';
import { volunteerService } from '../../services/api';
import {
  HeartHandshake,
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
  AlertCircle,
  Eye,
  X,
  FileSpreadsheet,
  Check,
  ChevronDown,
} from 'lucide-react';

export const VolunteeringManager = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({ totalAll: 0, newCount: 0, contactedCount: 0, approvedCount: 0 });

  const fetchVolunteers = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await volunteerService.getVolunteersAdmin({
        search: searchTerm,
        status: statusFilter,
      });

      if (res.data?.success) {
        setVolunteers(res.data.data || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to load volunteer applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, [statusFilter]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionLoadingId(id);
    try {
      const res = await volunteerService.updateStatus(id, newStatus);
      if (res.data?.success) {
        setVolunteers((prev) =>
          prev.map((v) => (v._id === id ? { ...v, status: newStatus } : v))
        );
        if (selectedVolunteer && selectedVolunteer._id === id) {
          setSelectedVolunteer((prev) => ({ ...prev, status: newStatus }));
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
      const res = await volunteerService.deleteVolunteer(id);
      if (res.data?.success) {
        setVolunteers((prev) => prev.filter((v) => v._id !== id));
        if (selectedVolunteer && selectedVolunteer._id === id) {
          setSelectedVolunteer(null);
        }
        setDeleteConfirmId(null);
        showNotification('success', 'Volunteer record deleted successfully');
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete record');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Helper: Calculate age from DOB
  const calculateAge = (dobString) => {
    if (!dobString) return null;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  };

  // Helper: Format DOB nicely
  const formatDob = (dobString) => {
    if (!dobString) return '—';
    try {
      const d = new Date(dobString);
      if (isNaN(d.getTime())) return dobString;
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dobString;
    }
  };

  // Filtered & Searched Volunteers
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((item) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        item.fullName?.toLowerCase().includes(term) ||
        item.phone?.includes(term) ||
        item.email?.toLowerCase().includes(term) ||
        item.interest?.toLowerCase().includes(term) ||
        item.dob?.includes(term)
      );
    });
  }, [volunteers, searchTerm]);

  // Export to CSV
  const handleExportCSV = () => {
    if (!filteredVolunteers.length) {
      showNotification('error', 'No volunteer records to export');
      return;
    }

    const headers = ['Full Name', 'Date of Birth', 'Age', 'Phone Number', 'Email ID', 'Interest in Volunteering', 'Status', 'Submitted At'];
    const rows = filteredVolunteers.map((v) => {
      const age = calculateAge(v.dob);
      return [
        `"${(v.fullName || '').replace(/"/g, '""')}"`,
        `"${formatDob(v.dob)}"`,
        age ? `"${age}"` : '""',
        `"${v.phone || ''}"`,
        `"${v.email || ''}"`,
        `"${(v.interest || '').replace(/"/g, '""')}"`,
        `"${v.status || 'NEW'}"`,
        `"${new Date(v.createdAt).toLocaleString('en-IN')}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `volunteers_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('success', 'Exported volunteer records successfully');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> NEW
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <MessageCircle className="w-3 h-3 text-blue-600" /> CONTACTED
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" /> APPROVED
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            ARCHIVED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl shadow-lg border flex items-center justify-between text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[var(--orange)]/10 text-[var(--orange)] flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-[var(--text-primary)]">
              Volunteering Applications
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            Review devotee seva applications, contact details, and their areas of interest in volunteering.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchVolunteers(true)}
            disabled={refreshing}
            className="btn-secondary py-2 px-3 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh List"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="btn-secondary py-2 px-3.5 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Applications
          </span>
          <span className="text-2xl font-black text-slate-900 mt-2 font-heading">
            {stats.totalAll || volunteers.length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> New / Pending
          </span>
          <span className="text-2xl font-black text-amber-600 mt-2 font-heading">
            {stats.newCount || volunteers.filter((v) => v.status === 'NEW').length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" /> Contacted
          </span>
          <span className="text-2xl font-black text-blue-600 mt-2 font-heading">
            {stats.contactedCount || volunteers.filter((v) => v.status === 'CONTACTED').length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Approved Seva
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-2 font-heading">
            {stats.approvedCount || volunteers.filter((v) => v.status === 'APPROVED').length}
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, email, or interest..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--orange)] focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          {['ALL', 'NEW', 'CONTACTED', 'APPROVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-[var(--orange)] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[var(--orange)] animate-spin mx-auto" />
            <p className="text-sm text-slate-500 font-medium">Loading volunteer applications...</p>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Volunteer Applications Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm
                ? 'No applications match your search criteria. Try a different keyword.'
                : 'No volunteer submissions yet. Devotee applications submitted from the website will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Volunteer Name</th>
                  <th className="py-3.5 px-4">Date of Birth</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Interest in Volunteering</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredVolunteers.map((vol) => {
                  const age = calculateAge(vol.dob);
                  return (
                    <tr
                      key={vol._id}
                      className="hover:bg-amber-50/40 transition-colors group"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[var(--orange)]/10 text-[var(--orange)] flex items-center justify-center font-bold text-sm shrink-0">
                            {vol.fullName ? vol.fullName.charAt(0).toUpperCase() : 'V'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-[var(--orange)] transition-colors">
                              {vol.fullName}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <User className="w-3 h-3" />
                              <span>Applicant</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* DOB */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDob(vol.dob)}</span>
                        </div>
                        {age !== null && (
                          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                            {age} years old
                          </div>
                        )}
                      </td>

                      {/* Phone & Email */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-medium text-slate-800">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>+91 {vol.phone}</span>
                            <a
                              href={`https://wa.me/91${vol.phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 p-0.5 rounded"
                              title="Message on WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a
                              href={`mailto:${vol.email}`}
                              className="hover:text-[var(--orange)] truncate max-w-[160px] inline-block"
                              title={vol.email}
                            >
                              {vol.email}
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Interest */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="line-clamp-2 text-xs text-slate-700 font-normal leading-relaxed">
                          {vol.interest}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            value={vol.status || 'NEW'}
                            onChange={(e) => handleStatusChange(vol._id, e.target.value)}
                            disabled={actionLoadingId === vol._id}
                            className="text-xs font-bold rounded-lg py-1 pl-2.5 pr-6 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[var(--orange)] cursor-pointer"
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="ARCHIVED">ARCHIVED</option>
                          </select>
                        </div>
                      </td>

                      {/* Submitted At */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                        {new Date(vol.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedVolunteer(vol)}
                            className="p-1.5 text-slate-500 hover:text-[var(--orange)] hover:bg-[var(--orange)]/10 rounded-lg transition-colors cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {deleteConfirmId === vol._id ? (
                            <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                              <button
                                onClick={() => handleDelete(vol._id)}
                                disabled={actionLoadingId === vol._id}
                                className="px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="p-1 text-slate-500 hover:text-slate-700 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(vol._id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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

      {/* Volunteer Details Modal */}
      {selectedVolunteer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedVolunteer(null);
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--orange)]/10 text-[var(--orange)] flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Volunteer Application</h3>
                  <span className="text-xs text-slate-500">ID: {selectedVolunteer._id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{selectedVolunteer.fullName}</h4>
                    <p className="text-xs text-slate-500">
                      Applied on{' '}
                      {new Date(selectedVolunteer.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {getStatusBadge(selectedVolunteer.status)}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-amber-200/40">
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">Date of Birth</span>
                    <span className="font-semibold text-slate-800">{formatDob(selectedVolunteer.dob)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">Age</span>
                    <span className="font-semibold text-slate-800">
                      {calculateAge(selectedVolunteer.dob) !== null
                        ? `${calculateAge(selectedVolunteer.dob)} years old`
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedVolunteer.phone}`}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center gap-2.5 font-medium text-slate-800 text-xs transition-colors"
                >
                  <Phone className="w-4 h-4 text-[var(--orange)]" />
                  <div className="truncate">
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Call</span>
                    <span>+91 {selectedVolunteer.phone}</span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/91${selectedVolunteer.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 flex items-center gap-2.5 font-medium text-emerald-800 text-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="block text-[10px] text-emerald-600 uppercase font-bold">WhatsApp</span>
                    <span>Direct Chat</span>
                  </div>
                </a>
              </div>

              {/* Email */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-800 truncate">{selectedVolunteer.email}</span>
                </div>
                <a
                  href={`mailto:${selectedVolunteer.email}`}
                  className="text-xs font-bold text-[var(--orange)] hover:underline shrink-0 ml-2"
                >
                  Send Email
                </a>
              </div>

              {/* Interest in Volunteering */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Interest in Volunteering
                </label>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedVolunteer.interest}
                </div>
              </div>

              {/* Status Update Quick Bar */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Change Status:</span>
                <div className="flex items-center gap-1.5">
                  {['NEW', 'CONTACTED', 'APPROVED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedVolunteer._id, st)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedVolunteer.status === st
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteeringManager;
