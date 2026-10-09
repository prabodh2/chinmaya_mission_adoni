import express from 'express';
import {
  getUserActivities,
  getUserRegistrations,
  getUserServices,
  getUserConnections,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/activities', protect, getUserActivities);
router.get('/registrations', protect, getUserRegistrations);
router.get('/services', protect, getUserServices);
router.get('/connections', protect, getUserConnections);

export default router;
