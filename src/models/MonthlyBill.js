import mongoose from 'mongoose';

if (mongoose.models.MonthlyBill) {
  delete mongoose.models.MonthlyBill;
}

const monthlyBillSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  bookingId: { type: String, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  rentAmount: { type: Number, required: true },
  waterAmount: { type: Number, default: 0 },
  electricAmount: { type: Number, default: 0 },
  internetAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paidDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MonthlyBill', monthlyBillSchema);
