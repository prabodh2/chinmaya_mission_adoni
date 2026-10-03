import express from 'express';
import { getEventConfig, updateEventConfig } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/config', getEventConfig);
router.put('/config', protect, requireAdmin, updateEventConfig);

export default router;
