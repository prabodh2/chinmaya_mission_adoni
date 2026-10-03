import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['NEW', 'READ', 'RESPONDED'], default: 'NEW' },
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);
