import express from 'express';
import {
  submitIndividualRegistration,
  submitBulkRegistration,
  parseSpreadsheetFile,
  getInstitutions,
  getUserRegistrations,
  getRegistrationById,
} from '../controllers/registrationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSpreadsheet } from '../middleware/uploadMiddleware.js';
import { registrationLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/institutions', getInstitutions);
router.post('/form', registrationLimiter, submitIndividualRegistration);
router.post('/bulk', registrationLimiter, submitBulkRegistration);
router.post('/parse-file', uploadSpreadsheet, parseSpreadsheetFile);
router.get('/my-registrations', protect, getUserRegistrations);
router.get('/details/:id', getRegistrationById);

export default router;
