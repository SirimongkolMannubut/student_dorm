import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password, firstName, lastName, phone, studentId, gender, year, major, faculty } = await request.json();
    
    // Server-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'รูปแบบอีเมลไม่ถูกต้อง' },
        { status: 400 }
      );
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก' },
        { status: 400 }
      );
    }
    
    // ตรวจสอบข้อมูลซ้ำ
    const existingUser = await User.findOne({ 
      $or: [{ email }, { studentId }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'อีเมลนี้มีในระบบแล้ว' },
          { status: 400 }
        );
      }
      if (existingUser.studentId === studentId) {
        return NextResponse.json(
          { error: 'รหัสนักศึกษานี้มีในระบบแล้ว' },
          { status: 400 }
        );
      }
    }
    
    console.log('Creating user with data:', { // Debug log
      email, firstName, lastName, phone, studentId, gender, year, major, faculty
    });
    
    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      studentId,
      gender: gender || 'male',
      year: year || '1',
      major: major || '',
      faculty: faculty || '',
      role: 'student'
    });
    
    console.log('User created successfully:', user._id); // Debug log
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    // Generate JWT token for new user
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { sub: user._id, email: user.email, role: user.role, name: `${user.firstName} ${user.lastName}`, status: user.status },
      process.env.JWT_SECRET || 'dev-secret-change-this',
      { expiresIn: '1d' }
    );
    
    const response = NextResponse.json(
      { message: 'User registered successfully', user: userWithoutPassword, redirectTo: '/dashboard' },
      { status: 201 }
    );
    
    response.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 });
    return response;
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).select('-password');
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
