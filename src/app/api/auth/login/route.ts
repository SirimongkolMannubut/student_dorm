import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-this';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { sub: user._id, email: user.email, role: user.role, name: `${user.firstName} ${user.lastName}` },
      SECRET,
      { expiresIn: '1d' }
    );
    
    const res = NextResponse.json({ 
      ok: true, 
      user: { 
        id: user._id, 
        name: `${user.firstName} ${user.lastName}`, 
        email: user.email,
        role: user.role,
        status: user.status
      } 
    });
    
    res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 });
    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
