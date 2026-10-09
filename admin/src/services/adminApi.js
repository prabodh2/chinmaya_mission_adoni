import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

export const ADMIN_AUTH_KEYS = {
  TOKEN: 'cma_admin_auth_token',
  USER: 'cma_admin_auth_user',
};

export const getStoredAdminToken = () => {
  try {
    return localStorage.getItem(ADMIN_AUTH_KEYS.TOKEN) || '';
  } catch {
    return '';
  }
};

export const getStoredAdminUser = () => {
  try {
    const saved = localStorage.getItem(ADMIN_AUTH_KEYS.USER);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return (parsed?.role || '').toLowerCase() === 'admin' ? parsed : null;
  } catch {
    return null;
  }
};

export const setStoredAdminSession = (token, user) => {
  try {
    if (token) localStorage.setItem(ADMIN_AUTH_KEYS.TOKEN, token);
    if (user) localStorage.setItem(ADMIN_AUTH_KEYS.USER, JSON.stringify(user));
  } catch {}
};

export const clearStoredAdminSession = () => {
  try {
    localStorage.removeItem(ADMIN_AUTH_KEYS.TOKEN);
    localStorage.removeItem(ADMIN_AUTH_KEYS.USER);
  } catch {}
};

// Create Isolated Admin API Client
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Scope': 'admin',
  },
});

// Request Interceptor: Attach Admin Bearer Token
adminApi.interceptors.request.use(
  (config) => {
    const token = getStoredAdminToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401s specifically for Admin Panel
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (typeof window !== 'undefined') {
        const isLoginPage = window.location.pathname === '/login' || window.location.pathname.endsWith('/login');
        if (!isLoginPage && error.response.status === 401) {
          clearStoredAdminSession();
          window.location.href = '/login?error=session_expired';
        }
      }
    }
    return Promise.reject(error);
  }
);

// --- 1. AUTHENTICATION & ADMIN PROFILE ---
export const adminAuthService = {
  loginAdmin: (credentials) =>
    adminApi.post('/auth/admin/login', credentials),
  
  verifySession: () =>
    adminApi.get('/auth/verify', { headers: { 'X-Auth-Scope': 'admin' } }),

  getProfile: () =>
    adminApi.get('/admin/profile'),

  updateProfile: (profileData) =>
    adminApi.put('/admin/profile', profileData),

  changePassword: (passwordData) =>
    adminApi.post('/auth/admin/change-password', passwordData),
};

// --- 2. DASHBOARD STATS ---
export const adminStatsService = {
  getStats: () => adminApi.get('/admin/dashboard-stats'),
};

// --- 3. USER MANAGEMENT ---
export const adminUserService = {
  getUsers: (params) => adminApi.get('/admin/users', { params }),
  getUserById: (id) => adminApi.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => adminApi.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => adminApi.delete(`/admin/users/${id}`),
};

// --- 4. REGISTRATIONS & BULK BATCHES ---
export const adminRegistrationService = {
  getRegistrations: (params) => adminApi.get('/admin/registrations', { params }),
  getRegistrationById: (id) => adminApi.get(`/admin/registrations/${id}`),
  updateRegistration: (id, data) => adminApi.put(`/admin/registrations/${id}`, data),
  deleteRegistration: (id) => adminApi.delete(`/admin/registrations/${id}`),
  getSummary: (year) => adminApi.get('/admin/registrations/summary', { params: { year } }),
  getInstitutions: () => adminApi.get('/registrations/institutions'),
  getBatches: (params) => adminApi.get('/admin/batches', { params }),
  getBatchStudents: (batchId) => adminApi.get(`/admin/batches/${batchId}/students`),
  downloadBatchSpreadsheet: (batchId) =>
    adminApi.get(`/admin/batches/${batchId}/download`, { responseType: 'blob' }),
  deleteBatch: (batchId) => adminApi.delete(`/admin/batches/${batchId}`),
  retrySheetsSync: (id) => adminApi.post(`/admin/registrations/${id}/sync-sheets`),
};

// --- 5. EVENT CONTROL ---
export const adminEventService = {
  getConfig: () => adminApi.get('/events/config'),
  updateConfig: (data) => adminApi.put('/events/config', data),
};

// --- 6. BANNER UPLOADS ---
export const adminBannerService = {
  getAllAdmin: () => adminApi.get('/banners/admin/all'),
  uploadBanner: (formData) =>
    adminApi.post('/banners/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  toggleStatus: (id) => adminApi.patch(`/banners/${id}/toggle`),
  deleteBanner: (id) => adminApi.delete(`/banners/${id}`),
};

// --- 7. ACTIVITIES CMS ---
export const adminActivityService = {
  getAllAdmin: () => adminApi.get('/activities/admin/all'),
  createActivity: (formData) =>
    adminApi.post('/activities', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  toggleStatus: (id) => adminApi.patch(`/activities/${id}/toggle`),
  deleteActivity: (id) => adminApi.delete(`/activities/${id}`),
};

// --- 8. ABOUT PAGE CMS ---
export const adminContentService = {
  getContent: (sectionKey) => adminApi.get(`/content/${sectionKey}`),
  updateContent: (sectionKey, content) => adminApi.put(`/content/${sectionKey}`, { content }),
};

// --- 9. HOME PAGE CMS ---
export const adminHomepageService = {
  getAdminHomepage: () => adminApi.get('/homepage/admin'),
  updateHomepage: (data) => adminApi.put('/homepage/admin', data),
  addSection: (sectionData) => adminApi.post('/homepage/admin/sections', sectionData),
  updateSection: (sectionId, sectionData) => adminApi.put(`/homepage/admin/sections/${sectionId}`, sectionData),
  deleteSection: (sectionId) => adminApi.delete(`/homepage/admin/sections/${sectionId}`),
  reorderSections: (orders) => adminApi.put('/homepage/admin/reorder', { orders }),
  toggleStatus: (isEnabled) => adminApi.put('/homepage/admin/status', { isEnabled }),
  updateTheme: (themeData) => adminApi.put('/homepage/admin/theme', themeData),
};

// --- 10. FOOTER CMS ---
export const adminFooterService = {
  getAdminFooter: () => adminApi.get('/footer/admin'),
  createFooter: (data) => adminApi.post('/footer/admin', data),
  updateFooter: (data) => adminApi.put('/footer/admin', data),
  deleteFooter: (id) => adminApi.delete(`/footer/admin/${id || 'default'}`),
};

// --- 11. IMAGES & MEDIA LIBRARY ---
export const adminMediaService = {
  getMedia: (params) => adminApi.get('/media', { params }),
  getMediaById: (id) => adminApi.get(`/media/${id}`),
  getCategories: () => adminApi.get('/media/categories'),
  uploadMedia: (formData) =>
    adminApi.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateMedia: (id, data) => {
    if (data instanceof FormData) {
      return adminApi.put(`/media/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return adminApi.put(`/media/${id}`, data);
  },
  replaceMediaFile: (id, formData) =>
    adminApi.put(`/media/${id}/replace`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteMedia: (id, force = false) => adminApi.delete(`/media/${id}`, { params: { force } }),
};

// --- 12. LET'S CONNECT (INQUIRIES) ---
export const adminContactService = {
  getMessagesAdmin: () => adminApi.get('/contact/admin/all'),
  updateStatus: (id, status) => adminApi.patch(`/contact/admin/${id}/status`, { status }),
  deleteMessage: (id) => adminApi.delete(`/contact/admin/${id}`),
};

export default adminApi;
