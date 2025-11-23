'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Wrench, Send, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';

export default function MaintenancePage() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadRequests();
    }
  }, []);

  const loadRequests = () => {
    const mockRequests = [
      {
        id: 1,
        title: 'หลอดไฟเสีย',
        description: 'หลอดไฟในห้องน้ำเสีย ไม่สว่าง',
        category: 'ไฟฟ้า',
        priority: 'medium',
        status: 'completed',
        createdDate: '2025-01-10',
        completedDate: '2025-01-12'
      },
      {
        id: 2,
        title: 'ก๊อกน้ำรั่ว',
        description: 'ก๊อกน้ำในห้องน้ำรั่ว น้ำไหลไม่หยุด',
        category: 'ประปา',
        priority: 'high',
        status: 'in_progress',
        createdDate: '2025-01-15'
      }
    ];
    setRequests(mockRequests);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRequest.title || !newRequest.description || !newRequest.category) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const request = {
      id: Date.now(),
      ...newRequest,
      status: 'pending',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setRequests(prev => [request, ...prev]);
    setNewRequest({ title: '', description: '', category: '', priority: 'medium' });
    alert('ส่งคำขอแจ้งซ่อมเรียบร้อยแล้ว');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} style={{color: '#10b981'}} />;
      case 'in_progress':
        return <Wrench size={20} style={{color: '#3b82f6'}} />;
      case 'pending':
        return <Clock size={20} style={{color: '#f59e0b'}} />;
      default:
        return <Clock size={20} style={{color: '#94a3b8'}} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'เสร็จสิ้น';
      case 'in_progress': return 'กำลังดำเนินการ';
      case 'pending': return 'รอดำเนินการ';
      default: return 'ไม่ทราบสถานะ';
    }
  };

  if (!user) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div style={{minHeight: '100vh', background: '#f8fafc'}}>
      <Header />
      
      <main style={{padding: '2rem 0'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem'}}>
          <div style={{textAlign: 'center', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}}>
            <Link href="/dashboard" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', color: '#64748b', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem', textDecoration: 'none'}}>
              <ArrowLeft size={18} />
              กลับหน้าหลัก
            </Link>
            <h1 style={{fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem'}}>แจ้งซ่อม</h1>
            <p style={{color: '#64748b'}}>แจ้งปัญหาและติดตามสถานะการซ่อม</p>
          </div>

          <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}}>
            <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem'}}>แจ้งซ่อมใหม่</h3>
            <form onSubmit={handleSubmit}>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem'}}>
                <div>
                  <label style={{display: 'block', fontWeight: '500', color: '#374151', fontSize: '0.875rem', marginBottom: '0.5rem'}}>หัวข้อ</label>
                  <input
                    type="text"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                    placeholder="เช่น หลอดไฟเสีย, ก๊อกน้ำรั่ว"
                    style={{width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontWeight: '500', color: '#374151', fontSize: '0.875rem', marginBottom: '0.5rem'}}>หมวดหมู่</label>
                  <select
                    value={newRequest.category}
                    onChange={(e) => setNewRequest({...newRequest, category: e.target.value})}
                    style={{width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem'}}
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    <option value="ไฟฟ้า">ไฟฟ้า</option>
                    <option value="ประปา">ประปา</option>
                    <option value="แอร์">แอร์</option>
                    <option value="เฟอร์นิเจอร์">เฟอร์นิเจอร์</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', fontWeight: '500', color: '#374151', fontSize: '0.875rem', marginBottom: '0.5rem'}}>ความเร่งด่วน</label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})}
                    style={{width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem'}}
                  >
                    <option value="low">ต่ำ</option>
                    <option value="medium">ปานกลาง</option>
                    <option value="high">สูง</option>
                  </select>
                </div>
              </div>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', fontWeight: '500', color: '#374151', fontSize: '0.875rem', marginBottom: '0.5rem'}}>รายละเอียด</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                  placeholder="อธิบายปัญหาที่พบ..."
                  rows={4}
                  style={{width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', resize: 'vertical'}}
                />
              </div>
              <button type="submit" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#10b981', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'}}>
                <Send size={20} />
                ส่งคำขอ
              </button>
            </form>
          </div>

          <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}}>
            <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem'}}>ประวัติการแจ้งซ่อม</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {requests.map((request) => (
                <div key={request.id} style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', background: '#f8fafc'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem'}}>
                    <h4 style={{fontWeight: '600', color: '#1e293b', margin: '0'}}>{request.title}</h4>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <span style={{padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '500', background: request.priority === 'high' ? '#fee2e2' : request.priority === 'medium' ? '#fef3c7' : '#dcfce7', color: request.priority === 'high' ? '#dc2626' : request.priority === 'medium' ? '#d97706' : '#166534'}}>
                        {request.priority === 'high' ? 'เร่งด่วน' : request.priority === 'medium' ? 'ปานกลาง' : 'ไม่เร่งด่วน'}
                      </span>
                      <span style={{padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '500', background: '#eff6ff', color: '#1e40af'}}>{request.category}</span>
                    </div>
                  </div>
                  <p style={{color: '#64748b', marginBottom: '1rem', lineHeight: '1.5'}}>{request.description}</p>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500'}}>
                      {getStatusIcon(request.status)}
                      <span>{getStatusText(request.status)}</span>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.75rem', color: '#64748b'}}>
                      <span>แจ้งเมื่อ: {new Date(request.createdDate).toLocaleDateString('th-TH')}</span>
                      {request.completedDate && (
                        <span>เสร็จเมื่อ: {new Date(request.completedDate).toLocaleDateString('th-TH')}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}