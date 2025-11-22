import { NextRequest, NextResponse } from 'next/server';

declare global {
  var bookings: any[] | undefined;
  var contracts: any[] | undefined;
}

if (!global.bookings) {
  global.bookings = [
    {
      id: 1,
      studentId: '62010001',
      studentName: 'สมชาย ใจดี',
      roomId: 'A301',
      bookingDate: '2025-01-15',
      status: 'Pending',
      contractId: null
    },
    {
      id: 2,
      studentId: '62010002', 
      studentName: 'สมหญิง รักดี',
      roomId: 'B205',
      bookingDate: '2025-01-14',
      status: 'Approved',
      contractId: 'CON001'
    }
  ];
}

if (!global.contracts) {
  global.contracts = [
    {
      id: 'CON001',
      studentId: '62010002',
      roomId: 'B205',
      startDate: '2025-02-01',
      endDate: '2025-07-31',
      rentalFee: 5000,
      paymentStatus: 'Paid',
      contractUrl: '/contracts/CON001.pdf'
    }
  ];
}

const bookings = global.bookings;
const contracts = global.contracts;

export async function GET() {
  return NextResponse.json({ bookings, contracts });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (data.action === 'create_booking') {
      const newBooking = {
        id: bookings.length + 1,
        studentId: data.studentId,
        studentName: data.studentName,
        roomId: data.roomId,
        bookingDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        contractId: null
      };
      
      bookings.push(newBooking);
      return NextResponse.json({ success: true, booking: newBooking });
    }
    
    if (data.action === 'approve_booking') {
      const booking = bookings.find(b => b.id === data.bookingId);
      if (booking) {
        booking.status = 'Approved';
        
        const contractId = `CON${String(contracts.length + 1).padStart(3, '0')}`;
        const newContract = {
          id: contractId,
          studentId: booking.studentId,
          roomId: booking.roomId,
          startDate: data.startDate,
          endDate: data.endDate,
          rentalFee: data.rentalFee,
          paymentStatus: 'Pending',
          contractUrl: `/contracts/${contractId}.pdf`
        };
        
        contracts.push(newContract);
        booking.contractId = contractId;
        
        return NextResponse.json({ success: true, booking, contract: newContract });
      }
    }
    
    if (data.action === 'reject_booking') {
      const booking = bookings.find(b => b.id === data.bookingId);
      if (booking) {
        booking.status = 'Rejected';
        return NextResponse.json({ success: true, booking });
      }
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}