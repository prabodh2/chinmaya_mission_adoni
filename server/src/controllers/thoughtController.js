import Thought from '../models/Thought.js';

// Available pastel sticky note colors for the editorial Story Board
const VALID_COLORS = ['sky', 'yellow', 'coral', 'mint', 'lavender', 'peach', 'cream'];

/**
 * @desc   Create a new thought submission (User)
 * @route  POST /api/thoughts
 * @access Private (Authenticated User)
 */
export const createThought = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to share your thoughts.',
        errorCode: 'AUTH_REQUIRED',
      });
    }

    let { content, color } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide your thought content.',
        errorCode: 'CONTENT_REQUIRED',
      });
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your thought cannot be empty or contain only whitespace.',
        errorCode: 'CONTENT_EMPTY',
      });
    }

    if (trimmedContent.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Please write at least a few words (minimum 3 characters).',
        errorCode: 'CONTENT_TOO_SHORT',
      });
    }

    if (trimmedContent.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Your thought is too long. The maximum allowed length is 2,000 characters.',
        errorCode: 'CONTENT_TOO_LONG',
      });
    }

    // Assign color: use requested color if valid, otherwise pick deterministically
    const selectedColor = VALID_COLORS.includes(color)
      ? color
      : VALID_COLORS[Math.floor(Math.random() * VALID_COLORS.length)];

    const thought = await Thought.create({
      user: req.user._id,
      content: trimmedContent,
      color: selectedColor,
      status: 'PENDING',
    });

    // PRIVACY: Explicitly return only safe confirmation data (NO author details)
    return res.status(201).json({
      success: true,
      message: 'Thank you for sharing your thoughts! Your submission is awaiting review.',
      data: {
        id: thought._id,
        status: thought.status,
        color: thought.color,
        createdAt: thought.createdAt,
      },
    });
  } catch (error) {
    console.error('[Create Thought Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit your thought. Please try again later.',
      errorCode: 'SUBMISSION_FAILED',
    });
  }
};

/**
 * @desc   Get approved thoughts for public Story Board (Anonymous)
 * @route  GET /api/thoughts
 * @access Public
 */
export const getApprovedThoughts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const skip = (page - 1) * limit;

    const query = { status: 'APPROVED' };

    const total = await Thought.countDocuments(query);

    // CRITICAL PRIVACY RULE:
    // Explicitly select ONLY public fields: _id, content, color, createdAt.
    // NEVER select or return user, reviewedBy, reviewedAt, or personal fields.
    const thoughts = await Thought.find(query)
      .select('_id content color createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: thoughts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('[Get Approved Thoughts Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve approved thoughts.',
      errorCode: 'FETCH_THOUGHTS_FAILED',
    });
  }
};

/**
 * @desc   Get single approved thought by ID (Anonymous)
 * @route  GET /api/thoughts/:id
 * @access Public
 */
export const getApprovedThoughtById = async (req, res) => {
  try {
    const { id } = req.params;

    const thought = await Thought.findOne({ _id: id, status: 'APPROVED' })
      .select('_id content color createdAt')
      .lean();

    if (!thought) {
      return res.status(404).json({
        success: false,
        message: 'Thought not found or awaiting moderation.',
        errorCode: 'THOUGHT_NOT_FOUND',
      });
    }

    return res.status(200).json({
      success: true,
      data: thought,
    });
  } catch (error) {
    console.error('[Get Thought By ID Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve thought details.',
      errorCode: 'FETCH_THOUGHT_FAILED',
    });
  }
};

/**
 * @desc   Get thought submissions for moderation (Admin only)
 * @route  GET /api/admin/thoughts
 * @access Private (Admin)
 */
export const getAdminThoughts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 30));
    const skip = (page - 1) * limit;

    const { status, search } = req.query;
    const filter = {};

    if (status && ['PENDING', 'APPROVED'].includes(status.toUpperCase())) {
      filter.status = status.toUpperCase();
    }

    if (search && search.trim()) {
      filter.content = { $regex: search.trim(), $options: 'i' };
    }

    const total = await Thought.countDocuments(filter);

    const thoughts = await Thought.find(filter)
      .populate('user', 'fullName email phone profession role')
      .populate('reviewedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: thoughts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('[Admin Get Thoughts Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch thought submissions for moderation.',
      errorCode: 'ADMIN_FETCH_THOUGHTS_FAILED',
    });
  }
};

/**
 * @desc   Get moderation statistics for Story Board (Admin only)
 * @route  GET /api/admin/thoughts/stats
 * @access Private (Admin)
 */
export const getAdminThoughtStats = async (req, res) => {
  try {
    const [total, pending, approved] = await Promise.all([
      Thought.countDocuments(),
      Thought.countDocuments({ status: 'PENDING' }),
      Thought.countDocuments({ status: 'APPROVED' }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        approved,
      },
    });
  } catch (error) {
    console.error('[Admin Get Thought Stats Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch thought moderation statistics.',
      errorCode: 'STATS_FETCH_FAILED',
    });
  }
};

/**
 * @desc   Approve a pending thought (Admin only)
 * @route  PATCH /api/admin/thoughts/:id/approve
 * @access Private (Admin)
 */
export const approveThought = async (req, res) => {
  try {
    const { id } = req.params;

    const thought = await Thought.findById(id);

    if (!thought) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found.',
        errorCode: 'THOUGHT_NOT_FOUND',
      });
    }

    thought.status = 'APPROVED';
    thought.reviewedBy = req.user._id;
    thought.reviewedAt = new Date();

    await thought.save();

    await thought.populate('user', 'fullName email phone');

    return res.status(200).json({
      success: true,
      message: 'Thought approved and published successfully.',
      data: thought,
    });
  } catch (error) {
    console.error('[Approve Thought Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to approve thought submission.',
      errorCode: 'APPROVE_FAILED',
    });
  }
};

/**
 * @desc   Reject and permanently delete a thought submission (Admin only)
 * @route  DELETE /api/admin/thoughts/:id
 * @access Private (Admin)
 */
export const rejectThought = async (req, res) => {
  try {
    const { id } = req.params;

    const thought = await Thought.findById(id);

    if (!thought) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found.',
        errorCode: 'THOUGHT_NOT_FOUND',
      });
    }

    // Policy requirement: permanently delete rejected thought so it is never published
    await Thought.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Thought rejected and permanently deleted.',
      data: { id },
    });
  } catch (error) {
    console.error('[Reject Thought Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete thought submission.',
      errorCode: 'REJECT_FAILED',
    });
  }
};
