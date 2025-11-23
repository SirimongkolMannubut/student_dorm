'use client';

import { Wrench, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import AdminHeader from '../../../components/AdminHeader';
import '../../../styles/admin.css';

const maintenanceRequests = [
  { id: 1, room: 'A301', student: 'สมชาย ใจดี', issue: 'ก๊อกน้ำเสีย', date: '2024-01-15', status: 'pending', priority: 'high' },
  { id: 2, room: 'B205', student: 'สมหญิง สวยงาม', issue: 'หลอดไฟขาด', date: '2024-01-14', status: 'in-progress', priority: 'medium' },
  { id: 3, room: 'C102', student: 'วิชัย เก่งมาก', issue: 'แอร์เสีย', date: '2024-01-13', status: 'completed', priority: 'high' },
];

export default function MaintenancePage() {
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
              <h1><Wrench size={24} /> จัดการซ่อมบำรุง</h1>
            </div>
            <p>รายการแจ้งซ่อม การติดตาม และการดำเนินการ</p>
          </div>

          <div className="filters-section">
            <div className="search-box">
              <Search size={20} />
              <input type="text" placeholder="ค้นหารายการซ่อม..." />
            </div>
            <div className="filter-buttons">
              <button className="filter-btn active">ทั้งหมด</button>
              <button className="filter-btn">รอดำเนินการ</button>
              <button className="filter-btn">กำลังซ่อม</button>
              <button className="filter-btn">เสร็จสิ้น</button>
            </div>
          </div>

          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>ห้องพัก</th>
                  <th>นักศึกษา</th>
                  <th>ปัญหา</th>
                  <th>วันที่แจ้ง</th>
                  <th>ความสำคัญ</th>
                  <th>สถานะ</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceRequests.map(request => (
                  <tr key={request.id}>
                    <td>{request.room}</td>
                    <td>{request.student}</td>
                    <td>{request.issue}</td>
                    <td>{request.date}</td>
                    <td>
                      <span className={`priority-badge ${request.priority}`}>
                        {request.priority === 'high' && 'สูง'}
                        {request.priority === 'medium' && 'ปานกลาง'}
                        {request.priority === 'low' && 'ต่ำ'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${request.status}`}>
                        {request.status === 'pending' && (
                          <>
                            <Clock size={14} />
                            รอดำเนินการ
                          </>
                        )}
                        {request.status === 'in-progress' && (
                          <>
                            <AlertCircle size={14} />
                            กำลังซ่อม
                          </>
                        )}
                        {request.status === 'completed' && (
                          <>
                            <CheckCircle size={14} />
                            เสร็จสิ้น
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn view">
                          <Wrench size={16} />
                        </button>
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