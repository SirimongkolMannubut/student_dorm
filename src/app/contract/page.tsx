'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, User, Home, Phone } from 'lucide-react';
import Header from '../../components/Header';

export default function ContractPage() {
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    studentId: '',
    phone: '',
    guardianName: '',
    emergencyPhone: '',
    roomNumber: '',
    checkInDate: '',
    contractEndDate: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserInfo(user);
    }
  }, []);

  return (
    <div className="contract-page">
      <Header />
      
      <main className="contract-main">
        <div className="contract-container">
          <div className="contract-header">
            <FileText size={32} />
            <h1>สัญญาเช่าหอพัก</h1>
            <p>มหาวิทยาลัยราชภัฏศรีสะเกษ</p>
          </div>

          <div className="contract-content">
            {/* ข้อมูลคู่สัญญา */}
            <section className="contract-section">
              <h3>📋 ข้อมูลคู่สัญญา</h3>
              <div className="contract-parties">
                <div className="party">
                  <h4>ผู้ให้เช่า</h4>
                  <p><strong>มหาวิทยาลัยราชภัฏศรีสะเกษ</strong></p>
                  <p>เลขที่ 680 ถนนศรีสะเกษ ตำบลเมืองใต้ อำเภอเมือง จังหวัดศรีสะเกษ 33000</p>
                  <p>โทร: 045-611-111</p>
                </div>
                <div className="party">
                  <h4>ผู้เช่า</h4>
                  <p><User size={16} /> <strong>{userInfo.fullName}</strong></p>
                  <p>รหัสนักศึกษา: {userInfo.studentId}</p>
                  <p><Phone size={16} /> {userInfo.phone}</p>
                  <p>ผู้ปกครอง: {userInfo.guardianName}</p>
                  <p>เบอร์ฉุกเฉิน: {userInfo.emergencyPhone}</p>
                </div>
              </div>
            </section>

            {/* รายละเอียดห้องพัก */}
            <section className="contract-section">
              <h3>🏠 รายละเอียดห้องพัก</h3>
              <div className="room-details">
                <p><Home size={16} /> <strong>ห้องที่: {userInfo.roomNumber || 'A-301'}</strong></p>
                <p>ขนาดห้อง: 3x4 เมตร</p>
                <p>จำนวนเตียง: 1 เตียง</p>
                <p>สิ่งอำนวยความสะดวก: เตียง ตู้เสื้อผ้า โต๊ะเขียนหนังสือ เก้าอี้ พัดลม แอร์</p>
              </div>
            </section>

            {/* เงื่อนไขการเช่า */}
            <section className="contract-section">
              <h3>💰 เงื่อนไขการเช่า</h3>
              <div className="rental-terms">
                <div className="term-item">
                  <span>ค่าเช่ารายเดือน:</span>
                  <strong>3,500 บาท</strong>
                </div>
                <div className="term-item">
                  <span>ค่ามัดจำ:</span>
                  <strong>3,500 บาท</strong>
                </div>
                <div className="term-item">
                  <span>ค่าไฟฟ้า:</span>
                  <strong>หน่วยละ 8 บาท</strong>
                </div>
                <div className="term-item">
                  <span>ค่าน้ำประปา:</span>
                  <strong>เหมาจ่าย 200 บาท/เดือน</strong>
                </div>
                <div className="term-item">
                  <span>ค่าอินเทอร์เน็ต:</span>
                  <strong>เหมาจ่าย 300 บาท/เดือน</strong>
                </div>
                <div className="term-item">
                  <span>วันครบกำหนดชำระ:</span>
                  <strong>วันที่ 5 ของทุกเดือน</strong>
                </div>
              </div>
            </section>

            {/* ระยะเวลา */}
            <section className="contract-section">
              <h3>📅 ระยะเวลาสัญญา</h3>
              <div className="contract-period">
                <p><Calendar size={16} /> วันที่เริ่มสัญญา: <strong>{userInfo.checkInDate}</strong></p>
                <p><Calendar size={16} /> วันที่สิ้นสุดสัญญา: <strong>{userInfo.contractEndDate}</strong></p>
                <p>ระยะเวลา: <strong>1 ปีการศึกษา</strong></p>
                <p>การต่อสัญญา: ต้องแจ้งล่วงหน้า 30 วัน</p>
              </div>
            </section>

            {/* กฎระเบียบ */}
            <section className="contract-section">
              <h3>📜 กฎระเบียบหอพัก</h3>
              <div className="rules">
                <ul>
                  <li>เวลาเข้า-ออกหอพัก: 06:00-22:00 น.</li>
                  <li>ห้ามนำแขกเข้าพักค้างคืน</li>
                  <li>ห้ามสูบบุหรี่ในหอพัก</li>
                  <li>ห้ามดื่มสุราในหอพัก</li>
                  <li>ห้ามทำเสียงดังรบกวนผู้อื่น</li>
                  <li>ต้องรักษาความสะอาดส่วนรวม</li>
                  <li>ห้ามปรับแต่งห้องพักโดยไม่ได้รับอนุญาต</li>
                </ul>
              </div>
            </section>

            {/* เงื่อนไขพิเศษ */}
            <section className="contract-section">
              <h3>⚖️ เงื่อนไขพิเศษ</h3>
              <div className="special-terms">
                <p><strong>การยกเลิกสัญญา:</strong> แจ้งล่วงหน้า 30 วัน</p>
                <p><strong>ค่าปรับ:</strong> ชำระเงินล่าช้า 50 บาท/วัน</p>
                <p><strong>ค่าเสียหาย:</strong> ตามราคาทุนจริง</p>
                <p><strong>การคืนเงินมัดจำ:</strong> หักค่าเสียหายและค่าทำความสะอาด</p>
              </div>
            </section>

            {/* ลายเซ็น */}
            <section className="contract-section">
              <h3>✍️ ลายเซ็นดิจิทัล</h3>
              <div className="signatures">
                <div className="signature-box">
                  <p>ผู้ให้เช่า</p>
                  <div className="signature">มหาวิทยาลัยราชภัฏศรีสะเกษ</div>
                  <p>วันที่: {new Date().toLocaleDateString('th-TH')}</p>
                </div>
                <div className="signature-box">
                  <p>ผู้เช่า</p>
                  <div className="signature">{userInfo.fullName}</div>
                  <p>วันที่: {new Date().toLocaleDateString('th-TH')}</p>
                </div>
              </div>
            </section>
          </div>

          <div className="contract-actions">
            <button className="download-btn">
              <Download size={20} />
              ดาวน์โหลดสัญญา PDF
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}