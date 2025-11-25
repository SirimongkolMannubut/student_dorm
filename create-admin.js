const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/student_dorm_system';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Delete existing admin
    await User.deleteOne({ email: 'admin@sskru.ac.th' });
    
    // Create new admin
    const admin = await User.create({
      email: 'admin@sskru.ac.th',
      password: 'admin123',
      firstName: 'ผู้ดูแล',
      lastName: 'ระบบ',
      phone: '081-234-5678',
      role: 'admin',
      status: 'approved'
    });
    
    console.log('Admin created:', admin.email, 'Role:', admin.role);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdmin();