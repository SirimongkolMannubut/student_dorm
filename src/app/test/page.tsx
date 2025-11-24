'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState('');

  const testRegister = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: '62010001',
          firstName: 'สมชาย',
          lastName: 'ใจดี',
          email: 'test@test.com',
          phone: '0812345678',
          gender: 'male',
          year: '1',
          major: 'วิทยาการคอมพิวเตอร์',
          faculty: 'คณะวิทยาศาสตร์',
          password: '12345678'
        })
      });
      
      const data = await response.json();
      setResult('Register: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Register Error: ' + error.message);
    }
  };

  const testProfile = async () => {
    try {
      const cookies = document.cookie.split(';');
      console.log('All cookies:', cookies);
      
      const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
      console.log('Token cookie:', tokenCookie);
      
      const token = tokenCookie?.split('=')[1];
      console.log('Extracted token:', token);
      
      if (!token) {
        setResult('Profile Error: No token found in cookies');
        return;
      }
      
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      setResult('Profile: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Profile Error: ' + error.message);
    }
  };

  const checkCookie = () => {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
    const token = tokenCookie?.split('=')[1];
    
    setResult(`All cookies: ${document.cookie}\n\nToken: ${token ? token.substring(0, 50) + '...' : 'ไม่มี token'}`);
  };

  const testBooking = async () => {
    try {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
      const token = tokenCookie?.split('=')[1];

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId: 'A101',
          roomType: 'แอร์',
          price: 3000
        })
      });
      
      const data = await response.json();
      setResult('Booking: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Booking Error: ' + error.message);
    }
  };

  const testPaymentUpload = async () => {
    try {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
      const token = tokenCookie?.split('=')[1];

      const formData = new FormData();
      const mockFile = new File(['mock slip'], 'slip.jpg', { type: 'image/jpeg' });
      formData.append('slip', mockFile);
      formData.append('bookingId', '1');
      formData.append('amount', '3000');

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      setResult('Payment Upload: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Payment Upload Error: ' + error.message);
    }
  };

  const testStudentLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: '62010001',
          password: '12345678'
        })
      });
      
      const data = await response.json();
      setResult('Student Login: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Student Login Error: ' + error.message);
    }
  };

  const testLoginCustom = async () => {
    const studentId = prompt('รหัสนักศึกษา:');
    const password = prompt('รหัสผ่าน:');
    if (!studentId || !password) return;
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: studentId, password })
      });
      
      const data = await response.json();
      setResult('Login: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Login Error: ' + error.message);
    }
  };

  const testAdminLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: 'admin@sskru.ac.th',
          password: 'admin123'
        })
      });
      
      const data = await response.json();
      setResult('Admin Login: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Admin Login Error: ' + error.message);
    }
  };

  const testAdminApprove = async () => {
    try {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
      const token = tokenCookie?.split('=')[1];

      // ดึง payment ล่าสุดก่อน
      const getResponse = await fetch('/api/admin/payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const getData = await getResponse.json();
      const latestPayment = getData.payments?.[0];
      
      if (!latestPayment) {
        setResult('No payments found');
        return;
      }

      const response = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentId: latestPayment._id,
          status: 'approved'
        })
      });
      
      const data = await response.json();
      setResult('Admin Approve: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Admin Approve Error: ' + error.message);
    }
  };

  const clearBookings = async () => {
    try {
      const response = await fetch('/api/bookings/clear', { method: 'DELETE' });
      const data = await response.json();
      setResult('Clear Bookings: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Clear Bookings Error: ' + error.message);
    }
  };

  const clearPayments = async () => {
    try {
      const response = await fetch('/api/payments/clear', { method: 'DELETE' });
      const data = await response.json();
      setResult('Clear Payments: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Clear Payments Error: ' + error.message);
    }
  };

  const testDocumentSubmit = async () => {
    try {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
      const token = tokenCookie?.split('=')[1];

      const formData = new FormData();
      formData.append('documentType', 'คำร้องขอเข้าพักหอพัก');
      formData.append('semester', '1 / 2568');
      formData.append('description', 'ทดสอบส่งเอกสาร');
      
      const mockFile = new File(['mock doc'], 'document.pdf', { type: 'application/pdf' });
      formData.append('files', mockFile);

      const response = await fetch('/api/documents/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      setResult('Document Submit: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Document Submit Error: ' + error.message);
    }
  };

  const testGetStudents = async () => {
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      setResult('Get Students: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Get Students Error: ' + error.message);
    }
  };

  const deleteTestUsers = async () => {
    if (!confirm('ลบ user ทดสอบ 2 คน?')) return;
    
    try {
      await fetch('/api/students/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '6924ce1a05afd1debdb355ed' })
      });
      
      await fetch('/api/students/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '69233a5f3961b42ec08055a9' })
      });
      
      setResult('ลบสำเร็จ');
    } catch (error) {
      setResult('Delete Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Page</h1>
      
      <button onClick={testRegister} style={{ margin: '10px', padding: '10px' }}>
        Test Register
      </button>
      
      <button onClick={testProfile} style={{ margin: '10px', padding: '10px' }}>
        Test Profile
      </button>
      
      <button onClick={checkCookie} style={{ margin: '10px', padding: '10px' }}>
        Check Cookie
      </button>
      
      <button onClick={testBooking} style={{ margin: '10px', padding: '10px' }}>
        Test Booking
      </button>
      
      <button onClick={testPaymentUpload} style={{ margin: '10px', padding: '10px' }}>
        Test Payment Upload
      </button>
      
      <button onClick={testStudentLogin} style={{ margin: '10px', padding: '10px', background: '#10b981' }}>
        Test Student Login (62010001)
      </button>
      
      <button onClick={testLoginCustom} style={{ margin: '10px', padding: '10px', background: '#8b5cf6' }}>
        Login ศิริมงคล (กรอกรหัส)
      </button>
      
      <button onClick={testAdminLogin} style={{ margin: '10px', padding: '10px', background: '#ff9800' }}>
        Test Admin Login
      </button>
      
      <button onClick={testAdminApprove} style={{ margin: '10px', padding: '10px' }}>
        Test Admin Approve
      </button>
      
      <button onClick={clearBookings} style={{ margin: '10px', padding: '10px', background: '#ef4444' }}>
        Clear Bookings
      </button>
      
      <button onClick={clearPayments} style={{ margin: '10px', padding: '10px', background: '#ef4444' }}>
        Clear Payments
      </button>
      
      <button onClick={testDocumentSubmit} style={{ margin: '10px', padding: '10px', background: '#10b981' }}>
        Test Document Submit
      </button>
      
      <button onClick={testGetStudents} style={{ margin: '10px', padding: '10px', background: '#3b82f6' }}>
        Test Get Students
      </button>
      
      <button onClick={deleteTestUsers} style={{ margin: '10px', padding: '10px', background: '#ef4444' }}>
        ลบ User ทดสอบ
      </button>
      
      <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '20px' }}>
        {result}
      </pre>
    </div>
  );
}