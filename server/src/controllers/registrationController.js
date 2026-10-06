import Registration from '../models/Registration.js';
import BulkBatch from '../models/BulkBatch.js';
import Institution from '../models/Institution.js';
import EventConfig from '../models/EventConfig.js';
import { syncRegistrationToGoogleSheets } from '../config/googleSheets.js';
import { adoniInstitutionsList } from '../utils/seedData.js';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const generateRegistrationId = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 5; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ADM2026${rand}`;
};

const generateBatchId = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `BATCH-2026-${num}`;
};

export const submitIndividualRegistration = async (req, res) => {
  try {
    // Check if registration is open in EventConfig
    const config = await EventConfig.findOne();
    if (config && !config.registrationOpen) {
      return res.status(400).json({
        success: false,
        message: 'Registration is currently closed by the organizers',
        errorCode: 'REGISTRATION_CLOSED',
      });
    }

    const { fullName, dateOfBirth, isStudent, institutionName, contactNumber, tShirtSize } = req.body;

    if (!fullName || !contactNumber || !tShirtSize) {
      return res.status(400).json({
        success: false,
        message: 'Full Name, Contact Number, and T-Shirt Size are required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    // Indian phone regex check
    let cleanPhone = contactNumber.replace(/\D/g, '');
    if (cleanPhone.startsWith('91') && cleanPhone.length > 10) {
      cleanPhone = cleanPhone.slice(2);
    }
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit Indian mobile number',
        errorCode: 'INVALID_PHONE',
      });
    }

    let parsedDob = null;
    if (dateOfBirth) {
      const d = new Date(dateOfBirth);
      if (!isNaN(d.getTime())) parsedDob = d;
    }

    let saved = false;
    let registration;
    let attempts = 0;

    while (!saved && attempts < 5) {
      try {
        attempts++;
        const registrationId = generateRegistrationId();
        registration = new Registration({
          registrationId,
          userId: req.user ? req.user._id : null,
          fullName: fullName.trim(),
          dateOfBirth: parsedDob,
          isStudent: Boolean(isStudent),
          institutionName: isStudent ? (institutionName || 'N/A').trim() : 'N/A',
          contactNumber: cleanPhone,
          tShirtSize: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].includes(tShirtSize) ? tShirtSize : 'M',
          registrationType: 'FORM',
          institutionType: 'OTHER',
        });

        await registration.save();
        saved = true;
      } catch (err) {
        if (err.code === 11000 && attempts < 5) {
          continue;
        }
        throw err;
      }
    }

    // Trigger Google Sheets sync asynchronously without failing the request
    syncRegistrationToGoogleSheets(registration).then(async (syncResult) => {
      try {
        registration.googleSheetsSync = syncResult;
        await registration.save();
      } catch (e) {}
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        registrationId: registration.registrationId,
        fullName: registration.fullName,
        isStudent: registration.isStudent,
        institutionName: registration.institutionName,
        contactNumber: registration.contactNumber,
        tShirtSize: registration.tShirtSize,
        createdAt: registration.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Registration failed',
      errorCode: 'REGISTRATION_ERROR',
    });
  }
};

export const submitBulkRegistration = async (req, res) => {
  try {
    const config = await EventConfig.findOne();
    if (config && !config.registrationOpen) {
      return res.status(400).json({
        success: false,
        message: 'Registration is currently closed',
        errorCode: 'REGISTRATION_CLOSED',
      });
    }

    const { contactPersonName, phone, institutionType, institutionName, studentsData } = req.body;

    if (!contactPersonName || !phone || !institutionName) {
      return res.status(400).json({
        success: false,
        message: 'Contact person name, phone number, and institution name are required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

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

    // If studentsData not provided or empty, attempt parsing from attached req.file
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

    if (!parsedStudents || parsedStudents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No student records found. Please upload a valid spreadsheet file containing student data.',
        errorCode: 'EMPTY_BULK_DATA',
      });
    }

    const batchId = generateBatchId();
    let validCount = 0;
    let failedCount = 0;
    const createdRegistrations = [];

    for (const student of parsedStudents) {
      const name = student.fullName || student.name || student['Full Name'] || student.FullName;
      const phoneNum = (student.phone || student.contactNumber || student['Phone Number'] || phone).toString().replace(/\D/g, '');
      const tShirt = (student.tShirtSize || student.size || student['T-Shirt Size'] || 'M').toUpperCase();
      const dob = student.dob || student.dateOfBirth || student['Date of Birth'] || null;

      if (!name) {
        failedCount++;
        continue;
      }

      const regId = generateRegistrationId();
      const reg = new Registration({
        registrationId: regId,
        fullName: name.trim(),
        dateOfBirth: dob ? new Date(dob) : null,
        isStudent: true,
        institutionName: institutionName.trim(),
        contactNumber: phoneNum.length === 10 ? phoneNum : phone,
        tShirtSize: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].includes(tShirt) ? tShirt : 'M',
        registrationType: 'SCHOOL_COLLEGE',
        institutionType: institutionType === 'COLLEGE' ? 'COLLEGE' : 'SCHOOL',
        batchId,
        contactPersonName: contactPersonName.trim(),
      });

      await reg.save();
      createdRegistrations.push(reg);
      validCount++;

      // Trigger sync in background
      syncRegistrationToGoogleSheets(reg).then(async (res) => {
        reg.googleSheetsSync = res;
        await reg.save();
      }).catch(() => {});
    }

    let cleanBulkPhone = phone.replace(/\D/g, '');
    if (cleanBulkPhone.startsWith('91') && cleanBulkPhone.length > 10) {
      cleanBulkPhone = cleanBulkPhone.slice(2);
    }

    const bulkBatch = new BulkBatch({
      batchId,
      institutionName: institutionName.trim(),
      institutionType: institutionType === 'COLLEGE' ? 'COLLEGE' : 'SCHOOL',
      contactPersonName: contactPersonName.trim(),
      phone: cleanBulkPhone,
      totalStudents: parsedStudents.length,
      validRecords: validCount,
      failedRecords: failedCount,
      fileName: req.file ? req.file.originalname : `Batch_${batchId}.csv`,
      fileMimeType: req.file ? req.file.mimetype : 'text/csv',
      fileSize: req.file ? req.file.size : 0,
      fileData: req.file ? req.file.buffer.toString('base64') : null,
    });

    await bulkBatch.save();

    res.status(201).json({
      success: true,
      message: `Successfully processed bulk registration for ${validCount} students under Batch ${batchId}`,
      data: {
        batchId,
        totalStudents: parsedStudents.length,
        validRecords: validCount,
        failedRecords: failedCount,
        fileName: bulkBatch.fileName,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Bulk registration processing failed',
      errorCode: 'BULK_REGISTRATION_ERROR',
    });
  }
};

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

    // Validate rows
    let validRows = 0;
    let invalidRows = 0;
    const validatedList = [];

    rows.forEach((row, idx) => {
      const name = row['Full Name'] || row['fullName'] || row['Name'] || row['name'] || row['STUDENT NAME'];
      const phone = row['Phone Number'] || row['phone'] || row['Contact'] || row['contactNumber'];
      const size = row['T-Shirt Size'] || row['tShirtSize'] || row['Size'] || row['size'] || 'M';
      const dob = row['Date of Birth'] || row['dob'] || row['DOB'];

      const isValid = Boolean(name && name.toString().trim().length > 0);
      if (isValid) {
        validRows++;
      } else {
        invalidRows++;
      }

      validatedList.push({
        rowNumber: idx + 1,
        fullName: name ? name.toString().trim() : '',
        phone: phone ? phone.toString().replace(/\D/g, '') : '',
        tShirtSize: (size || 'M').toString().toUpperCase(),
        dob: dob || '',
        isValid,
        error: isValid ? null : 'Missing Full Name',
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

export const getInstitutions = async (req, res) => {
  try {
    const list = await Institution.find().sort({ name: 1 });
    const names = list.map((item) => item.name);
    // Guarantee fallback list if empty
    const finalNames = names.length > 0 ? names : adoniInstitutionsList;
    res.json({ success: true, data: finalNames });
  } catch (err) {
    res.json({ success: true, data: adoniInstitutionsList });
  }
};

export const getUserRegistrations = async (req, res) => {
  try {
    const userPhone = req.user.phone;
    const userEmail = req.user.email;
    const registrations = await Registration.find({
      $or: [{ userId: req.user._id }, { contactNumber: userPhone }],
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getRegistrationById = async (req, res) => {
  try {
    const reg = await Registration.findOne({ registrationId: req.params.id.toUpperCase() });
    if (!reg) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    res.json({ success: true, data: reg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
