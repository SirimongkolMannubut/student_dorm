import mongoose from 'mongoose';

delete mongoose.models.GeneralDocument;

const generalDocumentSchema = new mongoose.Schema({
  userId: String,
  studentId: String,
  documentType: String,
  semester: String,
  description: String,
  fileUrls: [String],
  status: { type: String, default: 'pending' },
  rejectReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

export default mongoose.models.GeneralDocument || mongoose.model('GeneralDocument', generalDocumentSchema);
