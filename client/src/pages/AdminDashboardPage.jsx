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
import { LetsConnectManager } from './admin/LetsConnectManager';
import { UserManager } from './admin/UserManager';
import { AdminProfileManager } from './admin/AdminProfileManager';
import { RegistrationSummaryCards } from '../components/admin/RegistrationSummaryCards';
import { TshirtSummary } from '../components/admin/TshirtSummary';
import { ClassSummary } from '../components/admin/ClassSummary';
import { RegistrationDetailsModal } from '../components/admin/RegistrationDetailsModal';
import { RegistrationEditModal } from '../components/admin/RegistrationEditModal';
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
  Pencil,
  GraduationCap,
  MessageSquare,
  UserCheck,
} from 'lucide-react';

export const AdminDashboardPage = ({ defaultTab }) => {
  const { adminUser, user, isAdmin, logoutAdmin, logout } = useAuth();
  const getTabFromUrl = () => {
    if (defaultTab) return defaultTab;
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path.includes('/admin/users')) return 'USERS';
    if (path.includes('/admin/profile')) return 'ADMIN_PROFILE';
    if (path.includes('/admin/registrations')) return 'REGISTRATIONS';
    if (path.includes('/admin/event-config')) return 'EVENT_CONFIG';
    if (path.includes('/admin/banners')) return 'BANNERS';
    if (path.includes('/admin/activities')) return 'ACTIVITIES';
    if (path.includes('/admin/about')) return 'ABOUT_CMS';
    if (path.includes('/admin/change-password')) return 'PASSWORD';
    if (path.includes('/admin/lets-connect')) return 'LETS_CONNECT';
    if (path.includes('/admin/images')) return 'IMAGES';
    if (path.includes('/admin/footer')) return 'FOOTER_CMS';
    if (path.includes('/admin/home')) return 'HOME_PAGE';
    return 'STATS';
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Registrations Tab State
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
      if (regType === 'BATCHES') {
        loadBatches();
      } else {
        loadRegistrations();
      }
      loadRegistrationSummary();
    }
  }, [activeTab, regType, searchTerm, filterStandard, filterInstitution, filterSize, regPagination.page]);

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
      .catch(() => {})
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

  const handleDeleteRegistration = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete registration ${id} (${name})? The record will be permanently deleted, and the ID sequence will continue safely without reuse.`
      )
    ) {
      return;
    }
    try {
      const res = await adminService.deleteRegistration(id);
      if (res.data?.success) {
        alert(res.data.message || 'Registration deleted successfully.');
        loadRegistrations();
        loadRegistrationSummary();
        loadDashboardStats();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete registration.');
    }
  };

  const handleRegistrationUpdated = (updated) => {
    alert(`Registration ${updated.registrationId} updated successfully.`);
    loadRegistrations();
    loadRegistrationSummary();
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

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-left">
            <div className="w-8 h-8 rounded-full bg-[var(--cyan)] text-white flex items-center justify-center font-black text-xs shadow-sm">
              {adminUser?.fullName ? adminUser.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <p className="text-xs font-extrabold text-[var(--text-primary)] truncate max-w-[160px]">
                {adminUser?.fullName || 'Chinmaya Admin'}
              </p>
              <span className="text-[10px] font-mono font-bold text-[var(--cyan)] block">
                {adminUser?.email || adminUser?.phone || 'admin@anti-drug-marathon.org'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (logoutAdmin) logoutAdmin();
              else logout();
              navigate('/admin/login');
            }}
            className="btn-secondary text-xs py-2.5 px-5 border-red-500/30 text-red-500"
          >
            <LogOut className="w-4 h-4" />
            <span>ADMIN LOGOUT</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
        {[
          { id: 'STATS', label: 'Dashboard Stats', icon: Users },
          { id: 'USERS', label: 'User Directory', icon: UserCheck },
          { id: 'ADMIN_PROFILE', label: 'Admin Profile', icon: Shield },
          { id: 'LETS_CONNECT', label: "Let's Connect", icon: MessageSquare },
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

      {/* TAB: USER MANAGEMENT DIRECTORY */}
      {activeTab === 'USERS' && <UserManager />}

      {/* TAB: DEDICATED ADMIN PROFILE */}
      {activeTab === 'ADMIN_PROFILE' && <AdminProfileManager />}

      {/* TAB: LET'S CONNECT INBOX */}
      {activeTab === 'LETS_CONNECT' && <LetsConnectManager />}

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
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] space-y-8 animate-in fade-in">
          
          {/* Header & Export Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[var(--orange)]/15 text-[var(--orange)]">
                  <Award className="w-5 h-5" />
                </span>
                <h3 className="text-2xl font-black font-heading text-[var(--text-primary)]">
                  Registration Management
                </h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-medium mt-1">
                Manage all marathon registrations, track sequential IDs (CMA2026IN / CMA2026SC), T-shirts, and class breakdown.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  loadRegistrations();
                  loadRegistrationSummary();
                  if (regType === 'BATCHES') loadBatches();
                }}
                className="btn-secondary py-2.5 px-4 text-xs flex items-center gap-2"
                title="Refresh registrations and summary counts"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingRegistrations || loadingSummary ? 'animate-spin' : ''}`} />
                <span>REFRESH</span>
              </button>

              <button
                onClick={exportRegistrationsCSV}
                className="btn-secondary py-2.5 px-4 text-xs border-[var(--green)] text-[var(--green)] hover:bg-[var(--green)]/10 flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>EXPORT TO CSV</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC REGISTRATION SUMMARY SECTION */}
          <div className="space-y-4">
            <RegistrationSummaryCards summary={summaryData} loading={loadingSummary} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TshirtSummary summary={summaryData} loading={loadingSummary} />
              <ClassSummary summary={summaryData} loading={loadingSummary} />
            </div>
          </div>

          {/* REGISTRATION TYPE FILTER TABS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)]">
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
              <button
                onClick={() => {
                  setRegType('ALL');
                  setRegPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${
                  regType === 'ALL'
                    ? 'bg-[var(--orange)] text-white shadow-md'
                    : 'text-[var(--text-primary)] hover:text-[var(--orange)]'
                }`}
              >
                ALL REGISTRATIONS
              </button>

              <button
                onClick={() => {
                  setRegType('INDIVIDUAL');
                  setRegPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${
                  regType === 'INDIVIDUAL'
                    ? 'bg-[var(--orange)] text-white shadow-md'
                    : 'text-[var(--text-primary)] hover:text-[var(--orange)]'
                }`}
              >
                INDIVIDUAL (IN)
              </button>

              <button
                onClick={() => {
                  setRegType('SCHOOL_COLLEGE');
                  setRegPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${
                  regType === 'SCHOOL_COLLEGE'
                    ? 'bg-[var(--cyan)] text-white shadow-md'
                    : 'text-[var(--text-primary)] hover:text-[var(--cyan)]'
                }`}
              >
                SCHOOL / COLLEGE (SC)
              </button>

              <button
                onClick={() => setRegType('BATCHES')}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${
                  regType === 'BATCHES'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-[var(--text-primary)] hover:text-emerald-500'
                }`}
              >
                BATCH SPREADSHEETS
              </button>
            </div>

            <div className="text-xs font-bold text-[var(--text-muted)]">
              {regType === 'BATCHES' ? (
                <span>Showing {batches.length} institution uploads</span>
              ) : (
                <span>Total: <strong className="text-[var(--text-primary)]">{regPagination.total}</strong> records</span>
              )}
            </div>
          </div>

          {/* VIEW 1: REGISTRATIONS TABLE (ALL, INDIVIDUAL, SCHOOL_COLLEGE) */}
          {regType !== 'BATCHES' && (
            <div className="space-y-4">
              
              {/* Search & Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setRegPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    placeholder="Search ID, student name, phone, school..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                  />
                </div>

                <select
                  value={filterStandard}
                  onChange={(e) => {
                    setFilterStandard(e.target.value);
                    setRegPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="py-2.5 px-3 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--orange)]"
                >
                  <option value="ALL">ALL CLASSES / STANDARDS</option>
                  {summaryData?.classWise &&
                    Object.keys(summaryData.classWise).map((cls) => (
                      <option key={cls} value={cls}>Class: {cls}</option>
                    ))}
                  {(!summaryData?.classWise || Object.keys(summaryData.classWise).length === 0) && (
                    <>
                      <option value="8th">8th Class</option>
                      <option value="9th">9th Class</option>
                      <option value="10th">10th Class</option>
                    </>
                  )}
                </select>

                <select
                  value={filterInstitution}
                  onChange={(e) => {
                    setFilterInstitution(e.target.value);
                    setRegPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="py-2.5 px-3 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--orange)]"
                >
                  <option value="ALL">ALL SCHOOLS / COLLEGES</option>
                  {institutions.map((inst) => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>

                <select
                  value={filterSize}
                  onChange={(e) => {
                    setFilterSize(e.target.value);
                    setRegPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="py-2.5 px-3 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--orange)]"
                >
                  <option value="ALL">ALL T-SHIRT SIZES</option>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((sz) => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-extrabold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Registration ID</th>
                      <th className="p-3.5">Student Name</th>
                      <th className="p-3.5 text-center">Age</th>
                      <th className="p-3.5">Standard / Class</th>
                      <th className="p-3.5">Parent's Phone</th>
                      <th className="p-3.5">School / College</th>
                      <th className="p-3.5 text-center">T-Shirt</th>
                      <th className="p-3.5">Date & Time</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]/30 text-[var(--text-primary)]">
                    {loadingRegistrations ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-[var(--text-muted)] font-bold animate-pulse">
                          Loading registrations from database...
                        </td>
                      </tr>
                    ) : registrations.length > 0 ? (
                      registrations.map((item) => {
                        const isIN = item.registrationId?.includes('IN');
                        return (
                          <tr key={item._id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                            <td className="p-3.5 font-mono font-black">
                              <span className={`px-2.5 py-1 rounded-lg text-xs tracking-wider ${
                                isIN
                                  ? 'bg-[var(--orange)]/15 text-[var(--orange)] border border-[var(--orange)]/30'
                                  : 'bg-[var(--cyan)]/15 text-[var(--cyan)] border border-[var(--cyan)]/30'
                              }`}>
                                {item.registrationId}
                              </span>
                            </td>
                            <td className="p-3.5 font-black text-sm">
                              {item.fullName}
                            </td>
                            <td className="p-3.5 text-center font-bold text-[var(--text-muted)]">
                              {item.age ?? '—'}
                            </td>
                            <td className="p-3.5 font-bold text-[var(--orange)]">
                              {item.standard || '—'}
                            </td>
                            <td className="p-3.5 font-mono font-semibold">
                              {item.contactNumber}
                            </td>
                            <td className="p-3.5 font-medium max-w-[200px] truncate" title={item.institutionName}>
                              {item.institutionName}
                            </td>
                            <td className="p-3.5 text-center font-black">
                              <span className="px-2.5 py-1 rounded-md bg-[var(--yellow)]/15 text-[var(--yellow)] font-bold">
                                {item.tShirtSize}
                              </span>
                            </td>
                            <td className="p-3.5 text-[var(--text-muted)] font-medium">
                              {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setViewingRegistration(item)}
                                  title="View Details"
                                  className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingRegistration(item)}
                                  title="Edit Registration"
                                  className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRegistration(item.registrationId, item.fullName)}
                                  title="Delete Registration"
                                  className="p-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-[var(--text-muted)] font-bold">
                          No registrations found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {regPagination.pages > 1 && (
                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-[var(--text-muted)] font-bold">
                    Page {regPagination.page} of {regPagination.pages} ({regPagination.total} total records)
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={regPagination.page === 1}
                      onClick={() => setRegPagination({ ...regPagination, page: regPagination.page - 1 })}
                      className="px-3.5 py-1.5 rounded-xl border border-[var(--border-color)] font-bold disabled:opacity-40 hover:bg-[var(--bg-tertiary)]"
                    >
                      Prev
                    </button>
                    <button
                      disabled={regPagination.page === regPagination.pages}
                      onClick={() => setRegPagination({ ...regPagination, page: regPagination.page + 1 })}
                      className="px-3.5 py-1.5 rounded-xl border border-[var(--border-color)] font-bold disabled:opacity-40 hover:bg-[var(--bg-tertiary)]"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* VIEW 2: SCHOOL / COLLEGE BATCHES SPREADSHEETS */}
          {regType === 'BATCHES' && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search batch ID, school/college, contact person, file..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none"
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

            </div>
          )}

          {/* VIEW DETAILS MODAL */}
          {viewingRegistration && (
            <RegistrationDetailsModal
              registration={viewingRegistration}
              onClose={() => setViewingRegistration(null)}
              onEdit={(item) => setEditingRegistration(item)}
            />
          )}

          {/* EDIT REGISTRATION MODAL */}
          {editingRegistration && (
            <RegistrationEditModal
              registration={editingRegistration}
              onClose={() => setEditingRegistration(null)}
              onUpdated={handleRegistrationUpdated}
            />
          )}

          {/* BATCH STUDENTS MODAL */}
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
                        <th className="p-2">Age</th>
                        <th className="p-2">Standard</th>
                        <th className="p-2">T-Shirt Size</th>
                        <th className="p-2">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {selectedBatchStudents.map((st) => (
                        <tr key={st._id}>
                          <td className="p-2 font-mono font-bold text-[var(--cyan)]">{st.registrationId}</td>
                          <td className="p-2 font-bold">{st.fullName}</td>
                          <td className="p-2">{st.age ?? 'N/A'}</td>
                          <td className="p-2">{st.standard ?? 'N/A'}</td>
                          <td className="p-2 font-bold text-[var(--yellow)]">{st.tShirtSize}</td>
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
