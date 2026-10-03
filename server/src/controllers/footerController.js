import Footer from '../models/Footer.js';

// Default Footer Configuration Object
export const defaultFooterConfig = {
  isEnabled: true,
  disabledMessage: '',
  brand: {
    title: 'ANTI-DRUG 2026',
    description:
      '"YOUR LIFE. YOUR CHOICE." — A youth-focused anti-drug movement inspiring health, strength, purpose, and clean living across Adoni.',
    logoUrl: '',
  },
  organizedBy: {
    heading: 'ORGANIZED BY:',
    text: 'Chinmaya Mission Adoni & Chinmaya Yuva Kendra Adoni',
  },
  quickNavigation: {
    heading: 'QUICK NAVIGATION',
    links: [
      { label: 'Home', url: '/', openInNewTab: false, enabled: true, displayOrder: 1 },
      { label: 'About Us', url: '/about', openInNewTab: false, enabled: true, displayOrder: 2 },
      { label: 'Activities Gallery', url: '/activities', openInNewTab: false, enabled: true, displayOrder: 3 },
      { label: 'What We Do', url: '/what-we-do', openInNewTab: false, enabled: true, displayOrder: 4 },
      { label: "Let's Connect", url: '/lets-connect', openInNewTab: false, enabled: true, displayOrder: 5 },
      { label: 'Marathon Registration', url: '/register', openInNewTab: false, enabled: true, displayOrder: 6 },
    ],
  },
  contact: {
    heading: 'EVENT LOCATION & CONTACT',
    address: {
      line1: 'Chinmaya Mission Ashrama',
      line2: 'Arts College Road',
      city: 'Adoni',
      pincode: '518301',
      state: 'Andhra Pradesh',
      country: 'India',
    },
    phoneNumbers: ['+91 98765 43210', '+91 85122 34567'],
    emails: ['contact@chinmayamissionadoni.org'],
    googleMapsUrl: '',
    whatsappNumber: '',
    websiteUrl: '',
  },
  pledge: {
    heading: 'THE MARATHON PLEDGE',
    title: 'RUN FOR A DRUG-FREE FUTURE',
    description:
      '"I pledge to reject bad influences, honor my health, choose good friends, and build a brighter future for myself and Adoni."',
  },
  bottomFooter: {
    copyrightText: '© Chinmaya Mission Adoni.',
    privacyPolicy: { label: 'Privacy Policy', url: '/privacy' },
    termsConditions: { label: 'Terms & Conditions', url: '/terms' },
  },
  appearance: {
    backgroundColor: '#0B2340',
    textColor: '#CBD5E1',
    headingColor: '#FFC107',
    accentColor: '#F4511E',
    dividerColor: 'rgba(255, 255, 255, 0.1)',
    cardBackgroundColor: 'rgba(255, 255, 255, 0.05)',
    cardBorderColor: 'rgba(255, 255, 255, 0.1)',
  },
};

// @desc    Get public active footer configuration
// @route   GET /api/footer
// @access  Public
export const getPublicFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne().lean();
    if (!footer) {
      footer = defaultFooterConfig;
    }
    res.json({
      success: true,
      data: footer,
    });
  } catch (error) {
    console.error('[Get Public Footer Error]:', error.message);
    res.json({
      success: true,
      data: defaultFooterConfig,
    });
  }
};

// @desc    Get admin footer configuration
// @route   GET /api/footer/admin
// @access  Private/Admin
export const getAdminFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();
    if (!footer) {
      footer = await Footer.create({
        ...defaultFooterConfig,
        createdBy: req.user?._id,
        updatedBy: req.user?._id,
      });
    }
    res.json({
      success: true,
      data: footer,
    });
  } catch (error) {
    console.error('[Get Admin Footer Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve footer configuration.',
    });
  }
};

// @desc    Create footer configuration
// @route   POST /api/footer/admin
// @access  Private/Admin
export const createFooter = async (req, res) => {
  try {
    let existing = await Footer.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Footer configuration already exists. Use update endpoint.',
      });
    }

    const newFooter = await Footer.create({
      ...defaultFooterConfig,
      ...req.body,
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: 'Footer configuration created successfully.',
      data: newFooter,
    });
  } catch (error) {
    console.error('[Create Footer Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create footer configuration.',
    });
  }
};

// @desc    Update footer configuration
// @route   PUT /api/footer/admin
// @access  Private/Admin
export const updateFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();

    const updateData = {
      ...req.body,
      updatedBy: req.user?._id,
    };

    if (!footer) {
      footer = await Footer.create({
        ...defaultFooterConfig,
        ...updateData,
        createdBy: req.user?._id,
      });
    } else {
      footer = await Footer.findByIdAndUpdate(
        footer._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      message: 'Footer configuration updated successfully.',
      data: footer,
    });
  } catch (error) {
    console.error('[Update Footer Error]:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update footer configuration.',
    });
  }
};

// @desc    Delete footer configuration
// @route   DELETE /api/footer/admin/:id
// @access  Private/Admin
export const deleteFooter = async (req, res) => {
  try {
    const { id } = req.params;
    let footer;
    if (id && id !== 'default') {
      footer = await Footer.findByIdAndDelete(id);
    } else {
      footer = await Footer.findOneAndDelete();
    }

    res.json({
      success: true,
      message: 'Footer configuration deleted successfully.',
    });
  } catch (error) {
    console.error('[Delete Footer Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete footer configuration.',
    });
  }
};
