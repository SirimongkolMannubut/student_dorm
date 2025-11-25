'use client';

import { Home, DollarSign, Wrench, FileText } from 'lucide-react';

interface StatusCard {
  icon: React.ReactNode;
  label: string;
  status: string;
  color: string;
  gradient: string;
}

const statuses: StatusCard[] = [
  {
    icon: <Home size={32} />,
    label: 'Room Status',
    status: 'Occupied',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  },
  {
    icon: <DollarSign size={32} />,
    label: 'Payment Status',
    status: 'Paid',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  },
  {
    icon: <Wrench size={32} />,
    label: 'Maintenance',
    status: 'No Issues',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  },
  {
    icon: <FileText size={32} />,
    label: 'Announcements',
    status: '3 New',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  },
];

export default function OverviewCards() {
  return (
    <section className="overview-section">
      <div className="overview-container">
        <div className="overview-header">
          <div className="section-badge">ภาพรวม</div>
          <h2 className="overview-title">ภาพรวมสถานะ</h2>
          <p className="overview-subtitle">
            สถานะปัจจุบันของห้องพักและบริการต่างๆ
          </p>
        </div>
        <div className="overview-grid">
          {statuses.map((status, index) => (
            <div
              key={index}
              className="overview-card"
              style={{ '--status-gradient': status.gradient } as React.CSSProperties}
            >
              <div className="overview-icon-wrapper">
                <div className="overview-icon" style={{ background: status.gradient }}>
                  {status.icon}
                </div>
              </div>
              <div className="overview-content">
                <p className="overview-label">{status.label}</p>
                <p className="overview-value">{status.status}</p>
              </div>
              <div className="overview-hover-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

