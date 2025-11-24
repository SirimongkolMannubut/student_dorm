import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GeneralDocument from '@/models/GeneralDocument';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { documentId, status, rejectReason } = await request.json();
    
    const document = await GeneralDocument.findByIdAndUpdate(
      documentId,
      { status, rejectReason, updatedAt: new Date() },
      { new: true }
    );
    
    return NextResponse.json({ success: true, document });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
