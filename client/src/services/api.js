import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('marathon_token');
    if (token) {
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
      localStorage.removeItem('marathon_token');
      localStorage.removeItem('marathon_user');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

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
  submitForm: (data) => api.post('/registrations/form', data),
  submitBulk: (data) => api.post('/registrations/bulk', data),
  parseFile: (fileFormData) =>
    api.post('/registrations/parse-file', fileFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getUserRegistrations: () => api.get('/registrations/my-registrations'),
  getDetails: (id) => api.get(`/registrations/details/${id}`),
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
  getBatches: () => api.get('/admin/batches'),
  getBatchStudents: (batchId) => api.get(`/admin/batches/${batchId}/students`),
  retrySheetsSync: (id) => api.post(`/admin/registrations/${id}/sync-sheets`),
};

export const contactService = {
  submitMessage: (data) => api.post('/contact', data),
  getMessagesAdmin: () => api.get('/contact/admin/all'),
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
