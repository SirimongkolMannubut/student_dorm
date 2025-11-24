'use client';

import { useState } from 'react';
import { Building, Users, Snowflake, Fan, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';

// สร้างข้อมูลผู้อยู่อาศัยจำลอง
const generateOccupants = (count: number) => {
  const names = ['สมชาย', 'สมหญิง', 'วิชัย', 'สุดา', 'ประยุทธ', 'มาลี', 'สมศักดิ์', 'วันดี', 'ชัยวัฒน์', 'นิตยา'];
  const surnames = ['ใจดี', 'รักดี', 'สุขใส', 'เก่งกาจ', 'มั่นคง', 'สดใส', 'ยิ้มแย้ม', 'ใสใจ', 'มีสุข', 'ร่าเริง'];
  const years = [1, 2, 3, 4];
  const majors = ['วิทยาการคอมพิวเตอร์', 'บริหารธุรกิจ', 'วิศวกรรม', 'พยาบาล', 'ครุศาสตร์'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`,
    year: years[Math.floor(Math.random() * years.length)],
    major: majors[Math.floor(Math.random() * majors.length)],
    studentId: `620${Math.floor(Math.random() * 90000) + 10000}`
  }));
};

// สร้างข้อมูลห้องสำหรับแต่ละอาคาร
const generateRooms = (buildingId: string, floors: number) => {
  const rooms = [];
  for (let floor = 1; floor <= floors; floor++) {
    for (let room = 1; room <= 4; room++) {
      const roomNumber = `${buildingId}${floor}${room.toString().padStart(2, '0')}`;
      const occupantCount = Math.floor(Math.random() * 5); // 0-4 คน
      const type = Math.random() > 0.5 ? 'แอร์' : 'ปกติ';
      const occupantsList = generateOccupants(occupantCount);
      
      // คำนวณราคาตามประเภทห้องและจำนวนคน
      let price;
      if (type === 'ปกติ') {
        price = 3500; // ห้องปกติ
      } else {
        // ห้องแอร์
        if (occupantCount === 4) {
          price = 5000;
        } else if (occupantCount === 3) {
          price = 5500;
        } else {
          price = 5500; // ราคาเริ่มต้นสำหรับ 1-2 คน
        }
      }
      
      rooms.push({
        floor,
        roomNumber,
        type,
        occupants: occupantCount,
        occupantsList,
        maxOccupants: 4,
        available: occupantCount < 4,
        price
      });
    }
  }
  return rooms;
};

const buildings = [
  // อาคารผู้ชาย 2 อาคาร
  { id: 'A', name: 'อาคาร A', floors: 4, type: 'ชาย', rooms: generateRooms('A', 4) },
  { id: 'B', name: 'อาคาร B', floors: 4, type: 'ชาย', rooms: generateRooms('B', 4) },
  // อาคารผู้หญิง 1 อาคาร
  { id: 'C', name: 'อาคาร C', floors: 4, type: 'หญิง', rooms: generateRooms('C', 4) },
].map(building => ({
  ...building,
  totalRooms: building.floors * 4,
  availableRooms: building.rooms.filter(room => room.available).length
}));

export default function RoomsPage() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showBookingConfirm, setShowBookingConfirm] = useState<any>(null);
  const [showPayment, setShowPayment] = useState<any>(null);
  const [selectedSlip, setSelectedSlip] = useState<File | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const confirmBooking = async () => {
    if (isBooking) return;
    setIsBooking(true);
    
    try {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
      const token = tokenCookie?.split('=')[1];

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          roomId: showBookingConfirm.roomNumber,
          roomType: showBookingConfirm.type,
          price: showBookingConfirm.price
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        alert('จองห้องสำเร็จ! \n\nกรุณาไปที่หน้าประวัติการชำระเงินเพื่อชำระค่ามัดจำและค่าเช่า');
        window.location.href = '/payment-history';
      } else {
        const text = await response.text();
        try {
          const error = JSON.parse(text);
          alert(error.error || 'การจองล้มเหลว');
        } catch {
          alert('การจองล้มเหลว');
        }
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('เกิดข้อผิดพลาดในการจอง');
    } finally {
      setIsBooking(false);
    }
  };

  const building = buildings.find(b => b.id === selectedBuilding);
  const filteredBuildings = selectedGender ? buildings.filter(b => b.type === selectedGender) : [];
  const filteredRooms = building?.rooms.filter(room => 
    selectedFloor ? room.floor === selectedFloor : true
  ) || [];

  return (
    <div className="rooms-page">
      <Header />

      <main className="rooms-main">
        <div className="rooms-container">
          <div className="rooms-header">
            <h1>ดูสถานะห้องว่าง</h1>
            <p>เลือกอาคารและชั้นเพื่อดูห้องที่ว่าง</p>
          </div>

          {!selectedGender ? (
            <div className="gender-selector">
              <div className="gender-card" onClick={() => setSelectedGender('ชาย')}>
                <div className="gender-icon male">
                  <Users size={48} />
                </div>
                <h2>อาคารผู้ชาย</h2>
                <p>2 อาคาร</p>
              </div>
              <div className="gender-card" onClick={() => setSelectedGender('หญิง')}>
                <div className="gender-icon female">
                  <Users size={48} />
                </div>
                <h2>อาคารผู้หญิง</h2>
                <p>1 อาคาร</p>
              </div>
            </div>
          ) : !selectedBuilding ? (
            <div>
              <div className="section-header">
                <button 
                  className="back-btn"
                  onClick={() => setSelectedGender(null)}
                >
                  <ArrowLeft size={18} />
                  กลับ
                </button>
                <h2>อาคาร{selectedGender}</h2>
              </div>
              <div className="buildings-grid">
                {filteredBuildings.map((building) => (
                  <div
                    key={building.id}
                    className="building-card"
                    onClick={() => setSelectedBuilding(building.id)}
                  >
                    <div className="building-icon">
                      <Building size={32} />
                    </div>
                    <h3>{building.name}</h3>
                    <div className="building-info">
                      <div className="info-item">
                        <MapPin size={16} />
                        <span>{building.floors} ชั้น</span>
                      </div>
                      <div className="info-item">
                        <Users size={16} />
                        <span>{building.type}</span>
                      </div>
                    </div>
                    <div className="availability">
                      <span className="available">{building.availableRooms} ห้องว่าง</span>
                      <span className="total">/ {building.totalRooms} ห้อง</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="building-details">
              <div className="building-header">
                <button 
                  className="back-btn"
                  onClick={() => {
                    setSelectedBuilding(null);
                    setSelectedFloor(null);
                  }}
                >
                  <ArrowLeft size={18} />
                  กลับ
                </button>
                <h2>{building?.name} - {building?.type}</h2>
              </div>

              <div className="floor-selector">
                <button
                  className={`floor-btn ${selectedFloor === null ? 'active' : ''}`}
                  onClick={() => setSelectedFloor(null)}
                >
                  ทุกชั้น
                </button>
                {Array.from({ length: building?.floors || 0 }, (_, i) => i + 1).map(floor => (
                  <button
                    key={floor}
                    className={`floor-btn ${selectedFloor === floor ? 'active' : ''}`}
                    onClick={() => setSelectedFloor(floor)}
                  >
                    ชั้น {floor}
                  </button>
                ))}
              </div>

              <div className="rooms-grid">
                {filteredRooms.map((room) => (
                  <div key={room.roomNumber} className={`room-card ${room.available ? 'room-available' : 'room-full'}`}>
                    <div className="room-header">
                      <h4>{room.roomNumber}</h4>
                      <div className="room-status">
                        {room.available ? (
                          <span className="status-available">ว่าง</span>
                        ) : (
                          <span className="status-full">🔒 เต็ม</span>
                        )}
                      </div>
                    </div>
                    <div className="room-info">
                      <div className="room-type">
                        {room.type === 'แอร์' ? <Snowflake size={14} /> : <Fan size={14} />}
                        <span>{room.type}</span>
                      </div>
                      <div className="occupancy">
                        <Users size={14} />
                        <span>{room.occupants}/{room.maxOccupants} คน</span>
                      </div>
                    </div>
                    <div className="room-price">
                      {room.price.toLocaleString()} ฿/เทอม
                    </div>
                    <button 
                      className="view-details-btn"
                      onClick={() => setSelectedRoom(room)}
                    >
                      ดูรายละเอียด
                    </button>
                    {room.available && (
                      <button 
                        className="reserve-btn"
                        onClick={() => setShowBookingConfirm(room)}
                      >
                        จองห้องนี้
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Room Details Modal */}
          {selectedRoom && (
            <div className="modal-overlay" onClick={() => setSelectedRoom(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>รายละเอียดห้อง {selectedRoom.roomNumber}</h3>
                  <button 
                    className="close-btn"
                    onClick={() => setSelectedRoom(null)}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <div className="room-details">
                    <div className="detail-item">
                      <strong>ประเภทห้อง:</strong> {selectedRoom.type}
                    </div>
                    <div className="detail-item">
                      <strong>ราคา:</strong> {selectedRoom.price.toLocaleString()} ฿/เทอม
                    </div>
                    <div className="detail-item">
                      <strong>ผู้อยู่อาศัย:</strong> {selectedRoom.occupants}/{selectedRoom.maxOccupants} คน
                    </div>
                  </div>
                  
                  {selectedRoom.occupantsList.length > 0 ? (
                    <div className="occupants-list">
                      <h4>รายชื่อผู้อยู่อาศัย</h4>
                      {selectedRoom.occupantsList.map((occupant: any) => (
                        <div key={occupant.id} className="occupant-card">
                          <div className="occupant-info">
                            <div className="occupant-name">{occupant.name}</div>
                            <div className="occupant-details">
                              รหัส: {occupant.studentId} | ปี {occupant.year} | {occupant.major}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-room">
                      <p>ห้องว่าง - ไม่มีผู้อยู่อาศัย</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Booking Confirmation Modal */}
          {showBookingConfirm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>ยืนยันการจอง</h3>
                  <button className="close-btn" onClick={() => setShowBookingConfirm(null)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="booking-summary">
                    <h4>ห้อง: {showBookingConfirm.roomNumber}</h4>
                    <p>ประเภท: {showBookingConfirm.type}</p>
                    <div className="cost-summary">
                      <div className="cost-item">ค่าเช่ารายภาค: {showBookingConfirm.price.toLocaleString()} บาท</div>
                      <div className="cost-item">ค่ามัดจำ: 450 บาท</div>
                      <div className="total-cost">รวม: {(showBookingConfirm.price + 450).toLocaleString()} บาท</div>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button className="cancel-btn" onClick={() => setShowBookingConfirm(null)}>ยกเลิก</button>
                    <button 
                      className="confirm-btn" 
                      onClick={confirmBooking}
                      disabled={isBooking}
                    >
                      {isBooking ? 'กำลังจอง...' : 'ยืนยันการจอง'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Modal */}
          {showPayment && (
            <div className="modal-overlay">
              <div className="modal-content payment-modal">
                <div className="modal-header">
                  <h3>ชำระเงิน</h3>
                </div>
                <div className="modal-body">
                  <div className="payment-info">
                    <div className="step-indicator">
                      <span className="current-step">ขั้นที่ 2/3: ชำระเงิน</span>
                    </div>
                    <h4>ค่ามัดจำ + ค่าเช่าเดือนแรก</h4>
                    <div className="payment-amount">{(showPayment.price + 450).toLocaleString()} บาท</div>
                  </div>
                  
                  <div className="qr-section">
                    <div className="qr-code">
                      <div className="qr-placeholder">
                        [QR PromptPay อัตโนมัติ]
                      </div>
                      <p>สแกน QR เพื่อชำระเงิน (ตรวจสอบอัตโนมัติ)</p>
                      <div className="auto-verify">
                        <span className="verify-badge">✓ ตรวจสอบอัตโนมัติ</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="slip-upload">
                    <h5>อัปโหลดสลิปหลังชำระเงิน:</h5>
                    
                    {!selectedSlip ? (
                      <>
                        <input 
                          type="file" 
                          accept="image/*,.pdf"
                          className="slip-input"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setSelectedSlip(e.target.files[0]);
                            }
                          }}
                        />
                        <p className="upload-note">ไม่ได้เลือกไฟล์ใด</p>
                      </>
                    ) : (
                      <div className="selected-file">
                        <div className="file-info">
                          <span className="file-name">ไฟล์: {selectedSlip.name}</span>
                          <button 
                            className="remove-file-btn"
                            onClick={() => setSelectedSlip(null)}
                          >
                            ลบไฟล์
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <p className="upload-note">หลังชำระเงินแล้ว ให้แนบสลิปที่นี่</p>
                  </div>
                  
                  <div className="payment-actions">
                    <button 
                      className="cancel-btn"
                      onClick={() => {
                        setShowPayment(null);
                        setSelectedSlip(null);
                      }}
                    >
                      ยกเลิก
                    </button>
                    <button 
                      className="submit-btn"
                      disabled={!selectedSlip}
                      onClick={async () => {
                        if (selectedSlip) {
                          try {
                            const cookies = document.cookie.split(';');
                            const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
                            const token = tokenCookie?.split('=')[1];

                            const formData = new FormData();
                            formData.append('slip', selectedSlip);
                            formData.append('bookingId', '1');
                            formData.append('amount', (showPayment.price + 450).toString());

                            const response = await fetch('/api/payments', {
                              method: 'POST',
                              headers: {
                                'Authorization': `Bearer ${token}`
                              },
                              body: formData
                            });

                            if (response.ok) {
                              alert('อัปโหลดสลิปสำเร็จ รอการตรวจสอบ');
                              window.location.href = '/payment-history';
                            } else {
                              const text = await response.text();
                              try {
                                const error = JSON.parse(text);
                                alert(error.error || 'อัปโหลดล้มเหลว');
                              } catch {
                                alert('อัปโหลดล้มเหลว');
                              }
                            }
                          } catch (error) {
                            console.error('Upload error:', error);
                            alert('เกิดข้อผิดพลาดในการอัปโหลด');
                          }
                          setShowPayment(null);
                          setSelectedSlip(null);
                        }
                      }}
                    >
                      ส่งสลิป
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}