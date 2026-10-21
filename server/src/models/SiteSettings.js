import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'global',
      unique: true,
      index: true,
    },
    // Only property: true = Live site | false = Coming Soon mode
    isLive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
