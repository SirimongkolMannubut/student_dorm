import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

if (!global.registeredUsers) {
  global.registeredUsers = [];
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password, firstName, lastName, phone, studentId, gender, year, major, faculty } = await request.json();
    
    const existingUser = await User.findOne({ $or: [{ email }, { studentId }] });
    if (existingUser) {
      return NextResponse.json({ error: 'อีเมลหรือรหัสนักศึกษานี้ถูกใช้แล้ว' }, { status: 400 });
    }
    
    const user = await User.create({
      studentId,
      firstName,
      lastName,
      email,
      phone,
      gender,
      year,
      major,
      faculty,
      password,
      role: "student",
      status: "pending"
    });
    
    global.registeredUsers.push({
      id: user._id.toString(),
      studentId,
      firstName,
      lastName,
      email,
      phone,
      gender,
      year,
      major,
      faculty,
      password,
      role: "student",
      status: "pending"
    });
    
    console.log('User created:', user._id);
    
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        sub: user._id.toString(), 
        email: user.email, 
        role: user.role, 
        name: `${user.firstName} ${user.lastName}`, 
        status: user.status,
        studentId: user.studentId,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        gender: user.gender,
        year: user.year,
        major: user.major,
        faculty: user.faculty
      },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: '1d' }
    );
    
    const response = NextResponse.json(
      { message: 'User registered successfully', user, redirectTo: '/profile' },
      { status: 201 }
    );
    
    response.cookies.set('token', token, { httpOnly: false, path: '/', maxAge: 60 * 60 * 24 });
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
  return NextResponse.json({ message: 'Register API working' });
}
