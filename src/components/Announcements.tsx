'use client';

import { ChevronRight, Calendar } from 'lucide-react';

const announcements = [
  {
    id: 1,
    date: '20 Feb',
    title: 'Water maintenance',
    description: 'ระบบน้ำประปาจะหยุดชั่วคราวเพื่อซ่อมบำรุง',
  },
  {
    id: 2,
    date: '25 Feb',
    title: 'Room inspection',
    description: 'เจ้าหน้าที่จะเข้าตรวจสอบห้องพักตามกำหนดการ',
  },
  {
    id: 3,
    date: '28 Feb',
    title: 'Rent due date',
    description: 'วันครบกำหนดชำระค่าเช่าห้องพักประจำเดือนนี้',
  },
];

export default function Announcements() {
  return (
    <section className="announcements-section">
      <div className="announcements-container">
        <div className="announcements-header">
          <div className="section-badge">ประกาศ</div>
          <h2 className="announcements-title">ประกาศล่าสุด</h2>
          <p className="announcements-subtitle">
            ข่าวสารและประกาศสำคัญจากหอพัก
          </p>
        </div>

        <div className="announcements-list">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="announcement-card">
              <div className="announcement-date">
                <Calendar size={16} />
                <span>{announcement.date}</span>
              </div>
              <div className="announcement-content">
                <h3 className="announcement-title">{announcement.title}</h3>
                <p className="announcement-description">{announcement.description}</p>
              </div>
              <div className="announcement-arrow">
                <ChevronRight size={18} />
              </div>
            </div>
          ))}
        </div>

        <button className="view-all-btn">
          ดูทั้งหมด
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

