import express from 'express';
import { submitContactMessage, getContactMessagesAdmin } from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', submitContactMessage);
router.get('/admin/all', protect, requireAdmin, getContactMessagesAdmin);

export default router;
