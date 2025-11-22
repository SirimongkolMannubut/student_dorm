'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, FileText, Calendar, User, Building } from 'lucide-react';
import Link from 'next/link';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalData, setApprovalData] = useState({
    startDate: '',
    endDate: '',
    rentalFee: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data.bookings);
      setContracts(data.contracts);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleApprove = (booking: any) => {
    setSelectedBooking(booking);
    setApprovalData({
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rentalFee: 5000
    });
    setShowApprovalModal(true);
  };

  const confirmApproval = async () => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve_booking',
          bookingId: selectedBooking.id,
          ...approvalData
        })
      });

      if (response.ok) {
        fetchData();
        setShowApprovalModal(false);
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error('Error approving booking:', error);
    }
  };

  const handleReject = async (bookingId: number) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject_booking',
          bookingId
        })
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#f59e0b';
      case 'Approved': return '#10b981';
      case 'Rejected': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending': return 'รอดำเนินการ';
      case 'Approved': return 'อนุมัติแล้ว';
      case 'Rejected': return 'ปฏิเสธ';
      default: return status;
    }
  };

  return (
    <div className="admin-bookings-page">
      <header className="admin-header">
        <div className="admin-header-container">
          <div className="admin-logo">
            <h1>จัดการการจองห้อง</h1>
          </div>
          <Link href="/admin" className="nav-link">
            <ArrowLeft size={18} />
            กลับหน้าแอดมิน
          </Link>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-container">
          <div className="bookings-section">
            <h2>รายการจองห้อง</h2>
            <div className="bookings-table">
              <div className="table-header">
                <div>รหัสนักศึกษา</div>
                <div>ชื่อนักศึกษา</div>
                <div>ห้อง</div>
                <div>วันที่จอง</div>
                <div>สถานะ</div>
                <div>การดำเนินการ</div>
              </div>
              {bookings.map((booking: any) => (
                <div key={booking.id} className="table-row">
                  <div>{booking.studentId}</div>
                  <div>{booking.studentName}</div>
                  <div>{booking.roomId}</div>
                  <div>{new Date(booking.bookingDate).toLocaleDateString('th-TH')}</div>
                  <div>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  <div className="action-buttons">
                    {booking.status === 'Pending' && (
                      <>
                        <button 
                          className="approve-btn"
                          onClick={() => handleApprove(booking)}
                        >
                          <Check size={16} />
                          อนุมัติ
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => handleReject(booking.id)}
                        >
                          <X size={16} />
                          ปฏิเสธ
                        </button>
                      </>
                    )}
                    {booking.contractId && (
                      <button className="contract-btn">
                        <FileText size={16} />
                        ดูสัญญา
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contracts-section">
            <h2>สัญญาเช่า</h2>
            <div className="contracts-grid">
              {contracts.map((contract: any) => (
                <div key={contract.id} className="contract-card">
                  <div className="contract-header">
                    <h3>{contract.id}</h3>
                    <span className={`payment-status ${contract.paymentStatus.toLowerCase()}`}>
                      {contract.paymentStatus === 'Paid' ? 'ชำระแล้ว' : 'รอชำระ'}
                    </span>
                  </div>
                  <div className="contract-details">
                    <div className="detail-item">
                      <User size={16} />
                      <span>รหัส: {contract.studentId}</span>
                    </div>
                    <div className="detail-item">
                      <Building size={16} />
                      <span>ห้อง: {contract.roomId}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>{new Date(contract.startDate).toLocaleDateString('th-TH')} - {new Date(contract.endDate).toLocaleDateString('th-TH')}</span>
                    </div>
                    <div className="contract-fee">
                      ค่าเช่า: {contract.rentalFee.toLocaleString()} ฿/เทอม
                    </div>
                  </div>
                  <button className="download-btn">
                    <FileText size={16} />
                    ดาวน์โหลดสัญญา
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="modal-overlay" onClick={() => setShowApprovalModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>อนุมัติการจองห้อง {selectedBooking?.roomId}</h3>
              <button onClick={() => setShowApprovalModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>วันที่เริ่มสัญญา</label>
                <input
                  type="date"
                  value={approvalData.startDate}
                  onChange={(e) => setApprovalData({...approvalData, startDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>วันที่สิ้นสุดสัญญา</label>
                <input
                  type="date"
                  value={approvalData.endDate}
                  onChange={(e) => setApprovalData({...approvalData, endDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>ค่าเช่า (บาท/เทอม)</label>
                <input
                  type="number"
                  value={approvalData.rentalFee}
                  onChange={(e) => setApprovalData({...approvalData, rentalFee: Number(e.target.value)})}
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowApprovalModal(false)}>
                  ยกเลิก
                </button>
                <button className="confirm-btn" onClick={confirmApproval}>
                  อนุมัติและสร้างสัญญา
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}