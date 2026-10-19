import mongoose from 'mongoose';

const sevaBookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    bookingType: {
      type: String,
      enum: ['SEVA_BOOKING', 'DEVOTEE_CONTRIBUTION'],
      default: 'SEVA_BOOKING',
      index: true,
    },
    templeName: {
      type: String,
      trim: true,
      default: 'Chinmaya Sanjeevaraya Temple',
    },
    sevaName: {
      type: String,
      required: true,
      trim: true,
    },
    serviceCategory: {
      type: String,
      trim: true,
      default: '',
    },
    pujaType: {
      type: String,
      trim: true,
      default: 'general',
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    devoteeName: {
      type: String,
      required: true,
      trim: true,
    },
    gotram: {
      type: String,
      trim: true,
      default: '',
    },
    nakshatra: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    date: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    utrId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    screenshotName: {
      type: String,
      trim: true,
      default: '',
    },
    screenshotUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'Payment Proof Submitted (Verification Pending)',
        'CONFIRMED',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'Payment Proof Submitted (Verification Pending)',
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// High-performance compound indexes for search and filtering
sevaBookingSchema.index({ status: 1, createdAt: -1 });
sevaBookingSchema.index({ bookingType: 1, status: 1, createdAt: -1 });
sevaBookingSchema.index({ phone: 1, createdAt: -1 });

export default mongoose.model('SevaBooking', sevaBookingSchema);
