import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    originalFileName: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    caption: {
      type: String,
      default: '',
      trim: true,
    },
    altText: {
      type: String,
      required: true,
      default: 'Anti-Drug Movement Marathon 2026 Asset',
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    publicId: {
      type: String,
      required: true,
      index: true,
    },
    mimeType: {
      type: String,
      default: 'image/jpeg',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: ['Home', 'About', 'Activities', 'What We Do', 'Let\'s Connect', 'Marathon', 'Registration', 'Banner', 'Footer', 'Gallery', 'Other'],
      default: 'Other',
      index: true,
    },
    page: {
      type: String,
      default: 'General',
      index: true,
    },
    section: {
      type: String,
      default: 'General',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    usedIn: [
      {
        page: { type: String, default: 'General' },
        section: { type: String, default: 'General' },
        component: { type: String, default: 'CMS' },
      },
    ],
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

// High-performance indexing for admin media library filtering & searching
mediaSchema.index({ category: 1, status: 1, createdAt: -1 });
mediaSchema.index({ page: 1, section: 1 });

export default mongoose.model('Media', mediaSchema);
