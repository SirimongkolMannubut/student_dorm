'use client';

import { Home, CreditCard, Wrench, FileText, User, Bell, Calendar, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

const quickStats = [
  { label: 'ห้องของฉัน', value: 'A-301', icon: <Home size={20} />, color: '#3B82F6' },
  { label: 'ค่าเช่าเดือนนี้', value: '3,500 ฿', icon: <CreditCard size={20} />, color: '#10B981' },
  { label: 'แจ้งซ่อม', value: '2 รายการ', icon: <Wrench size={20} />, color: '#F59E0B' },
  { label: 'ประกาศใหม่', value: '5 รายการ', icon: <Bell size={20} />, color: '#8B5CF6' },
];

const menuItems = [
  { icon: <Home size={24} />, label: 'ห้องของฉัน', desc: 'ดูข้อมูลห้องพัก', color: '#3B82F6' },
  { icon: <CreditCard size={24} />, label: 'ชำระเงิน', desc: 'ค่าเช่า ค่าน้ำ ค่าไฟ', color: '#10B981' },
  { icon: <Wrench size={24} />, label: 'แจ้งซ่อม', desc: 'แจ้งปัญหาและติดตาม', color: '#F59E0B' },
  { icon: <FileText size={24} />, label: 'ประกาศ', desc: 'ข่าวสารและกิจกรรม', color: '#8B5CF6' },
  { icon: <User size={24} />, label: 'โปรไฟล์', desc: 'จัดการข้อมูลส่วนตัว', color: '#6366F1' },
  { icon: <MapPin size={24} />, label: 'แผนที่หอพัก', desc: 'ดูตำแหน่งและสิ่งอำนวยความสะดวก', color: '#EF4444' },
];

const recentAnnouncements = [
  { title: 'ปิดระบบน้ำชั่วคราว', date: '15 ม.ค. 2025', urgent: true },
  { title: 'กิจกรรมปีใหม่ 2025', date: '10 ม.ค. 2025', urgent: false },
  { title: 'เปลี่ยนแปลงอัตราค่าไฟ', date: '5 ม.ค. 2025', urgent: false },
];

export default function DashboardPage() {
  const [userName, setUserName] = useState('ผู้ใช้');

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.fullName || 'ผู้ใช้');
    }
  }, []);

  return (
    <div className="simple-dashboard">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="landing-logo">
            <h1>SSKRU Dormitory System</h1>
          </div>
          <nav className="landing-nav">
            <button type="button" className="nav-link profile-btn">
              <User size={18} />
              {userName}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="simple-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <h2>ยินดีต้อนรับสู่ระบบหอพัก</h2>
            <p>จัดการข้อมูลห้องพัก ชำระค่าเช่า และติดตามข่าวสารได้ที่นี่</p>
          </section>

          {/* Quick Stats */}
          <section className="stats-section">
            <h3>ข้อมูลสำคัญ</h3>
            <div className="stats-grid">
              {quickStats.map((stat, index) => (
                <div key={index} className="stat-card" style={{ '--accent-color': stat.color } as React.CSSProperties}>
                  <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-info">
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-value">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Main Menu */}
          <section className="menu-section">
            <h3>เมนูหลัก</h3>
            <div className="menu-grid">
              {menuItems.map((item, index) => {
                const isRoomMenu = item.label === 'ห้องของฉัน';
                const Component = isRoomMenu ? 'a' : 'button';
                const props = isRoomMenu ? { href: '/rooms' } : {};
                
                return (
                  <Component key={index} className="menu-card" style={{ '--accent-color': item.color } as React.CSSProperties} {...props}>
                    <div className="menu-icon" style={{ backgroundColor: item.color }}>
                      {item.icon}
                    </div>
                    <div className="menu-content">
                      <h4>{item.label}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </Component>
                );
              })}
            </div>
          </section>

          {/* Recent Announcements */}
          <section className="announcements-section">
            <h3>ประกาศล่าสุด</h3>
            <div className="announcements-list">
              {recentAnnouncements.map((announcement, index) => (
                <div key={index} className={`announcement-item ${announcement.urgent ? 'urgent' : ''}`}>
                  <div className="announcement-content">
                    <h4>{announcement.title}</h4>
                    <span className="announcement-date">
                      <Calendar size={14} />
                      {announcement.date}
                    </span>
                  </div>
                  {announcement.urgent && <span className="urgent-badge">ด่วน</span>}
                </div>
              ))}
            </div>
            <button className="view-all-btn">ดูประกาศทั้งหมด</button>
          </section>
        </div>
      </main>
    </div>
  );
}

