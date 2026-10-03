import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'Marathon Training',
        'Awareness Campaign',
        'Youth Program',
        'Fitness & Wellness',
        'Community Event',
        'School Drive',
      ],
      required: true,
    },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
