import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, "dev-secret-change-this");
    const updateData = await req.json();

    // อัปเดตข้อมูลใน token แทนการบันทึกลง database
    const updatedUser = {
      id: decoded.sub,
      ...decoded,
      ...updateData,
      updatedAt: new Date()
    };

    // สร้าง token ใหม่ด้วยข้อมูลที่อัปเดตแล้ว
    const newToken = jwt.sign(
      { 
        sub: updatedUser.id, 
        email: updatedUser.email, 
        role: updatedUser.role, 
        name: `${updatedUser.firstName} ${updatedUser.lastName}`, 
        status: updatedUser.status,
        studentId: updatedUser.studentId,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        year: updatedUser.year,
        major: updatedUser.major,
        faculty: updatedUser.faculty,
        birthDate: updatedUser.birthDate,
        currentAddress: updatedUser.currentAddress,
        guardianName: updatedUser.guardianName,
        emergencyPhone: updatedUser.emergencyPhone,
        houseNumber: updatedUser.houseNumber,
        province: updatedUser.province,
        roomNumber: updatedUser.roomNumber,
        checkInDate: updatedUser.checkInDate,
        contractEndDate: updatedUser.contractEndDate,
        rentalStatus: updatedUser.rentalStatus
      },
      "dev-secret-change-this",
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    });
    
    // ตั้ง cookie ใหม่
    response.cookies.set('token', newToken, { 
      httpOnly: false, 
      path: '/', 
      maxAge: 60 * 60 * 24 
    });
    
    return response;

  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}