import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  adminService,
  eventService,
  bannerService,
  activityService,
  faqService,
  registrationService,
  contentService,
} from '../services/api';
import { HomePageManager } from './admin/HomePageManager';
import { FooterManager } from './admin/FooterManager';
import { AdminImagesPage } from './admin/AdminImagesPage';
import {
  Shield,
  Users,
  Building,
  Calendar,
  FileSpreadsheet,
  Upload,
  Search,
  Filter,
  Download,
  Settings,
  Image as ImageIcon,
  HelpCircle,
  KeyRound,
  CheckCircle,
  XCircle,
  RefreshCw,
  LogOut,
  Award,
  Layout,
  Trash2,
  Eye,
  Shirt,
} from 'lucide-react';

export const AdminDashboardPage = ({ defaultTab }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(
    defaultTab || (
      window.location.pathname.includes('/admin/images') ? 'IMAGES' :
      window.location.pathname.includes('/admin/footer') ? 'FOOTER_CMS' :
      window.location.pathname.includes('/admin/home') ? 'HOME_PAGE' : 'STATS'
    )
  ); // STATS | REGISTRATIONS | BATCHES | EVENT_CONFIG | BANNERS | ACTIVITIES | FAQS | PASSWORD
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Registrations Tab State
  const [regType, setRegType] = useState('FORM'); // FORM | SCHOOL_COLLEGE
  const [registrations, setRegistrations] = useState([]);
  const [regPagination, setRegPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInstitution, setFilterInstitution] = useState('ALL');
  const [filterSize, setFilterSize] = useState('ALL');
  const [institutions, setInstitutions] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Batches Tab State
  const [batches, setBatches] = useState([]);
  const [selectedBatchStudents, setSelectedBatchStudents] = useState(null);

  // Event Config Tab State
  const [eventForm, setEventForm] = useState({
    programName: '',
    slogan: '',
    venue: '',
    eventDate: '',
    registrationEndDate: '2026-11-30T23:59',
    registrationOpen: true,
  });
  const [configSaving, setConfigSaving] = useState(false);

  // Banner Upload State
  const [banners, setBanners] = useState([]);
  const [bannerUploadForm, setBannerUploadForm] = useState({
    title: '',
    bannerType: 'HORIZONTAL',
    file: null,
  });
  const [bannerUploading, setBannerUploading] = useState(false);

  // Activities State
  const [activities, setActivities] = useState([]);
  const [activityForm, setActivityForm] = useState({ title: '', category: 'Marathon Training', description: '', file: null });

  // Password State
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdStatus, setPwdStatus] = useState({ success: false, error: null });

  // About CMS State
  const [aboutCmsForm, setAboutCmsForm] = useState(null);
  const [aboutCmsSaving, setAboutCmsSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    loadDashboardStats();
    loadInstitutionsList();
  }, [isAdmin]);

  const loadDashboardStats = () => {
    setLoadingStats(true);
    adminService.getStats().then((res) => {
      if (res.data?.success) setStats(res.data.data);
    }).catch(() => {}).finally(() => setLoadingStats(false));
  };

  const loadInstitutionsList = () => {
    registrationService.getInstitutions().then((res) => {
      if (res.data?.success) setInstitutions(res.data.data);
    }).catch(() => {});
  };

  // Fetch Registrations or Bulk Batches
  useEffect(() => {
    if (activeTab === 'REGISTRATIONS') {
      if (regType === 'FORM') {
        adminService
          .getRegistrations({
            type: 'FORM',
            search: searchTerm,
            institution: filterInstitution,
            size: filterSize,
            page: regPagination.page,
          })
          .then((res) => {
            if (res.data?.success) {
              setRegistrations(res.data.data.items);
              setRegPagination(res.data.data.pagination);
            }
          })
          .catch(() => {});
        loadRegistrationSummary();
      } else if (regType === 'SCHOOL_COLLEGE') {
        loadBatches();
      }
    }
  }, [activeTab, regType, searchTerm, filterInstitution, filterSize, regPagination.page]);

  const loadRegistrationSummary = () => {
    setLoadingSummary(true);
    adminService
      .getRegistrationSummary('FORM')
      .then((res) => {
        if (res.data?.success) {
          setSummaryData(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingSummary(false));
  };

  const loadBatches = () => {
    adminService
      .getBatches()
      .then((res) => {
        if (res.data?.success) setBatches(res.data.data);
      })
      .catch(() => {});
  };

  // Fetch Event Config
  useEffect(() => {
    if (activeTab === 'EVENT_CONFIG') {
      eventService.getConfig().then((res) => {
        if (res.data?.success) {
          const cfg = res.data.data;
          setEventForm({
            programName: cfg.programName,
            slogan: cfg.slogan,
            venue: cfg.venue,
            eventDate: cfg.eventDate ? new Date(cfg.eventDate).toISOString().substring(0, 16) : '',
            registrationEndDate: cfg.registrationEndDate
              ? new Date(cfg.registrationEndDate).toISOString().substring(0, 16)
              : '2026-11-30T23:59',
            registrationOpen: cfg.registrationOpen,
          });
        }
      }).catch(() => {});
    }
  }, [activeTab]);

  // Fetch Banners
  useEffect(() => {
    if (activeTab === 'BANNERS') {
      bannerService.getAllAdmin().then((res) => {
        if (res.data?.success) setBanners(res.data.data);
      }).catch(() => {});
    }
  }, [activeTab]);

  // Fetch Activities
  useEffect(() => {
    if (activeTab === 'ACTIVITIES') {
      activityService.getAllAdmin().then((res) => {
        if (res.data?.success) setActivities(res.data.data);
      }).catch(() => {});
    }

    if (activeTab === 'ABOUT_CMS') {
      contentService.getContent('about_page').then((res) => {
        if (res.data?.success && res.data?.data) {
          setAboutCmsForm(res.data.data);
        } else {
          setAboutCmsForm({
            hero: { title: '', subtitle: '', intro: '', imageUrl: '' },
            whoWeAre: { p1: '', p2: '' },
            chykSection: { imageUrl: '' },
          });
        }
      }).catch(() => {
        setAboutCmsForm({
          hero: { title: '', subtitle: '', intro: '', imageUrl: '' },
          whoWeAre: { p1: '', p2: '' },
          chykSection: { imageUrl: '' },
        });
      });
    }
  }, [activeTab]);

  const handleSaveAboutCms = async (e) => {
    e.preventDefault();
    if (!aboutCmsForm) return;
    setAboutCmsSaving(true);
    try {
      await contentService.updateContent('about_page', aboutCmsForm);
      alert('About Page content updated successfully!');
    } catch (err) {
      alert('Failed to update About Page content');
    } finally {
      setAboutCmsSaving(false);
    }
  };

  // Save Event Config
  const handleSaveEventConfig = async (e) => {
    e.preventDefault();
    setConfigSaving(true);
    try {
      await eventService.updateConfig(eventForm);
      alert('Event Configuration updated successfully!');
    } catch (err) {
      alert('Failed to update event configuration');
    } finally {
      setConfigSaving(false);
    }
  };

  // Upload Banner
  const handleBannerUploadSubmit = async (e) => {
    e.preventDefault();
    if (!bannerUploadForm.file) {
      alert('Please select an image file to upload.');
      return;
    }
    setBannerUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', bannerUploadForm.file);
      formData.append('title', bannerUploadForm.title || `${bannerUploadForm.bannerType} Banner`);
      formData.append('bannerType', bannerUploadForm.bannerType);

      const res = await bannerService.uploadBanner(formData);
      if (res.data?.success) {
        alert('Banner uploaded successfully!');
        setBannerUploadForm({ title: '', bannerType: 'HORIZONTAL', file: null });
        bannerService.getAllAdmin().then((r) => r.data?.success && setBanners(r.data.data));
      }
    } catch (err) {
      alert('Banner upload failed.');
    } finally {
      setBannerUploading(false);
    }
  };

  // File Size Formatter Helper
  const formatFileSize = (bytes) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Download Batch Spreadsheet File
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
      console.error('Download batch spreadsheet failed:', err);
      alert('Failed to download spreadsheet file for this batch.');
    }
  };

  // Delete Bulk Batch
  const handleDeleteBatch = async (batchId, instName) => {
    if (!window.confirm(`Are you sure you want to delete the batch for "${instName || batchId}"? This will also remove all student records under this batch.`)) {
      return;
    }
    try {
      const res = await adminService.deleteBatch(batchId);
      if (res.data?.success) {
        alert('Batch deleted successfully.');
        loadBatches();
        loadDashboardStats();
      }
    } catch (err) {
      alert('Failed to delete batch.');
    }
  };

  // Export CSV Helper
  const exportRegistrationsCSV = () => {
    if (regType === 'FORM') {
      if (registrations.length === 0) return;
      let csv = 'Registration ID,Full Name,Date of Birth,Institution,Contact Number,T-Shirt Size,Type,Date\n';
      registrations.forEach((r) => {
        csv += `"${r.registrationId}","${r.fullName}","${r.dateOfBirth ? new Date(r.dateOfBirth).toISOString().split('T')[0] : 'N/A'}","${r.institutionName}","${r.contactNumber}","${r.tShirtSize}","${r.registrationType}","${new Date(r.createdAt).toISOString()}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Registrations_Form_${Date.now()}.csv`;
      a.click();
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
    }
  };

  const filteredBatches = batches.filter((b) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q || (
      (b.batchId && b.batchId.toLowerCase().includes(q)) ||
      (b.institutionName && b.institutionName.toLowerCase().includes(q)) ||
      (b.contactPersonName && b.contactPersonName.toLowerCase().includes(q)) ||
      (b.phone && b.phone.toLowerCase().includes(q)) ||
      (b.fileName && b.fileName.toLowerCase().includes(q))
    );
    const matchesInst = filterInstitution === 'ALL' || b.institutionName === filterInstitution;
    return matchesSearch && matchesInst;
  });

  return (
    <div className="min-h-screen py-10 px-4 max-w-7xl mx-auto space-y-8">
      
      {/* Admin Navbar Header */}
      <div className="glass-card p-6 rounded-3xl border-2 border-[var(--cyan)]/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--cyan)] text-white flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-[var(--cyan)]/15 text-[var(--cyan)] text-[10px] font-extrabold uppercase">
              ADMIN CONTROL PANEL
            </span>
            <h1 className="text-2xl font-black font-heading text-[var(--text-primary)]">
              MARATHON MANAGEMENT SYSTEM
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-semibold">
              Chinmaya Mission Adoni • Chinmaya Yuva Kendra
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
          className="btn-secondary text-xs py-2.5 px-5 border-red-500/30 text-red-500"
        >
          <LogOut className="w-4 h-4" />
          <span>ADMIN LOGOUT</span>
        </button>
      </div>

      {/* Admin Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
        {[
          { id: 'STATS', label: 'Dashboard Stats', icon: Users },
          { id: 'IMAGES', label: 'Images & Media', icon: ImageIcon },
          { id: 'HOME_PAGE', label: 'Home Page CMS', icon: Layout },
          { id: 'FOOTER_CMS', label: 'Footer CMS', icon: Settings },
          { id: 'REGISTRATIONS', label: 'Registrations', icon: Award },
          { id: 'EVENT_CONFIG', label: 'Event Control', icon: Settings },
          { id: 'BANNERS', label: 'Banner Uploads', icon: ImageIcon },
          { id: 'ACTIVITIES', label: 'Activities CMS', icon: ImageIcon },
          { id: 'ABOUT_CMS', label: 'About Page CMS', icon: Settings },
          { id: 'PASSWORD', label: 'Change Password', icon: KeyRound },
        ].map((tabItem) => {
          const IconComp = tabItem.icon;
          return (
            <button
              key={tabItem.id}
              onClick={() => setActiveTab(tabItem.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === tabItem.id
                  ? 'bg-[var(--cyan)] text-white shadow-lg'
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tabItem.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: IMAGES & MEDIA LIBRARY */}
      {activeTab === 'IMAGES' && <AdminImagesPage />}

      {/* TAB: HOME PAGE CMS */}
      {activeTab === 'HOME_PAGE' && <HomePageManager />}

      {/* TAB: FOOTER CMS */}
      {activeTab === 'FOOTER_CMS' && <FooterManager />}

      {/* TAB 1: DASHBOARD OVERVIEW STATS */}
      {activeTab === 'STATS' && (
        <div className="space-y-8 animate-in fade-in">
          {loadingStats ? (
            <div className="text-center py-12 text-[var(--text-muted)] font-bold">
              Loading dashboard statistics...
            </div>
          ) : stats ? (
            <>
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl">
                  <span className="text-xs font-extrabold text-[var(--orange)] block mb-1">TOTAL REGISTRATIONS</span>
                  <h3 className="text-3xl font-black text-[var(--text-primary)] font-heading">{stats.totalRegistrations}</h3>
                </div>

                <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl">
                  <span className="text-xs font-extrabold text-[var(--cyan)] block mb-1">FORM REGISTRATIONS</span>
                  <h3 className="text-3xl font-black text-[var(--text-primary)] font-heading">{stats.formRegistrations}</h3>
                </div>

                <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl">
                  <span className="text-xs font-extrabold text-[var(--yellow)] block mb-1">SCHOOL/COLLEGE BULK</span>
                  <h3 className="text-3xl font-black text-[var(--text-primary)] font-heading">{stats.schoolCollegeRegistrations}</h3>
                </div>

                <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl">
                  <span className="text-xs font-extrabold text-[var(--green)] block mb-1">TODAY'S REGISTRATIONS</span>
                  <h3 className="text-3xl font-black text-[var(--text-primary)] font-heading">{stats.todayRegistrations}</h3>
                </div>
              </div>

              {/* Institution & Batch Summary Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-center">
                  <span className="text-xs font-bold text-[var(--text-muted)] block">PRELOADED SCHOOLS</span>
                  <span className="text-2xl font-black text-[var(--text-primary)]">{stats.totalSchools}</span>
                </div>
                <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-center">
                  <span className="text-xs font-bold text-[var(--text-muted)] block">PRELOADED COLLEGES</span>
                  <span className="text-2xl font-black text-[var(--text-primary)]">{stats.totalColleges}</span>
                </div>
                <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-center">
                  <span className="text-xs font-bold text-[var(--text-muted)] block">UPLOADED BATCHES</span>
                  <span className="text-2xl font-black text-[var(--text-primary)]">{stats.totalBatches}</span>
                </div>
              </div>

              {/* Recent Registrations Table */}
              <div className="glass-card p-6 rounded-3xl border border-[var(--border-color)] space-y-4">
                <h4 className="text-lg font-extrabold font-heading text-[var(--text-primary)]">
                  RECENT REGISTRATIONS LOG
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-extrabold uppercase">
                      <tr>
                        <th className="p-3">Registration ID</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Institution</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Size</th>
                        <th className="p-3">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]/30 text-[var(--text-primary)]">
                      {stats.recentRegistrations.map((item) => (
                        <tr key={item._id}>
                          <td className="p-3 font-mono font-bold text-[var(--orange)]">{item.registrationId}</td>
                          <td className="p-3 font-extrabold">{item.fullName}</td>
                          <td className="p-3 font-medium">{item.institutionName}</td>
                          <td className="p-3">{item.contactNumber}</td>
                          <td className="p-3 font-bold">{item.tShirtSize}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[var(--cyan)]/15 text-[var(--cyan)]">
                              {item.registrationType}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* TAB 2: REGISTRATIONS MANAGEMENT */}
      {activeTab === 'REGISTRATIONS' && (
        <div className="glass-card p-6 rounded-3xl border border-[var(--border-color)] space-y-6 animate-in fade-in">
          
          {/* Sub Tabs: Form vs School/College */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-2 p-1 rounded-xl bg-[var(--bg-tertiary)]">
              <button
                onClick={() => setRegType('FORM')}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  regType === 'FORM'
                    ? 'bg-[var(--orange)] text-white shadow'
                    : 'text-[var(--text-primary)]'
                }`}
              >
                1. FORM REGISTRATIONS
              </button>
              <button
                onClick={() => setRegType('SCHOOL_COLLEGE')}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
                  regType === 'SCHOOL_COLLEGE'
                    ? 'bg-[var(--cyan)] text-white shadow'
                    : 'text-[var(--text-primary)]'
                }`}
              >
                2. SCHOOL / COLLEGE BULK
              </button>
            </div>

            <button
              onClick={exportRegistrationsCSV}
              className="btn-secondary py-2 px-4 text-xs border-[var(--green)] text-[var(--green)]"
            >
              <Download className="w-4 h-4" />
              <span>EXPORT TO CSV</span>
            </button>
          </div>

          {/* 1. FORM REGISTRATIONS VIEW */}
          {regType === 'FORM' && (
            <>
              {/* Search & Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search ID, name, phone, institution..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                <select
                  value={filterInstitution}
                  onChange={(e) => setFilterInstitution(e.target.value)}
                  className="py-2.5 px-3 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none"
                >
                  <option value="ALL">ALL INSTITUTIONS</option>
                  {institutions.map((inst) => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>

                <select
                  value={filterSize}
                  onChange={(e) => setFilterSize(e.target.value)}
                  className="py-2.5 px-3 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none"
                >
                  <option value="ALL">ALL T-SHIRT SIZES</option>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((sz) => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
              </div>

              {/* Registrations Data Table */}
              <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-extrabold uppercase">
                    <tr>
                      <th className="p-3">Reg ID</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">DOB</th>
                      <th className="p-3">Institution</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">T-Shirt</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Sheets Sync</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]/30 text-[var(--text-primary)]">
                    {registrations.length > 0 ? (
                      registrations.map((item) => (
                        <tr key={item._id}>
                          <td className="p-3 font-mono font-bold text-[var(--orange)]">{item.registrationId}</td>
                          <td className="p-3 font-extrabold">{item.fullName}</td>
                          <td className="p-3">{item.dateOfBirth ? new Date(item.dateOfBirth).toLocaleDateString('en-IN') : 'N/A'}</td>
                          <td className="p-3 font-medium">{item.institutionName}</td>
                          <td className="p-3">{item.contactNumber}</td>
                          <td className="p-3 font-bold text-[var(--yellow)]">{item.tShirtSize}</td>
                          <td className="p-3">{new Date(item.createdAt).toLocaleDateString('en-IN')}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              item.googleSheetsSync?.status === 'success'
                                ? 'bg-emerald-500/15 text-emerald-500'
                                : 'bg-amber-500/15 text-amber-500'
                            }`}>
                              {item.googleSheetsSync?.status || 'saved'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-[var(--text-muted)] font-bold">
                          No registrations found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {regPagination.pages > 1 && (
                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-[var(--text-muted)] font-bold">
                    Page {regPagination.page} of {regPagination.pages} ({regPagination.total} records)
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={regPagination.page === 1}
                      onClick={() => setRegPagination({ ...regPagination, page: regPagination.page - 1 })}
                      className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] font-bold disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <button
                      disabled={regPagination.page === regPagination.pages}
                      onClick={() => setRegPagination({ ...regPagination, page: regPagination.page + 1 })}
                      className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] font-bold disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* REGISTRATION & T-SHIRT SUMMARY (BOTTOM OF FORM REGISTRATIONS) */}
              <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
                <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] space-y-6 shadow-xl">
                  <div className="text-center pb-4 border-b border-[var(--border-color)]">
                    <h4 className="text-sm sm:text-base font-black font-heading tracking-widest uppercase text-[var(--orange)]">
                      REGISTRATION SUMMARY
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] font-medium mt-1">
                      Dynamic count across all individual registrations in the database
                    </p>
                  </div>

                  {/* 1. Total Registrations */}
                  <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-center space-y-1">
                    <span className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] block">
                      TOTAL REGISTRATIONS
                    </span>
                    <div className="text-3xl sm:text-4xl font-black font-heading text-[var(--text-primary)]">
                      {summaryData
                        ? Number(summaryData.totalRegistrations).toLocaleString('en-IN')
                        : (loadingSummary ? '...' : '0')}
                    </div>
                  </div>

                  {/* 2. T-Shirt Summary Header */}
                  <div className="pt-2 space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <Shirt className="w-4 h-4 text-[var(--cyan)]" />
                      <h5 className="text-xs font-black uppercase tracking-widest text-[var(--cyan)]">
                        T-SHIRT SUMMARY
                      </h5>
                    </div>

                    {/* Breakdown: S, M, L, XL */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {['S', 'M', 'L', 'XL'].map((size) => (
                        <div
                          key={size}
                          className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-center shadow-sm transition-all hover:border-[var(--cyan)]/40"
                        >
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-[var(--cyan)]/15 text-[var(--cyan)] mb-2">
                            {size}
                          </span>
                          <div className="text-2xl sm:text-3xl font-black font-heading text-[var(--text-primary)]">
                            {summaryData && summaryData.sizes?.[size] !== undefined
                              ? Number(summaryData.sizes[size]).toLocaleString('en-IN')
                              : (loadingSummary ? '...' : '0')}
                          </div>
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mt-1">
                            Size {size}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 3. Total T-Shirts Required */}
                    <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border-2 border-[var(--cyan)]/40 text-center space-y-1">
                      <span className="text-xs font-black uppercase tracking-wider text-[var(--cyan)] block">
                        TOTAL T-SHIRTS
                      </span>
                      <div className="text-3xl sm:text-4xl font-black font-heading text-[var(--cyan)]">
                        {summaryData
                          ? Number(summaryData.totalTshirts).toLocaleString('en-IN')
                          : (loadingSummary ? '...' : '0')}
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] font-medium block">
                        Total T-shirts required (S + M + L + XL)
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}

          {/* 2. SCHOOL / COLLEGE BULK SUBMISSIONS VIEW */}
          {regType === 'SCHOOL_COLLEGE' && (
            <>
              {/* Search & Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search batch ID, school/college, contact person, file..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                <select
                  value={filterInstitution}
                  onChange={(e) => setFilterInstitution(e.target.value)}
                  className="py-2.5 px-3 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none"
                >
                  <option value="ALL">ALL INSTITUTIONS</option>
                  {institutions.map((inst) => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>

              {/* Batches Data Table */}
              <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-extrabold uppercase">
                    <tr>
                      <th className="p-3">Batch ID</th>
                      <th className="p-3">Institution</th>
                      <th className="p-3">Contact Person</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3 text-center">Students</th>
                      <th className="p-3">Uploaded Sheet</th>
                      <th className="p-3">Submission Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]/30 text-[var(--text-primary)]">
                    {filteredBatches.length > 0 ? (
                      filteredBatches.map((batch) => (
                        <tr key={batch._id} className="hover:bg-[var(--bg-tertiary)]/40 transition-colors">
                          <td className="p-3 font-mono font-bold text-[var(--cyan)]">{batch.batchId}</td>
                          <td className="p-3">
                            <div className="font-extrabold text-[var(--text-primary)]">{batch.institutionName}</div>
                            {batch.institutionType && (
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-[var(--cyan)]/15 text-[var(--cyan)]">
                                {batch.institutionType}
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-medium">{batch.contactPersonName}</td>
                          <td className="p-3">{batch.phone}</td>
                          <td className="p-3 text-center">
                            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[var(--cyan)]/15 text-[var(--cyan)]">
                              {batch.totalStudents}
                            </span>
                          </td>
                          <td className="p-3">
                            {batch.fileName ? (
                              <div className="flex items-center gap-2 max-w-[220px]" title={batch.fileName}>
                                <FileSpreadsheet className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span className="truncate font-semibold text-[var(--text-primary)]">{batch.fileName}</span>
                                {batch.fileSize && (
                                  <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                                    ({formatFileSize(batch.fileSize)})
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[var(--text-muted)] italic text-[11px]">Excel Spreadsheet</span>
                            )}
                          </td>
                          <td className="p-3">{new Date(batch.createdAt).toLocaleDateString('en-IN')}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDownloadBatchSheet(batch)}
                                title="Download the sheet uploaded by this institution"
                                className="btn-secondary py-1.5 px-3 text-[11px] font-extrabold border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10 flex items-center gap-1.5 shadow-sm"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>DOWNLOAD SHEET</span>
                              </button>
                              <button
                                onClick={() => {
                                  adminService.getBatchStudents(batch.batchId).then((r) => {
                                    if (r.data?.success) setSelectedBatchStudents(r.data.data);
                                  });
                                }}
                                title="View enrolled students"
                                className="btn-secondary py-1.5 px-2.5 text-[11px] font-extrabold border-[var(--cyan)]/40 text-[var(--cyan)] hover:bg-[var(--cyan)]/10 flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>STUDENTS</span>
                              </button>
                              <button
                                onClick={() => handleDeleteBatch(batch.batchId, batch.institutionName)}
                                title="Delete Batch"
                                className="p-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-[var(--text-muted)] font-bold">
                          {batches.length === 0
                            ? 'No school or college bulk submissions found yet.'
                            : 'No bulk submissions match your search filter.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Batch Students Detail Modal */}
          {selectedBatchStudents && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl max-w-3xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                  <h4 className="text-lg font-bold font-heading text-[var(--text-primary)]">
                    BATCH STUDENT RECORDS ({selectedBatchStudents.length})
                  </h4>
                  <button onClick={() => setSelectedBatchStudents(null)} className="text-red-500 font-bold text-xs hover:underline">
                    CLOSE [X]
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--bg-tertiary)] font-bold">
                      <tr>
                        <th className="p-2">Registration ID</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">T-Shirt Size</th>
                        <th className="p-2">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {selectedBatchStudents.map((st) => (
                        <tr key={st._id}>
                          <td className="p-2 font-mono font-bold text-[var(--orange)]">{st.registrationId}</td>
                          <td className="p-2 font-bold">{st.fullName}</td>
                          <td className="p-2">{st.tShirtSize}</td>
                          <td className="p-2">{st.contactNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 4: EVENT CONFIG CONTROL */}
      {activeTab === 'EVENT_CONFIG' && (
        <div className="glass-card p-8 rounded-3xl border border-[var(--border-color)] max-w-2xl mx-auto space-y-6 animate-in fade-in">
          <h3 className="text-xl font-extrabold font-heading text-[var(--text-primary)]">
            MARATHON EVENT CONFIGURATION
          </h3>

          <form onSubmit={handleSaveEventConfig} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)] uppercase">Program Name</label>
              <input
                type="text"
                value={eventForm.programName}
                onChange={(e) => setEventForm({ ...eventForm, programName: e.target.value })}
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-bold text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)] uppercase">Event Slogan</label>
              <input
                type="text"
                value={eventForm.slogan}
                onChange={(e) => setEventForm({ ...eventForm, slogan: e.target.value })}
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)] uppercase">Venue & Location</label>
              <input
                type="text"
                value={eventForm.venue}
                onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)] uppercase">Event Date & Time</label>
              <input
                type="datetime-local"
                value={eventForm.eventDate}
                onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)] uppercase">Last Day of Registration (30/11/2026)</label>
              <input
                type="datetime-local"
                value={eventForm.registrationEndDate}
                onChange={(e) => setEventForm({ ...eventForm, registrationEndDate: e.target.value })}
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
              <span className="text-[10px] text-[var(--text-muted)] mt-1 block">Registration closes on: 30 November 2026 (30/11/2026)</span>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-[var(--text-primary)] text-sm">REGISTRATION CONTROL</h4>
                <p className="text-[11px] text-[var(--text-muted)]">Turn marathon registration ON or OFF</p>
              </div>

              <button
                type="button"
                onClick={() => setEventForm({ ...eventForm, registrationOpen: !eventForm.registrationOpen })}
                className={`py-2 px-5 rounded-full font-extrabold text-xs transition-colors ${
                  eventForm.registrationOpen
                    ? 'bg-emerald-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {eventForm.registrationOpen ? 'REGISTRATION IS ON' : 'REGISTRATION IS OFF'}
              </button>
            </div>

            <button
              type="submit"
              disabled={configSaving}
              className="btn-primary w-full justify-center py-3.5 text-sm"
            >
              <span>{configSaving ? 'SAVING...' : 'SAVE EVENT CONFIGURATION'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: BANNERS MANAGEMENT */}
      {activeTab === 'BANNERS' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Upload Banner Form */}
          <div className="glass-card p-8 rounded-3xl border border-[var(--border-color)] max-w-2xl mx-auto space-y-4">
            <h3 className="text-xl font-extrabold font-heading text-[var(--text-primary)]">
              UPLOAD NEW BANNER / POSTER
            </h3>

            <form onSubmit={handleBannerUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-[var(--text-primary)]">Banner Title</label>
                <input
                  type="text"
                  required
                  value={bannerUploadForm.title}
                  onChange={(e) => setBannerUploadForm({ ...bannerUploadForm, title: e.target.value })}
                  placeholder="e.g. Hero Horizontal Banner or Vertical Poster"
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-[var(--text-primary)]">Banner Type</label>
                <select
                  value={bannerUploadForm.bannerType}
                  onChange={(e) => setBannerUploadForm({ ...bannerUploadForm, bannerType: e.target.value })}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-bold text-[var(--text-primary)]"
                >
                  <option value="HORIZONTAL">HORIZONTAL HERO BANNER (1 Active)</option>
                  <option value="VERTICAL">VERTICAL POSTER CAROUSEL (Up to 7)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-[var(--text-primary)]">Select Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerUploadForm({ ...bannerUploadForm, file: e.target.files[0] })}
                  className="w-full py-2 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                />
              </div>

              <button
                type="submit"
                disabled={bannerUploading}
                className="btn-primary w-full justify-center py-3.5 text-xs"
              >
                <span>{bannerUploading ? 'UPLOADING TO CLOUD...' : 'UPLOAD BANNER NOW'}</span>
              </button>
            </form>
          </div>

          {/* Banners List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {banners.map((b) => (
              <div key={b._id} className="rounded-3xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 space-y-3 shadow-lg">
                <div className="h-44 overflow-hidden rounded-2xl bg-black">
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[var(--text-primary)] truncate">{b.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[var(--orange)]/15 text-[var(--orange)]">
                    {b.bannerType}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                  <button
                    onClick={() => {
                      bannerService.toggleStatus(b._id).then(() => {
                        bannerService.getAllAdmin().then((r) => r.data?.success && setBanners(r.data.data));
                      });
                    }}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                      b.active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                    }`}
                  >
                    {b.active ? 'ACTIVE' : 'INACTIVE'}
                  </button>

                  <button
                    onClick={() => {
                      bannerService.deleteBanner(b._id).then(() => {
                        bannerService.getAllAdmin().then((r) => r.data?.success && setBanners(r.data.data));
                      });
                    }}
                    className="text-red-500 text-[10px] font-bold hover:underline"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 6: ACTIVITIES MANAGEMENT */}
      {activeTab === 'ACTIVITIES' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="glass-card p-6 rounded-3xl border border-[var(--border-color)] max-w-2xl mx-auto space-y-4">
            <h3 className="text-xl font-extrabold font-heading text-[var(--text-primary)]">
              ADD NEW MOVEMENT ACTIVITY ITEM
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Add marathon bootcamps, school awareness drives, or youth rallies to the user gallery.
            </p>
          </div>
        </div>
      )}

      {/* TAB 7: CHANGE ADMIN PASSWORD */}
      {activeTab === 'PASSWORD' && (
        <div className="glass-card p-8 rounded-3xl border border-[var(--border-color)] max-w-md mx-auto space-y-6 animate-in fade-in">
          <h3 className="text-xl font-extrabold font-heading text-[var(--text-primary)] text-center">
            CHANGE ADMIN PASSWORD
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pwdForm.newPassword !== pwdForm.confirmPassword) {
                alert('New passwords do not match!');
                return;
              }
              // API call
              alert('Admin password change submitted.');
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)]">Current Password</label>
              <input
                type="password"
                required
                value={pwdForm.currentPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)]">New Password</label>
              <input
                type="password"
                required
                value={pwdForm.newPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)]">Confirm New Password</label>
              <input
                type="password"
                required
                value={pwdForm.confirmPassword}
                onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3.5 text-xs">
              <span>UPDATE ADMIN PASSWORD</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB: ABOUT PAGE CMS */}
      {activeTab === 'ABOUT_CMS' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl">
            <h3 className="text-xl font-extrabold font-heading text-[var(--text-primary)] mb-2">
              ABOUT PAGE CONTENT MANAGEMENT
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-6">
              Update titles, subtitles, intro text, section headings and image URLs for the About Page.
            </p>

            {aboutCmsForm ? (
              <form onSubmit={handleSaveAboutCms} className="space-y-8">
                {/* Hero Section */}
                <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-4">
                  <h4 className="text-base font-extrabold text-[var(--orange)] font-heading uppercase">
                    1. HERO SECTION
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Hero Title</label>
                      <input
                        type="text"
                        value={aboutCmsForm.hero?.title || ''}
                        onChange={(e) => setAboutCmsForm({
                          ...aboutCmsForm,
                          hero: { ...aboutCmsForm.hero, title: e.target.value }
                        })}
                        className="w-full py-2.5 px-3.5 text-xs rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Hero Subtitle</label>
                      <input
                        type="text"
                        value={aboutCmsForm.hero?.subtitle || ''}
                        onChange={(e) => setAboutCmsForm({
                          ...aboutCmsForm,
                          hero: { ...aboutCmsForm.hero, subtitle: e.target.value }
                        })}
                        className="w-full py-2.5 px-3.5 text-xs rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Hero Intro Text</label>
                      <textarea
                        rows={2}
                        value={aboutCmsForm.hero?.intro || ''}
                        onChange={(e) => setAboutCmsForm({
                          ...aboutCmsForm,
                          hero: { ...aboutCmsForm.hero, intro: e.target.value }
                        })}
                        className="w-full py-2.5 px-3.5 text-xs rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Hero Image URL</label>
                      <input
                        type="text"
                        value={aboutCmsForm.hero?.imageUrl || ''}
                        onChange={(e) => setAboutCmsForm({
                          ...aboutCmsForm,
                          hero: { ...aboutCmsForm.hero, imageUrl: e.target.value }
                        })}
                        className="w-full py-2.5 px-3.5 text-xs rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Who We Are Section */}
                <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-4">
                  <h4 className="text-base font-extrabold text-[var(--orange)] font-heading uppercase">
                    2. WHO WE ARE SECTION
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Paragraph 1</label>
                      <textarea
                        rows={3}
                        value={aboutCmsForm.whoWeAre?.p1 || ''}
                        onChange={(e) => setAboutCmsForm({
                          ...aboutCmsForm,
                          whoWeAre: { ...aboutCmsForm.whoWeAre, p1: e.target.value }
                        })}
                        className="w-full py-2.5 px-3.5 text-xs rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Paragraph 2</label>
                      <textarea
                        rows={3}
                        value={aboutCmsForm.whoWeAre?.p2 || ''}
                        onChange={(e) => setAboutCmsForm({
                          ...aboutCmsForm,
                          whoWeAre: { ...aboutCmsForm.whoWeAre, p2: e.target.value }
                        })}
                        className="w-full py-2.5 px-3.5 text-xs rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>
                </div>

                {/* CHYK Section Image URL */}
                <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-4">
                  <h4 className="text-base font-extrabold text-[var(--orange)] font-heading uppercase">
                    3. CHYK YUVA KENDRA & IMAGES
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">CHYK Image URL</label>
                      <input
                        type="text"
                        value={aboutCmsForm.chykSection?.imageUrl || ''}
                        onChange={(e) => setAboutCmsForm({
                          ...aboutCmsForm,
                          chykSection: { ...aboutCmsForm.chykSection, imageUrl: e.target.value }
                        })}
                        className="w-full py-2.5 px-3.5 text-xs rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Spirituality In Action Image URL</label>
                      <input
                        type="text"
                        value={aboutCmsForm.spiritualityInAction?.imageUrl || ''}
                        onChange={(e) => setAboutCmsForm({
                          ...aboutCmsForm,
                          spiritualityInAction: { ...aboutCmsForm.spiritualityInAction, imageUrl: e.target.value }
                        })}
                        className="w-full py-2.5 px-3.5 text-xs rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={aboutCmsSaving}
                  className="btn-primary py-3.5 px-8 text-xs font-extrabold"
                >
                  <span>{aboutCmsSaving ? 'SAVING CONTENT...' : 'SAVE ABOUT PAGE CONTENT'}</span>
                </button>
              </form>
            ) : (
              <div className="py-8 text-center text-[var(--text-muted)] text-xs font-bold">
                Loading About Page CMS form...
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
