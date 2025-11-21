'use client';

import { Home, DollarSign, Wrench, FileText, Bell, BarChart3, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <Home size={32} />,
    title: 'จัดการห้องพัก',
    description: 'จัดการข้อมูลห้องพักทั้งหมด ตรวจสอบสถานะห้องว่าง และจัดสรรห้องให้กับนักศึกษา',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  },
  {
    icon: <DollarSign size={32} />,
    title: 'ระบบการชำระเงิน',
    description: 'จัดการค่าเช่า ค่าบำรุงรักษา และตรวจสอบการชำระเงินที่ค้างชำระ',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  },
  {
    icon: <Wrench size={32} />,
    title: 'แจ้งซ่อม',
    description: 'ระบบแจ้งซ่อมและติดตามสถานะการซ่อมแซมอุปกรณ์ภายในห้อง',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  },
  {
    icon: <FileText size={32} />,
    title: 'การจองห้อง',
    description: 'ระบบจองห้องออนไลน์ พร้อมการอนุมัติและจัดการคำขอเข้าพัก',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  },
  {
    icon: <Bell size={32} />,
    title: 'ประกาศและแจ้งเตือน',
    description: 'ส่งประกาศสำคัญและแจ้งเตือนต่างๆ ให้กับผู้พักอาศัย',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  },
  {
    icon: <BarChart3 size={32} />,
    title: 'รายงานและสถิติ',
    description: 'ดูรายงานสรุปข้อมูลและสถิติการใช้งานหอพักแบบเรียลไทม์',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
  },
];

export default function Features() {
  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-background">
          <div className="hero-blur-circle hero-blur-1"></div>
          <div className="hero-blur-circle hero-blur-2"></div>
          <div className="hero-blur-circle hero-blur-3"></div>
        </div>
        <div className="home-hero-container">
          <div className="home-hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>ระบบจัดการหอพักที่ทันสมัย</span>
            </div>
            <h1 className="home-hero-title">
              SSKRU Dormitory
              <span className="home-hero-title-highlight"> System</span>
            </h1>
            <p className="home-hero-description">
              ระบบจัดการหอพักนักศึกษามหาวิทยาลัยราชภัฏศรีสะเกษ อำนวยความสะดวกในการจองห้อง 
              ชำระค่าเช่า และติดตามสถานะหอพักอย่างมีประสิทธิภาพ
            </p>
            <div className="hero-actions">
              <Link href="/dashboard" className="btn-primary">
                เข้าสู่ระบบ
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="features-header">
            <div className="section-badge">ฟีเจอร์</div>
            <h2 className="features-title">ฟีเจอร์หลักของระบบ</h2>
            <p className="features-subtitle">
              ระบบจัดการหอพักที่ครอบคลุมทุกด้านของการบริหารจัดการ
              ออกแบบมาเพื่อความสะดวกและประสิทธิภาพสูงสุด
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card"
                style={{ '--feature-color': feature.color, '--feature-gradient': feature.gradient } as React.CSSProperties}
              >
                <div className="feature-icon-wrapper">
                  <div className="feature-icon" style={{ background: feature.gradient }}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-hover-effect"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

