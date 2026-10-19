import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    fullName: { type: String, required: true, trim: true },
    dob: { type: String, required: true, trim: true }, // Stored as YYYY-MM-DD or formatted string
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    interest: { type: String, required: true, trim: true }, // What is your interest in volunteering?
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'APPROVED', 'ARCHIVED'],
      default: 'NEW',
      index: true,
    },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

volunteerSchema.index({ status: 1, createdAt: -1 });
volunteerSchema.index({ createdAt: -1 });

export default mongoose.model('Volunteer', volunteerSchema);
