import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = 'dev-secret-change-this';

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();
    
    // Mock users - ไม่ต้องใช้ database
    const mockUsers = [
      {
        id: 'admin1',
        email: 'admin@sskru.ac.th',
        password: 'admin123',
        firstName: 'ผู้ดูแล',
        lastName: 'ระบบ',
        phone: '081-234-5678',
        role: 'admin',
        status: 'approved'
      },
      {
        id: '62010001',
        studentId: '62010001',
        email: 'test@test.com',
        password: '12345678',
        firstName: 'สมชาย',
        lastName: 'ใจดี',
        phone: '0812345678',
        gender: 'male',
        year: '1',
        major: 'วิทยาการคอมพิวเตอร์',
        faculty: 'คณะวิทยาศาสตร์',
        role: 'student',
        status: 'pending'
      }
    ];
    
    // Find user
    const user = mockUsers.find(u => 
      u.email === identifier || u.studentId === identifier
    );
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
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
      SECRET,
      { expiresIn: '1d' }
    );
    
    const res = NextResponse.json({ 
      ok: true, 
      user: { 
        id: user.id, 
        name: `${user.firstName} ${user.lastName}`, 
        email: user.email,
        role: user.role,
        status: user.status
      },
      redirectTo: user.role === 'admin' ? '/admin' : '/dashboard',
      role: user.role
    });
    
    res.cookies.set('token', token, { httpOnly: false, path: '/', maxAge: 60 * 60 * 24 });
    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}