import Media from '../models/Media.js';
import Banner from '../models/Banner.js';
import Activity from '../models/Activity.js';
import HomePage from '../models/HomePage.js';
import PageContent from '../models/PageContent.js';
import Footer from '../models/Footer.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { seedInitialData } from '../utils/seedData.js';

// @desc    Get paginated media items with search & filtering
// @route   GET /api/media
// @access  Private/Admin
export const getMediaList = async (req, res) => {
  try {
    const totalMedia = await Media.countDocuments();
    if (totalMedia === 0) {
      await seedInitialData();
    }
    const {
      search,
      category,
      pageName,
      status,
      page = 1,
      limit = 24,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    if (status && ['ACTIVE', 'INACTIVE'].includes(status.toUpperCase())) {
      query.status = status.toUpperCase();
    }

    if (category && category !== 'ALL') {
      query.category = category;
    }

    if (pageName && pageName !== 'ALL') {
      query.page = pageName;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { fileName: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
        { altText: searchRegex },
        { tags: searchRegex },
        { page: searchRegex },
        { section: searchRegex },
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 24;
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Media.find(query).sort(sortObj).skip(skip).limit(limitNum).lean(),
      Media.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum) || 1,
          limit: limitNum,
        },
      },
    });
  } catch (err) {
    console.error('[Get Media List Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve media library items',
      errorCode: 'MEDIA_FETCH_ERROR',
    });
  }
};

// @desc    Get single media item by ID
// @route   GET /api/media/:id
// @access  Private/Admin
export const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media asset not found',
        errorCode: 'MEDIA_NOT_FOUND',
      });
    }
    res.json({ success: true, data: media });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Upload new image asset & create media record
// @route   POST /api/media/upload
// @access  Private/Admin
export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded',
        errorCode: 'FILE_MISSING',
      });
    }

    const {
      title = '',
      description = '',
      caption = '',
      altText = 'Anti-Drug Movement Marathon 2026 Asset',
      category = 'Other',
      page = 'General',
      section = 'General',
      tags = '',
      status = 'ACTIVE',
      displayOrder = 0,
      width = 0,
      height = 0,
    } = req.body;

    const folder = `marathon_assets/${category.toLowerCase().replace(/\s+/g, '_')}`;
    const result = await uploadToCloudinary(req.file.buffer, folder, req.file.mimetype);

    const parsedTags = typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : Array.isArray(tags) ? tags : [];

    const originalName = req.file.originalname || 'uploaded_image';
    const cleanFileName = originalName.replace(/[^a-zA-Z0-9_.-]/g, '_');

    const media = new Media({
      fileName: cleanFileName,
      originalFileName: originalName,
      title: title.trim() || cleanFileName,
      description: description.trim(),
      caption: caption.trim(),
      altText: altText.trim() || 'Anti-Drug Movement Marathon 2026 Asset',
      url: result.url,
      thumbnailUrl: result.url,
      publicId: result.public_id,
      mimeType: req.file.mimetype,
      fileSize: req.file.size || req.file.buffer.length,
      width: Number(width) || 0,
      height: Number(height) || 0,
      category,
      page,
      section,
      tags: parsedTags,
      status: ['ACTIVE', 'INACTIVE'].includes(status.toUpperCase()) ? status.toUpperCase() : 'ACTIVE',
      displayOrder: Number(displayOrder) || 0,
      usedIn: [{ page, section, component: 'CMS' }],
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });

    await media.save();

    res.status(201).json({
      success: true,
      message: 'Image uploaded and added to media library successfully',
      data: media,
    });
  } catch (err) {
    console.error('[Upload Media Error]:', err.message);
    res.status(500).json({
      success: false,
      message: err.message || 'Image upload failed',
      errorCode: 'UPLOAD_ERROR',
    });
  }
};

