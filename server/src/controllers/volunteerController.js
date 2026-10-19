import Volunteer from '../models/Volunteer.js';

/**
 * Public: Submit a volunteering application
 * POST /api/volunteers
 */
export const submitVolunteer = async (req, res) => {
  try {
    const { fullName, name, dob, phone, phoneNumber, email, emailId, interest } = req.body;

    const applicantName = (fullName || name || '').trim();
    const applicantDob = (dob || '').trim();
    const rawPhone = (phone || phoneNumber || '').trim();
    const applicantEmail = (email || emailId || '').trim();
    const applicantInterest = (interest || '').trim();

    if (!applicantName) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }
    if (!applicantDob) {
      return res.status(400).json({ success: false, message: 'Please provide your date of birth.' });
    }
    if (!rawPhone) {
      return res.status(400).json({ success: false, message: 'Please provide your phone number.' });
    }
    if (!applicantEmail) {
      return res.status(400).json({ success: false, message: 'Please provide your email address.' });
    }
    if (!applicantInterest) {
      return res.status(400).json({ success: false, message: 'Please let us know your interest in volunteering.' });
    }

    // Clean phone number (strip whitespace, dashes, country code if provided)
    const cleanedPhone = rawPhone.replace(/\D/g, '').slice(-10);
    if (cleanedPhone.length !== 10) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number.' });
    }

    const volunteer = await Volunteer.create({
      userId: req.user?._id || null,
      fullName: applicantName,
      dob: applicantDob,
      phone: cleanedPhone,
      email: applicantEmail.toLowerCase(),
      interest: applicantInterest,
      status: 'NEW',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for offering your seva! Your volunteering application has been submitted successfully.',
      data: volunteer,
    });
  } catch (err) {
    console.error('Error submitting volunteer application:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to submit volunteering application. Please try again.',
    });
  }
};

/**
 * Admin: Get all volunteer applications with search, filter, and stats
 * GET /api/volunteers/admin/all
 */
export const getVolunteersAdmin = async (req, res) => {
  try {
    const { search = '', status = 'ALL', page = 1, limit = 100 } = req.query;

    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (search && search.trim()) {
      const s = search.trim();
      const regex = new RegExp(s, 'i');
      query.$or = [
        { fullName: regex },
        { phone: regex },
        { email: regex },
        { interest: regex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 100;
    const skip = (pageNum - 1) * limitNum;

    const [volunteers, total, newCount, contactedCount, approvedCount] = await Promise.all([
      Volunteer.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Volunteer.countDocuments(query),
      Volunteer.countDocuments({ status: 'NEW' }),
      Volunteer.countDocuments({ status: 'CONTACTED' }),
      Volunteer.countDocuments({ status: 'APPROVED' }),
    ]);

    res.json({
      success: true,
      data: volunteers,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
      stats: {
        totalAll: await Volunteer.countDocuments(),
        newCount,
        contactedCount,
        approvedCount,
      },
    });
  } catch (err) {
    console.error('Error fetching volunteers for admin:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch volunteer applications.',
    });
  }
};

/**
 * Admin: Update volunteer status & notes
 * PATCH /api/volunteers/admin/:id/status
 */
export const updateVolunteerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['NEW', 'CONTACTED', 'APPROVED', 'ARCHIVED'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;

    const volunteer = await Volunteer.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer record not found.' });
    }

    res.json({
      success: true,
      message: `Volunteer status updated to ${volunteer.status}`,
      data: volunteer,
    });
  } catch (err) {
    console.error('Error updating volunteer status:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update volunteer status.',
    });
  }
};

/**
 * Admin: Delete volunteer application
 * DELETE /api/volunteers/admin/:id
 */
export const deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.params;

    const volunteer = await Volunteer.findByIdAndDelete(id);

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer record not found.' });
    }

    res.json({
      success: true,
      message: 'Volunteer application deleted successfully.',
    });
  } catch (err) {
    console.error('Error deleting volunteer application:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete volunteer application.',
    });
  }
};
