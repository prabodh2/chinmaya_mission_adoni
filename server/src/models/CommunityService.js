import mongoose from 'mongoose';

const communityServiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Teaching & Education',
        'Volunteering & Event Support',
        'Fitness & Yoga',
        'Photography & Media',
        'Technical & IT Support',
        'Professional & Career Guidance',
        'Community & Elder Care',
        'Other',
      ],
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    skills: {
      type: String,
      trim: true,
      default: '',
    },
    availability: {
      type: String,
      trim: true,
      default: 'Flexible / On-demand',
    },
    location: {
      type: String,
      trim: true,
      default: 'Adoni, Andhra Pradesh',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PAUSED', 'CLOSED'],
      default: 'ACTIVE',
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true, // Published immediately per prompt requirement
      index: true,
    },
  },
  { timestamps: true }
);

communityServiceSchema.index({ category: 1, isPublished: 1, createdAt: -1 });

export default mongoose.model('CommunityService', communityServiceSchema);
