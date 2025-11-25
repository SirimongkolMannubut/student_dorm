import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    console.log('Token received:', token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
      console.log('Token decoded:', decoded);

      // ส่งข้อมูลจาก token กลับไป - ไม่ต้องใช้ database
      const user = {
        id: decoded.sub,
        firstName: decoded.firstName || '',
        lastName: decoded.lastName || '',
        email: decoded.email || '',
        phone: decoded.phone || '',
        studentId: decoded.studentId || '',
        gender: decoded.gender || '',
        year: decoded.year || '',
        major: decoded.major || '',
        faculty: decoded.faculty || '',
        role: decoded.role || 'student',
        status: decoded.status || 'pending',
        birthDate: decoded.birthDate || '',
        currentAddress: decoded.currentAddress || '',
        guardianName: decoded.guardianName || '',
        emergencyPhone: decoded.emergencyPhone || '',
        houseNumber: decoded.houseNumber || '',
        province: decoded.province || '',
        roomNumber: decoded.roomNumber || '',
        checkInDate: decoded.checkInDate || '',
        contractEndDate: decoded.contractEndDate || '',
        rentalStatus: decoded.rentalStatus || ''
      };

      return NextResponse.json(user, { status: 200 });
    } catch (jwtError) {
      console.log('JWT Error:', jwtError.message);
      return NextResponse.json({ error: "Invalid token: " + jwtError.message }, { status: 401 });
    }

  } catch (err) {
    console.error("Profile error:", err);
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}