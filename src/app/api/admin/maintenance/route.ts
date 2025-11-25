import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Maintenance from '@/models/Maintenance';

export async function GET() {
  try {
    await connectDB();
    const maintenances = await Maintenance.find().sort({ createdAt: -1 });
    return NextResponse.json({ maintenances });
  } catch (error: any) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด: ' + error.message }, { status: 500 });
  }
}
