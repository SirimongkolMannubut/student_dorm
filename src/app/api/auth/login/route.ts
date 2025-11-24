import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Initialize global storage
if (!global.registeredUsers) {
  global.registeredUsers = [];
}

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();
    
    // Default admin user
    const adminUser = {
      id: 'admin1',
      email: 'admin@sskru.ac.th',
      password: 'admin123',
      firstName: 'ผู้ดูแล',
      lastName: 'ระบบ',
      phone: '081-234-5678',
      role: 'admin',
      status: 'approved'
    };
    
    // Check admin first
    if (adminUser.email === identifier && adminUser.password === password) {
      const token = jwt.sign(
        { 
          userId: adminUser.id,
          sub: adminUser.id, 
          email: adminUser.email, 
          role: adminUser.role, 
          name: `${adminUser.firstName} ${adminUser.lastName}`, 
          status: adminUser.status,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          phone: adminUser.phone
        },
        SECRET,
        { expiresIn: '1d' }
      );
      
      const res = NextResponse.json({ 
        ok: true, 
        user: { 
          id: adminUser.id, 
          name: `${adminUser.firstName} ${adminUser.lastName}`, 
          email: adminUser.email,
          role: adminUser.role,
          status: adminUser.status
        },
        redirectTo: '/admin',
        role: adminUser.role
      });
      
      res.cookies.set('token', token, { httpOnly: false, path: '/', maxAge: 60 * 60 * 24 });
      return res;
    }
    
    // Find user in registered users
    const user = global.registeredUsers.find((u: any) => 
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
        userId: user.id,
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
      redirectTo: user.role === 'admin' ? '/admin' : '/profile',
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