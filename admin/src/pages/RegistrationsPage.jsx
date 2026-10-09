import React, { useEffect, useState } from 'react';
import {
  adminRegistrationService,
  adminStatsService,
} from '../services/adminApi';
import { RegistrationSummaryCards } from '../components/RegistrationSummaryCards';
import { TshirtSummary } from '../components/TshirtSummary';
import { ClassSummary } from '../components/ClassSummary';
import { RegistrationDetailsModal } from '../components/RegistrationDetailsModal';
import { RegistrationEditModal } from '../components/RegistrationEditModal';
import {
  Award,
  Users,
  Building,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Pencil,
  RefreshCw,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertTriangle,
  CheckCircle,
  RotateCw,
} from 'lucide-react';

export const RegistrationsPage = () => {
  const [regType, setRegType] = useState('ALL'); // ALL | INDIVIDUAL | SCHOOL_COLLEGE | BATCHES
  const [registrations, setRegistrations] = useState([]);
  const [regPagination, setRegPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInstitution, setFilterInstitution] = useState('ALL');
  const [filterSize, setFilterSize] = useState('ALL');
  const [filterStandard, setFilterStandard] = useState('ALL');
  const [institutions, setInstitutions] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [viewingRegistration, setViewingRegistration] = useState(null);
  const [editingRegistration, setEditingRegistration] = useState(null);

  // Batches Tab State
  const [batches, setBatches] = useState([]);
  const [selectedBatchStudents, setSelectedBatchStudents] = useState(null);
  const [loadingBatches, setLoadingBatches] = useState(false);

  // Action feedback
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  useEffect(() => {
    loadInstitutionsList();
  }, []);

  const loadInstitutionsList = () => {
    adminRegistrationService
      .getInstitutions()
      .then((res) => {
        if (res.data?.success) setInstitutions(res.data.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (regType === 'BATCHES') {
      loadBatches();
    } else {
      loadRegistrations();
    }
    loadRegistrationSummary();
  }, [regType, searchTerm, filterStandard, filterInstitution, filterSize, regPagination.page]);

  const loadRegistrations = () => {
    setLoadingRegistrations(true);
    adminRegistrationService
      .getRegistrations({
        type: regType === 'ALL' ? undefined : regType,
        search: searchTerm,
        standard: filterStandard !== 'ALL' ? filterStandard : undefined,
        institution: filterInstitution !== 'ALL' ? filterInstitution : undefined,
        size: filterSize !== 'ALL' ? filterSize : undefined,
        page: regPagination.page,
      })
      .then((res) => {
        if (res.data?.success) {
          setRegistrations(res.data.data.items);
          setRegPagination(res.data.data.pagination);
        }
      })
      .catch((err) => {
        setFeedback({
          type: 'error',
          message: err.response?.data?.message || 'Failed to load registrations.',
        });
      })
      .finally(() => setLoadingRegistrations(false));
  };

  const loadRegistrationSummary = () => {
    setLoadingSummary(true);
    adminRegistrationService
      .getSummary()
      .then((res) => {
        if (res.data?.success) {
          setSummaryData(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingSummary(false));
  };

  const loadBatches = () => {
    setLoadingBatches(true);
    adminRegistrationService
      .getBatches()
      .then((res) => {
        if (res.data?.success) setBatches(res.data.data);
      })
      .catch(() => {})
      .finally(() => setLoadingBatches(false));
  };

  const handleDeleteRegistration = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete registration ${id} (${name})? The record will be deleted from the database and cannot be recovered.`
      )
    ) {
      return;
    }
    try {
      const res = await adminRegistrationService.deleteRegistration(id);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: res.data.message || `Registration ${id} deleted successfully.`,
        });
        loadRegistrations();
        loadRegistrationSummary();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete registration record.',
      });
    }
  };

  const handleRegistrationUpdated = (updated) => {
    setFeedback({
      type: 'success',
      message: `Registration ${updated.registrationId} updated successfully.`,
    });
    loadRegistrations();
    loadRegistrationSummary();
  };

  const handleDownloadBatchSheet = async (batch) => {
    try {
      const res = await adminRegistrationService.downloadBatchSpreadsheet(batch.batchId);
      const blob = new Blob([res.data], {
        type: batch.fileMimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = batch.fileName || `${(batch.institutionName || 'Batch').replace(/\s+/g, '_')}_${batch.batchId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download spreadsheet file for this batch.');
    }
  };

  const handleDeleteBatch = async (batchId, instName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the batch for "${instName || batchId}"? This will permanently remove all student records under this batch from the database.`
      )
    ) {
      return;
    }
    try {
      const res = await adminRegistrationService.deleteBatch(batchId);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'Batch and associated student records deleted successfully.',
        });
        loadBatches();
        loadRegistrationSummary();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to delete batch.',
      });
    }
  };

  const handleRetrySheetsSync = async (regId) => {
    try {
      const res = await adminRegistrationService.retrySheetsSync(regId);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: res.data.message || 'Google Sheets sync completed!',
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to sync record to Google Sheets.',
      });
    }
  };

  const exportRegistrationsCSV = () => {
    if (regType !== 'BATCHES') {
      if (registrations.length === 0) {
        alert('No registration records to export.');
        return;
      }
      let csv = 'Registration ID,Student Name,Age,Standard / Class,Profession,Contact Number,School / College,T-Shirt Size,Type,Date\n';
      registrations.forEach((r) => {
        csv += `"${r.registrationId}","${r.fullName}","${r.age ?? 'N/A'}","${r.standard ?? 'N/A'}","${r.profession ?? 'N/A'}","${r.contactNumber}","${r.institutionName}","${r.tShirtSize}","${r.registrationType}","${new Date(r.createdAt).toISOString()}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Registrations_${regType}_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      if (batches.length === 0) return;
      let csv = 'Batch ID,Institution Name,Institution Type,Contact Person,Phone,Total Students,Uploaded File,Submission Date\n';
      batches.forEach((b) => {
        csv += `"${b.batchId}","${b.institutionName}","${b.institutionType || 'N/A'}","${b.contactPersonName}","${b.phone}","${b.totalStudents}","${b.fileName || 'N/A'}","${new Date(b.createdAt).toISOString()}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `School_College_Batches_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const filteredBatches = batches.filter((b) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (b.batchId && b.batchId.toLowerCase().includes(q)) ||
      (b.institutionName && b.institutionName.toLowerCase().includes(q)) ||
      (b.contactPersonName && b.contactPersonName.toLowerCase().includes(q)) ||
      (b.phone && b.phone.toLowerCase().includes(q));
    const matchesInst = filterInstitution === 'ALL' || b.institutionName === filterInstitution;
    return matchesSearch && matchesInst;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black tracking-widest text-[#00B4D8] uppercase">
            PARTICIPATION RECORDS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            MARATHON REGISTRATIONS
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium">
            Manage individual participants, school & college registrations, and bulk spreadsheets
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportRegistrationsCSV}
            className="btn-secondary text-xs py-2.5 px-4"
          >
            <Download className="w-4 h-4 text-[#00B4D8]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              if (regType === 'BATCHES') loadBatches();
              else loadRegistrations();
              loadRegistrationSummary();
            }}
            className="btn-secondary text-xs py-2.5 px-3"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loadingRegistrations ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Action Feedback Alerts */}
      {feedback.message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/15 border border-red-500/30 text-red-400'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({ type: null, message: '' })} className="hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <RegistrationSummaryCards summary={summaryData} loading={loadingSummary} />

      {/* T-Shirt & Class Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TshirtSummary summary={summaryData} loading={loadingSummary} />
        <ClassSummary summary={summaryData} loading={loadingSummary} />
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#1C2541] border border-white/10">
        {[
          { id: 'ALL', label: 'All Registrations' },
          { id: 'INDIVIDUAL', label: 'Individual Forms' },
          { id: 'SCHOOL_COLLEGE', label: 'School & College' },
          { id: 'BATCHES', label: 'Institutional Bulk Batches' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setRegType(tab.id);
              setRegPagination((p) => ({ ...p, page: 1 }));
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              regType === tab.id
                ? 'bg-[#00B4D8] text-white shadow-md'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#243054]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-[#1C2541] border border-white/10 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setRegPagination((p) => ({ ...p, page: 1 }));
              }}
              placeholder="Search by ID, Name, Phone, School..."
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#0B132B] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            />
          </div>

          <div>
            <select
              value={filterInstitution}
              onChange={(e) => {
                setFilterInstitution(e.target.value);
                setRegPagination((p) => ({ ...p, page: 1 }));
              }}
              className="w-full py-2 px-3 rounded-xl bg-[#0B132B] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            >
              <option value="ALL" className="bg-[#0B132B]">All Institutions</option>
              {institutions.map((inst) => (
                <option key={inst._id || inst.name} value={inst.name} className="bg-[#0B132B]">
                  {inst.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterSize}
              onChange={(e) => {
                setFilterSize(e.target.value);
                setRegPagination((p) => ({ ...p, page: 1 }));
              }}
              className="w-full py-2 px-3 rounded-xl bg-[#0B132B] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            >
              <option value="ALL" className="bg-[#0B132B]">All Sizes</option>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((s) => (
                <option key={s} value={s} className="bg-[#0B132B]">
                  Size {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table: Registrations OR Bulk Batches */}
      {regType !== 'BATCHES' ? (
        <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#243054] text-white font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Registration ID</th>
                  <th className="p-3.5">Participant Name</th>
                  <th className="p-3.5">Institution / School</th>
                  <th className="p-3.5">Class / Standard</th>
                  <th className="p-3.5">Contact Phone</th>
                  <th className="p-3.5">Size</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-semibold text-[#F8FAFC]">
                {loadingRegistrations ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-[#94A3B8]">
                      Loading registrations...
                    </td>
                  </tr>
                ) : registrations.length > 0 ? (
                  registrations.map((reg) => (
                    <tr key={reg._id || reg.registrationId} className="hover:bg-[#243054]/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#00B4D8]">
                        {reg.registrationId}
                      </td>
                      <td className="p-3.5 font-bold text-white">
                        {reg.fullName}
                      </td>
                      <td className="p-3.5 text-[#94A3B8] truncate max-w-[160px]">
                        {reg.institutionName || 'Individual'}
                      </td>
                      <td className="p-3.5 text-[#94A3B8]">
                        {reg.standard || 'N/A'}
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
                          reg.registrationId?.includes('IN')
                            ? 'bg-[#FF7B00]/15 text-[#FF7B00]'
                            : 'bg-[#00B4D8]/15 text-[#00B4D8]'
                        }`}>
                          {reg.registrationId?.includes('IN') ? 'INDIVIDUAL' : 'INSTITUTION'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingRegistration(reg)}
                            className="p-1.5 rounded-lg bg-[#243054] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingRegistration(reg)}
                            className="p-1.5 rounded-lg bg-[#243054] text-[#FF7B00] hover:bg-[#FF7B00] hover:text-white transition-colors"
                            title="Edit Record"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRetrySheetsSync(reg._id || reg.registrationId)}
                            className="p-1.5 rounded-lg bg-[#243054] text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                            title="Sync to Google Sheets"
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRegistration(reg.registrationId || reg._id, reg.fullName)}
                            className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                            title="Permanently Delete Registration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-[#94A3B8]">
                      No matching registration records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {regPagination.pages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
              <span className="text-[#94A3B8]">
                Page <span className="font-bold text-white">{regPagination.page}</span> of{' '}
                <span className="font-bold text-white">{regPagination.pages}</span> ({regPagination.total} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRegPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                  disabled={regPagination.page <= 1}
                  className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-30"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  onClick={() => setRegPagination((p) => ({ ...p, page: Math.min(p.pages, p.page + 1) }))}
                  disabled={regPagination.page >= regPagination.pages}
                  className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-30"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Batches View */
        <div className="p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#243054] text-white font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Batch ID</th>
                  <th className="p-3.5">Institution Name</th>
                  <th className="p-3.5">Contact Person</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Students Count</th>
                  <th className="p-3.5">Uploaded Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-semibold text-[#F8FAFC]">
                {loadingBatches ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-[#94A3B8]">
                      Loading institutional batches...
                    </td>
                  </tr>
                ) : filteredBatches.length > 0 ? (
                  filteredBatches.map((batch) => (
                    <tr key={batch._id || batch.batchId} className="hover:bg-[#243054]/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#00B4D8]">
                        {batch.batchId}
                      </td>
                      <td className="p-3.5 font-bold text-white">
                        {batch.institutionName}
                      </td>
                      <td className="p-3.5 text-[#94A3B8]">
                        {batch.contactPersonName}
                      </td>
                      <td className="p-3.5 font-mono text-[#94A3B8]">
                        {batch.phone}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-md bg-[#00B4D8]/15 text-[#00B4D8] font-black">
                          {batch.totalStudents} Students
                        </span>
                      </td>
                      <td className="p-3.5 text-[#94A3B8]">
                        {new Date(batch.createdAt).toLocaleDateString('en-IN', {
                          dateStyle: 'medium',
                        })}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDownloadBatchSheet(batch)}
                            className="p-1.5 rounded-lg bg-[#243054] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white transition-colors"
                            title="Download Spreadsheet"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBatch(batch.batchId, batch.institutionName)}
                            className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                            title="Delete Batch and Records"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-[#94A3B8]">
                      No bulk batches uploaded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {viewingRegistration && (
        <RegistrationDetailsModal
          registration={viewingRegistration}
          onClose={() => setViewingRegistration(null)}
          onEdit={(reg) => {
            setViewingRegistration(null);
            setEditingRegistration(reg);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingRegistration && (
        <RegistrationEditModal
          registration={editingRegistration}
          onClose={() => setEditingRegistration(null)}
          onUpdated={handleRegistrationUpdated}
        />
      )}
    </div>
  );
};

export default RegistrationsPage;
