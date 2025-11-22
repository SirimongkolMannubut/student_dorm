'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, User, FileText, Save } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    year: '',
    major: '',
    faculty: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const [contractData, setContractData] = useState({
    parentName: '',
    parentPhone: '',
    parentAddress: '',
    digitalSignature: '',
    agreementDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserInfo({
        fullName: user.fullName || '',
        studentId: user.studentId || '',
        email: user.email || '',
        phone: user.phone || '',
        year: user.year || '',
        major: user.major || '',
        faculty: user.faculty || '',
        address: user.address || '',
        emergencyContact: user.emergencyContact || '',
        emergencyPhone: user.emergencyPhone || ''
      });
    }
  }, []);

  const handleSave = () => {
    const updatedUser = { ...userInfo, ...contractData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert('บันทึกข้อมูลสำเร็จ!\n\nสัญญาดิจิทัลพร้อมใช้งาน ✓');
  };

  return (
    <div className="profile-page">
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="landing-logo">
            <h1>SSKRU Dormitory System</h1>
          </div>
          <nav className="landing-nav">
            <Link href="/dashboard" className="nav-link">
              <ArrowLeft size={18} />
              กลับ Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="profile-main">
        <div className="profile-container">
          <div className="profile-header">
            <h1>ข้อมูลส่วนตัว & สัญญาดิจิทัล</h1>
            <p>กรอกข้อมูลให้ครบถ้วนเพื่อสร้างสัญญาเช่าอัตโนมัติ</p>
          </div>

          <div className="profile-sections">
            {/* ข้อมูลนักศึกษา */}
            <div className="section">
              <div className="section-header">
                <User size={20} />
                <h3>ข้อมูลนักศึกษา</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>ชื่อ-นามสกุล</label>
                  <input 
                    type="text" 
                    value={userInfo.fullName}
                    onChange={(e) => setUserInfo({...userInfo, fullName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>รหัสนักศึกษา</label>
                  <input 
                    type="text" 
                    value={userInfo.studentId}
                    onChange={(e) => setUserInfo({...userInfo, studentId: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>อีเมล</label>
                  <input 
                    type="email" 
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>เบอร์โทรศัพท์</label>
                  <input 
                    type="tel" 
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>ชั้นปี</label>
                  <select 
                    value={userInfo.year}
                    onChange={(e) => setUserInfo({...userInfo, year: e.target.value})}
                  >
                    <option value="">เลือกชั้นปี</option>
                    <option value="1">ปี 1</option>
                    <option value="2">ปี 2</option>
                    <option value="3">ปี 3</option>
                    <option value="4">ปี 4</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>สาขาวิชา</label>
                  <input 
                    type="text" 
                    value={userInfo.major}
                    onChange={(e) => setUserInfo({...userInfo, major: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* ข้อมูลสำหรับสัญญา */}
            <div className="section">
              <div className="section-header">
                <FileText size={20} />
                <h3>ข้อมูลสำหรับสัญญาเช่า</h3>
              </div>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>ที่อยู่ปัจจุบัน</label>
                  <textarea 
                    value={userInfo.address}
                    onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                    placeholder="บ้านเลขที่ หมู่ที่ ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                  />
                </div>
                <div className="form-group">
                  <label>ชื่อผู้ปกครอง</label>
                  <input 
                    type="text" 
                    value={contractData.parentName}
                    onChange={(e) => setContractData({...contractData, parentName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>เบอร์โทรผู้ปกครอง</label>
                  <input 
                    type="tel" 
                    value={contractData.parentPhone}
                    onChange={(e) => setContractData({...contractData, parentPhone: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>ที่อยู่ผู้ปกครอง</label>
                  <textarea 
                    value={contractData.parentAddress}
                    onChange={(e) => setContractData({...contractData, parentAddress: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>ผู้ติดต่อฉุกเฉิน</label>
                  <input 
                    type="text" 
                    value={userInfo.emergencyContact}
                    onChange={(e) => setUserInfo({...userInfo, emergencyContact: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>เบอร์ติดต่อฉุกเฉิน</label>
                  <input 
                    type="tel" 
                    value={userInfo.emergencyPhone}
                    onChange={(e) => setUserInfo({...userInfo, emergencyPhone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* ลายเซ็นดิจิทัล */}
            <div className="section">
              <div className="section-header">
                <FileText size={20} />
                <h3>ลายเซ็นดิจิทัล</h3>
              </div>
              <div className="signature-section">
                <div className="form-group">
                  <label>พิมพ์ชื่อเพื่อเป็นลายเซ็นดิจิทัล</label>
                  <input 
                    type="text" 
                    value={contractData.digitalSignature}
                    onChange={(e) => setContractData({...contractData, digitalSignature: e.target.value})}
                    placeholder="พิมพ์ชื่อของคุณ"
                    className="signature-input"
                  />
                </div>
                <div className="signature-preview">
                  <p>ตัวอย่างลายเซ็น:</p>
                  <div className="signature-display">
                    {contractData.digitalSignature || 'ชื่อของคุณจะแสดงที่นี่'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="save-section">
            <button className="save-btn" onClick={handleSave}>
              <Save size={20} />
              บันทึกข้อมูล & สร้างสัญญาดิจิทัล
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}