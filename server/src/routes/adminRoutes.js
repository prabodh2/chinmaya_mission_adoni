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
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/registrations', getAdminRegistrations);
router.get('/registrations/summary', getIndividualRegistrationSummary);
router.get('/registrations/individual/summary', getIndividualRegistrationSummary);
router.get('/registrations/:id', getAdminRegistrationById);
router.put('/registrations/:id', updateAdminRegistration);
router.delete('/registrations/:id', deleteAdminRegistration);
router.get('/batches', getBulkBatches);
router.get('/batches/:batchId/students', getBatchStudents);
router.get('/batches/:batchId/download', downloadBatchSpreadsheet);
router.delete('/batches/:batchId', deleteBulkBatch);
router.post('/registrations/:id/sync-sheets', retrySheetsSync);

export default router;
