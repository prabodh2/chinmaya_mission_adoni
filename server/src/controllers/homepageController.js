import HomePage from '../models/HomePage.js';

const DEFAULT_SECTIONS = [
  {
    sectionId: 'hero-1',
    type: 'hero',
    title: 'ANTI-DRUG MOVEMENT MARATHON RUN 2026',
    subtitle: '"YOUR LIFE. YOUR CHOICE."',
    description: 'Run for a Drug-Free Future • Join Thousands of Youth in Adoni Building Health, Strength & Discipline',
    badgeText: 'CHINMAYA MISSION ADONI & CHYK ADONI',
    primaryButtonText: 'REGISTER NOW',
    primaryButtonLink: '/register',
    secondaryButtonText: 'EXPLORE THE MOVEMENT',
    secondaryButtonLink: '#about',
    imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1600&auto=format&fit=crop',
    isEnabled: true,
    order: 1,
  },
  {
    sectionId: 'marathon-1',
    type: 'marathon',
    title: 'EVENT DETAILS & COUNTDOWN',
    subtitle: 'Sunday, 20 December 2026 • 6:00 AM Onwards',
    description: 'Starting from Chinmaya Mission Adoni, Andhra Pradesh.',
    badgeText: 'EVENT INFORMATION',
    primaryButtonText: 'REGISTER FOR MARATHON',
    primaryButtonLink: '/register',
    isEnabled: true,
    order: 2,
  },
  {
    sectionId: 'activities-1',
    type: 'activities',
    title: 'MOVEMENT ACTIVITIES & HIGHLIGHTS',
    subtitle: 'GALLERY & HIGHLIGHTS',
    description: 'Explore community drives, bootcamps, wellness seminars, and youth initiatives.',
    primaryButtonText: 'VIEW ALL ACTIVITIES',
    primaryButtonLink: '/activities',
    isEnabled: true,
    order: 4,
  },
  {
    sectionId: 'faq-1',
    type: 'faq',
    title: 'FREQUENTLY ASKED QUESTIONS',
    subtitle: 'QUESTIONS & ANSWERS',
    description: 'Everything you need to know about participating, registrations, certificates, and event details.',
    isEnabled: true,
    order: 5,
  },
  {
    sectionId: 'cta-1',
    type: 'cta',
    title: 'BE PART OF THE MOVEMENT IN ADONI!',
    subtitle: 'CHINMAYA MISSION & CHYK ADONI',
    description: 'Register today individually or submit your school/college bulk student details. Receive your official marathon certificate & pass!',
    primaryButtonText: 'MARATHON REGISTRATION',
    primaryButtonLink: '/register',
    isEnabled: true,
    order: 6,
  },
];

const getOrCreateHomePage = async () => {
  let homePage = await HomePage.findOne();
  if (!homePage) {
    homePage = new HomePage({
      isEnabled: true,
      disabledTitle: 'Website Updates In Progress',
      disabledMessage: 'The public homepage is currently undergoing scheduled updates. Please check back soon!',
      disabledImage: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1600&auto=format&fit=crop',
      disabledContactButton: true,
      disabledContactUrl: '/lets-connect',
      theme: {
        primaryColor: '#0B2340',
        secondaryColor: '#FFF0C5',
        accentColor: '#F4511E',
        backgroundColor: '#FFF0C5',
        textColor: '#0B2340',
        buttonColor: '#F4511E',
        buttonHoverColor: '#D84315',
        cardBackgroundColor: '#FFFFFF',
        headingColor: '#0B2340',
      },
      sections: DEFAULT_SECTIONS,
    });
    await homePage.save();
  }
  return homePage;
};

