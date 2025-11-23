'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';

interface PaymentRecord {
  id: number;
  month: string;
  amount: number;
  type: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  method: string;
}

export default function PaymentHistoryPage() {
  const [user, setUser] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadPaymentHistory(parsedUser.studentId);
    }
  }, []);

  const loadPaymentHistory = (studentId: string) => {
    // ตรวจสอบการจองห้องที่รอชำระ
    const pendingBooking = localStorage.getItem('pendingBooking');
    
    const mockHistory: PaymentRecord[] = [
      {
        id: 1,
        month: 'มกราคม 2025',
        amount: 3950,
        type: 'ค่ามัดจำ + ค่าเช่าเดือนแรก',
        status: 'paid',
        dueDate: '2025-01-05',
        paidDate: '2025-01-03',
        method: 'PromptPay'
      },
      {
        id: 2,
        month: 'กุมภาพันธ์ 2025',
        amount: 4000,
        type: 'ค่าเช่า + ค่าน้ำ + ค่าไฟ + อินเทอร์เน็ต',
        status: 'paid',
        dueDate: '2025-02-05',
        paidDate: '2025-02-04',
        method: 'PromptPay'
      },
      {
        id: 3,
        month: 'มีนาคม 2025',
        amount: 3850,
        type: 'ค่าเช่า + ค่าน้ำ + ค่าไฟ + อินเทอร์เน็ต',
        status: 'pending',
        dueDate: '2025-03-05',
        method: '-'
      }
    ];
    
    // เพิ่มการจองห้องที่รอชำระ
    if (pendingBooking) {
      const booking = JSON.parse(pendingBooking);
      mockHistory.unshift({
        id: 0,
        month: 'การจองห้องใหม่',
        amount: booking.totalAmount,
        type: `ห้อง ${booking.roomNumber} - ${booking.roomType} (ค่ามัดจำ + ค่าเช่าเดือนแรก)`,
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        method: '-'
      });
    }
    
    setPaymentHistory(mockHistory);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'pending':
        return <Clock size={20} className="text-yellow-500" />;
      case 'overdue':
        return <XCircle size={20} className="text-red-500" />;
      default:
        return <Clock size={20} className="text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'ชำระแล้ว';
      case 'pending':
        return 'รอชำระ';
      case 'overdue':
        return 'เกินกำหนด';
      default:
        return 'ไม่ทราบสถานะ';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="payment-history-page">
        <div className="loading">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="payment-history-page">
      <Header />
      
      <main className="payment-history-main">
        <div className="payment-history-container">
          <div className="page-header">
            <Link href="/dashboard" className="back-btn">
              <ArrowLeft size={18} />
              กลับหน้าหลัก
            </Link>
            <h1>ประวัติการชำระเงิน</h1>
            <p>ดูประวัติการชำระค่าเช่าและค่าใช้จ่ายต่างๆ</p>
          </div>

          <div className="student-info">
            <div className="info-card">
              <h3>ข้อมูลนักศึกษา</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span>ชื่อ-นามสกุล:</span>
                  <strong>{user.fullName}</strong>
                </div>
                <div className="info-item">
                  <span>รหัสนักศึกษา:</span>
                  <strong>{user.studentId}</strong>
                </div>
                <div className="info-item">
                  <span>ห้อง:</span>
                  <strong>{user.assignedRoom || 'A-301'}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="payment-summary">
            <div className="summary-cards">
              <div className="summary-card paid">
                <div className="card-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="card-content">
                  <h4>ชำระแล้ว</h4>
                  <p>{paymentHistory.filter(p => p.status === 'paid').length} รายการ</p>
                </div>
              </div>
              <div className="summary-card pending">
                <div className="card-icon">
                  <Clock size={24} />
                </div>
                <div className="card-content">
                  <h4>รอชำระ</h4>
                  <p>{paymentHistory.filter(p => p.status === 'pending').length} รายการ</p>
                </div>
              </div>
              <div className="summary-card total">
                <div className="card-icon">
                  <CreditCard size={24} />
                </div>
                <div className="card-content">
                  <h4>ยอดรวม</h4>
                  <p>{paymentHistory.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} บาท</p>
                </div>
              </div>
            </div>
          </div>

          <div className="payment-history-section">
            <h3>รายการชำระเงิน</h3>
            <div className="history-table">
              <div className="table-header">
                <span>เดือน</span>
                <span>รายการ</span>
                <span>จำนวนเงิน</span>
                <span>กำหนดชำระ</span>
                <span>สถานะ</span>
                <span>วันที่ชำระ</span>
              </div>
              
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="table-row">
                  <div className="month-cell">
                    <Calendar size={16} />
                    <span>{payment.month}</span>
                  </div>
                  <div className="type-cell">
                    <span>{payment.type}</span>
                  </div>
                  <div className="amount-cell">
                    <strong>{payment.amount.toLocaleString()} ฿</strong>
                  </div>
                  <div className="due-date-cell">
                    {new Date(payment.dueDate).toLocaleDateString('th-TH')}
                  </div>
                  <div className="status-cell">
                    <div className={`status-badge ${getStatusClass(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span>{getStatusText(payment.status)}</span>
                    </div>
                    {payment.status === 'pending' && (
                      <button 
                        className="pay-btn"
                        onClick={() => {
                          if (payment.id === 0) {
                            window.location.href = '/payment';
                          } else {
                            localStorage.setItem('selectedPayment', JSON.stringify(payment));
                            window.location.href = '/payment';
                          }
                        }}
                      >
                        ชำระเงิน
                      </button>
                    )}
                  </div>
                  <div className="paid-date-cell">
                    {payment.paidDate 
                      ? new Date(payment.paidDate).toLocaleDateString('th-TH')
                      : '-'
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="payment-actions">
            <Link href="/payment" className="pay-now-btn">
              <CreditCard size={20} />
              ชำระเงิน
            </Link>
            {paymentHistory.some(p => p.status === 'pending') && (
              <div className="pending-notice">
                <Clock size={16} />
                <span>คุณมีรายการรอชำระ กรุณาชำระภายในกำหนด</span>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .payment-history-page {
          min-height: 100vh;
          background: #f8fafc;
        }

        .payment-history-main {
          padding: 2rem 0;
        }

        .payment-history-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .page-header {
          text-align: center;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f1f5f9;
          color: #64748b;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: all 0.2s;
          margin-bottom: 1rem;
        }

        .back-btn:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        .page-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: #64748b;
        }

        .student-info {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .info-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .payment-summary {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .summary-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid;
        }

        .summary-card.paid {
          background: #f0fdf4;
          border-left-color: #10b981;
        }

        .summary-card.pending {
          background: #fefce8;
          border-left-color: #f59e0b;
        }

        .summary-card.total {
          background: #eff6ff;
          border-left-color: #3b82f6;
        }

        .card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 8px;
          color: white;
        }

        .summary-card.paid .card-icon {
          background: #10b981;
        }

        .summary-card.pending .card-icon {
          background: #f59e0b;
        }

        .summary-card.total .card-icon {
          background: #3b82f6;
        }

        .card-content h4 {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .card-content p {
          color: #64748b;
          font-size: 0.875rem;
        }

        .payment-history-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .payment-history-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .history-table {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1.5fr 2fr 1fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          font-weight: 600;
          color: #64748b;
          font-size: 0.875rem;
        }

        .table-row {
          display: grid;
          grid-template-columns: 1.5fr 2fr 1fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          align-items: center;
          font-size: 0.875rem;
        }

        .month-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #1e293b;
          font-weight: 500;
        }

        .type-cell {
          color: #64748b;
        }

        .amount-cell {
          color: #10b981;
          font-weight: 600;
        }

        .due-date-cell {
          color: #64748b;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .paid-date-cell {
          color: #64748b;
        }

        .pay-btn {
          background: #10b981;
          color: white;
          padding: 0.25rem 0.75rem;
          border: none;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: background-color 0.2s;
        }

        .pay-btn:hover {
          background: #059669;
        }

        .payment-actions {
          text-align: center;
        }

        .pay-now-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #10b981;
          color: white;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          transition: background-color 0.2s;
        }

        .pay-now-btn:hover {
          background: #059669;
        }

        .pending-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #fef3c7;
          color: #92400e;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          font-weight: 500;
          border: 1px solid #f59e0b;
        }

        @media (max-width: 768px) {
          .payment-history-container {
            padding: 0 1rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .summary-cards {
            grid-template-columns: 1fr;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .table-header {
            display: none;
          }

          .table-row {
            display: flex;
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}