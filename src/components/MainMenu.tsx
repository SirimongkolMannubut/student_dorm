'use client';

import { Home, CreditCard, Wrench, FileText, User } from 'lucide-react';

const menuItems = [
  {
    icon: <Home size={32} />,
    label: 'My Room',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  },
  {
    icon: <CreditCard size={32} />,
    label: 'Payments',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  },
  {
    icon: <Wrench size={32} />,
    label: 'Maintenance',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  },
  {
    icon: <FileText size={32} />,
    label: 'Announcements',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  },
  {
    icon: <User size={32} />,
    label: 'Profile',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
  },
];

export default function MainMenu() {
  return (
    <section className="main-menu-section">
      <div className="main-menu-container">
        <div className="main-menu-header">
          <div className="section-badge">เมนูหลัก</div>
          <h2 className="main-menu-title">เมนูหลัก</h2>
          <p className="main-menu-subtitle">
            เข้าถึงฟีเจอร์ต่างๆ ของระบบจัดการหอพัก
          </p>
        </div>
        <div className="main-menu-grid">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="main-menu-card"
              style={{ '--menu-color': item.color, '--menu-gradient': item.gradient } as React.CSSProperties}
            >
              <div className="main-menu-icon-wrapper">
                <div className="main-menu-icon" style={{ background: item.gradient }}>
                  {item.icon}
                </div>
              </div>
              <h3 className="main-menu-label">{item.label}</h3>
              <div className="main-menu-hover-effect"></div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
