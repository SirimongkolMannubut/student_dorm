import mongoose from 'mongoose';

if (mongoose.models.Document) {
  delete mongoose.models.Document;
}

const documentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  studentId: { type: String, required: true },
  idCardUrl: { type: String },
  houseRegistrationUrl: { type: String },
  transcriptUrl: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectReason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Document', documentSchema);
