import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    category: {
      type: String,
      default: 'General Inquiry',
      trim: true,
    },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['NEW', 'READ', 'RESPONDED'], default: 'NEW', index: true },
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);

