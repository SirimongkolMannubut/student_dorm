'use client';

import { useState } from 'react';
import { Building, Users, Snowflake, Fan, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
    for (let room = 1; room <= 18; room++) {
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
  // อาคารผู้ชาย 3 อาคาร
  { id: 'A', name: 'อาคาร A', floors: 4, type: 'ชาย', rooms: generateRooms('A', 4) },
  { id: 'B', name: 'อาคาร B', floors: 4, type: 'ชาย', rooms: generateRooms('B', 4) },
  { id: 'C', name: 'อาคาร C', floors: 4, type: 'ชาย', rooms: generateRooms('C', 4) },
  // อาคารผู้หญิง 9 อาคาร
  { id: 'D', name: 'อาคาร D', floors: 4, type: 'หญิง', rooms: generateRooms('D', 4) },
  { id: 'E', name: 'อาคาร E', floors: 4, type: 'หญิง', rooms: generateRooms('E', 4) },
  { id: 'F', name: 'อาคาร F', floors: 4, type: 'หญิง', rooms: generateRooms('F', 4) },
  { id: 'G', name: 'อาคาร G', floors: 4, type: 'หญิง', rooms: generateRooms('G', 4) },
  { id: 'H', name: 'อาคาร H', floors: 4, type: 'หญิง', rooms: generateRooms('H', 4) },
  { id: 'I', name: 'อาคาร I', floors: 4, type: 'หญิง', rooms: generateRooms('I', 4) },
  { id: 'J', name: 'อาคาร J', floors: 4, type: 'หญิง', rooms: generateRooms('J', 4) },
  { id: 'K', name: 'อาคาร K', floors: 4, type: 'หญิง', rooms: generateRooms('K', 4) },
  { id: 'L', name: 'อาคาร L', floors: 4, type: 'หญิง', rooms: generateRooms('L', 4) },
].map(building => ({
  ...building,
  totalRooms: building.floors * 18,
  availableRooms: building.rooms.filter(room => room.available).length
}));

export default function RoomsPage() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const building = buildings.find(b => b.id === selectedBuilding);
  const filteredBuildings = selectedGender ? buildings.filter(b => b.type === selectedGender) : [];
  const filteredRooms = building?.rooms.filter(room => 
    selectedFloor ? room.floor === selectedFloor : true
  ) || [];

  return (
    <div className="rooms-page">
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
                <p>3 อาคาร</p>
              </div>
              <div className="gender-card" onClick={() => setSelectedGender('หญิง')}>
                <div className="gender-icon female">
                  <Users size={48} />
                </div>
                <h2>อาคารผู้หญิง</h2>
                <p>9 อาคาร</p>
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
                  <div key={room.roomNumber} className={`room-card ${room.available ? 'available' : 'full'}`}>
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
                      <button className="reserve-btn">
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
        </div>
      </main>
    </div>
  );
}