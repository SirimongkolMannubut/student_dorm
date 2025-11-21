'use client';

import { ChevronRight, CheckCircle2, FileText, DollarSign, Home } from 'lucide-react';

const tasks = [
  {
    id: 1,
    icon: <FileText size={20} />,
    title: 'อนุมัติคำขอเข้าพักใหม่',
    count: 3,
    type: 'request',
  },
  {
    id: 2,
    icon: <CheckCircle2 size={20} />,
    title: 'ใบแจ้งซ่อมที่ยังไม่ตรวจสอบ',
    count: 2,
    type: 'repair',
  },
  {
    id: 3,
    icon: <DollarSign size={20} />,
    title: 'ห้อง B-203 ค้างค่าเช่า',
    type: 'payment',
  },
];

export default function Tasks() {
  return (
    <section className="tasks-section">
      <div className="section-header">
        <h2 className="section-title">งานที่ต้องทำ</h2>
      </div>
      
      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <div className="task-icon" style={{ color: '#1E3A8A' }}>
              {task.icon}
            </div>
            <div className="task-content">
              <p className="task-title">
                {task.title}
                {task.count && <span className="task-count"> {task.count} รายการ</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="manage-btn">
        จัดการทั้งหมด
        <ChevronRight size={18} />
      </button>
    </section>
  );
}

