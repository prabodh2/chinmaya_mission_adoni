import mongoose from 'mongoose';

/**
 * RegistrationCounter Model
 * 
 * Maintains separate atomic counters for each combination of:
 * - year (e.g., 2026, 2027)
 * - type ('individual' or 'school_college')
 * 
 * Uses MongoDB's findOneAndUpdate with $inc for atomic, race-condition-safe
 * counter increments. Deleted registration IDs are never reused.
 */
const registrationCounterSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    type: {
      type: String,
      required: true,
      enum: ['individual', 'school_college'],
    },
    lastIndex: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// Compound unique index ensures one counter per year+type combination
registrationCounterSchema.index({ year: 1, type: 1 }, { unique: true });

export default mongoose.model('RegistrationCounter', registrationCounterSchema);
