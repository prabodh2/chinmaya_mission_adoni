import Activity from '../models/Activity.js';
import Media from '../models/Media.js';
import { uploadToR2, deleteFromR2 } from '../config/r2.js';
import { seedInitialData } from '../utils/seedData.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ACTIVITY_CACHE_FILE = path.join(__dirname, '../../cache/active_activities.json');

const loadDiskCache = () => {
  try {
    if (fs.existsSync(ACTIVITY_CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(ACTIVITY_CACHE_FILE, 'utf8'));
    }
  } catch (_) {}
  return null;
};

const saveDiskCache = (data) => {
  try {
    const dir = path.dirname(ACTIVITY_CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ACTIVITY_CACHE_FILE, JSON.stringify(data), 'utf8');
  } catch (_) {}
};

let cachedActivities = loadDiskCache();
let lastActivitiesCacheTime = cachedActivities ? Date.now() : 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5m cache

export const invalidateActivitiesCache = () => {
  cachedActivities = null;
  lastActivitiesCacheTime = 0;
  try {
    if (fs.existsSync(ACTIVITY_CACHE_FILE)) fs.unlinkSync(ACTIVITY_CACHE_FILE);
  } catch (_) {}
};

export const getActivities = async (req, res) => {
  try {
    const now = Date.now();
    if (cachedActivities && now - lastActivitiesCacheTime < CACHE_TTL_MS) {
      return res.json({ success: true, data: cachedActivities });
    }

    let activities = await Activity.find({ active: true })
      .sort({ order: 1, updatedAt: -1 })
      .lean();

    // Only search Media library if Activity collection has no records
    if ((activities || []).length === 0) {
      const activityMedia = await Media.find(
        {
          status: 'ACTIVE',
          $or: [{ category: 'Activities' }, { page: 'Activities' }],
        },
        { _id: 1, title: 1, section: 1, description: 1, caption: 1, url: 1 }
      )
        .sort({ displayOrder: 1, updatedAt: -1 })
        .lean();

      const existingUrls = new Set((activities || []).map((a) => a.imageUrl));
      const existingTitles = new Set((activities || []).map((a) => (a.title || '').toLowerCase()));

      const extraActivities = (activityMedia || [])
        .filter((m) => !existingUrls.has(m.url) && !existingTitles.has((m.title || '').toLowerCase()))
        .map((m) => ({
          _id: m._id,
          title: m.title,
          category: m.section || 'Activity',
          description: m.description || m.caption || m.title,
          imageUrl: m.url,
          active: true,
        }));

      activities = [...(activities || []), ...extraActivities];
    }

    cachedActivities = activities;
    lastActivitiesCacheTime = now;
    saveDiskCache(activities);

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
      const r2Res = await uploadToR2(req.file.buffer, 'chinmaya/activities', req.file.mimetype, req.file.originalname);
      imageUrl = r2Res.url;
      publicId = r2Res.public_id;
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
    invalidateActivitiesCache();

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
    invalidateActivitiesCache();

    res.json({ success: true, message: 'Activity status toggled', data: activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    invalidateActivitiesCache();

    // Delete the file from R2 (no-op if dev/fallback or already gone)
    if (activity.publicId) {
      await deleteFromR2(activity.publicId);
    }

    try {
      const Media = (await import('../models/Media.js')).default;
      await Media.deleteMany({
        $or: [
          { publicId: activity.publicId },
          { url: activity.imageUrl },
          { title: activity.title },
        ],
      });
    } catch (_) {}

    res.json({ success: true, message: 'Activity deleted permanently' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
