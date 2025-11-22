'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, CheckCircle, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function PaymentPage() {
  const [user, setUser] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // ตรวจสอบสถานะห้อง
      if (parsedUser.roomStatus !== 'approved') {
        alert('คุณยังไม่ได้รับการอนุมัติห้อง\nกรุณาจองห้องและรอการอนุมัติก่อน');
        window.location.href = '/dashboard';
        return;
      }
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUploadSlip = async () => {
    if (!selectedFile || !user) {
      alert('กรุณาเลือกไฟล์สลิปการโอนเงิน');
      return;
    }

    setUploading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // เพิ่มข้อมูลใน Admin Payments
      const adminPayments = JSON.parse(localStorage.getItem('adminPayments') || '[]');
      const newPayment = {
        id: Date.now(),
        studentName: user.fullName,
        studentId: user.studentId,
        roomNumber: user.assignedRoom,
        amount: 3950,
        slipImage: `/uploads/slip_${user.studentId}_${Date.now()}.jpg`,
        status: 'pending',
        uploadDate: new Date().toLocaleString('th-TH'),
        paymentType: 'ค่ามัดจำ + ค่าเช่าเดือนแรก',
        dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
        bankAccount: 'PromptPay QR Code',
        fileName: selectedFile.name
      };

      adminPayments.push(newPayment);
      localStorage.setItem('adminPayments', JSON.stringify(adminPayments));

      // อัปเดตสถานะผู้ใช้เป็นรอตรวจสอบการชำระเงิน
      const updatedUser = { ...user, roomStatus: 'payment_pending' };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert('อัปโหลดสลิปการโอนเงินสำเร็จ!\n\nระบบจะส่งให้แอดมินตรวจสอบ\nคุณจะได้รับการแจ้งเตือนเมื่อการตรวจสอบเสร็จสิ้น');
      
      window.location.href = '/dashboard';

    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัปโหลด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="payment-page">
        <div className="loading">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="landing-logo">
            <h1>SSKRU Payment System</h1>
          </div>
          <nav className="landing-nav">
            <Link href="/dashboard" className="nav-link">
              <ArrowLeft size={18} />
              กลับหน้าหลัก
            </Link>
          </nav>
        </div>
      </header>

      <main className="payment-main">
        <div className="payment-container">
          <div className="page-header">
            <h1>ชำระเงิน</h1>
            <div className="step-indicator">
              <span className="current-step">ขั้นที่ 2/3: ชำระเงิน</span>
            </div>
            <h4>ค่ามัดจำ + ค่าเช่าเดือนแรก</h4>
            <div className="payment-amount">3,950 บาท</div>
          </div>

          <div className="qr-section">
            <div className="qr-code">
              <div className="qr-placeholder">
                <QrCode size={120} />
                <div className="qr-text">
                  <h4>QR PromptPay อัตโนมัติ</h4>
                  <p>เลขบัญชี: 0-1234-56789-0</p>
                  <p>ชื่อบัญชี: มหาวิทยาลัยราชภัฏศรีสะเกษ</p>
                </div>
              </div>
              <p>สแกน QR เพื่อชำระเงิน (ตรวจสอบอัตโนมัติ)</p>
              <div className="auto-verify">
                <span className="verify-badge">✓ ตรวจสอบอัตโนมัติ</span>
              </div>
            </div>
          </div>

          <div className="slip-upload">
            <h5>อัปโหลดสลิปหลังชำระเงิน:</h5>
            
            <div className="upload-area">
              {!selectedFile ? (
                <>
                  <div className="upload-placeholder">
                    <Upload size={48} />
                    <p>คลิกเพื่อเลือกไฟล์สลิป</p>
                    <p className="upload-note">ไม่ได้เลือกไฟล์ใด</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*,.pdf"
                    className="slip-input"
                    onChange={handleFileSelect}
                  />
                </>
              ) : (
                <div className="selected-file">
                  <div className="file-info">
                    <CheckCircle size={24} color="#10b981" />
                    <span className="file-name">ไฟล์: {selectedFile.name}</span>
                    <button 
                      className="remove-file-btn"
                      onClick={() => setSelectedFile(null)}
                    >
                      ลบไฟล์
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <p className="upload-note">หลังชำระเงินแล้ว ให้แนบสลิปที่นี่</p>
          </div>

          <div className="payment-actions">
            <button 
              className="cancel-btn"
              onClick={() => window.location.href = '/dashboard'}
            >
              ยกเลิก
            </button>
            <button 
              className="submit-btn"
              disabled={!selectedFile || uploading}
              onClick={handleUploadSlip}
            >
              {uploading ? 'กำลังส่ง...' : 'ส่งสลิป'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}