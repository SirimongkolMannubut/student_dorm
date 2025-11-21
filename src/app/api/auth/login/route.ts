export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-this';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    // Simple mock user store — replace with real DB in production
    const users = [
      { id: '1', email: 'admin@sskru.ac.th', password: 'password123', name: 'ผู้ดูแลระบบ' },
    ];

    // For demo purposes, accept any valid email/password combination
    // In production, check against database
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'รูปแบบอีเมลไม่ถูกต้อง' }, { status: 401 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }, { status: 401 });
    }

    // Check if it's the admin user
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      // For demo, create a mock user for any valid email/password
      const mockUser = { id: Date.now().toString(), email, password, name: email.split('@')[0] };
      users.push(mockUser);
      const token = jwt.sign({ sub: mockUser.id, name: mockUser.name, email: mockUser.email }, SECRET, { expiresIn: '1d' });

      const res = NextResponse.json({ ok: true, user: { id: mockUser.id, name: mockUser.name, email: mockUser.email } });
      res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 });
      return res;
    }

    const token = jwt.sign({ sub: user.id, name: user.name, email: user.email }, SECRET, { expiresIn: '1d' });

    const res = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
    // set HTTP-only cookie
    res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 });
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
