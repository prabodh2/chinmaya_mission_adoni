import mongoose from 'mongoose';

const eventConfigSchema = new mongoose.Schema(
  {
    programName: { type: String, default: 'ANTI-DRUG MOVEMENT MARATHON RUN 2026' },
    slogan: { type: String, default: 'WE RISE. WE RUN. WE RESIST.' },
    subSlogan: { type: String, default: 'RUN FOR LIFE. STAND AGAINST DRUGS' },
    location: { type: String, default: 'Adoni, Andhra Pradesh, India' },
    venue: { type: String, default: 'Chinmaya Mission, Adoni' },
    eventDate: { type: Date, default: new Date('2026-12-20T06:00:00.000+05:30') },
    eventTime: { type: String, default: '6:00 AM onwards' },
    organizers: {
      type: [String],
      default: ['Chinmaya Mission, Adoni', 'Chinmaya Yuva Kendra, Adoni'],
    },
    registrationOpen: { type: Boolean, default: true },
    registrationStartDate: { type: Date, default: new Date('2026-01-01T00:00:00.000Z') },
    registrationEndDate: { type: Date, default: new Date('2026-11-30T23:59:59.000+05:30') },
  },
  { timestamps: true }
);

export default mongoose.model('EventConfig', eventConfigSchema);
