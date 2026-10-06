import Registration from '../models/Registration.js';
import BulkBatch from '../models/BulkBatch.js';
import Institution from '../models/Institution.js';
import User from '../models/User.js';
import { syncRegistrationToGoogleSheets } from '../config/googleSheets.js';
import * as XLSX from 'xlsx';

export const getDashboardStats = async (req, res) => {
  try {
    const totalRegistrations = await Registration.countDocuments({ status: 'CONFIRMED' });
    const formRegistrations = await Registration.countDocuments({ registrationType: 'FORM', status: 'CONFIRMED' });
    const schoolCollegeRegistrations = await Registration.countDocuments({ registrationType: 'SCHOOL_COLLEGE', status: 'CONFIRMED' });

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
      .select('registrationId fullName institutionName contactNumber tShirtSize registrationType createdAt status');

    res.json({
      success: true,
      data: {
        totalRegistrations,
        formRegistrations,
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
    const { type, search, institution, size, page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = { status: 'CONFIRMED' };

    if (type && ['FORM', 'SCHOOL_COLLEGE'].includes(type.toUpperCase())) {
      query.registrationType = type.toUpperCase();
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { registrationId: searchRegex },
        { fullName: searchRegex },
        { contactNumber: searchRegex },
        { institutionName: searchRegex },
      ];
    }

    if (institution && institution !== 'ALL') {
      query.institutionName = new RegExp(institution.trim(), 'i');
    }

    if (size && size !== 'ALL') {
      query.tShirtSize = size.toUpperCase();
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Registration.find(query).sort(sortObj).skip(skip).limit(limitNum),
      Registration.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum) || 1,
          limit: limitNum,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
    const students = await Registration.find({ batchId }).sort({ fullName: 1 });
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
    const students = await Registration.find({ batchId }).sort({ createdAt: 1 });
    const rows = students.map((s, idx) => ({
      'S.No': idx + 1,
      'Registration ID': s.registrationId,
      'Full Name': s.fullName,
      'Date of Birth': s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : 'N/A',
      'Contact Number': s.contactNumber,
      'T-Shirt Size': s.tShirtSize,
      'Institution': s.institutionName,
      'Institution Type': s.institutionType,
      'Contact Person': s.contactPersonName || batch.contactPersonName,
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
    const { type = 'FORM' } = req.query;
    const matchQuery = { status: 'CONFIRMED' };
    if (type && type.toUpperCase() !== 'ALL') {
      matchQuery.registrationType = type.toUpperCase();
    }

    // Dynamic count for total registrations from database
    const totalRegistrations = await Registration.countDocuments(matchQuery);

    // Dynamic database aggregation grouping by tShirtSize
    const sizeCounts = await Registration.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$tShirtSize',
          count: { $sum: 1 },
        },
      },
    ]);

    const sizes = {
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
    };

    sizeCounts.forEach((item) => {
      if (item._id) {
        const sizeKey = String(item._id).trim().toUpperCase();
        if (Object.prototype.hasOwnProperty.call(sizes, sizeKey)) {
          sizes[sizeKey] = item.count;
        }
      }
    });

    // Total T-Shirts = S + M + L + XL
    const totalTshirts = sizes.S + sizes.M + sizes.L + sizes.XL;

    res.json({
      success: true,
      data: {
        totalRegistrations,
        totalTshirts,
        sizes,
      },
    });
  } catch (err) {
    console.error('[Registration Summary Error]:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
