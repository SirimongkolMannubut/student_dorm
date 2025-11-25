import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GeneralDocument from '@/models/GeneralDocument';
import { verify } from 'jsonwebtoken';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'ไม่พบ token' }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
    const formData = await request.formData();
    
    const documentType = formData.get('documentType') as string;
    const semester = formData.get('semester') as string;
    const description = formData.get('description') as string;
    const files = formData.getAll('files') as File[];

    const fileUrls: string[] = [];
    
    for (const file of files) {
      const filename = `${Date.now()}-${file.name}`;
      const blob = await put(filename, file, { access: 'public' });
      fileUrls.push(blob.url);
    }

    const document = await GeneralDocument.create({
      userId: decoded.userId || decoded.sub,
      studentId: decoded.studentId,
      documentType,
      semester,
      description,
      fileUrls,
      status: 'pending'
    });
    
    return NextResponse.json({ success: true, document });
  } catch (error: any) {
    console.error('Document submit error:', error);
    return NextResponse.json({ error: 'อัปโหลดล้มเหลว: ' + error.message }, { status: 500 });
  }
}
