import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { verify } from 'jsonwebtoken';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'ไม่พบ token' }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
    const formData = await request.formData();
    const slip = formData.get('slip') as File;
    const bookingId = formData.get('bookingId');
    const amount = formData.get('amount');

    if (!slip) {
      return NextResponse.json({ error: 'ไม่มีไฟล์สลิป' }, { status: 400 });
    }

    const filename = `${Date.now()}-${slip.name}`;
    const blob = await put(filename, slip, {
      access: 'public',
    });

    const payment = await Payment.create({
      userId: decoded.studentId || decoded.userId || decoded.sub,
      bookingId: bookingId as string,
      amount: parseInt(amount as string),
      slipUrl: blob.url,
      status: 'pending'
    });
    
    return NextResponse.json({ 
      success: true, 
      payment 
    });
  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'อัปโหลดล้มเหลว: ' + error.message }, { status: 500 });
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
    console.log('GET payments for userId:', userId);
    const payments = await Payment.find({ userId });
    console.log('Found payments:', payments.length, payments);
    
    return NextResponse.json({ payments });
  } catch (error: any) {
    console.error('Get payments error:', error);
    return NextResponse.json({ error: 'ดึงข้อมูลล้มเหลว: ' + error.message }, { status: 500 });
  }
}