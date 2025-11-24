import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { verify } from 'jsonwebtoken';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { paymentId, status } = await request.json();
    console.log('Updating payment:', paymentId, 'to status:', status);
    
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedPayment) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลการชำระเงิน' }, { status: 404 });
    }
    
    console.log('Updated payment:', updatedPayment);
    return NextResponse.json({ 
      success: true, 
      payment: updatedPayment
    });
  } catch (error: any) {
    console.error('Admin payment error:', error);
    return NextResponse.json({ error: 'อัปเดตล้มเหลว: ' + error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    // ถ้ามี token ให้ตรวจสอบ role
    if (token) {
      try {
        const decoded: any = verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
        if (decoded.role !== 'admin') {
          return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 });
        }
      } catch (err) {
        console.error('Token verification error:', err);
      }
    }

    const payments = await Payment.find().sort({ createdAt: -1 });
    console.log('Found payments:', payments.length);
    
    return NextResponse.json({ payments });
  } catch (error: any) {
    console.error('Get admin payments error:', error);
    return NextResponse.json({ error: 'ดึงข้อมูลล้มเหลว: ' + error.message }, { status: 500 });
  }
}