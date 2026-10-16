import WebContent from '../models/WebContent.js';
import { DEFAULT_WEBSITE_PAGES } from '../utils/webContentSeedData.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

/**
 * Helper to auto-seed default pages for a website if none exist
 */
const ensureSeedPagesForWebsite = async (website) => {
  const existingCount = await WebContent.countDocuments({ website });
  if (existingCount > 0) return;

  const seedPages = DEFAULT_WEBSITE_PAGES[website];
  if (!seedPages || seedPages.length === 0) return;

  try {
    for (const page of seedPages) {
      await WebContent.findOneAndUpdate(
        { website: page.website, pageSlug: page.pageSlug },
        { $setOnInsert: page },
        { upsert: true, new: true }
      );
    }
    console.log(`[WebContent] Auto-seeded default pages for website: '${website}'`);
  } catch (err) {
    console.error(`[WebContent] Seed error for website ${website}:`, err.message);
  }
};

/**
 * Helper: converts sections array into a convenient dictionary map for public frontends
 */
export const buildFieldsMap = (sections = []) => {
  const map = {};
  sections.forEach((sec) => {
    if (!sec || !sec.sectionId) return;
    map[sec.sectionId] = {
      _name: sec.name,
      _isEnabled: sec.isEnabled !== false,
      items: sec.items || [],
    };
    if (Array.isArray(sec.fields)) {
      sec.fields.forEach((f) => {
        if (f && f.key) {
          map[sec.sectionId][f.key] = f.value;
        }
      });
    }
  });
  return map;
};