// Helper function to sync media URL & title changes across all CMS collections
export const syncMediaImageToCollections = async (mediaItem, oldUrl) => {
  try {
    if (!mediaItem || !mediaItem.url) return;

    const newUrl = mediaItem.url;
    const publicId = mediaItem.publicId;

    // 1. Sync to Banners
    const bannerQuery = {
      $or: [
        { publicId: publicId },
        { title: mediaItem.title },
      ],
    };
    if (oldUrl) bannerQuery.$or.push({ imageUrl: oldUrl });
    await Banner.updateMany(bannerQuery, { $set: { imageUrl: newUrl } });

    // 2. Sync to Activities
    const activityQuery = {
      $or: [
        { publicId: publicId },
        { title: mediaItem.title },
      ],
    };
    if (oldUrl) activityQuery.$or.push({ imageUrl: oldUrl });
    await Activity.updateMany(activityQuery, { $set: { imageUrl: newUrl } });

    // 3. Sync to HomePage sections & disabled maintenance image
    const homeConfig = await HomePage.findOne();
    if (homeConfig) {
      let updatedHome = false;
      if (oldUrl && homeConfig.disabledImage === oldUrl) {
        homeConfig.disabledImage = newUrl;
        updatedHome = true;
      }
      if (Array.isArray(homeConfig.sections)) {
        homeConfig.sections.forEach((sec) => {
          if (
            (oldUrl && sec.imageUrl === oldUrl) ||
            (sec.title && sec.title.toLowerCase() === (mediaItem.title || '').toLowerCase())
          ) {
            sec.imageUrl = newUrl;
            updatedHome = true;
          }
        });
      }
      if (updatedHome) {
        await homeConfig.save();
      }
    }

    // 4. Sync to PageContent (e.g. About Page)
    const aboutContent = await PageContent.findOne({ sectionKey: 'about_page' });
    if (aboutContent && aboutContent.content) {
      let updatedAbout = false;
      const jsonStr = JSON.stringify(aboutContent.content);
      if (oldUrl && jsonStr.includes(oldUrl)) {
        const replacedStr = jsonStr.replaceAll(oldUrl, newUrl);
        aboutContent.content = JSON.parse(replacedStr);
        updatedAbout = true;
      } else {
        const c = aboutContent.content;
        if (c.hero && mediaItem.section === 'Hero Header') {
          c.hero.imageUrl = newUrl;
          updatedAbout = true;
        }
        if (c.chykSection && mediaItem.category === 'About' && (mediaItem.title || '').includes('CHYK')) {
          c.chykSection.imageUrl = newUrl;
          updatedAbout = true;
        }
        if (c.ourActivities && Array.isArray(c.ourActivities.cards)) {
          c.ourActivities.cards.forEach((card) => {
            if (card.title && mediaItem.title && card.title.toLowerCase().includes(mediaItem.title.toLowerCase())) {
              card.imageUrl = newUrl;
              updatedAbout = true;
            }
          });
        }
      }
      if (updatedAbout) {
        await aboutContent.save();
      }
    }

    // 5. Sync to Footer
    const footerConfig = await Footer.findOne();
    if (footerConfig && oldUrl && footerConfig.logoUrl === oldUrl) {
      footerConfig.logoUrl = newUrl;
      await footerConfig.save();
    }
  } catch (err) {
    console.error('[Sync Media Image Error]:', err.message);
  }
};

