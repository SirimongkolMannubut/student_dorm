'use client';

import { Building2 } from 'lucide-react';

interface Building {
  id: string;
  name: string;
  availableRooms: number;
  totalRooms: number;
  isFull: boolean;
}

const buildings: Building[] = [
  {
    id: 'A',
    name: 'อาคาร A',
    availableRooms: 5,
    totalRooms: 50,
    isFull: false,
  },
  {
    id: 'B',
    name: 'อาคาร B',
    availableRooms: 2,
    totalRooms: 50,
    isFull: false,
  },
  {
    id: 'C',
    name: 'อาคาร C',
    availableRooms: 0,
    totalRooms: 50,
    isFull: true,
  },
];

export default function BuildingMap() {
  return (
    <section className="building-map-section">
      <div className="section-header">
        <h2 className="section-title">แผนที่อาคาร</h2>
        <p className="section-subtitle">คลิกที่อาคาร เพื่อดูรายละเอียด</p>
      </div>
      
      <div className="buildings-grid">
        {buildings.map((building) => (
          <div
            key={building.id}
            className={`building-card ${building.isFull ? 'building-full' : ''}`}
          >
            <div className="building-icon">
              <Building2 size={32} />
            </div>
            <h3 className="building-name">{building.name}</h3>
            <div className="building-status">
              {building.isFull ? (
                <span className="status-full">เต็ม</span>
              ) : (
                <span className="status-available">
                  ห้องว่าง {building.availableRooms}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

