'use client';

import { ChevronRight, Calendar } from 'lucide-react';

const announcements = [
  {
    id: 1,
    date: '12 พ.ย.',
    title: 'แจ้งชำระเงินหอประจำเดือน',
    description: 'กำหนดชำระเงินภายในวันที่ 15 พฤศจิกายน 2567',
  },
  {
    id: 2,
    date: '20 พ.ย.',
    title: 'ตรวจสภาพห้องอาคาร B',
    description: 'จะมีการตรวจสภาพห้องอาคาร B ในวันที่ 20 พฤศจิกายน',
  },
];

export default function Announcements() {
  return (
    <section className="announcements-section">
      <div className="section-header">
        <h2 className="section-title">ประกาศ & ข่าวสาร</h2>
      </div>
      
      <div className="announcements-list">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="announcement-item">
            <div className="announcement-date">
              <Calendar size={16} />
              <span>{announcement.date}</span>
            </div>
            <div className="announcement-content">
              <h3 className="announcement-title">{announcement.title}</h3>
              <p className="announcement-description">{announcement.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="view-all-btn">
        ดูทั้งหมด
        <ChevronRight size={18} />
      </button>
    </section>
  );
}

