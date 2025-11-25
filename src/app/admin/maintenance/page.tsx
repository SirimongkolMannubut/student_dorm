'use client';

import { useState, useEffect } from 'react';
import { Wrench, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import AdminHeader from '../../../components/AdminHeader';
import '../../../styles/admin.css';

export default function MaintenancePage() {
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);

  useEffect(() => {
    loadMaintenances();
  }, []);

  const loadMaintenances = async () => {
    try {
      const response = await fetch('/api/admin/maintenance');
      const data = await response.json();
      setMaintenanceRequests(data.maintenances || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
      const response = await fetch('/api/maintenance', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, status })
      });

      if (response.ok) {
        loadMaintenances();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
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
                  <tr key={request._id}>
                    <td>{request.roomId}</td>
                    <td>{request.userId}</td>
                    <td>{request.description}</td>
                    <td>{new Date(request.createdAt).toLocaleDateString('th-TH')}</td>
                    <td>
                      <span className="priority-badge medium">{request.category}</span>
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
                        {request.status === 'pending' && (
                          <button className="action-btn view" onClick={() => updateStatus(request._id, 'in-progress')}>
                            ดำเนินการ
                          </button>
                        )}
                        {request.status === 'in-progress' && (
                          <button className="action-btn view" onClick={() => updateStatus(request._id, 'completed')}>
                            เสร็จสิ้น
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