// @desc    Get supported websites list
// @route   GET /api/admin/content/websites
// @access  Private/Admin
export const getWebsites = async (req, res) => {
  try {
    const websites = [
      {
        id: 'chinmaya',
        name: 'Chinmaya Mission Website',
        domain: 'chinmayamissionadoni.org',
        url: 'http://localhost:5176',
        description: 'Main spiritual, cultural, and community website for Chinmaya Mission & CHYK, Adoni.',
      },
      {
        id: 'marathon',
        name: 'Marathon Website',
        domain: 'marathon.chinmayamissionadoni.org',
        url: 'http://localhost:5175',
        description: 'Official portal for Anti-Drug Movement Marathon Run 2026, passes & registrations.',
      },
    ];

    res.json({ success: true, data: websites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get pages for a given website
// @route   GET /api/admin/content/pages?website=chinmaya
// @access  Private/Admin
export const getPagesByWebsite = async (req, res) => {
  try {
    const { website } = req.query;
    if (!website || !['chinmaya', 'marathon'].includes(website)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing 'website' parameter. Must be 'chinmaya' or 'marathon'.",
      });
    }

    // Ensure seed pages exist
    await ensureSeedPagesForWebsite(website);

    const pages = await WebContent.find({ website })
      .select('pageSlug pageTitle route isSystemPage status sections seo updatedAt createdAt')
      .sort({ isSystemPage: -1, createdAt: 1 })
      .lean();

    const transformed = pages.map((p) => ({
      _id: p._id,
      website: p.website,
      pageSlug: p.pageSlug,
      pageTitle: p.pageTitle,
      route: p.route,
      isSystemPage: p.isSystemPage,
      status: p.status,
      sectionCount: p.sections?.length || 0,
      fieldCount: (p.sections || []).reduce((acc, s) => acc + (s.fields?.length || 0) + (s.items?.length || 0), 0),
      seo: p.seo,
      updatedAt: p.updatedAt,
    }));

    res.json({ success: true, data: transformed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get full page details by ID
// @route   GET /api/admin/content/pages/:id
// @access  Private/Admin
export const getPageById = async (req, res) => {
  try {
    const page = await WebContent.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page content not found' });
    }
    res.json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new dynamic content page
// @route   POST /api/admin/content/pages
// @access  Private/Admin
export const createPage = async (req, res) => {
  try {
    const { website, pageSlug, pageTitle, route, sections = [], seo = {} } = req.body;

    if (!website || !['chinmaya', 'marathon'].includes(website)) {
      return res.status(400).json({ success: false, message: "Valid 'website' is required ('chinmaya' or 'marathon')." });
    }

    if (!pageTitle || !pageTitle.trim()) {
      return res.status(400).json({ success: false, message: 'Page title is required.' });
    }

    const cleanSlug = (pageSlug || pageTitle)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const cleanRoute = (route || `/${cleanSlug}`).trim();

    // Check duplicate slug within same website
    const existing = await WebContent.findOne({ website, pageSlug: cleanSlug });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A page with slug '${cleanSlug}' already exists on ${website === 'chinmaya' ? 'Chinmaya Mission' : 'Marathon'} website.`,
      });
    }

    const newPage = new WebContent({
      website,
      pageSlug: cleanSlug,
      pageTitle: pageTitle.trim(),
      route: cleanRoute,
      isSystemPage: false,
      status: 'PUBLISHED',
      sections,
      seo,
      lastUpdatedBy: req.user?._id,
    });

    await newPage.save();

    res.status(201).json({
      success: true,
      message: `Page '${newPage.pageTitle}' created successfully`,
      data: newPage,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update page content, sections, fields, items
// @route   PUT /api/admin/content/pages/:id
// @access  Private/Admin
export const updatePage = async (req, res) => {
  try {
    const { pageTitle, route, status, sections, seo } = req.body;

    const page = await WebContent.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page content not found' });
    }

    if (pageTitle && pageTitle.trim()) page.pageTitle = pageTitle.trim();
    if (route && route.trim()) page.route = route.trim();
    if (status && ['PUBLISHED', 'DRAFT'].includes(status)) page.status = status;
    if (Array.isArray(sections)) page.sections = sections;
    if (seo && typeof seo === 'object') page.seo = seo;
    page.lastUpdatedBy = req.user?._id;

    await page.save();

    res.json({
      success: true,
      message: `Content for '${page.pageTitle}' saved and published successfully`,
      data: page,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete custom page
// @route   DELETE /api/admin/content/pages/:id
// @access  Private/Admin
export const deletePage = async (req, res) => {
  try {
    const page = await WebContent.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    if (page.isSystemPage) {
      return res.status(403).json({
        success: false,
        message: `Core system page '${page.pageTitle}' is protected and cannot be deleted. You may edit its content or mark it as DRAFT.`,
      });
    }

    await WebContent.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Page '${page.pageTitle}' deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Upload image for a page section
// @route   POST /api/admin/content/pages/:id/images
// @access  Private/Admin
export const uploadPageImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
    }

    const { folder = 'website_cms' } = req.body;
    const result = await uploadToCloudinary(req.file.buffer, folder, req.file.mimetype);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.url,
        publicId: result.public_id,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      },
    });
  } catch (err) {
    console.error('[Upload Page Image Error]:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Image upload failed' });
  }
};

// @desc    Public API to fetch published page content for public websites
// @route   GET /api/content/website/:website/page/:pageSlug
// @access  Public
export const getPublicWebContent = async (req, res) => {
  try {
    const { website, pageSlug } = req.params;

    let page = await WebContent.findOne({ website, pageSlug, status: 'PUBLISHED' }).lean();

    // If not found in DB, check if it exists in seed data and seed it immediately
    if (!page) {
      await ensureSeedPagesForWebsite(website);
      page = await WebContent.findOne({ website, pageSlug }).lean();
    }

    if (!page) {
      return res.status(404).json({
        success: false,
        message: `Page '${pageSlug}' not found on website '${website}'`,
      });
    }

    const fieldsMap = buildFieldsMap(page.sections);

    res.json({
      success: true,
      data: {
        _id: page._id,
        website: page.website,
        pageSlug: page.pageSlug,
        pageTitle: page.pageTitle,
        route: page.route,
        seo: page.seo,
        sections: page.sections,
        fieldsMap,
        updatedAt: page.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
