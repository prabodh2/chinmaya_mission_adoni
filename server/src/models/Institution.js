import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: ['SCHOOL', 'COLLEGE'], default: 'SCHOOL' },
    city: { type: String, default: 'Adoni' },
  },
  { timestamps: true }
);

export default mongoose.model('Institution', institutionSchema);
