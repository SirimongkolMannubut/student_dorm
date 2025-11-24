import { NextResponse } from 'next/server';

export async function DELETE() {
  try {
    // ลบข้อมูลทั้งหมดใน global storage
    global.adminPayments = [];
    
    console.log('All payments cleared');
    
    return NextResponse.json(
      { message: 'All payments cleared successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Clear payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}