// Get Public Homepage Configuration
export const getPublicHomepage = async (req, res) => {
  try {
    const homePage = await getOrCreateHomePage();

    if (!homePage.isEnabled) {
      return res.json({
        success: true,
        data: {
          isEnabled: false,
          disabledTitle: homePage.disabledTitle,
          disabledMessage: homePage.disabledMessage,
          disabledImage: homePage.disabledImage,
          disabledContactButton: homePage.disabledContactButton,
          disabledContactUrl: homePage.disabledContactUrl,
          theme: homePage.theme,
          sections: [],
        },
      });
    }

    // Filter only enabled sections and sort by order
    const enabledSections = (homePage.sections || [])
      .filter((s) => s.isEnabled)
      .sort((a, b) => a.order - b.order);

    res.json({
      success: true,
      data: {
        isEnabled: true,
        disabledTitle: homePage.disabledTitle,
        disabledMessage: homePage.disabledMessage,
        disabledImage: homePage.disabledImage,
        disabledContactButton: homePage.disabledContactButton,
        disabledContactUrl: homePage.disabledContactUrl,
        theme: homePage.theme,
        sections: enabledSections,
      },
    });
  } catch (err) {
    console.error('[getPublicHomepage Error]:', err);
    res.status(500).json({ success: false, message: 'Server error loading homepage' });
  }
};

// Get Admin Homepage Configuration (Full)
export const getAdminHomepage = async (req, res) => {
  try {
    const homePage = await getOrCreateHomePage();

    // Sort sections by order
    homePage.sections.sort((a, b) => a.order - b.order);

    res.json({
      success: true,
      data: homePage,
    });
  } catch (err) {
    console.error('[getAdminHomepage Error]:', err);
    res.status(500).json({ success: false, message: 'Server error loading admin homepage' });
  }
};

// Full Update Admin Homepage Configuration
export const updateAdminHomepage = async (req, res) => {
  try {
    const { isEnabled, disabledTitle, disabledMessage, disabledImage, disabledContactButton, disabledContactUrl, theme, sections } = req.body;

    let homePage = await HomePage.findOne();
    if (!homePage) {
      homePage = new HomePage();
    }

    if (typeof isEnabled === 'boolean') homePage.isEnabled = isEnabled;
    if (disabledTitle !== undefined) homePage.disabledTitle = disabledTitle;
    if (disabledMessage !== undefined) homePage.disabledMessage = disabledMessage;
    if (disabledImage !== undefined) homePage.disabledImage = disabledImage;
    if (typeof disabledContactButton === 'boolean') homePage.disabledContactButton = disabledContactButton;
    if (disabledContactUrl !== undefined) homePage.disabledContactUrl = disabledContactUrl;

    if (theme) {
      homePage.theme = { ...homePage.theme.toObject(), ...theme };
    }

    if (Array.isArray(sections)) {
      homePage.sections = sections;
    }

    await homePage.save();

    res.json({
      success: true,
      message: 'Homepage configuration updated successfully',
      data: homePage,
    });
  } catch (err) {
    console.error('[updateAdminHomepage Error]:', err);
    res.status(500).json({ success: false, message: 'Server error updating homepage' });
  }
};

// Add New Section
export const addSection = async (req, res) => {
  try {
    const sectionData = req.body;
    let homePage = await HomePage.findOne();
    if (!homePage) {
      homePage = new HomePage();
    }

    const newSectionId = sectionData.sectionId || `section-${Date.now()}`;
    const nextOrder = homePage.sections.length > 0 ? Math.max(...homePage.sections.map((s) => s.order || 0)) + 1 : 1;

    const newSection = {
      sectionId: newSectionId,
      type: sectionData.type || 'custom',
      title: sectionData.title || 'New Section',
      subtitle: sectionData.subtitle || '',
      description: sectionData.description || '',
      imageUrl: sectionData.imageUrl || '',
      badgeText: sectionData.badgeText || '',
      primaryButtonText: sectionData.primaryButtonText || '',
      primaryButtonLink: sectionData.primaryButtonLink || '',
      secondaryButtonText: sectionData.secondaryButtonText || '',
      secondaryButtonLink: sectionData.secondaryButtonLink || '',
      isEnabled: typeof sectionData.isEnabled === 'boolean' ? sectionData.isEnabled : true,
      order: sectionData.order || nextOrder,
      settings: sectionData.settings || {},
    };

    homePage.sections.push(newSection);
    await homePage.save();

    res.json({
      success: true,
      message: 'Section added successfully',
      data: homePage,
    });
  } catch (err) {
    console.error('[addSection Error]:', err);
    res.status(500).json({ success: false, message: 'Server error adding section' });
  }
};

