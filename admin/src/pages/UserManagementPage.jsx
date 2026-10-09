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
import { adminUserService } from '../services/adminApi';
import { useAdminAuth } from '../context/AdminAuthContext';

export const UserManagementPage = () => {
  const { adminUser } = useAdminAuth();
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
      const res = await adminUserService.getUsers({
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
      const res = await adminUserService.getUserById(userId);
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
      const res = await adminUserService.updateUserRole(user._id, newRole);
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
      const res = await adminUserService.deleteUser(userToDelete._id);
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black tracking-widest text-[#00B4D8] uppercase">
            MEMBERSHIP & ACCESS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            USER MANAGEMENT
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium">
            Directory of registered public website accounts and administrators
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="btn-secondary text-xs py-2.5 px-4 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload Users</span>
        </button>
      </div>

      {/* Action Feedback Alerts */}
      {actionFeedback.message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/15 border border-red-500/30 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionFeedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
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

      {/* User Stats Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#1C2541] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-[#94A3B8] uppercase tracking-wider block">
              TOTAL REGISTERED ACCOUNTS
            </span>
            <span className="text-3xl font-black text-white font-heading mt-1 block">
              {stats.totalUsers}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#00B4D8]/15 text-[#00B4D8] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#1C2541] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-[#10B981] uppercase tracking-wider block">
              NORMAL USERS (USER ROLE)
            </span>
            <span className="text-3xl font-black text-[#10B981] font-heading mt-1 block">
              {stats.totalRegularUsers}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#1C2541] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-[#00B4D8] uppercase tracking-wider block">
              ADMINISTRATORS (ADMIN ROLE)
            </span>
            <span className="text-3xl font-black text-[#00B4D8] font-heading mt-1 block">
              {stats.totalAdmins}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#00B4D8]/15 text-[#00B4D8] flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#1C2541] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name, phone (+91), email, profession..."
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-[#0B132B] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            />
            <button
              type="submit"
              className="btn-primary text-xs py-1.5 px-3 absolute right-1.5 top-1.5"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#94A3B8]" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            >
              <option value="all" className="bg-[#0B132B]">All Roles ({stats.totalUsers})</option>
              <option value="user" className="bg-[#0B132B]">Users ({stats.totalRegularUsers})</option>
              <option value="admin" className="bg-[#0B132B]">Admins ({stats.totalAdmins})</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-4">
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#243054] text-white font-extrabold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">User Details</th>
                <th className="p-3.5">Mobile Phone</th>
                <th className="p-3.5">Age & Profession</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Created Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-semibold text-[#F8FAFC]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#94A3B8]">
                    Loading registered users...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => {
                  const isCurrentAdmin = adminUser?._id === u._id;
                  return (
                    <tr key={u._id} className="hover:bg-[#243054]/40 transition-colors">
                      {/* Name & ID */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white ${
                              u.role === 'admin'
                                ? 'bg-[#00B4D8] shadow-sm shadow-[#00B4D8]/30'
                                : 'bg-[#FF7B00]'
                            }`}
                          >
                            {u.fullName ? u.fullName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-extrabold text-white text-xs">
                              {u.fullName}
                              {isCurrentAdmin && (
                                <span className="ml-2 px-1.5 py-0.5 rounded bg-[#00B4D8]/20 text-[#00B4D8] text-[10px] font-bold">
                                  You
                                </span>
                              )}
                            </p>
                            <span className="text-[10px] text-[#64748B] font-mono block">
                              ID: {u._id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="p-3.5 font-mono text-[#94A3B8]">
                        +91 {u.phone}
                        {u.email && (
                          <span className="text-[10px] text-[#64748B] block font-sans truncate max-w-[140px]">
                            {u.email}
                          </span>
                        )}
                      </td>

                      {/* Age & Profession */}
                      <td className="p-3.5">
                        <span className="text-white block">{u.profession || 'N/A'}</span>
                        <span className="text-[10px] text-[#94A3B8]">{u.age ? `${u.age} yrs` : 'N/A'}</span>
                      </td>

                      {/* Role */}
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-[#00B4D8]/20 text-[#00B4D8] border border-[#00B4D8]/40'
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                          <span>{u.role ? u.role.toUpperCase() : 'USER'}</span>
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="p-3.5 text-[#94A3B8]">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            onClick={() => handleViewDetails(u._id)}
                            className="p-1.5 rounded-lg bg-[#243054] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors"
                            title="View Account Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Role Toggle */}
                          <button
                            onClick={() => handleRoleToggle(u)}
                            disabled={updatingRole === u._id || (u.role === 'admin' && stats.totalAdmins <= 1)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.role === 'admin'
                                ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500 hover:text-white'
                                : 'bg-[#00B4D8]/15 text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white'
                            }`}
                            title={u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                          >
                            {updatingRole === u._id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : u.role === 'admin' ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <Shield className="w-4 h-4" />
                            )}
                          </button>

                          {/* Delete User */}
                          <button
                            onClick={() => setUserToDelete(u)}
                            disabled={isCurrentAdmin || (u.role === 'admin' && stats.totalAdmins <= 1)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isCurrentAdmin
                                ? 'opacity-30 cursor-not-allowed bg-red-500/10 text-red-500'
                                : 'bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white'
                            }`}
                            title={isCurrentAdmin ? 'Cannot delete self' : 'Permanently Delete User'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#94A3B8]">
                    No users matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
            <span className="text-[#94A3B8]">
              Showing page <span className="font-bold text-white">{pagination.currentPage}</span> of{' '}
              <span className="font-bold text-white">{pagination.totalPages}</span> ({pagination.totalCount} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-30"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage}
                className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-30"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1C2541] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-[#00B4D8] block">
                  USER ACCOUNT PROFILE
                </span>
                <h3 className="text-xl font-black font-heading text-white">
                  {selectedUser.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-full bg-[#243054] text-[#94A3B8] hover:text-red-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0B132B] border border-white/10">
                <span className="text-[10px] text-[#64748B] uppercase block font-bold">Mobile Phone</span>
                <span className="font-bold text-white font-mono text-sm block mt-0.5">+91 {selectedUser.phone}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B132B] border border-white/10">
                <span className="text-[10px] text-[#64748B] uppercase block font-bold">Email Address</span>
                <span className="font-bold text-white text-sm block mt-0.5">{selectedUser.email || 'Not provided'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B132B] border border-white/10">
                <span className="text-[10px] text-[#64748B] uppercase block font-bold">Age</span>
                <span className="font-bold text-white text-sm block mt-0.5">{selectedUser.age || 'N/A'} years</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B132B] border border-white/10">
                <span className="text-[10px] text-[#64748B] uppercase block font-bold">Profession</span>
                <span className="font-bold text-white text-sm block mt-0.5">{selectedUser.profession || 'N/A'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B132B] border border-white/10">
                <span className="text-[10px] text-[#64748B] uppercase block font-bold">Assigned Role</span>
                <span className="font-black text-[#00B4D8] uppercase text-sm block mt-0.5">{selectedUser.role}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B132B] border border-white/10">
                <span className="text-[10px] text-[#64748B] uppercase block font-bold">Joined On</span>
                <span className="font-bold text-white text-sm block mt-0.5">
                  {new Date(selectedUser.createdAt).toLocaleDateString('en-IN', {
                    dateStyle: 'medium',
                  })}
                </span>
              </div>
            </div>

            {/* Linked Registrations */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FF7B00]" />
                <span>Linked Marathon Registrations ({selectedUser.registrationsCount || 0})</span>
              </h4>

              {selectedUser.registrations && selectedUser.registrations.length > 0 ? (
                <div className="space-y-2">
                  {selectedUser.registrations.map((r) => (
                    <div
                      key={r._id || r.registrationId}
                      className="p-3 rounded-xl bg-[#0B132B] border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#00B4D8] block">{r.registrationId}</span>
                        <span className="text-[11px] text-[#94A3B8]">{r.fullName} • Size: {r.tShirtSize}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold text-[10px]">
                        {r.status || 'CONFIRMED'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#64748B] italic">No marathon pass registered with this account.</p>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="btn-primary text-xs py-2 px-5"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1C2541] border border-red-500/40 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black font-heading text-white">
                  PERMANENT USER DELETION
                </h3>
                <p className="text-xs text-[#94A3B8]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-white leading-relaxed">
              Are you sure you want to permanently delete the account for{' '}
              <strong className="text-red-400 font-black">{userToDelete.fullName}</strong> (+91 {userToDelete.phone})?
              All account records will be removed from the database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setUserToDelete(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="btn-danger text-xs py-2 px-5 bg-red-500 text-white hover:bg-red-600 font-bold"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
