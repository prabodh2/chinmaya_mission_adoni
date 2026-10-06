import mongoose from 'mongoose';

const bulkBatchSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, unique: true, index: true },
    institutionName: { type: String, required: true, trim: true },
    institutionType: { type: String, enum: ['SCHOOL', 'COLLEGE'], required: true },
    contactPersonName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    totalStudents: { type: Number, required: true },
    validRecords: { type: Number, required: true },
    failedRecords: { type: Number, default: 0 },
    duplicatesDetected: { type: Number, default: 0 },
    fileName: { type: String },
    fileMimeType: { type: String },
    fileSize: { type: Number },
    fileData: { type: String }, // Base64 data of original uploaded spreadsheet file
  },
  { timestamps: true }
);

export default mongoose.model('BulkBatch', bulkBatchSchema);
