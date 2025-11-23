'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Check, X, Eye } from 'lucide-react';
import AdminHeader from '../../../components/AdminHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import '../../../styles/admin.css';

export default function StudentsPage() {
  const [filter, setFilter] = useState('all');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStudentStatus = async (userId, status) => {
    try {
      const response = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status })
      });
      
      if (response.ok) {
        fetchStudents(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredStudents = students.filter(student => 
    filter === 'all' || student.status === filter
  );

  if (loading) {
    return (
      <div className="admin-page">
        <AdminHeader />
        <main className="admin-main">
          <div className="admin-container">
            <div>Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
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
                  <tr key={student._id}>
                    <td>{student.studentId || '-'}</td>
                    <td>{student.firstName} {student.lastName}</td>
                    <td>{student.room?.number || '-'}</td>
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
                            <button 
                              className="action-btn approve"
                              onClick={() => updateStudentStatus(student._id, 'approved')}
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              className="action-btn reject"
                              onClick={() => updateStudentStatus(student._id, 'rejected')}
                            >
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
    </ProtectedRoute>
  );
}