import Banner from '../models/Banner.js';
import Media from '../models/Media.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

export const getActiveBanners = async (req, res) => {
  try {
    const horizontalBanner = await Banner.findOne({ bannerType: 'HORIZONTAL', active: true }).sort({ updatedAt: -1 });
    let verticalBanners = await Banner.find({ bannerType: 'VERTICAL', active: true }).sort({ order: 1, updatedAt: -1 });

    // Filter out any seed vertical posters if any exist
    verticalBanners = verticalBanners.filter((b) => !/^Vertical Poster/i.test(b.title));

    // Also include any active media items strictly tagged for Vertical Poster Carousel that aren't in banners yet
    const carouselMedia = await Media.find({
      status: 'ACTIVE',
      section: 'Vertical Poster Carousel',
    }).sort({ displayOrder: 1, updatedAt: -1 });

    const existingUrls = new Set(verticalBanners.map((b) => b.imageUrl));
    const extraBanners = carouselMedia
      .filter((m) => !existingUrls.has(m.url) && !/^Vertical Poster/i.test(m.title))
      .map((m) => ({
        _id: m._id,
        title: m.title,
        imageUrl: m.url,
        tag: m.caption || m.category || '',
        active: true,
      }));

    verticalBanners = [...verticalBanners, ...extraBanners];

    res.json({
      success: true,
      data: {
        horizontal: horizontalBanner,
        vertical: verticalBanners,
      },
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

    // Upload to Cloudinary / Data URI
    const cloudRes = await uploadToCloudinary(
      req.file.buffer,
      `marathon_banners/${bannerType.toLowerCase()}`,
      req.file.mimetype
    );

    if (bannerType === 'HORIZONTAL') {
      // Deactivate existing horizontal banners if uploading a new active one
      await Banner.updateMany({ bannerType: 'HORIZONTAL' }, { active: false });
    }

    const banner = new Banner({
      title: title || `${bannerType} Banner ${Date.now()}`,
      imageUrl: cloudRes.url,
      publicId: cloudRes.public_id,
      bannerType,
      order: order ? Number(order) : 1,
      active: true,
    });

    await banner.save();

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

    res.json({ success: true, message: 'Banner status updated', data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
