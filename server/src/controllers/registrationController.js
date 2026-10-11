import registrationService from '../services/registrationService.js';
import Registration from '../models/Registration.js';
import Institution from '../models/Institution.js';
import EventConfig from '../models/EventConfig.js';
import { adoniInstitutionsList } from '../utils/seedData.js';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Check if marathon registration is currently open in EventConfig
 */
const checkEventRegistrationOpen = async () => {
  const config = await EventConfig.findOne();
  if (config) {
    const now = new Date();
    const isPastDeadline = config.registrationEndDate && now > new Date(config.registrationEndDate);
    if (!config.registrationOpen || isPastDeadline) {
      return {
        isOpen: false,
        message: isPastDeadline
          ? 'Registration closed. The last date to register was 30 November 2026 (30/11/2026).'
          : 'Registration is currently closed by the organizers.',
      };
    }
  }
  return { isOpen: true };
};

/**
 * Submit Individual Registration
 * Endpoint: POST /api/registrations/individual (and POST /api/registrations/form)
 */
export const submitIndividualRegistration = async (req, res) => {
  try {
    const eventCheck = await checkEventRegistrationOpen();
    if (!eventCheck.isOpen) {
      return res.status(400).json({
        success: false,
        message: eventCheck.message,
        errorCode: 'REGISTRATION_CLOSED',
      });
    }

    const registration = await registrationService.createIndividualRegistration(
      req.body,
      req.user ? req.user._id : null
    );

    if (registration.isGroup) {
      return res.status(201).json({
        success: true,
        message: 'Registration successful for you and your friend!',
        data: {
          isGroup: true,
          groupId: registration.groupId,
          participants: registration.participants.map((r) => ({
            registrationId: r.registrationId,
            entryPassId: r.entryPassId,
            groupRole: r.groupRole,
            fullName: r.fullName,
            age: r.age,
            standard: r.standard,
            profession: r.profession,
            isStudent: r.isStudent,
            institutionName: r.institutionName,
            contactNumber: r.contactNumber,
            tShirtSize: r.tShirtSize,
            createdAt: r.createdAt,
          })),
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        registrationId: registration.registrationId,
        entryPassId: registration.entryPassId,
        registrationYear: registration.registrationYear,
        registrationType: registration.registrationType,
        fullName: registration.fullName,
        age: registration.age,
        standard: registration.standard,
        profession: registration.profession,
        isStudent: registration.isStudent,
        institutionName: registration.institutionName,
        contactNumber: registration.contactNumber,
        tShirtSize: registration.tShirtSize,
        createdAt: registration.createdAt,
      },
    });
  } catch (err) {
    console.error('[Individual Registration Error]:', err.message);
    res.status(400).json({
      success: false,
      message: err.message || 'Registration failed',
      errorCode: 'REGISTRATION_ERROR',
    });
  }
};

/**
 * Backward compatibility alias for group registrations
 */
export const submitGroupRegistration = submitIndividualRegistration;

/**
 * Submit School / College Registration (supports both single student and bulk uploads)
 * Endpoint: POST /api/registrations/school-college (and POST /api/registrations/bulk)
 */
export const submitSchoolCollegeRegistration = async (req, res) => {
  try {
    const eventCheck = await checkEventRegistrationOpen();
    if (!eventCheck.isOpen) {
      return res.status(400).json({
        success: false,
        message: eventCheck.message,
        errorCode: 'REGISTRATION_CLOSED',
      });
    }

    const { contactPersonName, phone, institutionType, institutionName, studentsData } = req.body;

    // Check if this is a bulk registration request (either studentsData is present or a file is attached)
    let parsedStudents = [];
    if (studentsData) {
      if (typeof studentsData === 'string') {
        try {
          parsedStudents = JSON.parse(studentsData);
        } catch (e) {
          parsedStudents = [];
        }
      } else if (Array.isArray(studentsData)) {
        parsedStudents = studentsData;
      }
    }

    if ((!parsedStudents || parsedStudents.length === 0) && req.file) {
      const buffer = req.file.buffer;
      if (req.file.originalname.match(/\.csv$/i)) {
        const text = buffer.toString('utf-8');
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        parsedStudents = parsed.data;
      } else {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        parsedStudents = XLSX.utils.sheet_to_json(sheet);
      }
    }

    // BULK REGISTRATION FLOW
    if (parsedStudents && parsedStudents.length > 0) {
      const result = await registrationService.createBulkSchoolCollegeRegistrations({
        contactPersonName: contactPersonName || req.body.fullName || 'Institution Coordinator',
        phone: phone || req.body.contactNumber,
        institutionType: institutionType || 'SCHOOL',
        institutionName: institutionName || req.body.schoolName || 'School/College',
        students: parsedStudents,
        file: req.file,
        userId: req.user ? req.user._id : null,
      });

      return res.status(201).json({
        success: true,
        message: `Successfully registered ${result.validCount} students under Batch ${result.batchId}`,
        data: {
          batchId: result.batchId,
          totalStudents: result.totalStudents,
          validRecords: result.validCount,
          failedRecords: result.failedCount,
          fileName: result.bulkBatch.fileName,
        },
      });
    }

    // SINGLE STUDENT SCHOOL / COLLEGE REGISTRATION FLOW
    const registration = await registrationService.createSchoolCollegeRegistration(
      req.body,
      req.user ? req.user._id : null
    );

    res.status(201).json({
      success: true,
      message: 'School / College registration successful',
      data: {
        registrationId: registration.registrationId,
        registrationYear: registration.registrationYear,
        registrationType: registration.registrationType,
        fullName: registration.fullName,
        age: registration.age,
        standard: registration.standard,
        institutionName: registration.institutionName,
        contactNumber: registration.contactNumber,
        tShirtSize: registration.tShirtSize,
        createdAt: registration.createdAt,
      },
    });
  } catch (err) {
    console.error('[School / College Registration Error]:', err.message);
    res.status(400).json({
      success: false,
      message: err.message || 'School / College registration failed',
      errorCode: 'REGISTRATION_ERROR',
    });
  }
};

/**
 * Backward compatibility alias for submitBulkRegistration
 */
export const submitBulkRegistration = submitSchoolCollegeRegistration;

/**
 * Get all registrations with filtering, searching, and pagination
 * Endpoint: GET /api/registrations
 */
export const getRegistrations = async (req, res) => {
  try {
    const result = await registrationService.getRegistrations(req.query);
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error('[Get Registrations Error]:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get single registration by ID
 * Endpoint: GET /api/registrations/:registrationId
 */
export const getRegistrationById = async (req, res) => {
  try {
    const id = req.params.registrationId || req.params.id;
    const registration = await registrationService.getRegistrationById(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: `Registration not found with ID: ${id}`,
      });
    }

    // Strict Authorization: Only the owner, booking registrant, or an administrator can view the full record
    const userRole = (req.user?.role || '').toLowerCase();
    const isAdmin = userRole === 'admin';
    const isOwner = req.user && (
      (registration.userId && registration.userId.toString() === req.user._id.toString()) ||
      (registration.registeredBy && registration.registeredBy.toString() === req.user._id.toString()) ||
      (registration.contactNumber && registration.contactNumber === req.user.phone)
    );

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view this registration record.',
        errorCode: 'FORBIDDEN',
      });
    }

    res.json({ success: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update a registration (Registration ID is immutable)
 * Endpoint: PUT /api/registrations/:registrationId
 */
export const updateRegistration = async (req, res) => {
  try {
    const id = req.params.registrationId || req.params.id;
    const updated = await registrationService.updateRegistration(id, req.body);
    res.json({
      success: true,
      message: 'Registration updated successfully',
      data: updated,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Delete a registration (Atomic counter is not decremented)
 * Endpoint: DELETE /api/registrations/:registrationId
 */
export const deleteRegistration = async (req, res) => {
  try {
    const id = req.params.registrationId || req.params.id;
    await registrationService.deleteRegistration(id);
    res.json({
      success: true,
      message: `Registration ${id} deleted successfully. ID sequence preserved.`,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

/**
 * Dynamic summary calculation
 * Endpoint: GET /api/registrations/summary
 */
export const getRegistrationSummary = async (req, res) => {
  try {
    const summary = await registrationService.getSummary(req.query.year);
    res.json({
      success: true,
      data: summary,
    });
  } catch (err) {
    console.error('[Registration Summary Error]:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Quick counts
 * Endpoint: GET /api/registrations/counts
 */
export const getRegistrationCounts = async (req, res) => {
  try {
    const counts = await registrationService.getCounts();
    res.json({
      success: true,
      data: counts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Parse uploaded spreadsheet file for bulk preview
 * Endpoint: POST /api/registrations/parse-file
 */
export const parseSpreadsheetFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const buffer = req.file.buffer;
    let rows = [];

    if (req.file.originalname.match(/\.csv$/i)) {
      const text = buffer.toString('utf-8');
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
      rows = parsed.data;
    } else {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      rows = XLSX.utils.sheet_to_json(sheet);
    }

    let validRows = 0;
    let invalidRows = 0;
    const validatedList = [];

    rows.forEach((row, idx) => {
      const name =
        row['Full Name'] ||
        row['fullName'] ||
        row['Name'] ||
        row['name'] ||
        row['STUDENT NAME'] ||
        row['Student Name'] ||
        row['student name'];
      const phone =
        row['Phone Number'] ||
        row['phone'] ||
        row['Contact'] ||
        row['contactNumber'] ||
        row["Parent's Phone Number"];
      const size = row['T-Shirt Size'] || row['tShirtSize'] || row['Size'] || row['size'] || 'M';
      const age = row['Age'] || row['age'] || '';
      const standard = row['Standard / Class'] || row['Class'] || row['class'] || '';
      const school = row['School / College'] || row['school'] || '';
      const dob = row['Date of Birth'] || row['dob'] || '';

      const isValid = Boolean(name && name.toString().trim().length > 0);
      if (isValid) {
        validRows++;
      } else {
        invalidRows++;
      }

      validatedList.push({
        rowNumber: idx + 1,
        fullName: name ? name.toString().trim() : '',
        age: age ? String(age).trim() : '',
        standard: standard ? String(standard).trim() : '',
        phone: phone ? phone.toString().replace(/\D/g, '') : '',
        school: school ? school.toString().trim() : '',
        tShirtSize: (size || 'M').toString().toUpperCase(),
        dob: dob || '',
        isValid,
        error: isValid ? null : 'Missing Student Name',
      });
    });

    res.json({
      success: true,
      data: {
        totalRows: rows.length,
        validRows,
        invalidRows,
        preview: validatedList,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'File parsing error',
    });
  }
};

/**
 * Get institutions list
 * Endpoint: GET /api/registrations/institutions
 */
export const getInstitutions = async (req, res) => {
  try {
    const list = await Institution.find().sort({ name: 1 });
    const names = list.map((item) => item.name);
    const finalNames = names.length > 0 ? names : adoniInstitutionsList;
    res.json({ success: true, data: finalNames });
  } catch (err) {
    res.json({ success: true, data: adoniInstitutionsList });
  }
};

/**
 * Get logged-in user registrations
 * Endpoint: GET /api/registrations/my-registrations
 */
export const getUserRegistrations = async (req, res) => {
  try {
    const userPhone = req.user.phone;
    const registrations = await Registration.find({
      $or: [
        { userId: req.user._id },
        { registeredBy: req.user._id },
        { contactNumber: userPhone },
      ],
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Public Entry Pass Verification
 * Endpoint: GET /api/registrations/verify-pass/:passId (or /api/registrations/pass/:passId/verify)
 */
export const verifyPass = async (req, res) => {
  try {
    const passId = req.params.passId || req.params.id;
    const result = await registrationService.verifyEntryPass(passId);
    if (!result.isValid) {
      return res.status(404).json({
        success: false,
        message: result.message || 'Invalid or unconfirmed entry pass.',
        data: result,
      });
    }
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Pass verification failed.',
    });
  }
};
