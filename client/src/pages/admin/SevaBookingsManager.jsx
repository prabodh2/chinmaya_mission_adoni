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
} from 'lucide-react';

export const SevaBookingsManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [templeFilter, setTempleFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({ totalRecords: 0, totalAmount: 0 });

  const fetchBookings = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await sevaBookingService.getAllAdmin({
        search: searchTerm,
        status: statusFilter,
        bookingType: typeFilter,
        temple: templeFilter,
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
  }, [statusFilter, typeFilter, templeFilter]);

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
                DATABASE PERSISTED RECORDS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-[var(--text-primary)]">
              Temple Seva Bookings & Devotee Contributions
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Live records persisted in MongoDB Atlas from Chinmaya Sanjeevaraya Temple, Shri Shantamalleshwara Temple, and Support Our Mission donations.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchBookings(true)}
              disabled={refreshing}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-extrabold text-[var(--text-primary)] hover:border-[var(--orange)] flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh Database'}</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Total Submissions
            </span>
            <span className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-heading mt-1 block">
              {stats.totalRecords}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Total Funds Persisted
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-500 font-heading mt-1 block">
              ₹{Number(stats.totalAmount || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Temple Sevas
            </span>
            <span className="text-xl sm:text-2xl font-black text-[var(--cyan)] font-heading mt-1 block">
              {bookings.filter((b) => b.bookingType === 'SEVA_BOOKING').length}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              Devotee Donations
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-500 font-heading mt-1 block">
              {bookings.filter((b) => b.bookingType === 'DEVOTEE_CONTRIBUTION').length}
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
              placeholder="Search by Devotee, Phone, UTR, Ref ID..."
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
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-2.5 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-bold text-[var(--text-primary)] cursor-pointer text-xs"
          >
            <option value="ALL">All Types</option>
            <option value="SEVA_BOOKING">Seva Bookings</option>
            <option value="DEVOTEE_CONTRIBUTION">Contributions / Donations</option>
          </select>

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

      {/* Bookings Table */}
      <div className="glass-card rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[var(--orange)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-[var(--text-muted)]">Loading bookings from MongoDB Atlas...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Building className="w-12 h-12 text-[var(--text-muted)]/40 mx-auto" />
            <p className="text-sm font-bold text-[var(--text-primary)]">No Seva Bookings or Donations found.</p>
            <p className="text-xs text-[var(--text-muted)]">Submissions through temple seva cards and contribution modals will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--text-primary)]">
              <thead className="bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] uppercase tracking-wider text-[11px] font-black text-[var(--text-muted)]">
                <tr>
                  <th className="py-3.5 px-4">Ref ID / Date</th>
                  <th className="py-3.5 px-4">Devotee Name</th>
                  <th className="py-3.5 px-4">Temple / Seva Name</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">UTR Reference</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[var(--orange)] block">
                        {booking.bookingId}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] block">
                        {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-[var(--text-primary)] block">
                        {booking.devoteeName}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {booking.phone}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[var(--text-primary)] block">
                        {booking.sevaName}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] block">
                        {booking.templeName}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-amber-500 font-heading text-sm">
                        ₹{Number(booking.amount || 0).toLocaleString('en-IN')}
                      </span>
                      {booking.panNumber && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono block w-fit mt-0.5">
                          PAN: {booking.panNumber}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-semibold text-xs text-slate-700 block">
                        {booking.utrId}
                      </span>
                      {booking.screenshotName && (
                        <span className="text-[11px] text-[var(--cyan)] flex items-center gap-1 mt-0.5">
                          <Eye className="w-3 h-3" /> {booking.screenshotName}
                        </span>
                      )}
                    </td>

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

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--cyan)] hover:text-white transition-colors"
                          title="View Details & Proof"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {booking.status !== 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusChange(booking._id, 'CONFIRMED')}
                            disabled={actionLoadingId === booking._id}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-colors"
                            title="Confirm Seva / Proof"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setDeleteConfirmId(booking._id)}
                          disabled={actionLoadingId === booking._id}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-[var(--orange)] uppercase tracking-wider block">
                  {selectedBooking.bookingType === 'DEVOTEE_CONTRIBUTION' ? 'CONTRIBUTION DETAILS' : 'SEVA BOOKING'}
                </span>
                <h3 className="text-lg font-black text-slate-900 font-heading">
                  {selectedBooking.bookingId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Devotee / Donor</span>
                  <p className="font-extrabold text-slate-900 text-sm">{selectedBooking.devoteeName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Amount</span>
                  <p className="font-extrabold text-amber-600 text-base">
                    ₹{Number(selectedBooking.amount || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Mobile Phone</span>
                  <p className="font-bold text-slate-800">{selectedBooking.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Email</span>
                  <p className="font-medium text-slate-800">{selectedBooking.email || 'Not Provided'}</p>
                </div>
                {selectedBooking.gotram && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Gotram</span>
                    <p className="font-bold text-slate-800">{selectedBooking.gotram}</p>
                  </div>
                )}
                {selectedBooking.nakshatra && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Nakshatra</span>
                    <p className="font-bold text-slate-800">{selectedBooking.nakshatra}</p>
                  </div>
                )}
                {selectedBooking.panNumber && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">PAN Number</span>
                    <p className="font-mono font-bold text-slate-900">{selectedBooking.panNumber}</p>
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Seva Date</span>
                  <p className="font-medium text-slate-800">{selectedBooking.date || '—'}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Puja / Contribution Name
                </span>
                <p className="font-bold text-slate-900">{selectedBooking.sevaName}</p>
                <p className="text-[11px] text-slate-500">{selectedBooking.templeName}</p>
              </div>

              {selectedBooking.address && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Postal Address
                  </span>
                  <p className="font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl">{selectedBooking.address}</p>
                </div>
              )}

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">
                  Payment Verification Details
                </span>
                <p className="font-mono font-extrabold text-amber-950 text-sm">
                  UTR ID: {selectedBooking.utrId}
                </p>
                <p className="text-[11px] text-amber-700">
                  Uploaded Proof Screenshot: <strong>{selectedBooking.screenshotName || 'Attached by devotee'}</strong>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Created: {new Date(selectedBooking.createdAt).toLocaleString('en-IN')}
              </span>
              <div className="flex items-center gap-2">
                {selectedBooking.status !== 'CONFIRMED' && (
                  <button
                    onClick={() => handleStatusChange(selectedBooking._id, 'CONFIRMED')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm Seva</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SevaBookingsManager;
