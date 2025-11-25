const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/student_dorm_system';

const userSchema = new mongoose.Schema({
  studentId: { type: String, unique: true, sparse: true },
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

const roomSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  building: { type: String, required: true },
  floor: { type: Number, required: true },
  type: { type: String, enum: ['เดี่ยว', 'คู่'], required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Room = mongoose.model('Room', roomSchema);

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await User.deleteMany({});
    await Room.deleteMany({});
    
    // Create admin user
    const admin = await User.create({
      email: 'admin@sskru.ac.th',
      password: 'admin123',
      firstName: 'ผู้ดูแล',
      lastName: 'ระบบ',
      phone: '081-234-5678',
      role: 'admin',
      status: 'approved'
    });
    
    // Create sample student
    const student = await User.create({
      email: 'student@sskru.ac.th',
      password: 'student123',
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      phone: '082-345-6789',
      studentId: '65001234',
      role: 'student',
      status: 'pending'
    });
    
    // Create sample rooms
    const rooms = await Room.insertMany([
      { number: 'A301', building: 'A', floor: 3, type: 'เดี่ยว', price: 5000 },
      { number: 'B205', building: 'B', floor: 2, type: 'คู่', price: 3500 },
      { number: 'C102', building: 'C', floor: 1, type: 'เดี่ยว', price: 5000 }
    ]);
    
    console.log('Seed data created successfully!');
    console.log('Admin:', admin.email);
    console.log('Student:', student.email);
    console.log('Rooms:', rooms.length);
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Seed error:', error);
    await mongoose.disconnect();
  }
}

seedData();