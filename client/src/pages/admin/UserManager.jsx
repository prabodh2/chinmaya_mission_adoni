import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Eye,
  Shield,
  UserCheck,
  UserX,
  AlertTriangle,
  X,
  Award,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const UserManager = () => {
  const { adminUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0, totalRegularUsers: 0 });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Modals & Actions
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(null);
  const [actionFeedback, setActionFeedback] = useState({ type: null, message: '' });

  const fetchUsers = async () => {
    setLoading(true);
    setActionFeedback({ type: null, message: '' });
    try {
      const res = await adminService.getUsers({
        page,
        limit: 10,
        search: searchTerm,
        role: roleFilter,
      });

      if (res.data?.success) {
        setUsers(res.data.data.users);
        setPagination(res.data.data.pagination);
        if (res.data.data.stats) {
          setStats(res.data.data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setActionFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to load user accounts from database.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleViewDetails = async (userId) => {
    setLoadingDetails(true);
    setSelectedUser(null);
    try {
      const res = await adminService.getUserById(userId);
      if (res.data?.success) {
        setSelectedUser(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load user details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const confirmMsg =
      newRole === 'admin'
        ? `Grant ADMINISTRATOR privileges to ${user.fullName} (${user.phone})? They will have full access to manage registrations, CMS, and data.`
        : `Demote ${user.fullName} (${user.phone}) to standard USER?`;

    if (!window.confirm(confirmMsg)) return;

    setUpdatingRole(user._id);
    try {
      const res = await adminService.updateUserRole(user._id, newRole);
      if (res.data?.success) {
        setActionFeedback({
          type: 'success',
          message: `Role for ${user.fullName} changed to ${newRole.toUpperCase()} successfully.`,
        });
        fetchUsers();
      }
    } catch (err) {
      setActionFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update user role.',
      });
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      const res = await adminService.deleteUser(userToDelete._id);
      if (res.data?.success) {
        setActionFeedback({
          type: 'success',
          message: res.data.message || `User ${userToDelete.fullName} permanently deleted from database.`,
        });
        setUserToDelete(null);
        fetchUsers();
      }
    } catch (err) {
      setActionFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete user account.',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl border border-[var(--border-color)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[var(--cyan)]/15 text-[var(--cyan)]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-heading text-[var(--text-primary)]">
              Registered Users Directory
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              View and manage all registered accounts on Chinmaya Mission Adoni portal.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchUsers()}
          className="btn-secondary py-2.5 px-4 text-xs flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>REFRESH USERS</span>
        </button>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback.message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between border ${
            actionFeedback.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-500'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionFeedback.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
          <button
            onClick={() => setActionFeedback({ type: null, message: '' })}
            className="p-1 hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
          <span className="text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
            TOTAL REGISTERED ACCOUNTS
          </span>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-[var(--text-primary)] font-heading">
              {stats.totalUsers}
            </h3>
            <Users className="w-6 h-6 text-[var(--cyan)]" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
          <span className="text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
            STANDARD CITIZEN USERS
          </span>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-emerald-500 font-heading">
              {stats.totalRegularUsers}
            </h3>
            <UserCheck className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
          <span className="text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
            AUTHORIZED ADMINISTRATORS
          </span>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-[var(--orange)] font-heading">
              {stats.totalAdmins}
            </h3>
            <Shield className="w-6 h-6 text-[var(--orange)]" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-3xl border border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by full name, phone number, email, or profession..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
            />
          </div>
          <button type="submit" className="btn-primary py-2.5 px-5 text-xs font-extrabold">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[var(--text-muted)] hidden sm:block" />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-auto py-2.5 px-3.5 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--cyan)]"
          >
            <option value="all">ALL ROLES</option>
            <option value="user">USERS ONLY</option>
            <option value="admin">ADMINISTRATORS ONLY</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-3xl border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-extrabold uppercase border-b border-[var(--border-color)]">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">Email</th>
                <th className="p-4">Age / Profession</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]/40 text-[var(--text-primary)]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[var(--text-muted)] font-bold">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--cyan)]" />
                    Fetching user accounts from database...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[var(--text-muted)] font-bold">
                    No registered user accounts match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSelf = adminUser && (adminUser._id === u._id || adminUser.phone === u.phone);
                  const isAdminRole = u.role === 'admin';

                  return (
                    <tr key={u._id} className="hover:bg-[var(--bg-primary)]/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                              isAdminRole
                                ? 'bg-[var(--orange)] text-white'
                                : 'bg-[var(--cyan)]/20 text-[var(--cyan)]'
                            }`}
                          >
                            {u.fullName ? u.fullName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-extrabold text-[var(--text-primary)] flex items-center gap-1.5">
                              <span>{u.fullName}</span>
                              {isSelf && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[var(--cyan)]/20 text-[var(--cyan)] uppercase">
                                  You
                                </span>
                              )}
                            </p>
                            <span className="text-[10px] font-mono text-[var(--text-muted)]">
                              ID: {u._id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                          <span>{u.phone}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        {u.email ? (
                          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{u.email}</span>
                          </div>
                        ) : (
                          <span className="text-[var(--text-muted)] italic text-[11px]">None</span>
                        )}
                      </td>

                      <td className="p-4">
                        <p className="font-bold">{u.profession || 'Not specified'}</p>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {u.age ? `${u.age} yrs old` : 'Age N/A'}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            isAdminRole
                              ? 'bg-[var(--orange)]/15 text-[var(--orange)] border border-[var(--orange)]/30'
                              : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          }`}
                        >
                          {isAdminRole ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                          <span>{u.role.toUpperCase()}</span>
                        </span>
                      </td>

                      <td className="p-4 text-[var(--text-muted)] text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details Button */}
                          <button
                            onClick={() => handleViewDetails(u._id)}
                            className="p-2 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--cyan)] hover:text-white text-[var(--text-primary)] transition-all"
                            title="View user details & registrations"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Role Toggle Button */}
                          <button
                            onClick={() => handleRoleToggle(u)}
                            disabled={updatingRole === u._id || isSelf}
                            className={`p-2 rounded-xl border transition-all ${
                              isAdminRole
                                ? 'border-amber-500/30 text-amber-500 hover:bg-amber-500/10'
                                : 'border-[var(--cyan)]/30 text-[var(--cyan)] hover:bg-[var(--cyan)]/10'
                            } ${isSelf ? 'opacity-30 cursor-not-allowed' : ''}`}
                            title={
                              isSelf
                                ? 'Cannot modify your own active admin role'
                                : isAdminRole
                                ? 'Demote to regular user'
                                : 'Promote to administrator'
                            }
                          >
                            {isAdminRole ? <UserX className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setUserToDelete(u)}
                            disabled={isSelf}
                            className={`p-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all ${
                              isSelf ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title={isSelf ? 'Cannot delete your own active administrator account' : 'Permanently delete user'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-tertiary)]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[var(--text-muted)] font-medium">
              Showing page <strong className="text-[var(--text-primary)]">{pagination.currentPage}</strong> of{' '}
              <strong className="text-[var(--text-primary)]">{pagination.totalPages}</strong> ({pagination.totalCount} users total)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage}
                className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: USER DETAILS MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[var(--cyan)] text-white flex items-center justify-center font-black text-lg">
                  {selectedUser.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-black font-heading text-[var(--text-primary)]">
                    {selectedUser.fullName}
                  </h3>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    User ID: {selectedUser._id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase">
                  Mobile Number
                </span>
                <p className="font-mono font-bold text-sm text-[var(--text-primary)] mt-0.5">
                  {selectedUser.phone}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase">
                  Email Address
                </span>
                <p className="font-bold text-[var(--text-primary)] mt-0.5">
                  {selectedUser.email || 'Not provided'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase">
                  Age & Profession
                </span>
                <p className="font-bold text-[var(--text-primary)] mt-0.5">
                  {selectedUser.age ? `${selectedUser.age} years old` : 'Age N/A'} • {selectedUser.profession || 'N/A'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase">
                  Assigned Security Role
                </span>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[var(--cyan)]/15 text-[var(--cyan)]">
                  {selectedUser.role}
                </span>
              </div>
            </div>

            {/* User Associated Marathon Passes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black font-heading text-[var(--text-primary)] uppercase flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[var(--orange)]" />
                  <span>Associated Marathon Passes ({selectedUser.registrationsCount || 0})</span>
                </h4>
              </div>

              {selectedUser.registrations && selectedUser.registrations.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedUser.registrations.map((reg) => (
                    <div
                      key={reg.registrationId}
                      className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-[var(--orange)]">
                          {reg.registrationId}
                        </span>
                        <p className="font-extrabold text-[var(--text-primary)]">{reg.fullName}</p>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          Size: {reg.tShirtSize} • Class: {reg.standard || 'N/A'}
                        </span>
                      </div>
                      <span className="px-2 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-500 uppercase">
                        {reg.status || 'CONFIRMED'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-4 rounded-2xl bg-[var(--bg-primary)] text-center text-xs text-[var(--text-muted)] font-medium">
                  No marathon pass registrations created under this user account yet.
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="btn-secondary py-2.5 px-6 text-xs font-extrabold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM PERMANENT DELETE MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border border-red-500/40 bg-[var(--bg-secondary)] space-y-6 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-500">
              <div className="p-3 rounded-2xl bg-red-500/15">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black font-heading text-[var(--text-primary)]">
                  Permanent Delete Confirmation
                </h3>
                <span className="text-xs text-red-500 font-bold uppercase">Irreversible Action</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs space-y-2">
              <p className="text-[var(--text-primary)] font-medium">
                Are you sure you want to permanently delete the account for{' '}
                <strong className="text-[var(--text-primary)]">{userToDelete.fullName}</strong> (
                <span className="font-mono">{userToDelete.phone}</span>)?
              </p>
              <p className="text-[var(--text-muted)] text-[11px]">
                This action will delete the database record permanently.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                disabled={deleting}
                className="btn-secondary py-2.5 px-5 text-xs font-extrabold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="py-2.5 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-red-600/30"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? 'DELETING...' : 'YES, PERMANENTLY DELETE'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
