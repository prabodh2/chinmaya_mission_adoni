import express from 'express';
import {
  getUserActivities,
  getUserRegistrations,
  getUserServices,
  getUserConnections,
  getUserSevaBookings,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/activities', protect, getUserActivities);
router.get('/registrations', protect, getUserRegistrations);
router.get('/services', protect, getUserServices);
router.get('/connections', protect, getUserConnections);
router.get('/seva-bookings', protect, getUserSevaBookings);
router.get('/bookings', protect, getUserSevaBookings);

export default router;
