'use client';

import { Menu, X, User, Bell, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUserFromToken, isLoggedIn } from '../lib/auth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
      if (token) {
        try {
          const response = await fetch('/api/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            console.log('User data from API:', userData);
            setUser(userData);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };
    
    fetchUser();
  }, []);

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  };

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
            <button className="nav-link" onClick={() => window.location.href = '/profile'}>
              <User size={18} />
              {user?.firstName || 'Profile'}
            </button>
            <button className="nav-link logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
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
                  <div className="menu-item sub" onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    window.location.href = '/tenant-documents';
                  }}>
                    <span>เอกสารผู้เช่า</span>
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
                  <div className="menu-item sub" onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    window.location.href = '/submit-document';
                  }}>
                    <span>ส่งเอกสาร</span>
                  </div>
                  <div className="menu-item sub" onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    window.location.href = '/download-document';
                  }}>
                    <span>ดาวน์โหลดเอกสาร</span>
                  </div>
                </div>
              </div>
              
              <div className="menu-item primary" onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(false);
                window.location.href = '/rooms';
              }}>
                <span>ดูหอพัก</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}