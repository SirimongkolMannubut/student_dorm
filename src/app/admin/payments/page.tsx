'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Eye, Download } from 'lucide-react';
import Link from 'next/link';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);

  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleApprove = async (paymentId: number) => {
    try {
      console.log('Approving payment ID:', paymentId);
      
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      
      const result = await response.json();
      console.log('Approve response:', result);
      
      if (response.ok) {
        setPayments(prev => prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: 'approved' }
            : payment
        ));
        
        alert('อนุมัติการชำระเงินสำเร็จ!\nระบบจะส่งการแจ้งเตือนให้นักศึกษาทันที');
        setSelectedPayment(null);
        fetchPayments(); // รีเฟรชข้อมูล
      } else {
        alert('เกิดข้อผิดพลาด: ' + (result.error || 'ไม่ทราบสาเหตุ'));
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('เกิดข้อผิดพลาดในการอนุมัติ: ' + error.message);
    }
  };

  const handleReject = async (paymentId: number) => {
    if (!rejectReason.trim()) {
      alert('กรุณาระบุเหตุผลการปฏิเสธ');
      return;
    }

    try {
      console.log('Rejecting payment ID:', paymentId, 'Reason:', rejectReason);
      
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejectReason })
      });
      
      const result = await response.json();
      console.log('Reject response:', result);
      
      if (response.ok) {
        setPayments(prev => prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: 'rejected', rejectReason }
            : payment
        ));
        
        alert('ปฏิเสธการชำระเงินแล้ว!\nระบบจะส่งแจ้งให้นักศึกษาแก้ไข');
        setSelectedPayment(null);
        setRejectReason('');
        fetchPayments(); // รีเฟรชข้อมูล
      } else {
        alert('เกิดข้อผิดพลาด: ' + (result.error || 'ไม่ทราบสาเหตุ'));
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('เกิดข้อผิดพลาดในการปฏิเสธ: ' + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge pending">รอตรวจสอบ</span>;
      case 'approved':
        return <span className="status-badge approved">อนุมัติแล้ว</span>;
      case 'rejected':
        return <span className="status-badge rejected">ปฏิเสธ</span>;
      default:
        return <span className="status-badge">{status}</span>;
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
            <button
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onClick={async () => {
                if (confirm('คุณต้องการลบข้อมูลทั้งหมดหรือไม่?')) {
                  try {
                    const response = await fetch('/api/payments/clear', { method: 'DELETE' });
                    if (response.ok) {
                      alert('ลบข้อมูลสำเร็จ!');
                      fetchPayments();
                    }
                  } catch (error) {
                    alert('เกิดข้อผิดพลาด');
                  }
                }
              }}
            >
              ลบข้อมูลทั้งหมด
            </button>
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
                alignItems: 'center',
                transition: 'background 0.2s',
                ':hover': { background: '#f8fafc' }
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
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onClick={() => setSelectedPayment(payment)}
                    onMouseOver={(e) => e.target.style.background = '#2563eb'}
                    onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                  >
                    <Eye size={14} />
                    ดูสลิป
                  </button>
                  {payment.status === 'pending' && (
                    <>
                      <button 
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
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onClick={() => handleApprove(payment.id)}
                        onMouseOver={(e) => e.target.style.background = '#059669'}
                        onMouseOut={(e) => e.target.style.background = '#10b981'}
                      >
                        <Check size={14} />
                        อนุมัติ
                      </button>
                      <button 
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
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onClick={() => setSelectedPayment(payment)}
                        onMouseOver={(e) => e.target.style.background = '#dc2626'}
                        onMouseOut={(e) => e.target.style.background = '#ef4444'}
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

          {/* Payment Detail Modal */}
          {selectedPayment && (
            <div className="modal-overlay">
              <div className="modal-content payment-modal">
                <div className="modal-header">
                  <h3>ตรวจสอบการชำระเงิน</h3>
                  <button 
                    className="close-btn"
                    onClick={() => setSelectedPayment(null)}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <div className="payment-details">
                    <div className="detail-section">
                      <h4>ข้อมูลนักศึกษา</h4>
                      <p><strong>ชื่อ:</strong> {selectedPayment.studentName}</p>
                      <p><strong>รหัส:</strong> {selectedPayment.studentId}</p>
                      <p><strong>ห้อง:</strong> {selectedPayment.roomNumber}</p>
                    </div>
                    
                    <div className="detail-section">
                      <h4>ข้อมูลการชำระ</h4>
                      <p><strong>ประเภท:</strong> {selectedPayment.paymentType}</p>
                      <p><strong>จำนวน:</strong> {selectedPayment.amount.toLocaleString()} บาท</p>
                      <p><strong>วันที่:</strong> {selectedPayment.uploadDate}</p>
                    </div>

                    <div className="detail-section">
                      <h4>หลักฐานการโอนเงิน</h4>
                      <div className="slip-preview">
                        <div className="slip-placeholder">
                          [รูปสลิปการโอนเงิน]
                          <br />
                          {selectedPayment.slipImage}
                        </div>
                      </div>
                    </div>

                    {selectedPayment.status === 'rejected' && (
                      <div className="detail-section reject-reason">
                        <h4>เหตุผลการปฏิเสธ</h4>
                        <p>{selectedPayment.rejectReason}</p>
                      </div>
                    )}

                    {selectedPayment.status === 'pending' && (
                      <div className="detail-section">
                        <h4>การดำเนินการ</h4>
                        <div className="action-section">
                          <button 
                            className="approve-btn-large"
                            onClick={() => handleApprove(selectedPayment.id)}
                          >
                            <Check size={20} />
                            อนุมัติการชำระเงิน
                          </button>
                          
                          <div className="reject-section">
                            <textarea
                              placeholder="ระบุเหตุผลการปฏิเสธ..."
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              className="reject-reason-input"
                            />
                            <button 
                              className="reject-btn-large"
                              onClick={() => handleReject(selectedPayment.id)}
                            >
                              <X size={20} />
                              ปฏิเสธและส่งกลับแก้ไข
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}