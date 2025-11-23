import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Maintenance from '../../../models/Maintenance';

export async function GET() {
  try {
    await connectDB();
    const maintenance = await Maintenance.find({})
      .populate('user', 'firstName lastName studentId')
      .populate('room', 'number building')
      .sort({ createdAt: -1 });
    return NextResponse.json(maintenance);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const maintenance = await Maintenance.create(data);
    return NextResponse.json(maintenance, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}