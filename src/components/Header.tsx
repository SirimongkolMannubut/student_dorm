'use client';

import { Menu, X, User, Bell } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="header-left">
            <button 
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <div className="landing-logo">
              <h1>SSKRU Dormitory System</h1>
            </div>
          </div>
          <nav className="landing-nav">
            <button className="nav-link">
              <Bell size={18} />
            </button>
            <button className="nav-link">
              <User size={18} />
              Profile
            </button>
          </nav>
        </div>
      </header>

      {/* Sidebar Menu */}
      {isMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="sidebar-menu" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-content">
              <div className="menu-item primary">
                <span>กรอกข้อมูลผู้กู้</span>
              </div>
              
              <div className="menu-group">
                <div className="menu-item parent">
                  <span>ข้อมูลผู้เช่า</span>
                </div>
                <div className="submenu">
                  <div className="menu-item sub" onClick={() => window.location.href = '/profile'}>
                    <span>ข้อมูลส่วนตัว</span>
                  </div>
                  <div className="menu-item sub" onClick={() => window.location.href = '/contract'}>
                    <span>สัญญาเช่า</span>
                  </div>
                  <div className="menu-item sub" onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    window.location.href = '/payment-history';
                  }}>
                    <span>ประวัติการชำระเงิน</span>
                  </div>
                  <div className="menu-item sub" onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    window.location.href = '/maintenance';
                  }}>
                    <span>แจ้งซ่อม</span>
                  </div>
                  <div className="menu-item sub">
                    <span>เอกสารผู้เช่า</span>
                  </div>
                  <div className="menu-item sub">
                    <span>ประวัติการย้ายเข้า-ออก</span>
                  </div>
                  <div className="menu-item sub">
                    <span>การแจ้งเตือน</span>
                  </div>
                </div>
              </div>
              
              <div className="menu-group">
                <div className="menu-item parent">
                  <span>เอกสาร</span>
                </div>
                <div className="submenu">
                  <div className="menu-item sub" onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    window.location.href = '/documents';
                  }}>
                    <span>เอกสารที่ส่งแล้ว</span>
                  </div>
                  <div className="menu-item sub">
                    <span>ส่งเอกสาร</span>
                  </div>
                  <div className="menu-item sub">
                    <span>ดาวน์โหลดเอกสาร</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}