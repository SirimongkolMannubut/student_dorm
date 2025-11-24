import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import GeneralDocument from '@/models/GeneralDocument';
import Document from '@/models/Document';

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { userId } = await request.json();
    
    await User.findByIdAndDelete(userId);
    await GeneralDocument.deleteMany({ userId });
    await Document.deleteMany({ userId });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
