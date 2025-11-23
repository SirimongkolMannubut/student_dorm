import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  issue: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  assignedTo: { type: String },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Maintenance || mongoose.model('Maintenance', maintenanceSchema);