import express from 'express';
import {
  createThought,
  getApprovedThoughts,
  getApprovedThoughtById,
  getAdminThoughts,
  getAdminThoughtStats,
  approveThought,
  rejectThought,
} from '../controllers/thoughtController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// ==========================================
// 1. PUBLIC STORY BOARD ENDPOINTS (ANONYMOUS)
// ==========================================

// Publicly browse all approved thoughts (ZERO author identity exposed)
router.get('/', getApprovedThoughts);

// Publicly view single approved thought
router.get('/:id', getApprovedThoughtById);

// ==========================================
// 2. USER THOUGHT SUBMISSION (AUTHENTICATED)
// ==========================================

// Submit a new thought (saved as PENDING)
router.post('/', protect, createThought);

// ==========================================
// 3. ADMIN MODERATION ENDPOINTS
// ==========================================

// Moderation list (all submissions with submitter details)
router.get('/admin/list', protect, requireAdmin, getAdminThoughts);

// Moderation statistics (total, pending, approved)
router.get('/admin/stats', protect, requireAdmin, getAdminThoughtStats);

// Approve a submission
router.patch('/admin/:id/approve', protect, requireAdmin, approveThought);

// Reject and permanently delete a submission
router.delete('/admin/:id', protect, requireAdmin, rejectThought);

export default router;
