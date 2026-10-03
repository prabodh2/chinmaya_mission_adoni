import express from 'express';
import {
  getFAQs,
  getAllFAQsAdmin,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from '../controllers/faqController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getFAQs);
router.get('/admin/all', protect, requireAdmin, getAllFAQsAdmin);
router.post('/', protect, requireAdmin, createFAQ);
router.put('/:id', protect, requireAdmin, updateFAQ);
router.delete('/:id', protect, requireAdmin, deleteFAQ);

export default router;
