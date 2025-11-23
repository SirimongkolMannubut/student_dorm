'use client';

import { CreditCard, Search, Download, Eye } from 'lucide-react';
import AdminHeader from '../../../components/AdminHeader';
import '../../../styles/admin.css';

const payments = [
  { id: 1, student: 'สมชาย ใจดี', room: 'A301', amount: 5000, date: '2024-01-15', status: 'paid', receipt: 'RCP001' },
  { id: 2, student: 'สมหญิง สวยงาม', room: 'B205', amount: 3500, date: '2024-01-10', status: 'paid', receipt: 'RCP002' },
  { id: 3, student: 'วิชัย เก่งมาก', room: 'C102', amount: 5000, date: '2024-01-20', status: 'pending', receipt: null },
];

export default function FinancePage() {
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
              <h1><CreditCard size={24} /> จัดการการเงิน</h1>
            </div>
            <p>ชำระเงิน ใบเสร็จ และรายงานทางการเงิน</p>
          </div>

          <div className="filters-section">
            <div className="search-box">
              <Search size={20} />
              <input type="text" placeholder="ค้นหาการชำระเงิน..." />
            </div>
            <div className="filter-buttons">
              <button className="filter-btn active">ทั้งหมด</button>
              <button className="filter-btn">ชำระแล้ว</button>
              <button className="filter-btn">รอชำระ</button>
            </div>
          </div>

          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>นักศึกษา</th>
                  <th>ห้องพัก</th>
                  <th>จำนวนเงิน</th>
                  <th>วันที่</th>
                  <th>สถานะ</th>
                  <th>เลขที่ใบเสร็จ</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.student}</td>
                    <td>{payment.room}</td>
                    <td>{payment.amount.toLocaleString()} ฿</td>
                    <td>{payment.date}</td>
                    <td>
                      <span className={`status-badge ${payment.status}`}>
                        {payment.status === 'paid' && 'ชำระแล้ว'}
                        {payment.status === 'pending' && 'รอชำระ'}
                      </span>
                    </td>
                    <td>{payment.receipt || '-'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn view">
                          <Eye size={16} />
                        </button>
                        {payment.receipt && (
                          <button className="action-btn download">
                            <Download size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}