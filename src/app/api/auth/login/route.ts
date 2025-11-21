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

    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
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
