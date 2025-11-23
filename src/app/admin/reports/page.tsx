'use client';

import { BarChart3, Download, Calendar, TrendingUp, Users, Building, CreditCard } from 'lucide-react';
import AdminHeader from '../../../components/AdminHeader';
import '../../../styles/admin.css';

export default function ReportsPage() {
  return (
    <div className="admin-page">
      <AdminHeader />
      
      <main className="admin-main">
        <div className="admin-container">
          <div className="page-header">
            <div className="header-with-back">
              <button className="back-btn" onClick={() => window.history.back()}>
                ← กลับ
              </button>
              <h1><BarChart3 size={24} /> รายงาน</h1>
            </div>
            <p>สถิติและรายงานต่างๆ ของระบบหอพัก</p>
          </div>

          <div className="reports-grid">
            <div className="report-card">
              <div className="report-header">
                <Users size={24} />
                <h3>รายงานนักศึกษา</h3>
              </div>
              <p>สถิตินักศึกษาที่เข้าพัก การสมัคร และการอนุมัติ</p>
              <button className="report-btn">
                <Download size={16} />
                ดาวน์โหลด
              </button>
            </div>

            <div className="report-card">
              <div className="report-header">
                <Building size={24} />
                <h3>รายงานห้องพัก</h3>
              </div>
              <p>สถิติการใช้งานห้องพัก อัตราการเข้าพัก</p>
              <button className="report-btn">
                <Download size={16} />
                ดาวน์โหลด
              </button>
            </div>

            <div className="report-card">
              <div className="report-header">
                <CreditCard size={24} />
                <h3>รายงานการเงิน</h3>
              </div>
              <p>รายได้ รายจ่าย และสถิติการชำระเงิน</p>
              <button className="report-btn">
                <Download size={16} />
                ดาวน์โหลด
              </button>
            </div>

            <div className="report-card">
              <div className="report-header">
                <TrendingUp size={24} />
                <h3>รายงานประจำเดือน</h3>
              </div>
              <p>สรุปข้อมูลประจำเดือนทั้งหมด</p>
              <button className="report-btn">
                <Download size={16} />
                ดาวน์โหลด
              </button>
            </div>
          </div>

          <div className="date-filter">
            <h3>กรองตามวันที่</h3>
            <div className="date-inputs">
              <div className="date-group">
                <label>วันที่เริ่มต้น</label>
                <input type="date" />
              </div>
              <div className="date-group">
                <label>วันที่สิ้นสุด</label>
                <input type="date" />
              </div>
              <button className="filter-apply-btn">
                <Calendar size={16} />
                ใช้ตัวกรอง
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}