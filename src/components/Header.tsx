'use client';

import { Search, Bell, User, LogOut } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h1>SSKRU Dormitory System</h1>
        </div>
        
        <div className="header-actions">
          <button className="header-icon-btn" aria-label="Search">
            <Search size={20} />
          </button>
          
          <button className="header-icon-btn" aria-label="Notifications">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
          
          <div className="header-profile">
            <button className="profile-btn">
              <User size={20} />
              <span>Admin User</span>
            </button>
            <button className="logout-btn" aria-label="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

