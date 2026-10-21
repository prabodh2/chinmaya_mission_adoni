import Banner from '../models/Banner.js';
import Media from '../models/Media.js';
import { uploadToR2, deleteFromR2 } from '../config/r2.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BANNER_CACHE_FILE = path.join(__dirname, '../../cache/active_banners.json');

const loadDiskCache = () => {
  try {
    if (fs.existsSync(BANNER_CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(BANNER_CACHE_FILE, 'utf8'));
    }
  } catch (_) {}
  return null;
};

const saveDiskCache = (data) => {
  try {
    const dir = path.dirname(BANNER_CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(BANNER_CACHE_FILE, JSON.stringify(data), 'utf8');
  } catch (_) {}
};

let cachedActiveBanners = loadDiskCache();
let lastBannersCacheTime = cachedActiveBanners ? Date.now() : 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

export const invalidateBannersCache = () => {
  cachedActiveBanners = null;
  lastBannersCacheTime = 0;
  try {
    if (fs.existsSync(BANNER_CACHE_FILE)) fs.unlinkSync(BANNER_CACHE_FILE);
  } catch (_) {}
};

export const getActiveBanners = async (req, res) => {
  try {
    const now = Date.now();
    if (cachedActiveBanners && now - lastBannersCacheTime < CACHE_TTL_MS) {
      return res.json({
        success: true,
        data: cachedActiveBanners,
      });
    }

    const horizontalBanner = await Banner.findOne({ bannerType: 'HORIZONTAL', active: true })
      .sort({ updatedAt: -1 })
      .lean();

    let verticalBanners = await Banner.find({ bannerType: 'VERTICAL', active: true })
      .sort({ order: 1, updatedAt: -1 })
      .lean();

    // Filter out any seed vertical posters if any exist
    verticalBanners = (verticalBanners || []).filter((b) => !/^Vertical Poster/i.test(b.title));

    // If banners are already present in Banner collection, skip scanning large base64 Media collection
    if (verticalBanners.length === 0) {
      const carouselMedia = await Media.find(
        { status: 'ACTIVE', section: 'Vertical Poster Carousel' },
        { _id: 1, title: 1, url: 1, caption: 1, category: 1 }
      )
        .sort({ displayOrder: 1, updatedAt: -1 })
        .lean();

      const existingUrls = new Set(verticalBanners.map((b) => b.imageUrl));
      const extraBanners = (carouselMedia || [])
        .filter((m) => !existingUrls.has(m.url) && !/^Vertical Poster/i.test(m.title))
        .map((m) => ({
          _id: m._id,
          title: m.title,
          imageUrl: m.url,
          tag: m.caption || m.category || '',
          active: true,
        }));

      verticalBanners = [...verticalBanners, ...extraBanners];
    }

    const result = {
      horizontal: horizontalBanner || null,
      vertical: verticalBanners,
    };

    cachedActiveBanners = result;
    lastBannersCacheTime = now;
    saveDiskCache(result);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllBannersAdmin = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ bannerType: 1, order: 1, createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    const { title, bannerType, order } = req.body;
    if (!bannerType || !['HORIZONTAL', 'VERTICAL'].includes(bannerType)) {
      return res.status(400).json({ success: false, message: 'Banner type must be HORIZONTAL or VERTICAL' });
    }

    // Upload to Cloudflare R2
    const r2Res = await uploadToR2(
      req.file.buffer,
      `chinmaya/banners/${bannerType.toLowerCase()}`,
      req.file.mimetype,
      req.file.originalname
    );

    if (bannerType === 'HORIZONTAL') {
      // Deactivate existing horizontal banners if uploading a new active one
      await Banner.updateMany({ bannerType: 'HORIZONTAL' }, { active: false });
    }

    const banner = new Banner({
      title: title || `${bannerType} Banner ${Date.now()}`,
      imageUrl: r2Res.url,
      publicId: r2Res.public_id,
      bannerType,
      order: order ? Number(order) : 1,
      active: true,
    });

    await banner.save();
    invalidateBannersCache();

    res.status(201).json({
      success: true,
      message: `${bannerType} Banner uploaded successfully`,
      data: banner,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Banner upload failed' });
  }
};

export const toggleBannerStatus = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

    if (banner.bannerType === 'HORIZONTAL' && !banner.active) {
      // Ensure only 1 active horizontal banner
      await Banner.updateMany({ bannerType: 'HORIZONTAL' }, { active: false });
    }

    banner.active = !banner.active;
    await banner.save();
    invalidateBannersCache();

    res.json({ success: true, message: 'Banner status updated', data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

    // Delete underlying R2 object
    if (banner.publicId) {
      await deleteFromR2(banner.publicId);
    }

    invalidateBannersCache();
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
