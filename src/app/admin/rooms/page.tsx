'use client';

import { Building, Search, Plus, Edit, Eye } from 'lucide-react';
import AdminHeader from '../../../components/AdminHeader';
import '../../../styles/admin.css';

const rooms = [
  { id: 1, number: 'A301', building: 'A', floor: 3, type: 'เดี่ยว', price: 5000, status: 'occupied', student: 'สมชาย ใจดี' },
  { id: 2, number: 'B205', building: 'B', floor: 2, type: 'คู่', price: 3500, status: 'occupied', student: 'สมหญิง สวยงาม' },
  { id: 3, number: 'C102', building: 'C', floor: 1, type: 'เดี่ยว', price: 5000, status: 'maintenance', student: null },
  { id: 4, number: 'A401', building: 'A', floor: 4, type: 'คู่', price: 3500, status: 'available', student: null },
];

export default function RoomsPage() {
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
              <h1><Building size={24} /> จัดการห้องพัก</h1>
            </div>
            <p>สถานะห้อง การจอง และการบำรุงรักษา</p>
          </div>

          <div className="filters-section">
            <div className="search-box">
              <Search size={20} />
              <input type="text" placeholder="ค้นหาห้องพัก..." />
            </div>
            <button className="add-btn">
              <Plus size={20} />
              เพิ่มห้องพัก
            </button>
          </div>

          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>หมายเลขห้อง</th>
                  <th>อาคาร</th>
                  <th>ชั้น</th>
                  <th>ประเภท</th>
                  <th>ราคา</th>
                  <th>สถานะ</th>
                  <th>ผู้เช่า</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room.id}>
                    <td>{room.number}</td>
                    <td>{room.building}</td>
                    <td>{room.floor}</td>
                    <td>{room.type}</td>
                    <td>{room.price.toLocaleString()} ฿</td>
                    <td>
                      <span className={`status-badge ${room.status}`}>
                        {room.status === 'available' && 'ว่าง'}
                        {room.status === 'occupied' && 'มีผู้เช่า'}
                        {room.status === 'maintenance' && 'ซ่อมบำรุง'}
                      </span>
                    </td>
                    <td>{room.student || '-'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn view">
                          <Eye size={16} />
                        </button>
                        <button className="action-btn edit">
                          <Edit size={16} />
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