// @desc    Update media asset & metadata (With optional image file replacement)
// @route   PUT /api/media/:id
// @access  Private/Admin
export const updateMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media item not found',
        errorCode: 'MEDIA_NOT_FOUND',
      });
    }

    const oldUrl = media.url;

    const {
      title,
      description,
      caption,
      altText,
      category,
      page,
      section,
      tags,
      status,
      displayOrder,
      usedIn,
    } = req.body;

    // Check if a new image file is uploaded with the edit request
    if (req.file) {
      const catName = category || media.category || 'other';
      const folder = `marathon_assets/${catName.toLowerCase().replace(/\s+/g, '_')}`;
      const result = await uploadToCloudinary(req.file.buffer, folder, req.file.mimetype);

      media.url = result.url;
      media.thumbnailUrl = result.url;
      media.publicId = result.public_id;
      media.mimeType = req.file.mimetype;
      media.fileSize = req.file.size || req.file.buffer.length;
      if (req.file.originalname) {
        media.originalFileName = req.file.originalname;
        if (!title && !media.title) {
          media.fileName = req.file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
        }
      }
    }

    if (title !== undefined) media.title = title.trim();
    if (description !== undefined) media.description = description.trim();
    if (caption !== undefined) media.caption = caption.trim();
    if (altText !== undefined) media.altText = altText.trim();
    if (category !== undefined) media.category = category;
    if (page !== undefined) media.page = page;
    if (section !== undefined) media.section = section;
    if (displayOrder !== undefined) media.displayOrder = Number(displayOrder) || 0;
    if (status && ['ACTIVE', 'INACTIVE'].includes(status.toUpperCase())) {
      media.status = status.toUpperCase();
    }

    if (tags !== undefined) {
      media.tags = typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : Array.isArray(tags) ? tags : media.tags;
    }

    if (Array.isArray(usedIn)) {
      media.usedIn = usedIn;
    }

    media.updatedBy = req.user?._id;
    await media.save();

    // Trigger cross-collection image synchronization
    await syncMediaImageToCollections(media, oldUrl);

    res.json({
      success: true,
      message: req.file ? 'Media asset image and metadata updated successfully' : 'Media metadata updated successfully',
      data: media,
    });
  } catch (err) {
    console.error('[Update Media Error]:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Failed to update media item' });
  }
};

// @desc    Replace underlying image file
// @route   PUT /api/media/:id/replace
// @access  Private/Admin
export const replaceMediaFile = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media asset not found',
        errorCode: 'MEDIA_NOT_FOUND',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No new image file uploaded for replacement',
        errorCode: 'FILE_MISSING',
      });
    }

    const oldUrl = media.url;
    const folder = `marathon_assets/${media.category.toLowerCase().replace(/\s+/g, '_')}`;
    const result = await uploadToCloudinary(req.file.buffer, folder, req.file.mimetype);

    media.url = result.url;
    media.thumbnailUrl = result.url;
    media.publicId = result.public_id;
    media.mimeType = req.file.mimetype;
    media.fileSize = req.file.size || req.file.buffer.length;
    media.originalFileName = req.file.originalname || media.originalFileName;
    media.updatedBy = req.user?._id;

    await media.save();

    // Trigger cross-collection image synchronization
    await syncMediaImageToCollections(media, oldUrl);

    res.json({
      success: true,
      message: 'Image asset replaced successfully',
      data: media,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete media asset
// @route   DELETE /api/media/:id
// @access  Private/Admin
export const deleteMedia = async (req, res) => {
  try {
    const { force } = req.query;
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media asset not found',
        errorCode: 'MEDIA_NOT_FOUND',
      });
    }

    // Safety check if image is currently used in CMS sections
    if (media.usedIn && media.usedIn.length > 0 && force !== 'true') {
      const locations = media.usedIn.map((u) => `${u.page} → ${u.section}`).join(', ');
      return res.status(400).json({
        success: false,
        requiresConfirmation: true,
        message: `This image is currently referenced in: ${locations}. Are you sure you want to delete it?`,
        usedIn: media.usedIn,
      });
    }

    await Media.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Media asset deleted successfully',
      data: { id: req.params.id },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get categories & page list for filters
// @route   GET /api/media/categories
// @access  Private/Admin
export const getMediaCategories = async (req, res) => {
  try {
    const categories = ['Home', 'About', 'Activities', 'What We Do', 'Let\'s Connect', 'Marathon', 'Registration', 'Banner', 'Footer', 'Gallery', 'Other'];
    const pages = ['Home', 'About', 'Activities', 'What We Do', 'Let\'s Connect', 'Registration', 'General'];
    
    res.json({
      success: true,
      data: { categories, pages },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
