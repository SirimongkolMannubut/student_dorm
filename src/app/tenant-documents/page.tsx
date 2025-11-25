'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, CheckCircle } from 'lucide-react';
import Header from '../../components/Header';

export default function TenantDocumentsPage() {
  const [user, setUser] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
      if (!token) return;

      const [profileRes, bookingsRes, paymentsRes] = await Promise.all([
        fetch('/api/profile', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/payments', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const profileData = await profileRes.json();
      const bookingsData = await bookingsRes.json();
      const paymentsData = await paymentsRes.json();

      setUser(profileData);
      setBooking(bookingsData.bookings?.find((b: any) => b.status === 'approved'));
      setPayments(paymentsData.payments?.filter((p: any) => p.status === 'approved') || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const downloadContract = () => {
    window.open('/contract', '_blank');
  };

  if (!user) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div style={{minHeight: '100vh', background: '#f8fafc'}}>
      <Header />
      
      <main style={{padding: '2rem 0'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem'}}>
          <div style={{textAlign: 'center', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', marginBottom: '2rem'}}>
            <h1 style={{fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem'}}>เอกสารผู้เช่า</h1>
            <p style={{color: '#64748b'}}>เอกสารและใบเสร็จที่เกี่ยวข้องกับการเช่า</p>
          </div>

          <div style={{display: 'grid', gap: '1.5rem'}}>
            {booking && (
              <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                  <div style={{background: '#dbeafe', padding: '0.75rem', borderRadius: '8px'}}>
                    <FileText size={24} style={{color: '#1e40af'}} />
                  </div>
                  <div>
                    <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1e293b'}}>สัญญาเช่า</h3>
                    <p style={{color: '#64748b', fontSize: '0.875rem'}}>ห้อง {booking.roomId}</p>
                  </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                  <CheckCircle size={16} style={{color: '#10b981'}} />
                  <span style={{color: '#10b981', fontSize: '0.875rem', fontWeight: '500'}}>สัญญาเช่าที่ลงนามแล้ว</span>
                </div>
                <button onClick={downloadContract} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'}}>
                  <Download size={20} />
                  ดาวน์โหลดสัญญาเช่า
                </button>
              </div>
            )}

            <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
                <div style={{background: '#dcfce7', padding: '0.75rem', borderRadius: '8px'}}>
                  <FileText size={24} style={{color: '#059669'}} />
                </div>
                <div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1e293b'}}>ใบเสร็จรับเงิน</h3>
                  <p style={{color: '#64748b', fontSize: '0.875rem'}}>ประวัติการชำระเงิน</p>
                </div>
              </div>
              
              {payments.length === 0 ? (
                <p style={{color: '#64748b', textAlign: 'center', padding: '2rem'}}>ยังไม่มีใบเสร็จ</p>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  {payments.map((payment, index) => (
                    <div key={payment._id} style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', background: '#f8fafc'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                          <p style={{fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem'}}>ใบเสร็จ #{index + 1}</p>
                          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem'}}>
                            <Calendar size={14} />
                            <span>{new Date(payment.createdAt).toLocaleDateString('th-TH')}</span>
                          </div>
                        </div>
                        <div style={{textAlign: 'right'}}>
                          <p style={{fontSize: '1.25rem', fontWeight: '700', color: '#059669'}}>฿{payment.amount?.toLocaleString() || '3,500'}</p>
                          <span style={{padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '500', background: '#dcfce7', color: '#059669'}}>ชำระแล้ว</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                <div style={{background: '#fef3c7', padding: '0.75rem', borderRadius: '8px'}}>
                  <FileText size={24} style={{color: '#d97706'}} />
                </div>
                <div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1e293b'}}>กฎระเบียบหอพัก</h3>
                  <p style={{color: '#64748b', fontSize: '0.875rem'}}>ข้อบังคับและกฎระเบียบที่ต้องปฏิบัติตาม</p>
                </div>
              </div>
              <div style={{background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', padding: '1rem', marginBottom: '1rem'}}>
                <ul style={{margin: 0, paddingLeft: '1.5rem', color: '#78350f', fontSize: '0.875rem', lineHeight: '1.8'}}>
                  <li>ห้ามนำสัตว์เลี้ยงเข้าหอพัก</li>
                  <li>ห้ามสูบบุหรี่ในห้องพัก</li>
                  <li>ห้ามทำเสียงดังรบกวนผู้อื่นหลัง 22:00 น.</li>
                  <li>ต้องชำระค่าเช่าภายในวันที่ 5 ของทุกเดือน</li>
                  <li>แจ้งซ่อมภายใน 24 ชั่วโมงหากพบความเสียหาย</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
