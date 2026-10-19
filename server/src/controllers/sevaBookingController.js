import SevaBooking from '../models/SevaBooking.js';
import User from '../models/User.js';

// Sanitize 10-digit Indian phone
const sanitizePhone = (rawPhone) => {
  if (!rawPhone) return '';
  let clean = String(rawPhone).replace(/\D/g, '');
  if (clean.startsWith('91') && clean.length > 10) {
    clean = clean.slice(2);
  }
  return clean.slice(-10);
};

// Generate standard reference ID if not provided
const generateFallbackRefId = (prefix = 'SMT') => {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${t.slice(-5)}-${r}`;
};

/**
 * Public: Submit a temple seva booking or devotee contribution
 * POST /api/seva-bookings
 */
export const submitSevaBooking = async (req, res) => {
  try {
    const {
      refId,
      bookingId,
      bookingType = 'SEVA_BOOKING',
      templeName,
      sevaName,
      pujaName,
      serviceCategory,
      pujaType,
      amount,
      name,
      devoteeName,
      gotra,
      gotram,
      nakshetra,
      nakshatra,
      phone,
      phoneNumber,
      email,
      date,
      dob,
      address,
      panNumber,
      utrId,
      screenshotName,
      screenshot,
    } = req.body;

    const finalDevoteeName = (devoteeName || name || '').trim();
    if (!finalDevoteeName) {
      return res.status(400).json({
        success: false,
        message: 'Devotee / Donor name is required.',
      });
    }

    const rawPhone = phone || phoneNumber || '';
    const cleanPhone = sanitizePhone(rawPhone);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number.',
      });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid contribution / seva amount.',
      });
    }

    const finalSevaName = (sevaName || pujaName || 'General Seva').trim();
    const finalUtrId = (utrId || '').trim();
    if (!finalUtrId || finalUtrId.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid Bank / UPI Transaction UTR Reference ID (at least 6 characters).',
      });
    }

    // 1. Deduplication Guard: Check if this UTR Reference was already submitted
    const existingUtr = await SevaBooking.findOne({ utrId: finalUtrId });
    if (existingUtr) {
      return res.status(409).json({
        success: false,
        message: 'A submission with this UTR Transaction ID already exists. If this is an error, please contact the temple administration.',
        data: existingUtr,
      });
    }

    // 2. Double-Click Concurrency Guard: 15-second window for exact same phone and seva
    const fifteenSecondsAgo = new Date(Date.now() - 15 * 1000);
    const recentDuplicate = await SevaBooking.findOne({
      phone: cleanPhone,
      sevaName: finalSevaName,
      amount: numericAmount,
      createdAt: { $gte: fifteenSecondsAgo },
    });
    if (recentDuplicate) {
      return res.status(200).json({
        success: true,
        message: 'Booking details recorded successfully.',
        data: recentDuplicate,
      });
    }

    // Determine final booking identifier
    const prefix = bookingType === 'DEVOTEE_CONTRIBUTION' ? 'CMS' : (templeName?.includes('Sanjeevaraya') ? 'CST' : 'SMT');
    const finalBookingId = (bookingId || refId || generateFallbackRefId(prefix)).toUpperCase().trim();

    // Link to registered user if authenticated or phone matches account
    let linkedUserId = req.user?._id || (req.body.userId ? req.body.userId : null);
    if (!linkedUserId && cleanPhone) {
      try {
        const matchedUser = await User.findOne({ phone: cleanPhone });
        if (matchedUser) linkedUserId = matchedUser._id;
      } catch (_) {}
    }

    const booking = new SevaBooking({
      bookingId: finalBookingId,
      bookingType: bookingType === 'DEVOTEE_CONTRIBUTION' ? 'DEVOTEE_CONTRIBUTION' : 'SEVA_BOOKING',
      templeName: (templeName || 'Chinmaya Sanjeevaraya Temple').trim(),
      sevaName: finalSevaName,
      serviceCategory: (serviceCategory || '').trim(),
      pujaType: (pujaType || 'general').trim(),
      amount: numericAmount,
      devoteeName: finalDevoteeName,
      gotram: (gotram || gotra || '').trim(),
      nakshatra: (nakshatra || nakshetra || '').trim(),
      phone: cleanPhone,
      email: (email || '').trim().toLowerCase(),
      date: (date || dob || new Date().toISOString().split('T')[0]).trim(),
      address: (address || '').trim(),
      panNumber: (panNumber || '').trim().toUpperCase(),
      utrId: finalUtrId,
      screenshotName: (screenshotName || screenshot || '').trim(),
      status: 'Payment Proof Submitted (Verification Pending)',
      userId: linkedUserId,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Payment proof submitted successfully! Verification is pending.',
      data: booking,
    });
  } catch (err) {
    console.error('[SevaBooking Error]:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to submit seva booking. Please try again.',
    });
  }
};

/**
 * Public: Verify booking receipt by reference ID
 * GET /api/seva-bookings/verify/:refId
 */
export const getSevaBookingByRefId = async (req, res) => {
  try {
    const { refId } = req.params;
    const cleanId = (refId || '').trim().toUpperCase();

    const booking = await SevaBooking.findOne({ bookingId: cleanId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'No seva booking or donation receipt found with this Reference ID.',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Authenticated: Get my seva bookings & donations
 * GET /api/seva-bookings/my-bookings
 */
export const getMySevaBookings = async (req, res) => {
  try {
    const query = {
      $or: [{ userId: req.user._id }, { phone: req.user.phone }],
    };

    const bookings = await SevaBooking.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Admin: Get all seva bookings and devotee contributions
 * GET /api/seva-bookings/admin/all
 */
export const getSevaBookingsAdmin = async (req, res) => {
  try {
    const { search = '', status = 'ALL', bookingType = 'ALL', temple = 'ALL', page = 1, limit = 50 } = req.query;

    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (bookingType && bookingType !== 'ALL') {
      query.bookingType = bookingType;
    }

    if (temple && temple !== 'ALL') {
      query.templeName = temple;
    }

    if (search && search.trim()) {
      const s = search.trim();
      const regex = new RegExp(s, 'i');
      query.$or = [
        { bookingId: regex },
        { devoteeName: regex },
        { phone: regex },
        { utrId: regex },
        { sevaName: regex },
        { templeName: regex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total, totalAmountAgg] = await Promise.all([
      SevaBooking.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      SevaBooking.countDocuments(query),
      SevaBooking.aggregate([
        { $match: query },
        { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
      ]),
    ]);

    const totalAmount = totalAmountAgg.length > 0 ? totalAmountAgg[0].totalAmount : 0;

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          totalCount: total,
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
        stats: {
          totalRecords: total,
          totalAmount,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Admin: Update booking status
 * PATCH /api/seva-bookings/admin/:id/status
 */
export const updateSevaBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'Payment Proof Submitted (Verification Pending)',
      'CONFIRMED',
      'COMPLETED',
      'CANCELLED',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status provided.',
      });
    }

    const updated = await SevaBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    res.json({
      success: true,
      message: `Status updated to ${status} successfully.`,
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Admin: Delete booking
 * DELETE /api/seva-bookings/admin/:id
 */
export const deleteSevaBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SevaBooking.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    res.json({
      success: true,
      message: 'Booking record deleted successfully.',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
