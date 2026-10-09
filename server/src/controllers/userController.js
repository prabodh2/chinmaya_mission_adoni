import Registration from '../models/Registration.js';
import CommunityService from '../models/CommunityService.js';
import ContactMessage from '../models/ContactMessage.js';
import EventConfig from '../models/EventConfig.js';

/**
 * Get unified user activity timeline and statistics
 * GET /api/users/activities
 */
export const getUserActivities = async (req, res) => {
  try {
    const userId = req.user._id;
    const userPhone = req.user.phone;

    // 1. Fetch Event & Marathon Registrations
    const registrations = await Registration.find({
      $or: [{ userId }, { contactNumber: userPhone }],
    }).sort({ createdAt: -1 });

    // 2. Fetch User's Submitted Community Services
    const communityServices = await CommunityService.find({
      userId,
    }).sort({ createdAt: -1 });

    // 3. Fetch User's Connection & Contact Inquiries
    const contactMessages = await ContactMessage.find({
      $or: [{ userId }, { phone: userPhone }],
    }).sort({ createdAt: -1 });

    // 4. Fetch Event Config for display metadata
    const eventConfig = await EventConfig.findOne().select(
      'programName slogan venue location eventDate eventTime registrationOpen'
    );

    // Build unified activity items for timeline
    const activities = [
      ...registrations.map((r) => ({
        id: r._id,
        activityType: 'EVENT_REGISTRATION',
        title: `Marathon Registration — ${r.fullName}`,
        referenceNumber: r.registrationId,
        date: r.createdAt,
        status: r.status,
        badgeText: r.status === 'CONFIRMED' ? 'Confirmed Pass' : r.status,
        details: {
          participantName: r.fullName,
          tShirtSize: r.tShirtSize,
          institution: r.institutionName,
          category: r.registrationType,
          standard: r.standard,
          contactNumber: r.contactNumber,
        },
        registrationRecord: r,
      })),
      ...communityServices.map((s) => ({
        id: s._id,
        activityType: 'COMMUNITY_SERVICE',
        title: `Service Offered — ${s.title}`,
        referenceNumber: `SRV-${s._id.toString().slice(-6).toUpperCase()}`,
        date: s.createdAt,
        status: s.status,
        badgeText: s.status === 'ACTIVE' ? 'Published' : s.status,
        details: {
          category: s.category,
          availability: s.availability,
          location: s.location,
          contactPhone: s.contactPhone,
          skills: s.skills,
        },
        serviceRecord: s,
      })),
      ...contactMessages.map((c) => ({
        id: c._id,
        activityType: 'CONNECTION_REQUEST',
        title: `Inquiry: ${c.category || 'General Message'}`,
        referenceNumber: `INQ-${c._id.toString().slice(-6).toUpperCase()}`,
        date: c.createdAt,
        status: c.status,
        badgeText: c.status === 'NEW' ? 'Submitted' : c.status === 'READ' ? 'Under Review' : 'Responded',
        details: {
          category: c.category,
          message: c.message,
        },
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: {
        summary: {
          totalRegistrations: registrations.length,
          confirmedPasses: registrations.filter((r) => r.status === 'CONFIRMED').length,
          servicesOffered: communityServices.length,
          connectionInquiries: contactMessages.length,
        },
        activities,
        registrations,
        communityServices,
        contactMessages,
        eventConfig,
      },
    });
  } catch (err) {
    console.error('[User Activities Error]:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch user activities',
    });
  }
};

/**
 * Get user's event registrations only
 * GET /api/users/registrations
 */
export const getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      $or: [{ userId: req.user._id }, { contactNumber: req.user.phone }],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: registrations,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get user's community services only
 * GET /api/users/services
 */
export const getUserServices = async (req, res) => {
  try {
    const services = await CommunityService.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: services,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get user's connection inquiries only
 * GET /api/users/connections
 */
export const getUserConnections = async (req, res) => {
  try {
    const connections = await ContactMessage.find({
      $or: [{ userId: req.user._id }, { phone: req.user.phone }],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: connections,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
