import Activity from '../models/Activity.js';
import Media from '../models/Media.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { seedInitialData } from '../utils/seedData.js';

export const getActivities = async (req, res) => {
  try {
    let activities = await Activity.find({ active: true }).sort({ order: 1, updatedAt: -1 });

    // Also include active activities from Media library
    const activityMedia = await Media.find({
      status: 'ACTIVE',
      $or: [
        { category: 'Activities' },
        { page: 'Activities' },
      ],
    }).sort({ displayOrder: 1, updatedAt: -1 });

    const existingUrls = new Set(activities.map((a) => a.imageUrl));
    const existingTitles = new Set(activities.map((a) => (a.title || '').toLowerCase()));

    const extraActivities = activityMedia
      .filter((m) => !existingUrls.has(m.url) && !existingTitles.has((m.title || '').toLowerCase()))
      .map((m) => ({
        _id: m._id,
        title: m.title,
        category: m.section || 'Activity',
        description: m.description || m.caption || m.title,
        imageUrl: m.url,
        active: true,
      }));

    activities = [...activities, ...extraActivities];

    res.json({ success: true, data: activities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllActivitiesAdmin = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: activities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createActivity = async (req, res) => {
  try {
    const { title, category, description, order } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ success: false, message: 'Title, Category, and Description are required' });
    }

    let imageUrl = 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=800&auto=format&fit=crop';
    let publicId = `act_${Date.now()}`;

    if (req.file) {
      const cloudRes = await uploadToCloudinary(req.file.buffer, 'marathon_activities', req.file.mimetype);
      imageUrl = cloudRes.url;
      publicId = cloudRes.public_id;
    }

    const activity = new Activity({
      title,
      category,
      description,
      imageUrl,
      publicId,
      order: order ? Number(order) : 0,
      active: true,
    });

    await activity.save();

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: activity,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleActivityStatus = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    activity.active = !activity.active;
    await activity.save();

    res.json({ success: true, message: 'Activity status toggled', data: activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
