'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, CheckCircle, QrCode } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';

export default function PaymentPage() {
  const [user, setUser] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndPaymentData = async () => {
      try {
        const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
        if (token) {
          const response = await fetch('/api/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            const userInfo = {
              fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
              studentId: userData.studentId || ''
            };
            setUser(userInfo);
          }
        }
        
        // Check for payment data in localStorage
        const paymentData = localStorage.getItem('selectedPayment');
        const bookingData = localStorage.getItem('pendingBooking');
        
        if (paymentData) {
          setSelectedPayment(JSON.parse(paymentData));
          localStorage.removeItem('selectedPayment');
        } else if (bookingData) {
          setPendingBooking(JSON.parse(bookingData));
        } else {
          // Set default payment for demo
          setSelectedPayment({
            id: 3,
            month: 'มีนาคม 2025',
            amount: 3850,
            type: 'ค่าเช่า + ค่าน้ำ + ค่าไฟ + อินเทอร์เน็ต',
            dueDate: '2025-03-05'
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set default user and payment
        setUser({
          fullName: 'ผู้ใช้',
          studentId: '62010001'
        });
        setSelectedPayment({
          id: 3,
          month: 'มีนาคม 2025',
          amount: 3850,
          type: 'ค่าเช่า + ค่าน้ำ + ค่าไฟ + อินเทอร์เน็ต',
          dueDate: '2025-03-05'
        });
      }
    };

    fetchUserAndPaymentData();
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

      const currentTime = new Date().toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // สร้างข้อมูลสำหรับส่งไป API
      const paymentData = {
        studentName: user.fullName,
        studentId: user.studentId,
        roomNumber: pendingBooking?.roomNumber || 'A-301',
        amount: pendingBooking?.totalAmount || selectedPayment?.amount || 3850,
        slipImage: `/uploads/slip_${user.studentId}_${Date.now()}.jpg`,
        paymentType: pendingBooking ? `ห้อง ${pendingBooking.roomNumber} - ${pendingBooking.roomType}` : selectedPayment?.type || 'ค่าเช่ารายเดือน',
        dueDate: selectedPayment?.dueDate || new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
        bankAccount: 'PromptPay QR Code',
        fileName: selectedFile.name,
        month: selectedPayment?.month || 'มีนาคม 2025',
        uploadTime: currentTime
      };

      // ตรวจสอบว่ามีข้อมูลซ้ำหรือไม่
      const checkResponse = await fetch('/api/payments');
      const existingData = await checkResponse.json();
      const isDuplicate = existingData.payments?.some((p: any) => 
        p.studentId === user.studentId && 
        p.amount === paymentData.amount &&
        p.paymentType === paymentData.paymentType
      );
      
      if (isDuplicate) {
        alert('คุณได้ส่งสลิปสำหรับรายการนี้แล้ว\nกรุณารอแอดมินตรวจสอบ');
        window.location.href = '/payment-history';
        return;
      }

      // ส่งข้อมูลไป API
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        // อัปเดต payment record ถ้ามี selectedPayment
        if (selectedPayment?.id) {
          await fetch('/api/payment-records', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: selectedPayment.id,
              slipUploaded: true
            })
          });
        }
        
        // ลบข้อมูลที่ไม่จำเป็นอีกต่อไป
        localStorage.removeItem('pendingBooking');
        localStorage.removeItem('selectedPayment');
        
        alert(`ส่งสลิปการชำระเงินสำเร็จ!\n\nเวลาที่ส่ง: ${currentTime}\n\nรายการ: ${paymentData.paymentType}\nจำนวนเงิน: ${paymentData.amount.toLocaleString()} บาท\n\nกรุณารอแอดมินตรวจสอบการชำระเงิน\nระบบจะแจ้งเตือนเมื่อการตรวจสอบเสร็จสิ้น`);
        
        window.location.href = '/payment-history';
      } else {
        throw new Error('ไม่สามารถส่งข้อมูลได้');
      }

    } catch (error) {
      console.error('Upload error:', error);
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <Header />

      <main style={{ padding: '2rem 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.15)', borderLeft: '4px solid #3b82f6' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>ชำระเงิน</h1>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600' }}>ขั้นที่ 2/3: ชำระเงิน</span>
            </div>
            {pendingBooking && (
              <>
                <h4 style={{ margin: '1rem 0', fontSize: '1.25rem', color: '#1e293b' }}>ห้อง {pendingBooking.roomNumber} - {pendingBooking.roomType}</h4>
                <div style={{ margin: '1.5rem 0', padding: '1.5rem', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: '12px', border: '2px solid #3b82f6', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <p style={{ margin: '0', padding: '0.75rem', background: 'white', borderRadius: '8px', color: '#1e293b', fontWeight: '500', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>ค่าเช่า: {pendingBooking.price.toLocaleString()} บาท</p>
                  <p style={{ margin: '0', padding: '0.75rem', background: 'white', borderRadius: '8px', color: '#1e293b', fontWeight: '500', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>ค่ามัดจำ: {pendingBooking.deposit.toLocaleString()} บาท</p>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginTop: '1rem' }}>{pendingBooking.totalAmount.toLocaleString()} บาท</div>
              </>
            )}
            {selectedPayment && (
              <>
                <h4 style={{ margin: '1rem 0', fontSize: '1.25rem', color: '#1e293b' }}>{selectedPayment.type}</h4>
                <div style={{ margin: '1.5rem 0', padding: '1.5rem', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: '12px', border: '2px solid #3b82f6', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <p style={{ margin: '0', padding: '0.75rem', background: 'white', borderRadius: '8px', color: '#1e293b', fontWeight: '500', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>เดือน: {selectedPayment.month}</p>
                  <p style={{ margin: '0', padding: '0.75rem', background: 'white', borderRadius: '8px', color: '#1e293b', fontWeight: '500', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>กำหนดชำระ: {new Date(selectedPayment.dueDate).toLocaleDateString('th-TH')}</p>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginTop: '1rem' }}>{selectedPayment.amount.toLocaleString()} บาท</div>
              </>
            )}
          </div>

          <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.15)', textAlign: 'center', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', padding: '2rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '2px solid #10b981', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <img src="/images/49e819ed-80cd-4aa8-a4fa-ec5e361f427c.jpg" alt="QR Code" style={{ width: '200px', height: '200px', borderRadius: '8px', objectFit: 'cover' }} />
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.25rem', fontWeight: '700' }}>QR PromptPay อัตโนมัติ</h4>
                <p style={{ margin: '0.5rem 0', color: '#374151', fontSize: '0.95rem', fontWeight: '500' }}>พร้อมเพย์: 0652796807</p>
                <p style={{ margin: '0.5rem 0', color: '#374151', fontSize: '0.95rem', fontWeight: '500' }}>ชื่อบัญชี: ศิริมงคล มนูบุตร</p>
              </div>
            </div>
            <p style={{ marginBottom: '1rem', color: '#64748b' }}>สแกน QR เพื่อชำระเงิน (ตรวจสอบอัตโนมัติ)</p>
            <div style={{ marginTop: '1rem' }}>
              <span style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', padding: '0.5rem 1rem', borderRadius: '25px', fontSize: '0.875rem', fontWeight: '600', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>✓ ตรวจสอบอัตโนมัติ</span>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.15)', borderLeft: '4px solid #f59e0b' }}>
            <h5 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>อัปโหลดสลิปหลังชำระเงิน:</h5>
            
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              {!selectedFile ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem 2rem', background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)', border: '2px dashed #f59e0b', borderRadius: '12px', cursor: 'pointer', color: '#92400e', transition: 'all 0.3s ease' }}>
                    <Upload size={48} />
                    <p style={{ margin: '0', fontWeight: '600' }}>คลิกเพื่อเลือกไฟล์สลิป</p>
                    <p style={{ margin: '0', fontSize: '0.875rem', color: '#64748b' }}>ไม่ได้เลือกไฟล์ใด</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*,.pdf"
                    style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', opacity: '0', cursor: 'pointer' }}
                    onChange={handleFileSelect}
                  />
                </>
              ) : (
                <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '2px solid #10b981', borderRadius: '12px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle size={24} color="#10b981" />
                    <span style={{ flex: '1', color: '#166534', fontWeight: '500' }}>ไฟล์: {selectedFile.name}</span>
                    <button 
                      style={{ background: '#ef4444', color: 'white', padding: '0.25rem 0.75rem', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                      onClick={() => setSelectedFile(null)}
                    >
                      ลบไฟล์
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <p style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'center', margin: '0' }}>หลังชำระเงินแล้ว ให้แนบสลิปที่นี่</p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.15)' }}>
            <button 
              style={{ padding: '1rem 2.5rem', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', color: '#374151', border: '2px solid #d1d5db', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' }}
              onClick={() => window.location.href = '/payment-history'}
            >
              ยกเลิก
            </button>
            <button 
              style={{ padding: '1rem 2.5rem', background: !selectedFile || uploading ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: '2px solid #10b981', borderRadius: '12px', fontWeight: '600', cursor: !selectedFile || uploading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease' }}
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