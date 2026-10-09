import express from 'express';
import {
  submitContactMessage,
  getContactMessagesAdmin,
  getUserContactMessages,
} from '../controllers/contactController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, submitContactMessage);
router.get('/my-messages', protect, getUserContactMessages);
router.get('/admin/all', protect, requireAdmin, getContactMessagesAdmin);

export default router;
