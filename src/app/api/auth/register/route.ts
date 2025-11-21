import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-this';

export async function POST(request: NextRequest) {
  try {
    const { studentId, fullName, email, year, major, faculty, phone, password } = await request.json();

    // Basic validation
    if (!studentId || !fullName || !email || !year || !major || !faculty || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'รูปแบบอีเมลไม่ถูกต้อง' }, { status: 400 });
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json({ error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }, { status: 400 });
    }

    // Here you would typically save to a database
    // For demo purposes, we'll store in memory (in production, use a real database)
    console.log('Registration data:', { studentId, fullName, email, year, major, faculty, phone });

    // Create a mock user object (in production, this would be from DB)
    const user = { id: Date.now().toString(), studentId, fullName, email, year, major, faculty, phone };

    // Generate JWT token
    const token = jwt.sign({ sub: user.id, name: user.fullName, email: user.email }, SECRET, { expiresIn: '1d' });

    // In a real application, you would save this to your database
    // For now, just return success with user data and set cookie
    const res = NextResponse.json({ ok: true, user: { id: user.id, name: user.fullName, email: user.email } }, { status: 201 });
    // set HTTP-only cookie
    res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 });
    return res;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
