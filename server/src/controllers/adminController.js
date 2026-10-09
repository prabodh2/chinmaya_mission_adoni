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
    const totalUsers = await User.countDocuments({ role: { $in: ['user', 'USER'] } });

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

/**
 * Get Paginated List of Users for Admin User Management
 * GET /api/admin/users
 */
export const getAdminUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const { search, role, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};

    if (role && role !== 'all') {
      query.role = role.toLowerCase();
    }

    if (search && search.trim()) {
      const cleanSearch = search.trim();
      const searchRegex = new RegExp(cleanSearch, 'i');
      query.$or = [
        { fullName: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
        { profession: searchRegex },
      ];
    }

    const sortOption = {};
    sortOption[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [users, totalCount, totalAdmins, totalRegularUsers] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: { $in: ['user', 'USER'] } }),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          totalCount,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        stats: {
          totalUsers: totalAdmins + totalRegularUsers,
          totalAdmins,
          totalRegularUsers,
        },
      },
    });
  } catch (err) {
    console.error('[Admin Users Error]:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch users' });
  }
};

/**
 * Get Specific User by ID
 * GET /api/admin/users/:id
 */
export const getAdminUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch user's registered marathon passes
    const registrations = await Registration.find({
      $or: [{ userId: user._id }, { contactNumber: user.phone }],
    })
      .select('registrationId fullName category standard status createdAt tShirtSize')
      .lean();

    res.json({
      success: true,
      data: {
        ...user,
        registrations,
        registrationsCount: registrations.length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update User Role
 * PATCH /api/admin/users/:id/role
 */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const targetUserId = req.params.id;

    if (!role || !['user', 'admin'].includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Role must be "user" or "admin".',
      });
    }

    const normalizedRole = role.toLowerCase();
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Protect against demoting the last active administrator
    if (targetUser.role === 'admin' && normalizedRole === 'user') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot demote the last remaining administrator.',
        });
      }
    }

    targetUser.role = normalizedRole;
    await targetUser.save();

    res.json({
      success: true,
      message: `User role updated to ${normalizedRole.toUpperCase()} successfully`,
      data: {
        _id: targetUser._id,
        fullName: targetUser.fullName,
        phone: targetUser.phone,
        role: targetUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Permanent Delete User
 * DELETE /api/admin/users/:id
 */
export const deleteAdminUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    // 1. Prevent administrator from deleting themselves
    if (req.user && req.user._id.toString() === targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own active administrator account.',
      });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User record not found' });
    }

    // 2. Prevent deleting the last administrator
    if (targetUser.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the only administrator account.',
        });
      }
    }

    // 3. Permanent delete from database
    await User.findByIdAndDelete(targetUserId);

    res.json({
      success: true,
      message: `User ${targetUser.fullName} (${targetUser.phone}) permanently deleted from database.`,
    });
  } catch (err) {
    console.error('[Delete User Error]:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to delete user' });
  }
};

/**
 * Get Authenticated Admin's Profile
 * GET /api/admin/profile
 */
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select('-password').lean();
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin profile not found' });
    }
    res.json({
      success: true,
      data: admin,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update Authenticated Admin's Profile
 * PUT /api/admin/profile
 */
export const updateAdminProfile = async (req, res) => {
  try {
    const { fullName, email, phone, profession, age } = req.body;
    const admin = await User.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    if (fullName && fullName.trim()) admin.fullName = fullName.trim();
    if (email !== undefined) admin.email = email ? email.toLowerCase().trim() : null;
    if (profession !== undefined) admin.profession = profession.trim();
    if (age) {
      const parsedAge = parseInt(age, 10);
      if (!isNaN(parsedAge) && parsedAge >= 5 && parsedAge <= 120) {
        admin.age = parsedAge;
      }
    }
    if (phone) {
      const cleanPhone = phone.toString().replace(/\D/g, '');
      if (cleanPhone.length === 10) {
        // Check phone uniqueness
        const duplicate = await User.findOne({ phone: cleanPhone, _id: { $ne: admin._id } });
        if (duplicate) {
          return res.status(409).json({ success: false, message: 'This phone number is already registered to another account.' });
        }
        admin.phone = cleanPhone;
      }
    }

    await admin.save();

    res.json({
      success: true,
      message: 'Admin profile updated successfully',
      data: {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        profession: admin.profession,
        age: admin.age,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
