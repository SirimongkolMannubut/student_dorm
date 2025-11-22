'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Eye, Download } from 'lucide-react';
import Link from 'next/link';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      studentName: 'นายสมชาย ใจดี',
      studentId: '62010001',
      roomNumber: 'A301',
      amount: 5950,
      slipImage: '/slip1.jpg',
      status: 'pending',
      uploadDate: '2025-01-15 14:30',
      paymentType: 'มัดจำ + เช่าเดือนแรก'
    },
    {
      id: 2,
      studentName: 'นางสาวสมหญิง รักดี',
      studentId: '62010002',
      roomNumber: 'B205',
      amount: 5950,
      slipImage: '/slip2.jpg',
      status: 'approved',
      uploadDate: '2025-01-14 16:45',
      paymentType: 'มัดจำ + เช่าเดือนแรก'
    },
    {
      id: 3,
      studentName: 'นายวิชัย เก่งกาจ',
      studentId: '62010003',
      roomNumber: 'C102',
      amount: 3500,
      slipImage: '/slip3.jpg',
      status: 'rejected',
      uploadDate: '2025-01-13 10:15',
      paymentType: 'ค่าเช่าประจำเดือน',
      rejectReason: 'จำนวนเงินไม่ตรงกับที่ระบุ'
    }
  ]);

  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (paymentId: number) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: 'approved' }
        : payment
    ));
    
    // ส่งการแจ้งเตือนให้นักศึกษา
    alert('อนุมัติการชำระเงินสำเร็จ!\nระบบจะส่งการแจ้งเตือนให้นักศึกษาทันที');
    setSelectedPayment(null);
  };

  const handleReject = (paymentId: number) => {
    if (!rejectReason.trim()) {
      alert('กรุณาระบุเหตุผลการปฏิเสธ');
      return;
    }

    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: 'rejected', rejectReason }
        : payment
    ));
    
    alert('ปฏิเสธการชำระเงินแล้ว!\nระบบจะส่งแจ้งให้นักศึกษาแก้ไข');
    setSelectedPayment(null);
    setRejectReason('');
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
    <div className="admin-payments-page">
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="landing-logo">
            <h1>SSKRU Admin Panel</h1>
          </div>
          <nav className="landing-nav">
            <Link href="/admin" className="nav-link">
              <ArrowLeft size={18} />
              กลับ Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="admin-payments-main">
        <div className="admin-payments-container">
          <div className="page-header">
            <h1>ตรวจสอบการชำระเงิน</h1>
            <p>อนุมัติหรือปฏิเสธการชำระเงินของนักศึกษา</p>
          </div>

          <div className="payments-table">
            <div className="table-header">
              <span>นักศึกษา</span>
              <span>ห้อง</span>
              <span>จำนวนเงิน</span>
              <span>วันที่อัปโหลด</span>
              <span>สถานะ</span>
              <span>การดำเนินการ</span>
            </div>

            {payments.map((payment) => (
              <div key={payment.id} className="table-row">
                <div className="student-info">
                  <strong>{payment.studentName}</strong>
                  <small>{payment.studentId}</small>
                </div>
                <span>{payment.roomNumber}</span>
                <div className="amount-info">
                  <strong>{payment.amount.toLocaleString()} ฿</strong>
                  <small>{payment.paymentType}</small>
                </div>
                <span>{payment.uploadDate}</span>
                <div>{getStatusBadge(payment.status)}</div>
                <div className="action-buttons">
                  <button 
                    className="view-btn"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    <Eye size={16} />
                    ดูสลิป
                  </button>
                  {payment.status === 'pending' && (
                    <>
                      <button 
                        className="approve-btn"
                        onClick={() => handleApprove(payment.id)}
                      >
                        <Check size={16} />
                        อนุมัติ
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <X size={16} />
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