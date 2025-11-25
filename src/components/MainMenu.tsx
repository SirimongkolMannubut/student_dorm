'use client';

import { Home, CreditCard, Wrench, FileText, User, Building, DollarSign, Download, Upload, Send } from 'lucide-react';

const menuItems = [
  {
    icon: <DollarSign size={32} />,
    label: 'กรอกข้อมูลผู้กู้',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  },
  {
    icon: <User size={32} />,
    label: 'ข้อมูลผู้เช่า',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  },
  {
    icon: <User size={32} />,
    label: 'ข้อมูลส่วนตัว',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  },
  {
    icon: <FileText size={32} />,
    label: 'สัญญาเช่า',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  },
  {
    icon: <CreditCard size={32} />,
    label: 'ประวัติการชำระเงิน',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
  },
  {
    icon: <Wrench size={32} />,
    label: 'แจ้งซ่อม',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
  },
  {
    icon: <FileText size={32} />,
    label: 'เอกสารผู้เช่า',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  },
  {
    icon: <FileText size={32} />,
    label: 'เอกสาร',
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
  },
  {
    icon: <Send size={32} />,
    label: 'เอกสารที่ส่งแล้ว',
    color: '#84CC16',
    gradient: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
  },
  {
    icon: <Upload size={32} />,
    label: 'ส่งเอกสาร',
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
  },
  {
    icon: <Download size={32} />,
    label: 'ดาวน์โหลดเอกสาร',
    color: '#8B5A2B',
    gradient: 'linear-gradient(135deg, #8B5A2B 0%, #7C2D12 100%)',
  },
  {
    icon: <DollarSign size={32} />,
    label: 'ยื่นกู้รายใหม่',
    color: '#BE185D',
    gradient: 'linear-gradient(135deg, #BE185D 0%, #9D174D 100%)',
  },
  {
    icon: <Building size={32} />,
    label: 'ดูหอพัก',
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
  },
  {
    icon: <Building size={32} />,
    label: 'ดูหอพัก',
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
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
