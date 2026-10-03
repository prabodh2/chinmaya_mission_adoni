import express from 'express';
import {
  getMediaList,
  getMediaById,
  uploadMedia,
  updateMedia,
  replaceMediaFile,
  deleteMedia,
  getMediaCategories,
} from '../controllers/mediaController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/categories', protect, requireAdmin, getMediaCategories);
router.get('/', protect, requireAdmin, getMediaList);
router.get('/:id', protect, requireAdmin, getMediaById);
router.post('/upload', protect, requireAdmin, uploadSingleImage, uploadMedia);
router.put('/:id', protect, requireAdmin, uploadSingleImage, updateMedia);
router.put('/:id/replace', protect, requireAdmin, uploadSingleImage, replaceMediaFile);
router.delete('/:id', protect, requireAdmin, deleteMedia);

export default router;
