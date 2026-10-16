import express from 'express';
import {
  getWebsites,
  getPagesByWebsite,
  getPageById,
  createPage,
  updatePage,
  deletePage,
  uploadPageImage,
} from '../controllers/webContentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/websites', protect, requireAdmin, getWebsites);
router.get('/pages', protect, requireAdmin, getPagesByWebsite);
router.get('/pages/:id', protect, requireAdmin, getPageById);
router.post('/pages', protect, requireAdmin, createPage);
router.put('/pages/:id', protect, requireAdmin, updatePage);
router.delete('/pages/:id', protect, requireAdmin, deletePage);
router.post('/pages/:id/images', protect, requireAdmin, uploadSingleImage, uploadPageImage);

export default router;
