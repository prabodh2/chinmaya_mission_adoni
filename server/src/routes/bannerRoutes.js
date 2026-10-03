import express from 'express';
import {
  getActiveBanners,
  getAllBannersAdmin,
  uploadBanner,
  toggleBannerStatus,
  deleteBanner,
} from '../controllers/bannerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getActiveBanners);
router.get('/admin/all', protect, requireAdmin, getAllBannersAdmin);
router.post('/upload', protect, requireAdmin, uploadSingleImage, uploadBanner);
router.patch('/:id/toggle', protect, requireAdmin, toggleBannerStatus);
router.delete('/:id', protect, requireAdmin, deleteBanner);

export default router;
