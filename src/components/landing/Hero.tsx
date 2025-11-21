'use client';

import { ArrowRight, Building2, Users, Shield, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            SSKRU Dormitory
            <span className="hero-title-highlight"> System</span>
          </h1>
          <p className="hero-description">
            ระบบจัดการหอพักนักศึกษามหาวิทยาลัยราชภัฏศรีสะเกษ อำนวยความสะดวกในการจองห้อง 
            ชำระค่าเช่า และติดตามสถานะหอพักอย่างมีประสิทธิภาพ
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <Building2 size={20} />
              <span>จัดการห้องพัก</span>
            </div>
            <div className="hero-feature">
              <Users size={20} />
              <span>จัดการผู้พักอาศัย</span>
            </div>
            <div className="hero-feature">
              <Shield size={20} />
              <span>ระบบความปลอดภัย</span>
            </div>
            <div className="hero-feature">
              <Clock size={20} />
              <span>ตรวจสอบแบบเรียลไทม์</span>
            </div>
          </div>
          <div className="hero-actions">
            <Link href="/dashboard" className="btn-primary">
              เข้าสู่ระบบ
              <ArrowRight size={20} />
            </Link>
            <Link href="#features" className="btn-secondary">
              เรียนรู้เพิ่มเติม
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

