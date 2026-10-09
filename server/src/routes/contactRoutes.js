import express from 'express';
import {
  submitContactMessage,
  getContactMessagesAdmin,
  getUserContactMessages,
  updateContactStatus,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, submitContactMessage);
router.get('/my-messages', protect, getUserContactMessages);
router.get('/admin/all', protect, requireAdmin, getContactMessagesAdmin);
router.patch('/admin/:id/status', protect, requireAdmin, updateContactStatus);
router.delete('/admin/:id', protect, requireAdmin, deleteContactMessage);

export default router;

