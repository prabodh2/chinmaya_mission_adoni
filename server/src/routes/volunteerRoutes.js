import express from 'express';
import {
  submitVolunteer,
  getVolunteersAdmin,
  updateVolunteerStatus,
  deleteVolunteer,
} from '../controllers/volunteerController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public: Submit volunteering application (can be anonymous or authenticated)
router.post('/', optionalAuth, submitVolunteer);

// Admin: Manage volunteer applications
router.get('/admin/all', protect, requireAdmin, getVolunteersAdmin);
router.patch('/admin/:id/status', protect, requireAdmin, updateVolunteerStatus);
router.delete('/admin/:id', protect, requireAdmin, deleteVolunteer);

export default router;
