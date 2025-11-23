'use client';

import { Home, CreditCard, Wrench, FileText, User, Bell, Calendar, MapPin, Menu, X, UserPlus, Users, FolderOpen, Send, Download, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';



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
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quickStats, setQuickStats] = useState([
    { label: 'ห้องของฉัน', value: 'ยังไม่ได้เลือกห้อง', icon: <Home size={20} />, color: '#94A3B8' },
    { label: 'ค่าเช่าเดือนนี้', value: '-', icon: <CreditCard size={20} />, color: '#94A3B8' },
    { label: 'แจ้งซ่อม', value: '-', icon: <Wrench size={20} />, color: '#94A3B8' },
    { label: 'ประกาศใหม่', value: '5 รายการ', icon: <Bell size={20} />, color: '#8B5CF6' },
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.fullName || 'ผู้ใช้');
      setStudentId(user.studentId || '');
      
      // อัปเดต quickStats ตามสถานะห้อง
      updateQuickStats(user);
      fetchNotifications(user.studentId);
    }
  }, []);
  
  const updateQuickStats = (user) => {
    const roomStatus = user.roomStatus || 'none';
    const assignedRoom = user.assignedRoom || null;
    
    if (roomStatus === 'approved' && assignedRoom) {
      setQuickStats([
        { label: 'ห้องของฉัน', value: assignedRoom, icon: <Home size={20} />, color: '#3B82F6' },
        { label: 'ค่าเช่าเดือนนี้', value: '3,500 ฿', icon: <CreditCard size={20} />, color: '#10B981' },
        { label: 'แจ้งซ่อม', value: '2 รายการ', icon: <Wrench size={20} />, color: '#F59E0B' },
        { label: 'ประกาศใหม่', value: '5 รายการ', icon: <Bell size={20} />, color: '#8B5CF6' },
      ]);
    } else {
      setQuickStats([
        { label: 'ห้องของฉัน', value: 'ยังไม่ได้เลือกห้อง', icon: <Home size={20} />, color: '#94A3B8' },
        { label: 'ค่าเช่าเดือนนี้', value: '-', icon: <CreditCard size={20} />, color: '#94A3B8' },
        { label: 'แจ้งซ่อม', value: '-', icon: <Wrench size={20} />, color: '#94A3B8' },
        { label: 'ประกาศใหม่', value: '5 รายการ', icon: <Bell size={20} />, color: '#8B5CF6' },
      ]);
    }
  };

  const fetchNotifications = (studentId: string) => {
    if (typeof window === 'undefined') return;
    
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const userNotifications = allNotifications.filter(n => n.studentId === studentId);
    setNotifications(userNotifications);
  };

  const markAsRead = (notificationId: number) => {
    if (typeof window === 'undefined') return;
    
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedNotifications = allNotifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    fetchNotifications(studentId);
  };

  const downloadContract = async (contractUrl?: string, contractId?: string) => {
    try {
      const link = document.createElement('a');
      link.href = contractUrl || '/api/contracts/download/default';
      link.download = `สัญญาเช่าห้องพักหอพักมหาวิทยาลัยราชภัฏศรีสะเกษ.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('เริ่มดาวน์โหลดสัญญาเช่าแล้ว');
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการดาวน์โหลด');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <div className="simple-dashboard">
      {/* Header */}
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
          <nav className="landing-nav" style={{ gap: '0.25rem' }}>
            <button 
              type="button" 
              className="nav-link notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            <button 
              type="button" 
              className="nav-link profile-btn"
              onClick={() => setShowProfile(!showProfile)}
            >
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

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>การแจ้งเตือน</h3>
                <button 
                  className="close-notifications"
                  onClick={() => setShowNotifications(false)}
                >
                  ×
                </button>
              </div>
              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.map((notification: any) => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="notification-content">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <span className="notification-time">
                          {new Date(notification.createdAt).toLocaleString('th-TH')}
                        </span>
                      </div>
                      {notification.contractUrl && (
                        <button 
                          className="download-contract-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadContract(notification.contractUrl, notification.contractId);
                          }}
                        >
                          ดาวน์โหลดสัญญา
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">
                    <p>ไม่มีการแจ้งเตือน</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <h3>โปรไฟล์</h3>
                <button 
                  className="close-profile"
                  onClick={() => setShowProfile(false)}
                >
                  ×
                </button>
              </div>
              <div className="profile-menu">
                <button 
                  className="profile-menu-item"
                  onClick={() => window.location.href = '/profile'}
                >
                  <User size={18} />
                  ข้อมูลส่วนตัว & สัญญา
                </button>
                <button 
                  className="profile-menu-item"
                  onClick={() => window.location.href = '/contract'}
                >
                  <FileText size={18} />
                  สัญญาดิจิทัล
                </button>
                <button 
                  className="profile-menu-item logout"
                  onClick={logout}
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Sidebar Menu */}
      {isMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="sidebar-menu" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-content">
              <div className="menu-item primary">
                <UserPlus size={18} />
                <span>กรอกข้อมูลผู้กู้</span>
              </div>
              
              <div className="menu-group">
                <div className="menu-item parent">
                  <Users size={18} />
                  <span>ข้อมูลผู้เช่า</span>
                  <ChevronRight size={16} className="chevron" />
                </div>
                <div className="submenu">
                  <div className="menu-item sub" onClick={() => window.location.href = '/profile'}>
                    <User size={14} />
                    <span>ข้อมูลส่วนตัว</span>
                  </div>
                  <div className="menu-item sub" onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = '/contract';
                  }}>
                    <FileText size={14} />
                    <span>สัญญาเช่า</span>
                  </div>
                  <div className="menu-item sub" onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    window.location.href = '/payment-history';
                  }}>
                    <CreditCard size={14} />
                    <span>ประวัติการชำระเงิน</span>
                  </div>
                  <div className="menu-item sub" onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    window.location.href = '/maintenance';
                  }}>
                    <Wrench size={14} />
                    <span>แจ้งซ่อม</span>
                  </div>
                  <div className="menu-item sub">
                    <FolderOpen size={14} />
                    <span>เอกสารผู้เช่า</span>
                  </div>
                  <div className="menu-item sub">
                    <Home size={14} />
                    <span>ประวัติการย้ายเข้า-ออก</span>
                  </div>
                  <div className="menu-item sub">
                    <Bell size={14} />
                    <span>การแจ้งเตือน</span>
                  </div>
                </div>
              </div>
              
              <div className="menu-group">
                <div className="menu-item parent">
                  <FileText size={18} />
                  <span>เอกสาร</span>
                  <ChevronRight size={16} className="chevron" />
                </div>
                <div className="submenu">
                  <div className="menu-item sub" onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    window.location.href = '/documents';
                  }}>
                    <FolderOpen size={14} />
                    <span>เอกสารที่ส่งแล้ว</span>
                  </div>
                  <div className="menu-item sub">
                    <Send size={14} />
                    <span>ส่งเอกสาร</span>
                  </div>
                  <div className="menu-item sub">
                    <Download size={14} />
                    <span>ดาวน์โหลดเอกสาร</span>
                  </div>
                </div>
              </div>
              
              <div className="menu-item primary">
                <UserPlus size={18} />
                <span>ยื่นกู้รายใหม่</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {(showNotifications || showProfile) && (
        <div 
          className="notifications-overlay"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </div>
  );
}

