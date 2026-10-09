import CommunityService from '../models/CommunityService.js';

// Sanitize basic text to prevent XSS
const sanitizeText = (text) => {
  if (!text) return '';
  return text.toString().replace(/<[^>]*>?/gm, '').trim();
};

/**
 * Get all published community services (Public)
 * GET /api/community-services
 */
export const getPublicServices = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 50 } = req.query;
    const filter = { isPublished: true, status: 'ACTIVE' };

    if (category && category !== 'ALL') {
      filter.category = category;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { skills: regex },
        { location: regex },
        { fullName: regex },
      ];
    }

    const total = await CommunityService.countDocuments(filter);
    const services = await CommunityService.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('userId', 'fullName phone role');

    res.json({
      success: true,
      data: {
        total,
        page: Number(page),
        services,
      },
    });
  } catch (err) {
    console.error('[Get Community Services Error]:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch community services',
    });
  }
};

/**
 * Get service by ID (Public)
 * GET /api/community-services/:id
 */
export const getServiceById = async (req, res) => {
  try {
    const service = await CommunityService.findById(req.params.id).populate('userId', 'fullName phone');
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Submit / Offer a Community Service (Protected)
 * POST /api/community-services
 */
export const createService = async (req, res) => {
  try {
    const { title, category, description, skills, availability, location, contactPhone, contactEmail } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Service title is required' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Service category is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Service description is required' });
    }

    const phoneToUse = contactPhone ? contactPhone.trim() : req.user.phone;

    const newService = new CommunityService({
      userId: req.user._id,
      fullName: req.user.fullName,
      contactPhone: phoneToUse,
      contactEmail: contactEmail ? contactEmail.trim() : req.user.email || '',
      title: sanitizeText(title),
      category: category.trim(),
      description: sanitizeText(description),
      skills: sanitizeText(skills || ''),
      availability: sanitizeText(availability || 'Flexible / On-demand'),
      location: sanitizeText(location || 'Adoni, Andhra Pradesh'),
      status: 'ACTIVE',
      isPublished: true, // Published immediately per prompt requirement
    });

    await newService.save();

    res.status(201).json({
      success: true,
      message: 'Service submitted and published successfully to the directory!',
      data: newService,
    });
  } catch (err) {
    console.error('[Create Service Error]:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to submit service',
    });
  }
};

/**
 * Update Community Service (Protected: Owner or Admin)
 * PUT /api/community-services/:id
 */
export const updateService = async (req, res) => {
  try {
    const service = await CommunityService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Verify ownership or admin role
    const isOwner = service.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this service',
      });
    }

    const { title, category, description, skills, availability, location, contactPhone, status } = req.body;

    if (title) service.title = sanitizeText(title);
    if (category) service.category = category.trim();
    if (description) service.description = sanitizeText(description);
    if (skills !== undefined) service.skills = sanitizeText(skills);
    if (availability !== undefined) service.availability = sanitizeText(availability);
    if (location !== undefined) service.location = sanitizeText(location);
    if (contactPhone !== undefined) service.contactPhone = contactPhone.trim();
    if (status && ['ACTIVE', 'PAUSED', 'CLOSED'].includes(status)) {
      service.status = status;
    }

    await service.save();

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete Community Service (Protected: Owner or Admin)
 * DELETE /api/community-services/:id
 */
export const deleteService = async (req, res) => {
  try {
    const service = await CommunityService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const isOwner = service.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this service',
      });
    }

    await CommunityService.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Service removed successfully',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
