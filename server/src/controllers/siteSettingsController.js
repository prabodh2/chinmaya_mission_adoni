import SiteSettings from '../models/SiteSettings.js';

/**
 * Helper to ensure a global site settings document exists.
 */
const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne({ key: 'global' });
  if (!settings) {
    settings = await SiteSettings.create({
      key: 'global',
      isLive: false, // Default is false (Coming Soon mode)
    });
  }
  return settings;
};

/**
 * GET /api/site-settings (and /api/site-status)
 * Public endpoint returning ONLY isLive status.
 */
export const getSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    return res.status(200).json({
      success: true,
      isLive: Boolean(settings.isLive),
    });
  } catch (error) {
    console.error('[SiteSettings] Error fetching settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve site settings',
      error: error.message,
    });
  }
};

/**
 * PUT /api/site-settings (and POST /api/site-settings)
 * Update ONLY isLive (true or false).
 */
export const updateSiteSettings = async (req, res) => {
  try {
    const { isLive } = req.body;

    let settings = await getOrCreateSettings();

    if (typeof isLive === 'boolean' || isLive === 'true' || isLive === 'false') {
      settings.isLive = isLive === true || isLive === 'true';
    }

    await settings.save();

    console.log(`[SiteSettings] isLive updated to: ${settings.isLive}`);

    return res.status(200).json({
      success: true,
      message: `Site status updated. isLive is now ${settings.isLive}`,
      isLive: settings.isLive,
    });
  } catch (error) {
    console.error('[SiteSettings] Error updating settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update site settings',
      error: error.message,
    });
  }
};

/**
 * POST /api/site-settings/toggle
 * Toggle isLive between true and false.
 */
export const toggleSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    settings.isLive = !settings.isLive;
    await settings.save();

    console.log(`[SiteSettings] isLive toggled to: ${settings.isLive}`);

    return res.status(200).json({
      success: true,
      message: `Toggled site status. isLive is now ${settings.isLive}`,
      isLive: settings.isLive,
    });
  } catch (error) {
    console.error('[SiteSettings] Error toggling settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle site settings',
      error: error.message,
    });
  }
};
