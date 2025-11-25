import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  building: { type: String, required: true },
  floor: { type: Number, required: true },
  type: { type: String, enum: ['เดี่ยว', 'คู่'], required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
  occupant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Room || mongoose.model('Room', roomSchema);