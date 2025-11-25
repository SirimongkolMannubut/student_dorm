import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Document from '@/models/Document';
import GeneralDocument from '@/models/GeneralDocument';
import { verify } from 'jsonwebtoken';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'ไม่พบ token' }, { status: 401 });
    }

    const decoded: any = verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
    const formData = await request.formData();
    
    const idCard = formData.get('idCard') as File;
    const houseRegistration = formData.get('houseRegistration') as File;
    const transcript = formData.get('transcript') as File;

    let idCardUrl = '';
    let houseRegistrationUrl = '';
    let transcriptUrl = '';

    if (idCard) {
      const bytes = await idCard.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-idcard-${idCard.name}`;
      const filepath = path.join(process.cwd(), 'public', 'uploads', 'documents', filename);
      await writeFile(filepath, buffer);
      idCardUrl = `/uploads/documents/${filename}`;
    }

    if (houseRegistration) {
      const bytes = await houseRegistration.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-house-${houseRegistration.name}`;
      const filepath = path.join(process.cwd(), 'public', 'uploads', 'documents', filename);
      await writeFile(filepath, buffer);
      houseRegistrationUrl = `/uploads/documents/${filename}`;
    }

    if (transcript) {
      const bytes = await transcript.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-transcript-${transcript.name}`;
      const filepath = path.join(process.cwd(), 'public', 'uploads', 'documents', filename);
      await writeFile(filepath, buffer);
      transcriptUrl = `/uploads/documents/${filename}`;
    }

    const document = await Document.create({
      userId: decoded.userId || decoded.sub,
      studentId: decoded.studentId,
      idCardUrl,
      houseRegistrationUrl,
      transcriptUrl,
      status: 'pending'
    });
    
    return NextResponse.json({ success: true, document });
  } catch (error: any) {
    console.error('Document upload error:', error);
    return NextResponse.json({ error: 'อัปโหลดล้มเหลว: ' + error.message }, { status: 500 });
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
    
    if (decoded.role === 'admin') {
      const documents = await Document.find().sort({ createdAt: -1 });
      const generalDocs = await GeneralDocument.find().sort({ createdAt: -1 });
      return NextResponse.json({ documents: [...documents, ...generalDocs] });
    } else {
      const documents = await Document.find({ userId: decoded.userId || decoded.sub });
      const generalDocs = await GeneralDocument.find({ userId: decoded.userId || decoded.sub }).sort({ createdAt: -1 });
      return NextResponse.json({ documents: [...documents, ...generalDocs] });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { documentId, status, rejectReason } = await request.json();
    
    const document = await Document.findByIdAndUpdate(
      documentId,
      { status, rejectReason, updatedAt: new Date() },
      { new: true }
    );
    
    return NextResponse.json({ success: true, document });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
