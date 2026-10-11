import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Session Key Constants
export const AUTH_KEYS = {
  ADMIN_TOKEN: 'marathon_admin_token',
  ADMIN_USER: 'marathon_admin_user',
  USER_TOKEN: 'marathon_user_token',
  USER_USER: 'marathon_user_user',
  LEGACY_TOKEN: 'marathon_token',
  LEGACY_USER: 'marathon_user',
};

// Helper to determine if a URL or context is for Admin
export const getAdminToken = () => {
  try {
    return localStorage.getItem(AUTH_KEYS.ADMIN_TOKEN) || '';
  } catch {
    return '';
  }
};

export const getUserToken = () => {
  try {
    return (
      localStorage.getItem(AUTH_KEYS.USER_TOKEN) ||
      localStorage.getItem(AUTH_KEYS.LEGACY_TOKEN) ||
      ''
    );
  } catch {
    return '';
  }
};

const isAdminTarget = (config) => {
  if (config.headers?.['X-Auth-Scope'] === 'admin') return true;
  if (config.headers?.['X-Auth-Scope'] === 'user') return false;
  
  const url = (config.url || '').toLowerCase();
  if (
    url.startsWith('/admin') ||
    url.includes('/admin/') ||
    url.includes('/media/upload') ||
    url.includes('/media/replace') ||
    url.includes('/homepage/admin') ||
    url.includes('/footer/admin') ||
    url.includes('/activities/admin') ||
    url.includes('/contact/admin') ||
    url.includes('/faqs/admin')
  ) {
    return true;
  }

  // Fallback to active browser tab location if in browser
  if (typeof window !== 'undefined') {
    return window.location.pathname.startsWith('/admin');
  }

  return false;
};

