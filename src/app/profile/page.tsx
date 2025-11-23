'use client';

import { useState, useEffect } from 'react';
import { User, FileText, Save, Edit, Camera, Home, Calendar, Phone, Mail, MapPin, X } from 'lucide-react';
import Header from '../../components/Header';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    studentId: '',
    faculty: '',
    major: '',
    phone: '',
    email: '',
    birthDate: '',
    gender: '',
    academicYear: '',
    currentAddress: '',
    houseNumber: '',
    province: '',
    guardianName: '',
    emergencyPhone: '',
    roomNumber: '',
    checkInDate: '',
    contractEndDate: '',
    rentalStatus: '',
    profileImage: ''
  });

  const [contractData, setContractData] = useState({
    parentName: '',
    parentPhone: '',
    parentAddress: '',
    digitalSignature: '',
    agreementDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
      if (!token) {
        console.log('No token found');
        return;
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const user = await response.json();
        console.log('User data from API:', user);
        setUserInfo(prev => ({
          ...prev,
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          studentId: user.studentId || '',
          email: user.email || '',
          phone: user.phone || '',
          faculty: user.faculty || '',
          major: user.major || '',
          gender: user.gender === 'male' ? 'ชาย' : user.gender === 'female' ? 'หญิง' : '',
          academicYear: user.year || '',
          birthDate: user.birthDate || '',
          currentAddress: user.currentAddress || '',
          guardianName: user.guardianName || '',
          emergencyPhone: user.emergencyPhone || '',
          rentalStatus: user.status === 'pending' ? 'รอการอนุมัติ' : user.status === 'approved' ? 'อนุมัติแล้ว' : 'ไม่ระบุ'
        }));
      } else {
        console.log('Failed to fetch profile:', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSave = async () => {
    try {
      const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
      if (!token) {
        alert('กรุณาเข้าสู่ระบบก่อน');
        return;
      }

      // ตรวจสอบข้อมูลจำเป็น
      if (!userInfo.fullName || !userInfo.phone) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
      }

      const [firstName, ...lastNameParts] = userInfo.fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      const updateData = {
        firstName: firstName || '',
        lastName: lastName || '',
        phone: userInfo.phone,
        gender: userInfo.gender === 'ชาย' ? 'male' : userInfo.gender === 'หญิง' ? 'female' : '',
        year: userInfo.academicYear,
        major: userInfo.major,
        faculty: userInfo.faculty,
        birthDate: userInfo.birthDate,
        currentAddress: userInfo.currentAddress,
        guardianName: userInfo.guardianName,
        emergencyPhone: userInfo.emergencyPhone
      };

      console.log('Sending update data:', updateData); // Debug log

      const response = await fetch('/api/students/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      console.log('Update response:', result); // Debug log

      if (response.ok) {
        alert('บันทึกข้อมูลสำเร็จ!');
        setIsEditing(false); // Exit edit mode
        fetchUserProfile(); // Refresh data
      } else {
        alert(result.error || 'เกิดข้อผิดพลาดในการบันทึก');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  return (
    <div className="profile-page">
      <Header />

      <main className="profile-main">
        <div className="profile-container">
          <div className="profile-header">
            <h1>ข้อมูลส่วนตัว & สัญญาดิจิทัล</h1>
            <p>กรอกข้อมูลให้ครบถ้วนเพื่อสร้างสัญญาเช่าอัตโนมัติ</p>
          </div>

          <div className="profile-sections">
            {/* ข้อมูลส่วนตัว */}
            <div className="section">
              <div className="section-header">
                <User size={20} />
                <h3>ข้อมูลส่วนตัว</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>ชื่อ–นามสกุล</label>
                  <input 
                    type="text" 
                    value={userInfo.fullName}
                    onChange={(e) => setUserInfo({...userInfo, fullName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>รหัสนักศึกษา</label>
                  <input 
                    type="text" 
                    value={userInfo.studentId}
                    onChange={(e) => setUserInfo({...userInfo, studentId: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>คณะ / สาขา</label>
                  <input 
                    type="text" 
                    value={`${userInfo.faculty} / ${userInfo.major}`}
                    onChange={(e) => {
                      const [faculty, major] = e.target.value.split(' / ');
                      setUserInfo({...userInfo, faculty: faculty || '', major: major || ''});
                    }}
                    placeholder="คณะ / สาขา"
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>เบอร์โทร</label>
                  <input 
                    type="tel" 
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>อีเมล</label>
                  <input 
                    type="email" 
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>วันเกิด</label>
                  <input 
                    type="date" 
                    value={userInfo.birthDate}
                    onChange={(e) => setUserInfo({...userInfo, birthDate: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>เพศ</label>
                  <select 
                    value={userInfo.gender}
                    onChange={(e: any) => setUserInfo({...userInfo, gender: e.target.value})}
                    disabled={!isEditing}
                  >
                    <option value="">เลือกเพศ</option>
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>ปีการศึกษา</label>
                  <select 
                    value={userInfo.academicYear}
                    onChange={(e: any) => setUserInfo({...userInfo, academicYear: e.target.value})}
                    disabled={!isEditing}
                  >
                    <option value="">เลือกปีการศึกษา</option>
                    <option value="1">ปี 1</option>
                    <option value="2">ปี 2</option>
                    <option value="3">ปี 3</option>
                    <option value="4">ปี 4</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ที่อยู่ปัจจุบัน */}
            <div className="section">
              <div className="section-header">
                <MapPin size={20} />
                <h3>🔹 ที่อยู่ปัจจุบัน (ถ้ามี)</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>บ้านเลขที่</label>
                  <input 
                    type="text" 
                    value={userInfo.houseNumber}
                    onChange={(e) => setUserInfo({...userInfo, houseNumber: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>จังหวัด</label>
                  <input 
                    type="text" 
                    value={userInfo.province}
                    onChange={(e) => setUserInfo({...userInfo, province: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group full-width">
                  <label>ที่อยู่เต็ม</label>
                  <textarea 
                    value={userInfo.currentAddress}
                    onChange={(e: any) => setUserInfo({...userInfo, currentAddress: e.target.value})}
                    placeholder="บ้านเลขที่ หมู่ที่ ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* ผู้ปกครอง */}
            <div className="section">
              <div className="section-header">
                <Phone size={20} />
                <h3>ผู้ปกครอง / เบอร์ติดต่อฉุกเฉิน</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>ชื่อผู้ปกครอง</label>
                  <input 
                    type="text" 
                    value={userInfo.guardianName}
                    onChange={(e) => setUserInfo({...userInfo, guardianName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>เบอร์ติดต่อฉุกเฉิน</label>
                  <input 
                    type="tel" 
                    value={userInfo.emergencyPhone}
                    onChange={(e) => setUserInfo({...userInfo, emergencyPhone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* สถานะผู้เช่า */}
            <div className="section">
              <div className="section-header">
                <Home size={20} />
                <h3>🔹 สถานะผู้เช่า</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>ห้องที่เช่า</label>
                  <input 
                    type="text" 
                    value={userInfo.roomNumber}
                    onChange={(e) => setUserInfo({...userInfo, roomNumber: e.target.value})}
                    placeholder="เช่น A-301"
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>วันที่เข้าพัก</label>
                  <input 
                    type="date" 
                    value={userInfo.checkInDate}
                    onChange={(e) => setUserInfo({...userInfo, checkInDate: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>วันที่ครบกำหนดสัญญา</label>
                  <input 
                    type="date" 
                    value={userInfo.contractEndDate}
                    onChange={(e) => setUserInfo({...userInfo, contractEndDate: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>สถานะปัจจุบัน</label>
                  <select 
                    value={userInfo.rentalStatus}
                    onChange={(e: any) => setUserInfo({...userInfo, rentalStatus: e.target.value})}
                    disabled={!isEditing}
                  >
                    <option value="">เลือกสถานะ</option>
                    <option value="กำลังเช่า">กำลังเช่า</option>
                    <option value="รอย้ายออก">รอย้ายออก</option>
                    <option value="ไม่ต่อสัญญา">ไม่ต่อสัญญา</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <h3>การจัดการข้อมูล</h3>
            <div className="buttons-grid">
              {!isEditing ? (
                <>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit size={20} />
                    แก้ไขข้อมูล
                  </button>
                  <button className="action-btn upload-btn">
                    <Camera size={20} />
                    อัปโหลดรูปโปรไฟล์
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="action-btn save-btn" 
                    onClick={handleSave}
                  >
                    <Save size={20} />
                    บันทึกข้อมูล
                  </button>
                  <button 
                    className="action-btn cancel-btn"
                    onClick={() => {
                      setIsEditing(false);
                      fetchUserProfile(); // Reset data
                    }}
                  >
                    <X size={20} />
                    ยกเลิก
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}