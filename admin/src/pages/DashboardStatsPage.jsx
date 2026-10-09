import React, { useEffect, useState } from 'react';
import { adminStatsService } from '../services/adminApi';
import {
  Users,
  Award,
  Building,
  Calendar,
  RefreshCw,
  Eye,
  Shield,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { RegistrationDetailsModal } from '../components/RegistrationDetailsModal';

export const DashboardStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingRegistration, setViewingRegistration] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminStatsService.getStats();
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black tracking-widest text-[#00B4D8] uppercase">
            EXECUTIVE OVERVIEW
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            ADMIN DASHBOARD
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium">
            Live metrics and operations for Anti-Drug Marathon Run 2026
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="btn-secondary text-xs py-2.5 px-4 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#FF7B00]">TOTAL REGISTRATIONS</span>
            <Award className="w-5 h-5 text-[#FF7B00]" />
          </div>
          <h3 className="text-3xl font-black text-white font-heading mt-2">
            {loading ? '...' : (stats?.totalRegistrations ?? 0)}
          </h3>
          <p className="text-[11px] text-[#94A3B8] mt-1">Confirmed participants</p>
        </div>

        <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#00B4D8]">FORM REGISTRATIONS</span>
            <Users className="w-5 h-5 text-[#00B4D8]" />
          </div>
          <h3 className="text-3xl font-black text-white font-heading mt-2">
            {loading ? '...' : (stats?.formRegistrations ?? 0)}
          </h3>
          <p className="text-[11px] text-[#94A3B8] mt-1">Individual signups</p>
        </div>

        <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#F59E0B]">SCHOOL/COLLEGE BULK</span>
            <Building className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <h3 className="text-3xl font-black text-white font-heading mt-2">
            {loading ? '...' : (stats?.schoolCollegeRegistrations ?? 0)}
          </h3>
          <p className="text-[11px] text-[#94A3B8] mt-1">Institutional entries</p>
        </div>

        <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#10B981]">TODAY'S REGISTRATIONS</span>
            <TrendingUp className="w-5 h-5 text-[#10B981]" />
          </div>
          <h3 className="text-3xl font-black text-white font-heading mt-2">
            {loading ? '...' : (stats?.todayRegistrations ?? 0)}
          </h3>
          <p className="text-[11px] text-[#94A3B8] mt-1">Activity today</p>
        </div>
      </div>

      {/* Secondary Metrics: Users, Schools, Batches */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#1C2541]/70 border border-white/10 text-center">
          <span className="text-[11px] font-bold text-[#94A3B8] block">REGISTERED USERS</span>
          <span className="text-2xl font-black text-white font-heading mt-0.5 block">
            {loading ? '...' : (stats?.totalUsers ?? 0)}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#1C2541]/70 border border-white/10 text-center">
          <span className="text-[11px] font-bold text-[#94A3B8] block">PRELOADED SCHOOLS</span>
          <span className="text-2xl font-black text-white font-heading mt-0.5 block">
            {loading ? '...' : (stats?.totalSchools ?? 0)}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#1C2541]/70 border border-white/10 text-center">
          <span className="text-[11px] font-bold text-[#94A3B8] block">PRELOADED COLLEGES</span>
          <span className="text-2xl font-black text-white font-heading mt-0.5 block">
            {loading ? '...' : (stats?.totalColleges ?? 0)}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#1C2541]/70 border border-white/10 text-center">
          <span className="text-[11px] font-bold text-[#94A3B8] block">UPLOADED BATCHES</span>
          <span className="text-2xl font-black text-white font-heading mt-0.5 block">
            {loading ? '...' : (stats?.totalBatches ?? 0)}
          </span>
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-black font-heading text-white">
            RECENT REGISTRATIONS
          </h4>
          <span className="text-xs text-[#94A3B8]">Latest entries</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#243054] text-white font-extrabold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Registration ID</th>
                <th className="p-3.5">Full Name</th>
                <th className="p-3.5">Institution</th>
                <th className="p-3.5">Contact Phone</th>
                <th className="p-3.5">T-Shirt</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-semibold text-[#F8FAFC]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#94A3B8]">
                    Loading recent records...
                  </td>
                </tr>
              ) : stats?.recentRegistrations?.length > 0 ? (
                stats.recentRegistrations.map((reg) => (
                  <tr key={reg._id || reg.registrationId} className="hover:bg-[#243054]/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#00B4D8]">
                      {reg.registrationId}
                    </td>
                    <td className="p-3.5 font-bold text-white">
                      {reg.fullName}
                    </td>
                    <td className="p-3.5 text-[#94A3B8] truncate max-w-[180px]">
                      {reg.institutionName || 'Individual'}
                    </td>
                    <td className="p-3.5 font-mono text-[#94A3B8]">
                      {reg.contactNumber}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#F59E0B]/15 text-[#F59E0B] font-bold">
                        {reg.tShirtSize}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        (reg.registrationType || '').toLowerCase().includes('individual') || reg.registrationId?.includes('IN')
                          ? 'bg-[#FF7B00]/15 text-[#FF7B00]'
                          : 'bg-[#00B4D8]/15 text-[#00B4D8]'
                      }`}>
                        {reg.registrationType || 'FORM'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setViewingRegistration(reg)}
                        className="p-1.5 rounded-lg bg-[#243054] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors"
                        title="View Record"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#94A3B8]">
                    No registrations recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {viewingRegistration && (
        <RegistrationDetailsModal
          registration={viewingRegistration}
          onClose={() => setViewingRegistration(null)}
        />
      )}
    </div>
  );
};

export default DashboardStatsPage;
