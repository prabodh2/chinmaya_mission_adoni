import express from 'express';
import {
  getPublicHomepage,
  getAdminHomepage,
  updateAdminHomepage,
  addSection,
  updateSection,
  deleteSection,
  reorderSections,
  toggleStatus,
  updateTheme,
} from '../controllers/homepageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public Route
router.get('/', getPublicHomepage);

// Admin Protected Routes
router.get('/admin', protect, requireAdmin, getAdminHomepage);
router.put('/admin', protect, requireAdmin, updateAdminHomepage);
router.post('/admin/sections', protect, requireAdmin, addSection);
router.put('/admin/sections/:sectionId', protect, requireAdmin, updateSection);
router.delete('/admin/sections/:sectionId', protect, requireAdmin, deleteSection);
router.put('/admin/reorder', protect, requireAdmin, reorderSections);
router.put('/admin/status', protect, requireAdmin, toggleStatus);
router.put('/admin/theme', protect, requireAdmin, updateTheme);

export default router;
