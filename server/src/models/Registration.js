import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    registrationYear: { type: Number, index: true },
    registrationIndex: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, default: null },
    standard: { type: String, default: null, trim: true }, // e.g. "8th", "9th", "10th"
    profession: { type: String, default: null, trim: true },
    dateOfBirth: { type: Date },
    isStudent: { type: Boolean, default: true },
    institutionName: { type: String, default: 'N/A', trim: true },
    contactNumber: { type: String, required: true, trim: true, index: true },
    tShirtSize: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      required: true,
    },
    registrationType: {
      type: String,
      enum: ['individual', 'school_college', 'FORM', 'SCHOOL_COLLEGE'],
      default: 'individual',
      index: true,
    },
    institutionType: {
      type: String,
      enum: ['SCHOOL', 'COLLEGE', 'OTHER'],
      default: 'OTHER',
    },
    batchId: { type: String, default: null, index: true },
    contactPersonName: { type: String, default: null },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
      index: true,
    },
    googleSheetsSync: {
      status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending',
      },
      syncedAt: { type: Date, default: null },
      error: { type: String, default: null },
    },
  },
  { timestamps: true }
);

// High Performance Compound Indexes for Admin Search, Filter & Pagination
registrationSchema.index({ status: 1, createdAt: -1 });
registrationSchema.index({ registrationType: 1, status: 1, createdAt: -1 });
registrationSchema.index({ institutionName: 1 });
registrationSchema.index({ standard: 1 });
registrationSchema.index({ tShirtSize: 1 });
registrationSchema.index({ registrationYear: 1, registrationType: 1 });

export default mongoose.model('Registration', registrationSchema);
