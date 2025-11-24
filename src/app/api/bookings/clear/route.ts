import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function DELETE() {
  try {
    await connectDB();
    await Booking.deleteMany({});
    return NextResponse.json({ success: true, message: 'ลบข้อมูล bookings สำเร็จ' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
