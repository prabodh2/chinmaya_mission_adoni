import express from 'express';
import {
  getDashboardStats,
  getAdminRegistrations,
  getBulkBatches,
  getBatchStudents,
  retrySheetsSync,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/registrations', getAdminRegistrations);
router.get('/batches', getBulkBatches);
router.get('/batches/:batchId/students', getBatchStudents);
router.post('/registrations/:id/sync-sheets', retrySheetsSync);

export default router;
