import mongoose from 'mongoose';

if (mongoose.models.Payment) {
  delete mongoose.models.Payment;
}

const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  bookingId: { type: String },
  amount: { type: Number, required: true },
  slipUrl: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);