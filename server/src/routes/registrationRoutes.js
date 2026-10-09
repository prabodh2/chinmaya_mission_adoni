import express from 'express';
import {
  submitIndividualRegistration,
  submitSchoolCollegeRegistration,
  submitBulkRegistration,
  parseSpreadsheetFile,
  getInstitutions,
  getUserRegistrations,
  getRegistrationById,
  getRegistrations,
  updateRegistration,
  deleteRegistration,
  getRegistrationSummary,
  getRegistrationCounts,
} from '../controllers/registrationController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { uploadSpreadsheet } from '../middleware/uploadMiddleware.js';
import { registrationLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public Form Submissions (with optional user session attachment)
router.post('/individual', registrationLimiter, optionalAuth, submitIndividualRegistration);
router.post('/form', registrationLimiter, optionalAuth, submitIndividualRegistration); // alias
router.post('/school-college', registrationLimiter, optionalAuth, uploadSpreadsheet, submitSchoolCollegeRegistration);
router.post('/bulk', registrationLimiter, optionalAuth, uploadSpreadsheet, submitBulkRegistration); // alias
router.post('/parse-file', uploadSpreadsheet, parseSpreadsheetFile);


// Metadata & Calculations
router.get('/institutions', getInstitutions);
router.get('/summary', getRegistrationSummary);
router.get('/counts', getRegistrationCounts);

// User's own registrations
router.get('/my-registrations', protect, getUserRegistrations);

// Query all registrations (supports admin filtering & search)
router.get('/', getRegistrations);

// Specific registration details
router.get('/details/:id', getRegistrationById);
router.get('/:registrationId', getRegistrationById);

// Admin-managed Edit & Delete
router.put('/:registrationId', protect, requireAdmin, updateRegistration);
router.delete('/:registrationId', protect, requireAdmin, deleteRegistration);

export default router;
