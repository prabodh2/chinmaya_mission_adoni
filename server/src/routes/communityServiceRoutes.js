import express from 'express';
import {
  getPublicServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/communityServiceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPublicServices);
router.get('/:id', getServiceById);

// Protected routes
router.post('/', protect, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

export default router;
