import WebContent from '../models/WebContent.js';
import { DEFAULT_WEBSITE_PAGES } from '../utils/webContentSeedData.js';
import { uploadToR2 } from '../config/r2.js';

/**
 * Helper to auto-seed default pages for a website if none exist
 */
const ensureSeedPagesForWebsite = async (website) => {
  const seedPages = DEFAULT_WEBSITE_PAGES[website];
  if (!seedPages || seedPages.length === 0) return;

  try {
    for (const seedPage of seedPages) {
      const existing = await WebContent.findOne({ website, pageSlug: seedPage.pageSlug });
      if (!existing) {
        await WebContent.create(seedPage);
        console.log(`[WebContent] Created default page '${seedPage.pageSlug}' for website '${website}'`);
      } else if (existing.isSystemPage) {
        // Check if any default section is missing from the existing page
        let modified = false;
        const existingSectionIds = new Set((existing.sections || []).map((s) => s.sectionId));
        for (const defaultSec of seedPage.sections || []) {
          if (!existingSectionIds.has(defaultSec.sectionId)) {
            existing.sections.push(defaultSec);
            modified = true;
          }
        }
        if (modified) {
          await existing.save();
          console.log(`[WebContent] Synced new sections into existing '${seedPage.pageSlug}' for website '${website}'`);
        }
      }
    }
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

    // Automatically exclude marathon items from upcoming_events and ensure festival images
    const rawItems = sec.items || [];
    const filteredItems = sec.sectionId === 'upcoming_events'
      ? rawItems
          .filter(
            (item) =>
              item &&
              item.itemId !== 'event-marathon' &&
              !item.title?.toLowerCase().includes('marathon')
          )
          .map((item) => {
            const copy = typeof item?.toObject === 'function' ? item.toObject() : { ...(item || {}) };
            const titleLower = (copy.title || '').toLowerCase();
            if (titleLower.includes('rama navami')) {
              if (!copy.imageUrl || copy.imageUrl.includes('rama-navami-procession')) {
                copy.imageUrl = '/assets/rama-navami.jpg';
              }
            } else if (titleLower.includes('hanuman')) {
              if (!copy.imageUrl) {
                copy.imageUrl = '/assets/hanuman-jayanthi.png';
              }
            } else if (titleLower.includes('krishna')) {
              if (!copy.imageUrl) {
                copy.imageUrl = '/assets/krishna-janmashtami.jpg';
              }
            }
            return copy;
          })
      : rawItems;

    map[sec.sectionId] = {
      _name: sec.name,
      _isEnabled: sec.isEnabled !== false,
      items: filteredItems,
    };

    if (Array.isArray(sec.fields)) {
      sec.fields.forEach((f) => {
        if (f && f.key) {
          let val = f.value;
          // Cleanse hero portrait so obsolete cutouts or huge base64 strings don't override the canonical image
          if (sec.sectionId === 'hero' && f.key === 'portraitImage') {
            if (
              !val ||
              typeof val !== 'string' ||
              val.startsWith('data:') ||
              val.includes('cutout') ||
              val.includes('natural') ||
              val.includes('suitable-bg') ||
              !val.startsWith('http')
            ) {
              val = '/assets/swami-chinmayananda-himalaya-sunrise.jpg';
            }
          }
          // Ensure contact_info heading is always Let's Connect With
          if (sec.sectionId === 'contact_info' && f.key === 'heading') {
            if (typeof val === 'string' && val.toLowerCase().includes('us')) {
              val = "Let's Connect With";
            }
          }
          map[sec.sectionId][f.key] = val;
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

    const { folder = 'chinmaya/website_cms' } = req.body;
    const result = await uploadToR2(req.file.buffer, folder, req.file.mimetype, req.file.originalname);

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
