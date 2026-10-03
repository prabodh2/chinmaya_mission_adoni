import mongoose from 'mongoose';

const homePageSectionSchema = new mongoose.Schema(
  {
    sectionId: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['hero', 'marathon', 'about', 'pillars', 'activities', 'faq', 'cta', 'contact', 'text', 'custom'],
      default: 'custom',
    },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    badgeText: { type: String, default: '' },
    primaryButtonText: { type: String, default: '' },
    primaryButtonLink: { type: String, default: '' },
    secondaryButtonText: { type: String, default: '' },
    secondaryButtonLink: { type: String, default: '' },
    isEnabled: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: true, timestamps: true }
);

const homePageSchema = new mongoose.Schema(
  {
    isEnabled: { type: Boolean, default: true },
    disabledTitle: { type: String, default: 'Website Updates In Progress' },
    disabledMessage: { type: String, default: 'The public homepage is currently undergoing scheduled updates. Please check back soon!' },
    disabledImage: { type: String, default: '' },
    disabledContactButton: { type: Boolean, default: true },
    disabledContactUrl: { type: String, default: '/lets-connect' },
    theme: {
      primaryColor: { type: String, default: '#0B2340' },
      secondaryColor: { type: String, default: '#FFF8EC' },
      accentColor: { type: String, default: '#F4511E' },
      backgroundColor: { type: String, default: '#FFF8EC' },
      textColor: { type: String, default: '#0B2340' },
      buttonColor: { type: String, default: '#F4511E' },
      buttonHoverColor: { type: String, default: '#D84315' },
      cardBackgroundColor: { type: String, default: '#FFFFFF' },
      headingColor: { type: String, default: '#0B2340' },
    },
    sections: [homePageSectionSchema],
  },
  { timestamps: true }
);

export default mongoose.model('HomePage', homePageSchema);
