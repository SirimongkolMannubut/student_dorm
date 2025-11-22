import { NextRequest, NextResponse } from 'next/server';

declare global {
  var bookings: any[] | undefined;
  var contracts: any[] | undefined;
  var notifications: any[] | undefined;
}

if (!global.bookings) {
  global.bookings = [];
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
      contractUrl: '/api/contracts/download/CON001'
    }
  ];
}

if (!global.notifications) {
  global.notifications = [];
}

const bookings = global.bookings;
const contracts = global.contracts;
const notifications = global.notifications;

export async function GET() {
  return NextResponse.json({ bookings, contracts });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (data.action === 'create_booking') {
      // ตรวจสอบคุณสมบัตินักศึกษา
      if (!data.studentId || !data.studentName || !data.studentEmail) {
        return NextResponse.json(
          { error: 'ข้อมูลนักศึกษาไม่ครบถ้วน กรุณาลงทะเบียนใหม่' },
          { status: 400 }
        );
      }

      // ตรวจสอบว่ามีการจองซ้ำหรือไม่
      const existingBooking = bookings.find(b => 
        b.studentId === data.studentId && (b.status === 'Pending' || b.status === 'Approved')
      );
      
      if (existingBooking) {
        return NextResponse.json(
          { error: 'คุณมีการจองอยู่แล้ว กรุณารอการดำเนินการจากแอดมิน' },
          { status: 400 }
        );
      }

      const newBooking = {
        id: bookings.length + 1,
        studentId: data.studentId,
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        studentYear: data.studentYear,
        studentMajor: data.studentMajor,
        studentFaculty: data.studentFaculty,
        studentPhone: data.studentPhone,
        roomId: data.roomId,
        roomType: data.roomType,
        roomPrice: data.roomPrice,
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
        // ตรวจสอบว่ามีสัญญาอยู่แล้วหรือไม่
        const existingContract = contracts.find(c => 
          c.studentId === booking.studentId && c.roomId === booking.roomId
        );
        
        if (existingContract) {
          booking.status = 'Approved';
          booking.contractId = existingContract.id;
          return NextResponse.json({ success: true, booking, contract: existingContract });
        }
        
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
          contractUrl: `/api/contracts/download/${contractId}`
        };
        
        contracts.push(newContract);
        booking.contractId = contractId;
        
        // สร้างการแจ้งเตือน
        const newNotification = {
          id: notifications.length + 1,
          studentId: booking.studentId,
          type: 'booking_approved',
          title: `การจองห้อง ${booking.roomId} ได้รับการอนุมัติ`,
          message: `ยินดีด้วย! การจองห้อง ${booking.roomId} ของคุณได้รับการอนุมัติแล้ว กรุณาสามารถดาวน์โหลดสัญญาเช่าได้`,
          contractId: contractId,
          contractUrl: `/contracts/สัญญาเช่าห้องพัก%20หอพักมหาวิทยาลัยราชภัฏศรีสะเกษ.pdf`,
          read: false,
          createdAt: new Date().toISOString()
        };
        notifications.push(newNotification);
        
        return NextResponse.json({ success: true, booking, contract: newContract });
      }
    }
    
    if (data.action === 'reject_booking') {
      const booking = bookings.find(b => b.id === data.bookingId);
      if (booking) {
        booking.status = 'Rejected';
        
        // สร้างการแจ้งเตือน
        const newNotification = {
          id: notifications.length + 1,
          studentId: booking.studentId,
          type: 'booking_rejected',
          title: `การจองห้อง ${booking.roomId} ถูกปฏิเสธ`,
          message: `ขออภัย การจองห้อง ${booking.roomId} ของคุณถูกปฏิเสธ กรุณาสามารถเลือกห้องอื่นได้`,
          contractId: null,
          contractUrl: null,
          read: false,
          createdAt: new Date().toISOString()
        };
        notifications.push(newNotification);
        
        return NextResponse.json({ success: true, booking });
      }
    }
    
    if (data.action === 'delete_booking') {
      const bookingIndex = bookings.findIndex(b => b.id === data.bookingId);
      if (bookingIndex !== -1) {
        bookings.splice(bookingIndex, 1);
        return NextResponse.json({ success: true });
      }
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}