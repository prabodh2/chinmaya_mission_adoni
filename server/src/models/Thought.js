import mongoose from 'mongoose';

const thoughtSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'Thought content cannot exceed 2,000 characters'],
    },
    color: {
      type: String,
      enum: ['sky', 'yellow', 'coral', 'mint', 'lavender', 'peach', 'cream'],
      default: 'yellow',
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED'],
      default: 'PENDING',
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast querying of approved public thoughts ordered by recency
thoughtSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Thought', thoughtSchema);
