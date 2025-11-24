import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for payments (in production, use database)
if (!global.adminPayments) {
  global.adminPayments = [];
}

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json();
    
    const newPayment = {
      id: Date.now(),
      ...paymentData,
      status: 'pending',
      uploadDate: new Date().toLocaleString('th-TH'),
      reviewDate: null
    };
    
    global.adminPayments.push(newPayment);
    
    console.log('New payment submitted:', newPayment);
    
    return NextResponse.json(
      { message: 'Payment submitted successfully', paymentId: newPayment.id },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Payment submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json(
      { payments: global.adminPayments || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}