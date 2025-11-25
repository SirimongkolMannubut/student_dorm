import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import User from '@/models/User';
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
    
    // ถ้าอนุมัติ ให้อัปเดต booking
    if (status === 'approved' && updatedPayment.bookingId) {
      try {
        const booking = await Booking.findByIdAndUpdate(
          updatedPayment.bookingId,
          { status: 'approved', updatedAt: new Date() }
        );
        if (booking) {
          console.log('Updated booking:', updatedPayment.bookingId, 'to approved');
        }
      } catch (bookingError) {
        console.error('Error updating booking:', bookingError);
      }
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
    
    const payments = await Payment.find().sort({ createdAt: -1 });
    console.log('Found payments:', payments.length);
    
    const enrichedPayments = await Promise.all(payments.map(async (payment) => {
      try {
        let user = await User.findOne({ studentId: payment.userId });
        if (!user) {
          user = await User.findById(payment.userId).catch(() => null);
        }
        const booking = payment.bookingId ? await Booking.findById(payment.bookingId).catch(() => null) : null;
        
        console.log('Payment userId:', payment.userId, 'Found user:', user ? `${user.firstName} ${user.lastName}` : 'null');
        
        return {
          ...payment.toObject(),
          studentName: user ? `${user.firstName} ${user.lastName}` : 'ไม่ระบุ',
          studentId: user?.studentId || payment.userId,
          roomNumber: booking?.roomId || 'ไม่ระบุ'
        };
      } catch (err) {
        console.error('Error enriching payment:', err);
        return {
          ...payment.toObject(),
          studentName: 'ไม่ระบุ',
          studentId: payment.userId,
          roomNumber: 'ไม่ระบุ'
        };
      }
    }));
    
    return NextResponse.json({ payments: enrichedPayments });
  } catch (error: any) {
    console.error('Get admin payments error:', error);
    return NextResponse.json({ error: 'ดึงข้อมูลล้มเหลว: ' + error.message }, { status: 500 });
  }
}
