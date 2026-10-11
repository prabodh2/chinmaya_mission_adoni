import express from 'express';
import {
  submitIndividualRegistration,
  submitGroupRegistration,
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
  verifyPass,
} from '../controllers/registrationController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { uploadSpreadsheet } from '../middleware/uploadMiddleware.js';
import { registrationLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Protected Form Submissions (Requires user authentication/signup)
router.post('/individual', registrationLimiter, protect, submitIndividualRegistration);
router.post('/group', registrationLimiter, protect, submitGroupRegistration);
router.post('/form', registrationLimiter, protect, submitIndividualRegistration); // alias
router.post('/school-college', registrationLimiter, protect, uploadSpreadsheet, submitSchoolCollegeRegistration);
router.post('/bulk', registrationLimiter, protect, uploadSpreadsheet, submitBulkRegistration); // alias
router.post('/parse-file', protect, uploadSpreadsheet, parseSpreadsheetFile);

// Public Entry Pass Verification (Opaque / QR scan verification)
router.get('/verify-pass/:passId', verifyPass);
router.get('/pass/:passId/verify', verifyPass);

// Metadata & Calculations
router.get('/institutions', getInstitutions);
router.get('/summary', getRegistrationSummary);
router.get('/counts', getRegistrationCounts);

// User's own registrations
router.get('/my-registrations', protect, getUserRegistrations);

// Query all registrations (Admin only)
router.get('/', protect, requireAdmin, getRegistrations);

// Specific registration details (Protected: Owner or Admin)
router.get('/details/:id', protect, getRegistrationById);
router.get('/:registrationId', protect, getRegistrationById);

// Admin-managed Edit & Delete
router.put('/:registrationId', protect, requireAdmin, updateRegistration);
router.delete('/:registrationId', protect, requireAdmin, deleteRegistration);

export default router;
