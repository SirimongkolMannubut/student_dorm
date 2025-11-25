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
  slipUploaded?: boolean;
}

export default function PaymentHistoryPage() {
  const [user, setUser] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    const fetchUserAndPayments = async () => {
      try {
        const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
        if (!token) return;

        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          
          // ดึงข้อมูล booking ที่ approved
          const bookingsResponse = await fetch('/api/bookings', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const bookingsData = await bookingsResponse.json();
          const approvedBooking = bookingsData.bookings?.find((b: any) => b.status === 'approved');
          
          const userInfo = {
            fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            studentId: userData.studentId || '',
            assignedRoom: approvedBooking?.roomId || '-'
          };
          setUser(userInfo);
          await loadPaymentHistory(userData.studentId);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Set default user to prevent loading state
        setUser({
          fullName: 'ผู้ใช้',
          studentId: '62010001',
          assignedRoom: 'A-301'
        });
        loadPaymentHistory('62010001');
      }
    };

    fetchUserAndPayments();
  }, []);

  const loadPaymentHistory = async (studentId: string) => {
    try {
      const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
      
      // ดึงข้อมูลจาก API payments (สลิปที่อัปโหลดแล้ว)
      const paymentsResponse = await fetch('/api/payments', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const paymentsData = await paymentsResponse.json();
      const userPayments = paymentsData.payments || [];
      
      // ดึงข้อมูลจาก API payment-records (รายการที่ยังไม่ได้อัปโหลดสลิป)
      const recordsResponse = await fetch(`/api/payment-records?studentId=${studentId}`);
      const recordsData = await recordsResponse.json();
      const userRecords = recordsData.records || [];
      
      // แปลงข้อมูลจาก payments API
      console.log('User payments from API:', userPayments);
      const apiPayments: PaymentRecord[] = userPayments.map((payment: any) => ({
        id: payment._id || payment.id,
        month: payment.month || 'มีนาคม 2025',
        amount: payment.amount || 0,
        type: payment.paymentType || 'ค่าเช่า',
        status: payment.status === 'approved' ? 'paid' : payment.status === 'rejected' ? 'overdue' : 'pending',
        dueDate: payment.dueDate || new Date().toISOString().split('T')[0],
        paidDate: payment.status === 'approved' ? (payment.updatedAt || payment.createdAt) : undefined,
        method: payment.status === 'approved' ? 'PromptPay' : '-',
        slipUploaded: true
      }));
      console.log('API Payments:', apiPayments);
      
      // แปลงข้อมูลจาก payment-records API
      const recordPayments: PaymentRecord[] = userRecords.map((record: any) => ({
        id: record.id,
        month: record.month,
        amount: record.amount,
        type: record.type,
        status: record.status,
        dueDate: record.dueDate,
        paidDate: record.paidDate,
        method: record.method,
        slipUploaded: record.slipUploaded
      }));
      
      // ดึงข้อมูลจาก API bookings
      const bookingsResponse = await fetch('/api/bookings', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const bookingsData = await bookingsResponse.json();
      const userBookings = bookingsData.bookings || [];
      
      // สร้าง Set ของ bookingId ที่มีการอัปโหลดสลิปแล้ว
      const paidBookingIds = new Set(userPayments.map((p: any) => p.bookingId));
      
      // แสดงเฉพาะ booking ที่ยังไม่ได้อัปโหลดสลิป
      let localPayments: PaymentRecord[] = userBookings
        .filter((booking: any) => !paidBookingIds.has(booking._id))
        .map((booking: any) => ({
          id: booking._id,
          bookingId: booking._id,
          month: 'มีนาคม 2025',
          amount: booking.price || booking.amount || 0,
          type: `ห้อง ${booking.roomId} - ${booking.roomType}`,
          status: 'pending',
          dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
          method: '-',
          slipUploaded: false
        }));
      
      // รวมข้อมูลทั้งหมด
      console.log('Local Payments (bookings):', localPayments);
      const allPayments = [...apiPayments, ...localPayments]
        .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
      console.log('All Payments:', allPayments);
      
      setPaymentHistory(allPayments);
    } catch (error) {
      console.error('Error loading payment history:', error);
      setPaymentHistory([]);
    }
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

  const getStatusText = (status: string, slipUploaded: boolean) => {
    if (status === 'paid') {
      return 'ผ่าน';
    } else if (status === 'overdue') {
      return 'ปฏิเสธ';
    } else if (status === 'pending') {
      return slipUploaded ? 'รอตรวจสอบ' : 'รอชำระ';
    }
    return 'ไม่ทราบสถานะ';
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'status-paid';
      case 'pending':
        return 'status-pending';
      case 'overdue':
        return 'status-overdue';
      default:
        return 'status-default';
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
                    <strong>{(payment.amount || 0).toLocaleString()} ฿</strong>
                  </div>
                  <div className="due-date-cell">
                    {new Date(payment.dueDate).toLocaleDateString('th-TH')}
                  </div>
                  <div className="status-cell">
                    <div className={`status-badge ${getStatusClass(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span>{getStatusText(payment.status, payment.slipUploaded)}</span>
                    </div>
                    {payment.status === 'pending' && !payment.slipUploaded && (
                      <button 
                        className="pay-btn"
                        onClick={() => {
                          const paymentData = {
                            ...payment,
                            bookingId: payment.bookingId || payment.id
                          };
                          localStorage.setItem('selectedPayment', JSON.stringify(paymentData));
                          window.location.href = '/payment';
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
        
        .status-paid {
          background: #dcfce7 !important;
          color: #166534 !important;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .status-pending {
          background: #fed7aa !important;
          color: #9a3412 !important;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .status-overdue {
          background: #fecaca !important;
          color: #991b1b !important;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .status-default {
          background: #f3f4f6 !important;
          color: #374151 !important;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
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