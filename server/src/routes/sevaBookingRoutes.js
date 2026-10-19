import express from 'express';
import {
  submitSevaBooking,
  getSevaBookingByRefId,
  getMySevaBookings,
  getSevaBookingsAdmin,
  updateSevaBookingStatus,
  deleteSevaBooking,
} from '../controllers/sevaBookingController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public / Semi-authenticated Submission
router.post('/', optionalAuth, submitSevaBooking);

// Public Receipt Verification
router.get('/verify/:refId', getSevaBookingByRefId);

// Devotee's own bookings
router.get('/my-bookings', protect, getMySevaBookings);

// Admin Management
router.get('/admin/all', protect, requireAdmin, getSevaBookingsAdmin);
router.patch('/admin/:id/status', protect, requireAdmin, updateSevaBookingStatus);
router.delete('/admin/:id', protect, requireAdmin, deleteSevaBooking);

export default router;
