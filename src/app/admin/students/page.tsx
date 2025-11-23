'use client';

import { useState } from 'react';
import { Users, Search, Check, X, Eye } from 'lucide-react';
import AdminHeader from '../../../components/AdminHeader';
import '../../../styles/admin.css';

const students = [
  { id: 1, name: 'สมชาย ใจดี', studentId: '65001234', room: 'A301', status: 'pending', phone: '081-234-5678' },
  { id: 2, name: 'สมหญิง สวยงาม', studentId: '65001235', room: 'B205', status: 'approved', phone: '082-345-6789' },
  { id: 3, name: 'วิชัย เก่งมาก', studentId: '65001236', room: null, status: 'rejected', phone: '083-456-7890' },
];

export default function StudentsPage() {
  const [filter, setFilter] = useState('all');

  const filteredStudents = students.filter(student => 
    filter === 'all' || student.status === filter
  );

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
              <h1><Users size={24} /> จัดการนักศึกษา</h1>
            </div>
            <p>ดูข้อมูล อนุมัติ ปฏิเสธการสมัครของนักศึกษา</p>
          </div>

          <div className="filters-section">
            <div className="search-box">
              <Search size={20} />
              <input type="text" placeholder="ค้นหานักศึกษา..." />
            </div>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                ทั้งหมด
              </button>
              <button 
                className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                รออนุมัติ
              </button>
              <button 
                className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
                onClick={() => setFilter('approved')}
              >
                อนุมัติแล้ว
              </button>
              <button 
                className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                onClick={() => setFilter('rejected')}
              >
                ปฏิเสธ
              </button>
            </div>
          </div>

          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>รหัสนักศึกษา</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>ห้องพัก</th>
                  <th>เบอร์โทร</th>
                  <th>สถานะ</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.studentId}</td>
                    <td>{student.name}</td>
                    <td>{student.room || '-'}</td>
                    <td>{student.phone}</td>
                    <td>
                      <span className={`status-badge ${student.status}`}>
                        {student.status === 'pending' && 'รออนุมัติ'}
                        {student.status === 'approved' && 'อนุมัติแล้ว'}
                        {student.status === 'rejected' && 'ปฏิเสธ'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn view">
                          <Eye size={16} />
                        </button>
                        {student.status === 'pending' && (
                          <>
                            <button className="action-btn approve">
                              <Check size={16} />
                            </button>
                            <button className="action-btn reject">
                              <X size={16} />
                            </button>
                          </>
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