'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Droplets, Send, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminUtilitiesPage() {
  const [students, setStudents] = useState([
    { id: '62010001', name: 'สมชาย ใจดี', room: 'A-301' },
    { id: '6612732129', name: 'Louis', room: 'A-301' }
  ]);
  
  const [utilityBills, setUtilityBills] = useState([]);
  const [newBill, setNewBill] = useState({
    month: new Date().toISOString().slice(0, 7),
    electricUnits: '',
    electricRate: '8',
    waterAmount: '200',
    selectedRoom: ''
  });
  
  const [filters, setFilters] = useState({
    building: '',
    gender: ''
  });
  
  const allRooms = {
    'A': { type: 'ชาย', rooms: ['A-301', 'A-302', 'A-303', 'A-304', 'A-305'] },
    'B': { type: 'หญิง', rooms: ['B-201', 'B-202', 'B-203', 'B-204', 'B-205'] },
    'C': { type: 'ชาย', rooms: ['C-101', 'C-102', 'C-103', 'C-104', 'C-105'] }
  };
  
  const getFilteredRooms = () => {
    let rooms = [];
    
    Object.keys(allRooms).forEach(building => {
      const buildingData = allRooms[building];
      
      // กรองตามตึก
      if (filters.building && building !== filters.building) return;
      
      // กรองตามเพศ
      if (filters.gender && buildingData.type !== filters.gender) return;
      
      rooms.push(...buildingData.rooms);
    });
    
    return rooms;
  };

  const calculateTotal = (electricUnits, electricRate, waterAmount) => {
    const electric = parseFloat(electricUnits) * parseFloat(electricRate);
    const water = parseFloat(waterAmount);
    return electric + water;
  };

  const handleCreateBill = () => {
    if (!newBill.electricUnits) {
      alert('กรุณากรอกหน่วยไฟฟ้า');
      return;
    }
    
    if (!newBill.selectedRoom) {
      alert('กรุณาเลือกห้อง');
      return;
    }

    const bill = {
      id: Date.now(),
      month: newBill.month,
      electricUnits: parseFloat(newBill.electricUnits),
      electricRate: parseFloat(newBill.electricRate),
      electricAmount: parseFloat(newBill.electricUnits) * parseFloat(newBill.electricRate),
      waterAmount: parseFloat(newBill.waterAmount),
      roomNumber: newBill.selectedRoom,
      totalAmount: calculateTotal(newBill.electricUnits, newBill.electricRate, newBill.waterAmount),
      createdDate: new Date().toLocaleString('th-TH'),
      status: 'sent'
    };

    setUtilityBills(prev => [...prev, bill]);
    
    // รีเซ็ตฟอร์ม
    setNewBill({
      month: new Date().toISOString().slice(0, 7),
      electricUnits: '',
      electricRate: '8',
      waterAmount: '200',
      selectedRoom: ''
    });

    alert(`แจ้งค่าสาธารณูปโภคสำเร็จ!\nเดือน: ${bill.month}\nยอดรวม: ${bill.totalAmount.toLocaleString()} บาท`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        padding: '1rem 0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0' }}>แจ้งค่าสาธารณูปโภค</h1>
          <Link href="/admin" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            transition: 'background 0.2s'
          }}>
            <ArrowLeft size={18} />
            กลับ Admin
          </Link>
        </div>
      </header>

      <main style={{ padding: '2rem 0', marginTop: '64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* ฟอร์มสร้างบิลใหม่ */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={24} />
              สร้างบิลค่าสาธารณูปโภค
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  เดือน/ปี
                </label>
                <input
                  type="month"
                  value={newBill.month}
                  onChange={(e) => setNewBill({...newBill, month: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  <Zap size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  หน่วยไฟฟ้า (kWh)
                </label>
                <input
                  type="number"
                  value={newBill.electricUnits}
                  onChange={(e) => setNewBill({...newBill, electricUnits: e.target.value})}
                  placeholder="เช่น 150"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  อัตราไฟฟ้า (บาท/หน่วย)
                </label>
                <input
                  type="number"
                  value={newBill.electricRate}
                  onChange={(e) => setNewBill({...newBill, electricRate: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  <Droplets size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  ค่าน้ำ (บาท)
                </label>
                <input
                  type="number"
                  value={newBill.waterAmount}
                  onChange={(e) => setNewBill({...newBill, waterAmount: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  กรองตามตึก
                </label>
                <select
                  value={filters.building}
                  onChange={(e) => {
                    setFilters({...filters, building: e.target.value});
                    setNewBill({...newBill, selectedRoom: ''});
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: 'white'
                  }}
                >
                  <option value="">ทุกตึก</option>
                  <option value="A">ตึก A (ชาย)</option>
                  <option value="B">ตึก B (หญิง)</option>
                  <option value="C">ตึก C (ชาย)</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  กรองตามเพศ
                </label>
                <select
                  value={filters.gender}
                  onChange={(e) => {
                    setFilters({...filters, gender: e.target.value});
                    setNewBill({...newBill, selectedRoom: ''});
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: 'white'
                  }}
                >
                  <option value="">ทุกเพศ</option>
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  เลือกห้อง
                </label>
                <select
                  value={newBill.selectedRoom}
                  onChange={(e) => setNewBill({...newBill, selectedRoom: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: 'white'
                  }}
                >
                  <option value="">เลือกห้อง</option>
                  {getFilteredRooms().map(room => {
                    const building = room.split('-')[0];
                    const roomType = allRooms[building]?.type;
                    return (
                      <option key={room} value={room}>
                        {room} ({roomType})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            
            {newBill.electricUnits && (
              <div style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '2px solid #3b82f6'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>สรุปค่าใช้จ่าย</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div>ค่าไฟฟ้า: {(parseFloat(newBill.electricUnits) * parseFloat(newBill.electricRate)).toLocaleString()} บาท</div>
                  <div>ค่าน้ำ: {parseFloat(newBill.waterAmount).toLocaleString()} บาท</div>
                  <div>ค่าอินเทอร์เน็ต: {parseFloat(newBill.internetAmount).toLocaleString()} บาท</div>
                  <div style={{ fontWeight: '700', color: '#1e293b' }}>
                    รวม: {calculateTotal(newBill.electricUnits, newBill.electricRate, newBill.waterAmount, newBill.internetAmount).toLocaleString()} บาท
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={handleCreateBill}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Send size={20} />
              แจ้งค่าสาธารณูปโภค
            </button>
          </div>

          {/* ประวัติการแจ้งค่าสาธารณูปโภค */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: '0' }}>ประวัติการแจ้งค่าสาธารณูปโภค</h3>
            </div>
            
            {utilityBills.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                ยังไม่มีการแจ้งค่าสาธารณูปโภค
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                  gap: '1rem',
                  padding: '1rem',
                  background: '#f8fafc',
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '0.875rem'
                }}>
                  <span>เดือน/ปี</span>
                  <span>ค่าไฟฟ้า</span>
                  <span>ค่าน้ำ</span>
                  <span>ค่าอินเทอร์เน็ต</span>
                  <span>ยอดรวม</span>
                  <span>วันที่แจ้ง</span>
                  <span>สถานะ</span>
                </div>
                
                {utilityBills.map((bill, index) => (
                  <div key={bill.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                    gap: '1rem',
                    padding: '1rem',
                    borderBottom: index < utilityBills.length - 1 ? '1px solid #e5e7eb' : 'none',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: '500' }}>{bill.month}</span>
                    <span>{bill.electricAmount.toLocaleString()} ฿</span>
                    <span>{bill.waterAmount.toLocaleString()} ฿</span>
                    <span>{bill.internetAmount.toLocaleString()} ฿</span>
                    <span style={{ fontWeight: '700', color: '#10b981' }}>{bill.totalAmount.toLocaleString()} ฿</span>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{bill.createdDate}</span>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: '#dcfce7',
                      color: '#166534',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      แจ้งแล้ว
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}