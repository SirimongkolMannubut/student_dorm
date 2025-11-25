import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for payment records (in production, use database)
if (!global.paymentRecords) {
  global.paymentRecords = [
    {
      id: 1003,
      studentId: '62010001',
      month: 'มีนาคม 2025',
      amount: 3850,
      type: 'ค่าเช่า + ค่าน้ำ + ค่าไฟ + อินเทอร์เน็ต',
      status: 'pending',
      dueDate: '2025-03-05',
      method: '-',
      slipUploaded: false
    }
  ];
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');
    
    if (studentId) {
      const userRecords = global.paymentRecords.filter((record: any) => record.studentId === studentId);
      return NextResponse.json({ records: userRecords }, { status: 200 });
    }
    
    return NextResponse.json({ records: global.paymentRecords }, { status: 200 });
  } catch (error) {
    console.error('Get payment records error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, slipUploaded } = await request.json();
    
    const recordIndex = global.paymentRecords.findIndex((record: any) => record.id === id);
    if (recordIndex !== -1) {
      global.paymentRecords[recordIndex].slipUploaded = slipUploaded;
      
      return NextResponse.json(
        { message: 'Payment record updated successfully' },
        { status: 200 }
      );
    }
    
    return NextResponse.json({ error: 'Record not found' }, { status: 404 });
  } catch (error) {
    console.error('Update payment record error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}