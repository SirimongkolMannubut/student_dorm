'use client';

import { useState } from 'react';
import { Users, Building, CreditCard, Wrench, FileText, Settings, BarChart3, Bell, LogOut } from 'lucide-react';
import AdminHeader from '../../components/AdminHeader';
import '../../styles/admin.css';

const adminStats = [
  { label: 'นักศึกษาทั้งหมด', value: '1,247', icon: <Users size={24} />, color: '#3b82f6' },
  { label: 'ห้องที่ใช้งาน', value: '856/864', icon: <Building size={24} />, color: '#10b981' },
  { label: 'รายได้เดือนนี้', value: '4.2M ฿', icon: <CreditCard size={24} />, color: '#f59e0b' },
  { label: 'แจ้งซ่อมรอดำเนินการ', value: '23', icon: <Wrench size={24} />, color: '#ef4444' },
];

const menuItems = [
  { icon: <Users size={24} />, label: 'จัดการนักศึกษา', desc: 'ดูข้อมูล อนุมัติ ปฏิเสธ', color: '#3b82f6' },
  { icon: <Building size={24} />, label: 'จัดการห้องพัก', desc: 'สถานะห้อง การจอง', color: '#10b981' },
  { icon: <CreditCard size={24} />, label: 'จัดการการเงิน', desc: 'แจ้งค่าไฟค่าน้ำ ตรวจสอบการชำระ', color: '#f59e0b' },
  { icon: <Wrench size={24} />, label: 'จัดการซ่อมบำรุง', desc: 'รายการแจ้งซ่อม', color: '#ef4444' },
  { icon: <FileText size={24} />, label: 'จัดการประกาศ', desc: 'เพิ่ม แก้ไข ลบประกาศ', color: '#8b5cf6' },
  { icon: <BarChart3 size={24} />, label: 'รายงาน', desc: 'สถิติและรายงาน', color: '#06b6d4' },
];

const recentActivities = [
  { type: 'booking', message: 'นักศึกษา สมชาย ใจดี จองห้อง A301', time: '5 นาทีที่แล้ว' },
  { type: 'payment', message: 'ได้รับชำระเงินห้อง B205 จำนวน 5,000 ฿', time: '15 นาทีที่แล้ว' },
  { type: 'maintenance', message: 'แจ้งซ่อมห้อง C102 - ก๊อกน้ำเสีย', time: '30 นาทีที่แล้ว' },
  { type: 'approval', message: 'อนุมัติการจองห้อง D201 สำเร็จ', time: '1 ชั่วโมงที่แล้ว' },
];

export default function AdminPage() {

  return (
      <div className="admin-page">
      <AdminHeader />

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-container">
          {/* Stats Section */}
          <section className="admin-stats">
            <h2>ภาพรวมระบบ</h2>
            <div className="stats-grid">
              {adminStats.map((stat, index) => (
                <div key={index} className="admin-stat-card">
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

          {/* Menu Section */}
          <section className="admin-menu">
            <h2>เมนูจัดการ</h2>
            <div className="admin-menu-grid">
              {menuItems.map((item, index) => {
                const getHref = (label) => {
                  switch(label) {
                    case 'จัดการนักศึกษา': return '/admin/students';
                    case 'จัดการห้องพัก': return '/admin/rooms';
                    case 'จัดการการเงิน': return '/admin/utilities';
                    case 'จัดการซ่อมบำรุง': return '/admin/maintenance';
                    case 'จัดการประกาศ': return '/admin/announcements';
                    case 'รายงาน': return '/admin/reports';
                    default: return '#';
                  }
                };
                
                return (
                  <a key={index} className="admin-menu-card" href={getHref(item.label)}>
                    <div className="menu-icon" style={{ backgroundColor: item.color }}>
                      {item.icon}
                    </div>
                    <div className="menu-content">
                      <h3>{item.label}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          {/* Recent Activities */}
          <section className="recent-activities">
            <h2>กิจกรรมล่าสุด</h2>
            <div className="activities-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    {activity.type === 'booking' && <Building size={16} />}
                    {activity.type === 'payment' && <CreditCard size={16} />}
                    {activity.type === 'maintenance' && <Wrench size={16} />}
                    {activity.type === 'approval' && <Users size={16} />}
                  </div>
                  <div className="activity-content">
                    <div className="activity-message">{activity.message}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}