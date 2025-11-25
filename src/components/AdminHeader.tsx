'use client';

import { Bell, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUserFromToken, isLoggedIn } from '../lib/auth';

export default function AdminHeader() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn()) {
      setUser(getUserFromToken());
    }
  }, []);

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  };
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
            {user ? user.name : 'ผู้ดูแลระบบ'}
          </button>
          <button className="nav-link logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </nav>
      </div>
    </header>
  );
}