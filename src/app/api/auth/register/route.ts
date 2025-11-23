import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage
if (!global.registeredUsers) {
  global.registeredUsers = [];
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone, studentId, gender, year, major, faculty } = await request.json();
    
    // สร้าง user object และเก็บไว้ใน memory
    const user = {
      id: Date.now().toString(),
      studentId,
      firstName,
      lastName,
      email,
      phone,
      gender,
      year,
      major,
      faculty,
      password, // เก็บ password ไว้สำหรับ login
      role: "student",
      status: "pending"
    };
    
    // เก็บข้อมูลผู้ใช้ที่สมัคร
    global.registeredUsers.push(user);
    
    console.log('User created (mock):', user.id);
    
    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        sub: user.id, 
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
      'dev-secret-change-this',
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
  return NextResponse.json({ message: 'Register API working - No Database' });
}