import { NextRequest, NextResponse } from 'next/server';

// เก็บข้อมูลผู้ใช้ใน global variable
declare global {
  var users: Map<string, any> | undefined;
}

if (!global.users) {
  global.users = new Map();
  // เพิ่มข้อมูลจำลองผู้ใช้
  global.users.set('admin@sisaket.com', {
    studentId: '6612732129',
    fullName: 'ศิริมงคล มนูบุตร',
    email: 'admin@sisaket.com',
    year: '3',
    major: 'วิทยาการคอมพิวเตอร์',
    faculty: 'คณะวิทยาศาสตร์และเทคโนโลยี',
    phone: '0812345678',
    password: 'Admin123!',
    createdAt: new Date().toISOString()
  });
}

const users = global.users;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // ตรวจสอบว่ามีผู้ใช้นี้แล้วหรือไม่
    if (users.has(data.email)) {
      return NextResponse.json(
        { error: 'อีเมลนี้ถูกใช้งานแล้ว' },
        { status: 400 }
      );
    }

    // บันทึกข้อมูลผู้ใช้
    users.set(data.email, {
      studentId: data.studentId,
      fullName: data.fullName,
      email: data.email,
      year: data.year,
      major: data.major,
      faculty: data.faculty,
      phone: data.phone,
      password: data.password,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        message: 'ลงทะเบียนสำเร็จ', 
        user: {
          email: data.email,
          fullName: data.fullName,
          studentId: data.studentId,
          year: data.year,
          major: data.major,
          faculty: data.faculty,
          phone: data.phone
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลงทะเบียน' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(Array.from(users.values()));
}
