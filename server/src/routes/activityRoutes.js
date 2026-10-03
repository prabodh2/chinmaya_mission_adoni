import express from 'express';
import {
  getActivities,
  getAllActivitiesAdmin,
  createActivity,
  toggleActivityStatus,
  deleteActivity,
} from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getActivities);
router.get('/admin/all', protect, requireAdmin, getAllActivitiesAdmin);
router.post('/', protect, requireAdmin, uploadSingleImage, createActivity);
router.patch('/:id/toggle', protect, requireAdmin, toggleActivityStatus);
router.delete('/:id', protect, requireAdmin, deleteActivity);

export default router;
