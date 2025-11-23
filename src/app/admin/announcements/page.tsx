'use client';

import { FileText, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import AdminHeader from '../../../components/AdminHeader';
import '../../../styles/admin.css';

const announcements = [
  { id: 1, title: 'ประกาศปิดระบบชั่วคราว', content: 'ระบบจะปิดปรับปรุงในวันที่ 25 มกราคม 2567', date: '2024-01-15', status: 'active' },
  { id: 2, title: 'กำหนดชำระค่าหอพัก', content: 'กำหนดชำระค่าหอพักภาคเรียนที่ 2/2566', date: '2024-01-10', status: 'active' },
  { id: 3, title: 'ประกาศเก่า', content: 'ประกาศที่หมดอายุแล้ว', date: '2024-01-01', status: 'inactive' },
];

export default function AnnouncementsPage() {
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
              <h1><FileText size={24} /> จัดการประกาศ</h1>
            </div>
            <p>เพิ่ม แก้ไข ลบประกาศสำหรับนักศึกษา</p>
          </div>

          <div className="filters-section">
            <div className="search-box">
              <Search size={20} />
              <input type="text" placeholder="ค้นหาประกาศ..." />
            </div>
            <button className="add-btn">
              <Plus size={20} />
              เพิ่มประกาศ
            </button>
          </div>

          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>หัวข้อ</th>
                  <th>เนื้อหา</th>
                  <th>วันที่สร้าง</th>
                  <th>สถานะ</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map(announcement => (
                  <tr key={announcement.id}>
                    <td>{announcement.title}</td>
                    <td className="content-preview">{announcement.content}</td>
                    <td>{announcement.date}</td>
                    <td>
                      <span className={`status-badge ${announcement.status}`}>
                        {announcement.status === 'active' && 'เปิดใช้งาน'}
                        {announcement.status === 'inactive' && 'ปิดใช้งาน'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn view">
                          <Eye size={16} />
                        </button>
                        <button className="action-btn edit">
                          <Edit size={16} />
                        </button>
                        <button className="action-btn delete">
                          <Trash2 size={16} />
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