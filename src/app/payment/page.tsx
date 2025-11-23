'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, CheckCircle, QrCode } from 'lucide-react';
import Link from 'next/link';
import styles from './payment.module.css';

export default function PaymentPage() {
  const [user, setUser] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const userData = localStorage.getItem('user');
    const bookingData = localStorage.getItem('pendingBooking');
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    if (bookingData) {
      setPendingBooking(JSON.parse(bookingData));
    } else {
      alert('ไม่พบข้อมูลการจอง\nกรุณาจองห้องก่อน');
      window.location.href = '/rooms';
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

      // ลบข้อมูลการจองที่รอชำระ
      localStorage.removeItem('pendingBooking');
      
      // เพิ่มข้อมูลใน Admin Payments
      const adminPayments = JSON.parse(localStorage.getItem('adminPayments') || '[]');
      const newPayment = {
        id: Date.now(),
        studentName: user.fullName,
        studentId: user.studentId,
        roomNumber: pendingBooking.roomNumber,
        amount: pendingBooking.totalAmount,
        slipImage: `/uploads/slip_${user.studentId}_${Date.now()}.jpg`,
        status: 'pending',
        uploadDate: new Date().toLocaleString('th-TH'),
        paymentType: `ห้อง ${pendingBooking.roomNumber} - ${pendingBooking.roomType}`,
        dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
        bankAccount: 'PromptPay QR Code',
        fileName: selectedFile.name
      };

      adminPayments.push(newPayment);
      localStorage.setItem('adminPayments', JSON.stringify(adminPayments));

      // อัปเดตสถานะผู้ใช้เป็นรอตรวจสอบการชำระเงิน
      const updatedUser = { ...user, roomStatus: 'payment_pending' };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert('ส่งสลิปการชำระเงินสำเร็จ!\n\nระบบจะตรวจสอบการชำระเงิน\nคุณจะได้รับการแจ้งเตือนเมื่อการตรวจสอบเสร็จสิ้น');
      
      window.location.href = '/payment-history';

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
    <div className={styles.paymentPage}>
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

      <main className={styles.paymentMain}>
        <div className={styles.paymentContainer}>
          <div className={styles.pageHeader}>
            <h1>ชำระเงิน</h1>
            <div className={styles.stepIndicator}>
              <span className={styles.currentStep}>ขั้นที่ 2/3: ชำระเงิน</span>
            </div>
            {pendingBooking && (
              <>
                <h4>ห้อง {pendingBooking.roomNumber} - {pendingBooking.roomType}</h4>
                <div className={styles.paymentDetails}>
                  <p>ค่าเช่า: {pendingBooking.price.toLocaleString()} บาท</p>
                  <p>ค่ามัดจำ: {pendingBooking.deposit.toLocaleString()} บาท</p>
                </div>
                <div className={styles.paymentAmount}>{pendingBooking.totalAmount.toLocaleString()} บาท</div>
              </>
            )}
          </div>

          <div className={styles.qrSection}>
            <div className={styles.qrCode}>
              <div className={styles.qrPlaceholder}>
                <QrCode size={120} />
                <div className={styles.qrText}>
                  <h4>QR PromptPay อัตโนมัติ</h4>
                  <p>เลขบัญชี: 0-1234-56789-0</p>
                  <p>ชื่อบัญชี: มหาวิทยาลัยราชภัฏศรีสะเกษ</p>
                </div>
              </div>
              <p>สแกน QR เพื่อชำระเงิน (ตรวจสอบอัตโนมัติ)</p>
              <div className={styles.autoVerify}>
                <span className={styles.verifyBadge}>✓ ตรวจสอบอัตโนมัติ</span>
              </div>
            </div>
          </div>

          <div className={styles.slipUpload}>
            <h5>อัปโหลดสลิปหลังชำระเงิน:</h5>
            
            <div className={styles.uploadArea}>
              {!selectedFile ? (
                <>
                  <div className={styles.uploadPlaceholder}>
                    <Upload size={48} />
                    <p>คลิกเพื่อเลือกไฟล์สลิป</p>
                    <p className={styles.uploadNote}>ไม่ได้เลือกไฟล์ใด</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*,.pdf"
                    className={styles.slipInput}
                    onChange={handleFileSelect}
                  />
                </>
              ) : (
                <div className={styles.selectedFile}>
                  <div className={styles.fileInfo}>
                    <CheckCircle size={24} color="#10b981" />
                    <span className={styles.fileName}>ไฟล์: {selectedFile.name}</span>
                    <button 
                      className={styles.removeFileBtn}
                      onClick={() => setSelectedFile(null)}
                    >
                      ลบไฟล์
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <p className={styles.uploadNote}>หลังชำระเงินแล้ว ให้แนบสลิปที่นี่</p>
          </div>

          <div className={styles.paymentActions}>
            <button 
              className={styles.cancelBtn}
              onClick={() => window.location.href = '/dashboard'}
            >
              ยกเลิก
            </button>
            <button 
              className={styles.submitBtn}
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