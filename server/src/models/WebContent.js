import mongoose from 'mongoose';

const contentFieldSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'textarea', 'richtext', 'image', 'link', 'number', 'boolean'],
      default: 'text',
    },
    value: { type: mongoose.Schema.Types.Mixed, default: '' },
    placeholder: { type: String, default: '' },
    helpText: { type: String, default: '' },
  },
  { _id: true }
);

const repeatedItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    imageAlt: { type: String, default: '' },
    linkUrl: { type: String, default: '' },
    linkLabel: { type: String, default: '' },
    badge: { type: String, default: '' },
    dateOrYear: { type: String, default: '' },
    order: { type: Number, default: 0 },
    extraFields: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: true }
);

const contentSectionSchema = new mongoose.Schema(
  {
    sectionId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true },
    fields: [contentFieldSchema],
    items: [repeatedItemSchema],
  },
  { _id: true }
);

const webContentSchema = new mongoose.Schema(
  {
    website: {
      type: String,
      required: true,
      enum: ['chinmaya', 'marathon'],
      index: true,
    },
    pageSlug: {
      type: String,
      required: true,
      index: true,
    },
    pageTitle: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    isSystemPage: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['PUBLISHED', 'DRAFT'],
      default: 'PUBLISHED',
      index: true,
    },
    sections: [contentSectionSchema],
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: { type: String, default: '' },
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Compound unique index guaranteeing strict website isolation
webContentSchema.index({ website: 1, pageSlug: 1 }, { unique: true });

export default mongoose.model('WebContent', webContentSchema);
