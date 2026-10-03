import express from 'express';
import {
  loginAdmin,
  getProfile,
  changeAdminPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Dedicated Admin Authentication Routes
router.post('/admin/login', loginLimiter, loginAdmin);
router.get('/profile', protect, requireAdmin, getProfile);
router.post('/admin/change-password', protect, requireAdmin, changeAdminPassword);

export default router;
