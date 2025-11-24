import mongoose from 'mongoose';

if (mongoose.models.Booking) {
  delete mongoose.models.Booking;
}

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  roomId: { type: String, required: true },
  roomType: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);
