import mongoose from 'mongoose';

const footerSchema = new mongoose.Schema(
  {
    isEnabled: {
      type: Boolean,
      default: true,
    },
    disabledMessage: {
      type: String,
      default: '',
    },
    brand: {
      title: {
        type: String,
        default: 'ANTI-DRUG 2026',
      },
      description: {
        type: String,
        default:
          '"YOUR LIFE. YOUR CHOICE." — A youth-focused anti-drug movement inspiring health, strength, purpose, and clean living across Adoni.',
      },
      logoUrl: {
        type: String,
        default: '',
      },
    },
    organizedBy: {
      heading: {
        type: String,
        default: 'ORGANIZED BY:',
      },
      text: {
        type: String,
        default: 'Chinmaya Mission Adoni & Chinmaya Yuva Kendra Adoni',
      },
    },
    quickNavigation: {
      heading: {
        type: String,
        default: 'QUICK NAVIGATION',
      },
      links: [
        {
          label: { type: String, required: true },
          url: { type: String, required: true },
          openInNewTab: { type: Boolean, default: false },
          enabled: { type: Boolean, default: true },
          displayOrder: { type: Number, default: 0 },
        },
      ],
    },
    contact: {
      heading: {
        type: String,
        default: 'EVENT LOCATION & CONTACT',
      },
      address: {
        line1: { type: String, default: 'Chinmaya Mission Ashrama' },
        line2: { type: String, default: 'Arts College Road' },
        city: { type: String, default: 'Adoni' },
        pincode: { type: String, default: '518301' },
        state: { type: String, default: 'Andhra Pradesh' },
        country: { type: String, default: 'India' },
      },
      phoneNumbers: [{ type: String }],
      emails: [{ type: String }],
      googleMapsUrl: { type: String, default: '' },
      whatsappNumber: { type: String, default: '' },
      websiteUrl: { type: String, default: '' },
    },
    pledge: {
      heading: {
        type: String,
        default: 'THE MARATHON PLEDGE',
      },
      title: {
        type: String,
        default: 'RUN FOR A DRUG-FREE FUTURE',
      },
      description: {
        type: String,
        default:
          '"I pledge to reject bad influences, honor my health, choose good friends, and build a brighter future for myself and Adoni."',
      },
    },
    bottomFooter: {
      copyrightText: {
        type: String,
        default: '© Chinmaya Mission Adoni.',
      },
      privacyPolicy: {
        label: { type: String, default: 'Privacy Policy' },
        url: { type: String, default: '/privacy' },
      },
      termsConditions: {
        label: { type: String, default: 'Terms & Conditions' },
        url: { type: String, default: '/terms' },
      },
    },
    appearance: {
      backgroundColor: { type: String, default: '#0B2340' },
      textColor: { type: String, default: '#CBD5E1' },
      headingColor: { type: String, default: '#FFC107' },
      accentColor: { type: String, default: '#F4511E' },
      dividerColor: { type: String, default: 'rgba(255, 255, 255, 0.1)' },
      cardBackgroundColor: { type: String, default: 'rgba(255, 255, 255, 0.05)' },
      cardBorderColor: { type: String, default: 'rgba(255, 255, 255, 0.1)' },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Footer = mongoose.model('Footer', footerSchema);
export default Footer;
