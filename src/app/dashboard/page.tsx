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
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      // ถ้าข้อมูลไม่ครบ ให้อัปเดตด้วยข้อมูลครบถ้วน
      if (!user.year || !user.major || !user.faculty || !user.phone) {
        const updatedUser = {
          ...user,
          year: user.year || '3',
          major: user.major || 'วิทยาการคอมพิวเตอร์',
          faculty: user.faculty || 'คณะวิทยาศาสตร์และเทคโนโลยี',
          phone: user.phone || '0812345678'
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      setUserName(user.fullName || 'ผู้ใช้');
      setStudentId(user.studentId || '');
      fetchNotifications(user.studentId);
    }
  }, []);

  const fetchNotifications = async (studentId: string) => {
    try {
      const response = await fetch(`/api/notifications?studentId=${studentId}`);
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_read',
          notificationId
        })
      });
      fetchNotifications(studentId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
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
          <div className="landing-logo">
            <h1>SSKRU Dormitory System</h1>
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
                  onClick={() => downloadContract()}
                >
                  <FileText size={18} />
                  ดาวน์โหลดสัญญาเช่า
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