api.interceptors.request.use(
  (config) => {
    // Strictly isolate admin token and user token without cross-fallback
    const isAdmin = isAdminTarget(config);
    const token = isAdmin ? getAdminToken() : getUserToken();

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

api.interceptors.response.use(
  (response) => {
    const method = response.config?.method?.toUpperCase();
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      try {
        localStorage.setItem('cms_last_updated', Date.now().toString());
        window.dispatchEvent(new Event('cms_updated'));
      } catch (e) {}
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const config = error.config || {};
      const isAdmin = isAdminTarget(config);

      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const returnUrl = encodeURIComponent(path + window.location.search);

        if (isAdmin || path.startsWith('/admin')) {
          // Clear only admin session
          localStorage.removeItem(AUTH_KEYS.ADMIN_TOKEN);
          localStorage.removeItem(AUTH_KEYS.ADMIN_USER);
          
          if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
            window.location.href = `/admin/login?redirect=${returnUrl}`;
          }
        } else {
          // Clear only user session
          localStorage.removeItem(AUTH_KEYS.USER_TOKEN);
          localStorage.removeItem(AUTH_KEYS.USER_USER);
          localStorage.removeItem(AUTH_KEYS.LEGACY_TOKEN);
          localStorage.removeItem(AUTH_KEYS.LEGACY_USER);

          const isUserAuthRoute = path.startsWith('/profile') || path.startsWith('/my-activity') || path.startsWith('/my-registrations');
          if (isUserAuthRoute) {
            window.location.href = `/login?redirect=${returnUrl}`;
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  signup: (data) => api.post('/auth/signup', data, { headers: { 'X-Auth-Scope': 'user' } }),
  login: (data) => api.post('/auth/login', data, { headers: { 'X-Auth-Scope': 'user' } }),
  loginAdmin: (data) => api.post('/auth/admin/login', data, { headers: { 'X-Auth-Scope': 'admin' } }),
  verifySession: (scope = 'auto') =>
    api.get('/auth/verify', {
      headers: { 'X-Auth-Scope': scope },
    }),
  getMe: () => api.get('/auth/me'),
  getProfile: () => api.get('/auth/profile', { headers: { 'X-Auth-Scope': 'user' } }),
  updateProfile: (data) => api.put('/auth/profile', data, { headers: { 'X-Auth-Scope': 'user' } }),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const userService = {
  getActivities: () => api.get('/users/activities'),
  getRegistrations: () => api.get('/users/registrations'),
  getServices: () => api.get('/users/services'),
  getConnections: () => api.get('/users/connections'),
};

export const communityService = {
  getServices: (params) => api.get('/community-services', { params }),
  getServiceById: (id) => api.get(`/community-services/${id}`),
  createService: (data) => api.post('/community-services', data),
  updateService: (id, data) => api.put(`/community-services/${id}`, data),
  deleteService: (id) => api.delete(`/community-services/${id}`),
};

export const eventService = {
  getConfig: () => api.get('/events/config'),
  updateConfig: (data) => api.put('/events/config', data),
};

export const bannerService = {
  getBanners: () => api.get('/banners'),
  getAllAdmin: () => api.get('/banners/admin/all'),
  uploadBanner: (formData) =>
    api.post('/banners/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  toggleStatus: (id) => api.patch(`/banners/${id}/toggle`),
  deleteBanner: (id) => api.delete(`/banners/${id}`),
};

export const registrationService = {
  getInstitutions: () => api.get('/registrations/institutions'),
  submitForm: (data) => api.post('/registrations/individual', data),
  submitIndividual: (data) => api.post('/registrations/individual', data),
  submitGroup: (data) => api.post('/registrations/group', data),
  submitSchoolCollege: (data) => api.post('/registrations/school-college', data),
  submitBulk: (data) =>
    api.post(
      '/registrations/school-college',
      data,
      data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
    ),
  parseFile: (fileFormData) =>
    api.post('/registrations/parse-file', fileFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getUserRegistrations: () => api.get('/registrations/my-registrations'),
  getDetails: (id) => api.get(`/registrations/${id}`),
  verifyPass: (passId) => api.get(`/registrations/verify-pass/${passId}`),
  getSummary: (year) => api.get('/registrations/summary', { params: { year } }),
  getCounts: () => api.get('/registrations/counts'),
  getAll: (params) => api.get('/registrations', { params }),
  update: (id, data) => api.put(`/registrations/${id}`, data),
  delete: (id) => api.delete(`/registrations/${id}`),
};

export const activityService = {
  getActivities: () => api.get('/activities'),
  getAllAdmin: () => api.get('/activities/admin/all'),
  createActivity: (formData) =>
    api.post('/activities', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  toggleStatus: (id) => api.patch(`/activities/${id}/toggle`),
  deleteActivity: (id) => api.delete(`/activities/${id}`),
};

export const faqService = {
  getFAQs: () => api.get('/faqs'),
  getAllAdmin: () => api.get('/faqs/admin/all'),
  createFAQ: (data) => api.post('/faqs', data),
  updateFAQ: (id, data) => api.put(`/faqs/${id}`, data),
  deleteFAQ: (id) => api.delete(`/faqs/${id}`),
};

export const adminService = {
  getStats: () => api.get('/admin/dashboard-stats'),
  getRegistrations: (params) => api.get('/admin/registrations', { params }),
  getRegistrationById: (id) => api.get(`/admin/registrations/${id}`),
  updateRegistration: (id, data) => api.put(`/admin/registrations/${id}`, data),
  deleteRegistration: (id) => api.delete(`/admin/registrations/${id}`),
  getBatches: (params) => api.get('/admin/batches', { params }),
  getBatchStudents: (batchId) => api.get(`/admin/batches/${batchId}/students`),
  downloadBatchSpreadsheet: (batchId) =>
    api.get(`/admin/batches/${batchId}/download`, { responseType: 'blob' }),
  deleteBatch: (batchId) => api.delete(`/admin/batches/${batchId}`),
  retrySheetsSync: (id) => api.post(`/admin/registrations/${id}/sync-sheets`),
  getRegistrationSummary: (year) =>
    api.get('/admin/registrations/summary', { params: { year } }),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getProfile: () => api.get('/admin/profile', { headers: { 'X-Auth-Scope': 'admin' } }),
  updateProfile: (data) => api.put('/admin/profile', data, { headers: { 'X-Auth-Scope': 'admin' } }),
  changePassword: (data) => api.put('/auth/change-password', data, { headers: { 'X-Auth-Scope': 'admin' } }),
};

export const contactService = {
  submitMessage: (data) => api.post('/contact', data),
  getMyMessages: () => api.get('/contact/my-messages'),
  getMessagesAdmin: () => api.get('/contact/admin/all'),
  updateStatus: (id, status) => api.patch(`/contact/admin/${id}/status`, { status }),
  deleteMessage: (id) => api.delete(`/contact/admin/${id}`),
};

export const contentService = {
  getContent: (sectionKey) => api.get(`/content/${sectionKey}`),
  updateContent: (sectionKey, content) => api.put(`/content/${sectionKey}`, { content }),
};

export const homepageService = {
  getPublicHomepage: () => api.get('/homepage'),
  getAdminHomepage: () => api.get('/homepage/admin'),
  updateHomepage: (data) => api.put('/homepage/admin', data),
  addSection: (sectionData) => api.post('/homepage/admin/sections', sectionData),
  updateSection: (sectionId, sectionData) => api.put(`/homepage/admin/sections/${sectionId}`, sectionData),
  deleteSection: (sectionId) => api.delete(`/homepage/admin/sections/${sectionId}`),
  reorderSections: (orders) => api.put('/homepage/admin/reorder', { orders }),
  toggleStatus: (isEnabled) => api.put('/homepage/admin/status', { isEnabled }),
  updateTheme: (themeData) => api.put('/homepage/admin/theme', themeData),
};

export const footerService = {
  getPublicFooter: () => api.get('/footer'),
  getAdminFooter: () => api.get('/footer/admin'),
  createFooter: (data) => api.post('/footer/admin', data),
  updateFooter: (data) => api.put('/footer/admin', data),
  deleteFooter: (id) => api.delete(`/footer/admin/${id || 'default'}`),
};

export const mediaService = {
  getMedia: (params) => api.get('/media', { params }),
  getMediaById: (id) => api.get(`/media/${id}`),
  getCategories: () => api.get('/media/categories'),
  uploadMedia: (formData) =>
    api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateMedia: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/media/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put(`/media/${id}`, data);
  },
  replaceMediaFile: (id, formData) =>
    api.put(`/media/${id}/replace`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteMedia: (id, force = false) => api.delete(`/media/${id}`, { params: { force } }),
};

export default api;
