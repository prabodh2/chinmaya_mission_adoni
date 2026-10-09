import express from 'express';
import {
  signupUser,
  loginUser,
  loginAdmin,
  verifySession,
  getProfile,
  updateProfile,
  changePassword,
  changeAdminPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public Authentication
router.post('/signup', loginLimiter, signupUser);
router.post('/login', loginLimiter, loginUser);

// Dedicated Admin Authentication Routes
router.post('/admin/login', loginLimiter, loginAdmin);
router.post('/admin/change-password', protect, requireAdmin, changeAdminPassword);

// User Profile & Settings (Authenticated)
router.get('/verify', protect, verifySession);
router.get('/me', protect, getProfile);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
