import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, rejectReason } = await request.json();
    const paymentId = parseInt(params.id);
    
    console.log('Updating payment ID:', paymentId, 'Status:', status);
    
    // ใช้ global storage เดียวกับ payments API
    if (!global.adminPayments) {
      global.adminPayments = [];
    }
    
    console.log('Current adminPayments:', global.adminPayments);
    
    const paymentIndex = global.adminPayments.findIndex((payment: any) => payment.id === paymentId);
    
    if (paymentIndex === -1) {
      console.log('Payment not found in adminPayments, ID:', paymentId);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
    
    // อัปเดตสถานะ
    global.adminPayments[paymentIndex].status = status;
    if (rejectReason) {
      global.adminPayments[paymentIndex].rejectReason = rejectReason;
    }
    global.adminPayments[paymentIndex].reviewDate = new Date().toLocaleString('th-TH');
    
    console.log('Updated payment:', global.adminPayments[paymentIndex]);
    
    return NextResponse.json(
      { message: 'Payment status updated successfully', payment: global.adminPayments[paymentIndex] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update payment status error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}