// Update Section
export const updateSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const updateData = req.body;

    const homePage = await HomePage.findOne();
    if (!homePage) {
      return res.status(404).json({ success: false, message: 'Homepage not found' });
    }

    const sectionIndex = homePage.sections.findIndex((s) => s.sectionId === sectionId || s._id?.toString() === sectionId);
    if (sectionIndex === -1) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    homePage.sections[sectionIndex] = {
      ...homePage.sections[sectionIndex].toObject(),
      ...updateData,
    };

    await homePage.save();

    res.json({
      success: true,
      message: 'Section updated successfully',
      data: homePage,
    });
  } catch (err) {
    console.error('[updateSection Error]:', err);
    res.status(500).json({ success: false, message: 'Server error updating section' });
  }
};

// Delete Section
export const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const homePage = await HomePage.findOne();
    if (!homePage) {
      return res.status(404).json({ success: false, message: 'Homepage not found' });
    }

    homePage.sections = homePage.sections.filter((s) => s.sectionId !== sectionId && s._id?.toString() !== sectionId);
    await homePage.save();

    res.json({
      success: true,
      message: 'Section deleted successfully',
      data: homePage,
    });
  } catch (err) {
    console.error('[deleteSection Error]:', err);
    res.status(500).json({ success: false, message: 'Server error deleting section' });
  }
};

// Reorder Sections
export const reorderSections = async (req, res) => {
  try {
    const { orders } = req.body; // [{ sectionId: 'hero-1', order: 1 }, ...]
    if (!Array.isArray(orders)) {
      return res.status(400).json({ success: false, message: 'Invalid section order payload' });
    }

    const homePage = await HomePage.findOne();
    if (!homePage) {
      return res.status(404).json({ success: false, message: 'Homepage not found' });
    }

    const orderMap = new Map(orders.map((item) => [item.sectionId, item.order]));

    homePage.sections.forEach((sec) => {
      if (orderMap.has(sec.sectionId)) {
        sec.order = orderMap.get(sec.sectionId);
      }
    });

    homePage.sections.sort((a, b) => a.order - b.order);
    await homePage.save();

    res.json({
      success: true,
      message: 'Sections reordered successfully',
      data: homePage,
    });
  } catch (err) {
    console.error('[reorderSections Error]:', err);
    res.status(500).json({ success: false, message: 'Server error reordering sections' });
  }
};

// Toggle Global Homepage Status
export const toggleStatus = async (req, res) => {
  try {
    const { isEnabled } = req.body;
    const homePage = await HomePage.findOne();
    if (!homePage) {
      return res.status(404).json({ success: false, message: 'Homepage not found' });
    }

    homePage.isEnabled = typeof isEnabled === 'boolean' ? isEnabled : !homePage.isEnabled;
    await homePage.save();

    res.json({
      success: true,
      message: `Homepage status updated to ${homePage.isEnabled ? 'ON' : 'OFF'}`,
      data: homePage,
    });
  } catch (err) {
    console.error('[toggleStatus Error]:', err);
    res.status(500).json({ success: false, message: 'Server error toggling homepage status' });
  }
};

// Update Theme Colors
export const updateTheme = async (req, res) => {
  try {
    const themeData = req.body;
    const homePage = await HomePage.findOne();
    if (!homePage) {
      return res.status(404).json({ success: false, message: 'Homepage not found' });
    }

    homePage.theme = {
      ...homePage.theme.toObject(),
      ...themeData,
    };

    await homePage.save();

    res.json({
      success: true,
      message: 'Theme colors updated successfully',
      data: homePage,
    });
  } catch (err) {
    console.error('[updateTheme Error]:', err);
    res.status(500).json({ success: false, message: 'Server error updating theme' });
  }
};
