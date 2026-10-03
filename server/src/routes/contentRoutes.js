import express from 'express';
import { getPageContent, updatePageContent } from '../controllers/contentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/:sectionKey', getPageContent);
router.put('/:sectionKey', protect, requireAdmin, updatePageContent);

export default router;
