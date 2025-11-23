import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-this') as any;
    const updateData = await request.json();
    
    // Update user profile
    const student = await User.findByIdAndUpdate(
      decoded.sub,
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { new: true }
    ).select('-password');
    
    if (!student) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้งาน' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: 'อัปเดตข้อมูลสำเร็จ', 
      student 
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}