import React, { useEffect, useState } from 'react';
import {
  adminService,
  registrationService,
} from '../../services/api';
import { RegistrationSummaryCards } from '../../components/admin/RegistrationSummaryCards';
import { TshirtSummary } from '../../components/admin/TshirtSummary';
import { ClassSummary } from '../../components/admin/ClassSummary';
import { RegistrationDetailsModal } from '../../components/admin/RegistrationDetailsModal';
import { RegistrationEditModal } from '../../components/admin/RegistrationEditModal';
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
  RotateCw,
} from 'lucide-react';

export const RegistrationsManager = () => {
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
  const [loadingBatches, setLoadingBatches] = useState(false);

  // Action feedback
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  useEffect(() => {
    loadInstitutionsList();
  }, []);

  const loadInstitutionsList = () => {
    registrationService
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
    adminService
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
    adminService
      .getRegistrationSummary()
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
    adminService
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
        `Are you sure you want to permanently delete registration ${id} (${name})? The record will be permanently deleted from the database.`
      )
    ) {
      return;
    }
    try {
      const res = await adminService.deleteRegistration(id);
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
      const res = await adminService.downloadBatchSpreadsheet(batch.batchId);
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
        `Are you sure you want to delete the batch for "${instName || batchId}"? This will permanently remove all student records under this batch.`
      )
    ) {
      return;
    }
    try {
      const res = await adminService.deleteBatch(batchId);
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
      const res = await adminService.retrySheetsSync(regId);
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
          <span className="text-xs font-black tracking-widest text-[var(--cyan)] uppercase">
            PARTICIPATION RECORDS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-[var(--text-primary)]">
            MARATHON REGISTRATIONS
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Manage individual participants, school & college registrations, and bulk spreadsheets
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportRegistrationsCSV}
            className="btn-secondary text-xs py-2.5 px-4"
          >
            <Download className="w-4 h-4 text-[var(--cyan)]" />
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
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-500'
              : 'bg-red-500/15 border border-red-500/30 text-red-500'
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
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
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
                ? 'bg-[var(--cyan)] text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setRegPagination((p) => ({ ...p, page: 1 }));
              }}
              placeholder="Search by ID, Name, Phone, School..."
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
            />
          </div>

          <div>
            <select
              value={filterInstitution}
              onChange={(e) => {
                setFilterInstitution(e.target.value);
                setRegPagination((p) => ({ ...p, page: 1 }));
              }}
              className="w-full py-2 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
            >
              <option value="ALL" className="bg-[var(--bg-primary)]">All Institutions</option>
              {institutions.map((inst) => (
                <option key={inst._id || inst.name} value={inst.name} className="bg-[var(--bg-primary)]">
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
              className="w-full py-2 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
            >
              <option value="ALL" className="bg-[var(--bg-primary)]">All Sizes</option>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((s) => (
                <option key={s} value={s} className="bg-[var(--bg-primary)]">
                  Size {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table: Registrations OR Bulk Batches */}
      {regType !== 'BATCHES' ? (
        <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-extrabold uppercase tracking-wider">
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
              <tbody className="divide-y divide-[var(--border-color)] font-semibold text-[var(--text-primary)]">
                {loadingRegistrations ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-[var(--text-muted)]">
                      Loading registrations...
                    </td>
                  </tr>
                ) : registrations.length > 0 ? (
                  registrations.map((reg) => (
                    <tr key={reg._id || reg.registrationId} className="hover:bg-[var(--bg-tertiary)]/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[var(--cyan)]">
                        {reg.registrationId}
                      </td>
                      <td className="p-3.5 font-bold text-[var(--text-primary)]">
                        {reg.fullName}
                      </td>
                      <td className="p-3.5 text-[var(--text-muted)] truncate max-w-[160px]">
                        {reg.institutionName || 'Individual'}
                      </td>
                      <td className="p-3.5 text-[var(--text-muted)]">
                        {reg.standard || 'N/A'}
                      </td>
                      <td className="p-3.5 font-mono text-[var(--text-muted)]">
                        {reg.contactNumber}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-[var(--yellow)]/15 text-[var(--yellow)] font-bold">
                          {reg.tShirtSize}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          reg.registrationId?.includes('IN')
                            ? 'bg-[var(--orange)]/15 text-[var(--orange)]'
                            : 'bg-[var(--cyan)]/15 text-[var(--cyan)]'
                        }`}>
                          {reg.registrationId?.includes('IN') ? 'INDIVIDUAL' : 'INSTITUTION'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingRegistration(reg)}
                            className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--cyan)] hover:bg-[var(--cyan)] hover:text-white transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingRegistration(reg)}
                            className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--orange)] hover:bg-[var(--orange)] hover:text-white transition-colors"
                            title="Edit Record"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRetrySheetsSync(reg._id || reg.registrationId)}
                            className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                            title="Sync to Google Sheets"
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRegistration(reg.registrationId || reg._id, reg.fullName)}
                            className="p-1.5 rounded-lg bg-red-500/15 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
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
                    <td colSpan="8" className="p-8 text-center text-[var(--text-muted)]">
                      No matching registration records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {regPagination.pages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)] text-xs">
              <span className="text-[var(--text-muted)]">
                Page <span className="font-bold text-[var(--text-primary)]">{regPagination.page}</span> of{' '}
                <span className="font-bold text-[var(--text-primary)]">{regPagination.pages}</span> ({regPagination.total} total)
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
        <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-extrabold uppercase tracking-wider">
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
              <tbody className="divide-y divide-[var(--border-color)] font-semibold text-[var(--text-primary)]">
                {loadingBatches ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-[var(--text-muted)]">
                      Loading institutional batches...
                    </td>
                  </tr>
                ) : filteredBatches.length > 0 ? (
                  filteredBatches.map((batch) => (
                    <tr key={batch._id || batch.batchId} className="hover:bg-[var(--bg-tertiary)]/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[var(--cyan)]">
                        {batch.batchId}
                      </td>
                      <td className="p-3.5 font-bold text-[var(--text-primary)]">
                        {batch.institutionName}
                      </td>
                      <td className="p-3.5 text-[var(--text-muted)]">
                        {batch.contactPersonName}
                      </td>
                      <td className="p-3.5 font-mono text-[var(--text-muted)]">
                        {batch.phone}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-md bg-[var(--cyan)]/15 text-[var(--cyan)] font-black">
                          {batch.totalStudents} Students
                        </span>
                      </td>
                      <td className="p-3.5 text-[var(--text-muted)]">
                        {new Date(batch.createdAt).toLocaleDateString('en-IN', {
                          dateStyle: 'medium',
                        })}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDownloadBatchSheet(batch)}
                            className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] text-[var(--cyan)] hover:bg-[var(--cyan)] hover:text-white transition-colors"
                            title="Download Spreadsheet"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBatch(batch.batchId, batch.institutionName)}
                            className="p-1.5 rounded-lg bg-red-500/15 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
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
                    <td colSpan="7" className="p-8 text-center text-[var(--text-muted)]">
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

export default RegistrationsManager;
