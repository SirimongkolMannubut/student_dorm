'use client';

import { Home, Users, Square, DollarSign, Wrench, FileText } from 'lucide-react';

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const stats: StatCard[] = [
  {
    icon: <Home size={24} />,
    label: 'ห้องทั้งหมด',
    value: '150',
    color: '#3B82F6',
  },
  {
    icon: <Users size={24} />,
    label: 'นักศึกษาพักอยู่',
    value: '142',
    color: '#10B981',
  },
  {
    icon: <Square size={24} />,
    label: 'ห้องว่าง',
    value: '8',
    color: '#6366F1',
  },
  {
    icon: <DollarSign size={24} />,
    label: 'ค่าหอค้างชำระ',
    value: '5',
    color: '#F59E0B',
  },
  {
    icon: <Wrench size={24} />,
    label: 'แจ้งซ่อมค้าง',
    value: '2',
    color: '#EF4444',
  },
  {
    icon: <FileText size={24} />,
    label: 'คำขอใหม่',
    value: '3',
    color: '#8B5CF6',
  },
];

export default function OverviewCards() {
  return (
    <section className="overview-section">
      <h2 className="section-title">ภาพรวมระบบ</h2>
      <div className="overview-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

