import express from 'express';
import {
  getSiteSettings,
  updateSiteSettings,
  toggleSiteSettings,
} from '../controllers/siteSettingsController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public status check
router.get('/', getSiteSettings);
router.get('/status', getSiteSettings);

// Update status (isLive: true / false)
router.put('/', optionalAuth, updateSiteSettings);
router.post('/', optionalAuth, updateSiteSettings);

// Quick toggle (supports both GET and POST for easy developer testing via browser/cURL)
router.get('/toggle', optionalAuth, toggleSiteSettings);
router.post('/toggle', optionalAuth, toggleSiteSettings);

export default router;
