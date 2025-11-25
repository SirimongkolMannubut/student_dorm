import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
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
    
    console.log('Creating booking for userId:', userId, 'roomId:', data.roomId);
    
    const newBooking = await Booking.create({
      userId,
      roomId: data.roomId,
      roomType: data.roomType,
      price: data.price,
      status: 'approved'
    });
    
    console.log('Booking created:', newBooking);
    
    return NextResponse.json({ 
      success: true, 
      booking: newBooking
    });
  } catch (error: any) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'การจองล้มเหลว: ' + error.message }, { status: 500 });
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
    console.log('Getting bookings for userId:', userId);
    const bookings = await Booking.find({ userId });
    console.log('Found bookings:', bookings.length);
    
    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ error: 'ดึงข้อมูลล้มเหลว: ' + error.message }, { status: 500 });
  }
}