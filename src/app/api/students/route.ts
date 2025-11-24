import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import Document from '../../../models/Document';
import GeneralDocument from '../../../models/GeneralDocument';

export async function GET() {
  try {
    await connectDB();
    
    const students = await User.find({ role: 'student' })
      .populate('room', 'number')
      .select('-password')
      .sort({ createdAt: -1 });
    
    const studentsWithDocs = await Promise.all(
      students.map(async (student) => {
        const doc = await Document.findOne({ userId: student._id });
        const generalDocs = await GeneralDocument.find({ userId: student._id }).sort({ createdAt: -1 });
        return {
          ...student.toObject(),
          document: doc,
          generalDocuments: generalDocs
        };
      })
    );
    
    return NextResponse.json(studentsWithDocs);
  } catch (error) {
    console.error('Get students error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    
    const { userId, status } = await request.json();
    
    const user = await User.findByIdAndUpdate(
      userId,
      { status, updatedAt: new Date() },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Status updated successfully', user });
  } catch (error) {
    console.error('Update student status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}