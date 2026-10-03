import Registration from '../models/Registration.js';
import BulkBatch from '../models/BulkBatch.js';
import Institution from '../models/Institution.js';
import User from '../models/User.js';
import { syncRegistrationToGoogleSheets } from '../config/googleSheets.js';

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
