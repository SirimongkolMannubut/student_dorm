'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminRoomsPage() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      } else {
        // Mock data fallback
        setPayments([
          {
            id: 1,
            studentName: 'สมชาย ใจดี',
            studentId: '62010001',
            roomNumber: 'A101',
            amount: 3000,
            paymentType: 'ค่าเช่าและค่ามัดจำ',
            slipUrl: 'uploads/slip1.jpg',
            status: 'pending',
            uploadDate: '15/01/2567'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([
        {
          id: 1,
          studentName: 'สมชาย ใจดี',
          studentId: '62010001',
          roomNumber: 'A101',
          amount: 3000,
          paymentType: 'ค่าเช่าและค่ามัดจำ',
          slipUrl: 'uploads/slip1.jpg',
          status: 'pending',
          uploadDate: '15/01/2567'
        }
      ]);
    }
  };

  const updatePaymentStatus = async (paymentId: number, status: 'approved' | 'rejected') => {
    try {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
      const token = tokenCookie?.split('=')[1];

      const response = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentId, status })
      });

      if (response.ok) {
        setPayments(prev => 
          prev.map(payment => 
            payment.id === paymentId 
              ? { ...payment, status }
              : payment
          )
        );
        alert(`${status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}การชำระเงินสำเร็จ!\n\nระบบจะส่งการแจ้งเตือนให้นักศึกษาทันที`);
      } else {
        const text = await response.text();
        try {
          const error = JSON.parse(text);
          alert(error.error || 'ไม่สามารถอัปเดตสถานะได้');
        } catch {
          alert('ไม่สามารถอัปเดตสถานะได้');
        }
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดต');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span style={{ background: '#fbbf24', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>รอตรวจสอบ</span>;
      case 'approved':
        return <span style={{ background: '#10b981', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>อนุมัติแล้ว</span>;
      case 'rejected':
        return <span style={{ background: '#ef4444', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>ปฏิเสธ</span>;
      default:
        return <span style={{ background: '#6b7280', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>{status}</span>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <header style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        padding: '1rem 0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0' }}>SSKRU Admin Panel</h1>
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

      <main style={{ padding: '2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>ตรวจสอบการชำระเงิน</h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>อนุมัติหรือปฏิเสธการชำระเงินของนักศึกษา</p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1.5fr 1.5fr 1fr 2fr',
              gap: '1rem',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              fontWeight: '600',
              color: '#475569',
              fontSize: '0.875rem'
            }}>
              <span>นักศึกษา</span>
              <span>ห้อง</span>
              <span>จำนวนเงิน</span>
              <span>วันที่อัปโหลด</span>
              <span>สถานะ</span>
              <span>การดำเนินการ</span>
            </div>

            {payments.map((payment, index) => (
              <div key={payment.id} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1.5fr 1.5fr 1fr 2fr',
                gap: '1rem',
                padding: '1.5rem',
                borderBottom: index < payments.length - 1 ? '1px solid #e2e8f0' : 'none',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>{payment.studentName}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{payment.studentId}</div>
                </div>
                <span style={{ fontWeight: '500', color: '#1e293b' }}>{payment.roomNumber}</span>
                <div>
                  <div style={{ fontWeight: '700', color: '#10b981', fontSize: '1.1rem' }}>{payment.amount.toLocaleString()} ฿</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{payment.paymentType}</div>
                </div>
                <span style={{ color: '#64748b' }}>{payment.uploadDate}</span>
                <div>{getStatusBadge(payment.status)}</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.5rem 0.75rem',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    <Eye size={14} />
                    ดูสลิป
                  </button>
                  {payment.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => updatePaymentStatus(payment.id, 'approved')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.5rem 0.75rem',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        <Check size={14} />
                        อนุมัติ
                      </button>
                      <button 
                        onClick={() => updatePaymentStatus(payment.id, 'rejected')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.5rem 0.75rem',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={14} />
                        ปฏิเสธ
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}