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
      
      <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '20px' }}>
        {result}
      </pre>
    </div>
  );
}