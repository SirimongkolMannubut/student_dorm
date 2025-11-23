'use client';

import { Bell, LogOut, User } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="landing-header">
      <div className="landing-header-container">
        <div className="landing-logo">
          <h1>SSKRU Dormitory System - Admin</h1>
        </div>
        <nav className="landing-nav">
          <button className="nav-link">
            <Bell size={18} />
            <span className="notification-badge">5</span>
          </button>
          <button className="nav-link">
            <User size={18} />
            ผู้ดูแลระบบ
          </button>
          <button className="nav-link logout-btn">
            <LogOut size={18} />
          </button>
        </nav>
      </div>
    </header>
  );
}