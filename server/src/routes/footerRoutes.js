import express from 'express';
import {
  getPublicFooter,
  getAdminFooter,
  createFooter,
  updateFooter,
  deleteFooter,
} from '../controllers/footerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public Route
router.get('/', getPublicFooter);
router.get('/public', getPublicFooter);

// Admin Protected Routes
router.get('/admin', protect, requireAdmin, getAdminFooter);
router.post('/admin', protect, requireAdmin, createFooter);
router.put('/admin', protect, requireAdmin, updateFooter);
router.delete('/admin', protect, requireAdmin, deleteFooter);
router.delete('/admin/:id', protect, requireAdmin, deleteFooter);

export default router;
