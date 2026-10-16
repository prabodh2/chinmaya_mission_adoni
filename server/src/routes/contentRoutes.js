import express from 'express';
import { getPageContent, updatePageContent } from '../controllers/contentController.js';
import { getPublicWebContent } from '../controllers/webContentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public multi-website dynamic page content endpoint
router.get('/website/:website/page/:pageSlug', getPublicWebContent);

// Legacy sectionKey endpoints
router.get('/:sectionKey', getPageContent);
router.put('/:sectionKey', protect, requireAdmin, updatePageContent);

export default router;
