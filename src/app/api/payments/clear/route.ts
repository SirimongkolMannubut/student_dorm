import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function DELETE() {
  try {
    await connectDB();
    await Payment.deleteMany({});
    return NextResponse.json({ success: true, message: 'ลบข้อมูล payments สำเร็จ' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
