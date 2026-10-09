import express from 'express';
import {
  getDashboardStats,
  getAdminRegistrations,
  getBulkBatches,
  getBatchStudents,
  downloadBatchSpreadsheet,
  deleteBulkBatch,
  retrySheetsSync,
  getIndividualRegistrationSummary,
  getAdminRegistrationById,
  updateAdminRegistration,
  deleteAdminRegistration,
  getAdminUsers,
  getAdminUserById,
  updateUserRole,
  deleteAdminUser,
  getAdminProfile,
  updateAdminProfile,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Strict RBAC: All admin routes require valid authentication and ADMIN role
router.use(protect, requireAdmin);

// Dashboard & Overview
router.get('/dashboard-stats', getDashboardStats);

// User Management (Full Registered Users Table, Details, Role Update, Permanent Delete)
router.get('/users', getAdminUsers);
router.get('/users/:id', getAdminUserById);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteAdminUser);

// Dedicated Admin Profile
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);

// Marathon & Event Registrations
router.get('/registrations', getAdminRegistrations);
router.get('/registrations/summary', getIndividualRegistrationSummary);
router.get('/registrations/individual/summary', getIndividualRegistrationSummary);
router.get('/registrations/:id', getAdminRegistrationById);
router.put('/registrations/:id', updateAdminRegistration);
router.delete('/registrations/:id', deleteAdminRegistration);

// Bulk Institutional Batches
router.get('/batches', getBulkBatches);
router.get('/batches/:batchId/students', getBatchStudents);
router.get('/batches/:batchId/download', downloadBatchSpreadsheet);
router.delete('/batches/:batchId', deleteBulkBatch);

// Integrations
router.post('/registrations/:id/sync-sheets', retrySheetsSync);

export default router;
