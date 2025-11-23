'use client';

import { useState, useEffect } from 'react';
import { Building, Search, Plus, Edit, Eye } from 'lucide-react';
import AdminHeader from '../../../components/AdminHeader';
import '../../../styles/admin.css';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

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
                  <tr key={room._id}>
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
                    <td>{room.occupant ? `${room.occupant.firstName} ${room.occupant.lastName}` : '-'}</td>
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