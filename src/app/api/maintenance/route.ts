import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Maintenance from '@/models/Maintenance';
import { verify } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'ไม่พบ token' }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
    const data = await request.json();
    const userId = decoded.studentId || decoded.userId || decoded.sub;
    
    const maintenance = await Maintenance.create({
      userId,
      roomId: data.roomId,
      category: data.category,
      description: data.description,
      status: 'pending'
    });
    
    return NextResponse.json({ success: true, maintenance });
  } catch (error: any) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด: ' + error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'ไม่พบ token' }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
    const userId = decoded.studentId || decoded.userId || decoded.sub;
    
    const maintenances = await Maintenance.find({ userId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ maintenances });
  } catch (error: any) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด: ' + error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'ไม่พบ token' }, { status: 401 });
    }

    const data = await request.json();
    
    const maintenance = await Maintenance.findByIdAndUpdate(
      data.id,
      { status: data.status, updatedAt: new Date() },
      { new: true }
    );
    
    return NextResponse.json({ success: true, maintenance });
  } catch (error: any) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด: ' + error.message }, { status: 500 });
  }
}
