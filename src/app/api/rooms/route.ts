import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Room from '../../../models/Room';

export async function GET() {
  try {
    await connectDB();
    const rooms = await Room.find({}).populate('occupant', 'firstName lastName').sort({ building: 1, number: 1 });
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const room = await Room.create(data);
    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}