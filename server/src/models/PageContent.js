import mongoose from 'mongoose';

const pageContentSchema = new mongoose.Schema(
  {
    sectionKey: { type: String, required: true, unique: true, index: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('PageContent', pageContentSchema);
