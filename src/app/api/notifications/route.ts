import { NextRequest, NextResponse } from 'next/server';

declare global {
  var notifications: any[] | undefined;
}

if (!global.notifications) {
  global.notifications = [
    {
      id: 1,
      studentId: '62010001',
      type: 'booking_approved',
      title: 'การจองห้อง A301 ได้รับการอนุมัติ',
      message: 'ยินดีด้วย! การจองห้อง A301 ของคุณได้รับการอนุมัติแล้ว',
      contractId: 'CON002',
      contractUrl: '/api/contracts/download/CON002',
      read: false,
      createdAt: new Date().toISOString()
    }
  ];
}

const notifications = global.notifications;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  
  if (studentId) {
    const userNotifications = notifications.filter(n => n.studentId === studentId);
    return NextResponse.json({ notifications: userNotifications });
  }
  
  return NextResponse.json({ notifications });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (data.action === 'mark_read') {
      const notification = notifications.find(n => n.id === data.notificationId);
      if (notification) {
        notification.read = true;
        return NextResponse.json({ success: true });
      }
    }
    
    if (data.action === 'create_notification') {
      const newNotification = {
        id: notifications.length + 1,
        studentId: data.studentId,
        type: data.type,
        title: data.title,
        message: data.message,
        contractId: data.contractId || null,
        contractUrl: data.contractUrl || null,
        read: false,
        createdAt: new Date().toISOString()
      };
      
      notifications.push(newNotification);
      return NextResponse.json({ success: true, notification: newNotification });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}