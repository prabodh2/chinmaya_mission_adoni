import Registration from '../models/Registration.js';
import BulkBatch from '../models/BulkBatch.js';
import Institution from '../models/Institution.js';
import User from '../models/User.js';
import registrationService from '../services/registrationService.js';
import { syncRegistrationToGoogleSheets } from '../config/googleSheets.js';
import * as XLSX from 'xlsx';

export const getDashboardStats = async (req, res) => {
  try {
    const totalRegistrations = await Registration.countDocuments({ status: 'CONFIRMED' });
    const formRegistrations = await Registration.countDocuments({
      status: 'CONFIRMED',
      $or: [
        { registrationType: { $in: ['individual', 'FORM'] } },
        { registrationId: { $regex: /^CMA\d{4}IN/i } },
      ],
    });
    const schoolCollegeRegistrations = await Registration.countDocuments({
      status: 'CONFIRMED',
      $or: [
        { registrationType: { $in: ['school_college', 'SCHOOL_COLLEGE'] } },
        { registrationId: { $regex: /^CMA\d{4}SC/i } },
      ],
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayRegistrations = await Registration.countDocuments({
      createdAt: { $gte: startOfToday },
      status: 'CONFIRMED',
    });

    const totalSchools = await Institution.countDocuments({ type: 'SCHOOL' });
    const totalColleges = await Institution.countDocuments({ type: 'COLLEGE' });
    const totalBatches = await BulkBatch.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    const recentRegistrations = await Registration.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select('registrationId fullName age standard institutionName contactNumber tShirtSize registrationType createdAt status');

    res.json({
      success: true,
      data: {
        totalRegistrations,
        formRegistrations,
        individualRegistrations: formRegistrations,
        schoolCollegeRegistrations,
        todayRegistrations,
        totalSchools,
        totalColleges,
        totalBatches,
        totalUsers,
        recentRegistrations,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminRegistrations = async (req, res) => {
  try {
    const result = await registrationService.getRegistrations(req.query);
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminRegistrationById = async (req, res) => {
  try {
    const registration = await registrationService.getRegistrationById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    res.json({ success: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAdminRegistration = async (req, res) => {
  try {
    const updated = await registrationService.updateRegistration(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Registration updated successfully',
      data: updated,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteAdminRegistration = async (req, res) => {
  try {
    await registrationService.deleteRegistration(req.params.id);
    res.json({
      success: true,
      message: 'Registration deleted successfully. ID sequence preserved.',
    });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const getBulkBatches = async (req, res) => {
  try {
    const batches = await BulkBatch.find().sort({ createdAt: -1 });
    res.json({ success: true, data: batches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBatchStudents = async (req, res) => {
  try {
    const { batchId } = req.params;
    const students = await Registration.find({ batchId }).sort({ registrationIndex: 1, createdAt: 1, fullName: 1 });
    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const downloadBatchSpreadsheet = async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = await BulkBatch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    if (batch.fileData) {
      const buffer = Buffer.from(batch.fileData, 'base64');
      const filename = batch.fileName || `${batch.institutionName.replace(/\s+/g, '_')}_${batchId}.xlsx`;
      const mimeType = batch.fileMimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(buffer);
    }

    // Fallback: Generate spreadsheet from stored student records for this batch
    const students = await Registration.find({ batchId }).sort({ registrationIndex: 1, createdAt: 1 });
    const rows = students.map((s, idx) => ({
      'S.No': idx + 1,
      'Registration ID': s.registrationId,
      'Student Name': s.fullName,
      'Age': s.age || 'N/A',
      'Standard / Class': s.standard || 'N/A',
      'Parent Phone': s.contactNumber,
      'School / College': s.institutionName,
      'T-Shirt Size': s.tShirtSize,
      'Institution Type': s.institutionType,
      'Registration Date': new Date(s.createdAt).toISOString().split('T')[0],
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const safeName = batch.institutionName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeName}_Students_${batchId}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (err) {
    console.error('[Download Batch Spreadsheet Error]:', err.message);
    res.status(500).json({ success: false, message: 'Failed to download spreadsheet file' });
  }
};

export const deleteBulkBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    await BulkBatch.findOneAndDelete({ batchId });
    await Registration.deleteMany({ batchId });
    res.json({ success: true, message: 'Batch and associated student records deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const retrySheetsSync = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    const syncResult = await syncRegistrationToGoogleSheets(registration);
    registration.googleSheetsSync = syncResult;
    await registration.save();

    res.json({
      success: true,
      message: syncResult.status === 'success' ? 'Google Sheets sync successful' : 'Sync attempt complete',
      data: syncResult,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getIndividualRegistrationSummary = async (req, res) => {
  try {
    const summary = await registrationService.getSummary(req.query.year);

    res.json({
      success: true,
      data: {
        ...summary,
        sizes: summary.tshirtSizes, // backward compatibility
      },
    });
  } catch (err) {
    console.error('[Registration Summary Error]:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
