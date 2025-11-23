'use client';

import { useState } from 'react';
import { X, User, LogIn } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    gender: '',
    year: '',
    major: '',
    faculty: '',
    phone: '',
    email: 'somkid@sisaket.com',
    password: '11111111',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        alert('รหัสผ่านไม่ตรงกัน');
        return;
      }

      try {
        const [firstName, ...lastNameParts] = formData.fullName.split(' ');
        const lastName = lastNameParts.join(' ');
        
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: formData.studentId,
            firstName,
            lastName,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender === 'ชาย' ? 'male' : 'female',
            year: formData.year,
            major: formData.major,
            faculty: formData.faculty,
            password: formData.password
          })
        });
        
        const data = await response.json();
        if (response.ok) {
          alert('ลงทะเบียนสำเร็จ!');
          window.location.href = data.redirectTo || '/dashboard';
        } else {
          alert(data.error || 'เกิดข้อผิดพลาด');
        }
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลงทะเบียน');
      }
    } else {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: formData.email,
            password: formData.password
          })
        });
        
        const data = await response.json();
        if (response.ok) {
          window.location.href = data.redirectTo || '/dashboard';
        } else {
          alert(data.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-page">
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="landing-logo">
            <h1>SSKRU Dormitory System</h1>
          </div>
          <nav className="landing-nav">
            <a className="nav-link" href="/">กลับหน้าแรก</a>
          </nav>
        </div>
      </header>
      
      <main className="login-main">
        <div className={styles.modalCard}>
      <button 
        className={styles.modalCloseIcon}
        onClick={() => window.location.href = '/'}
      >
        <X size={18} />
      </button>
      
      <div className={styles.modalHeader}>
        <div className={styles.logoBadge}>
          <User size={28} />
        </div>
        <div>
          <div className={styles.headerTitle}>
            {isRegister ? 'ลงทะเบียน' : 'เข้าสู่ระบบ'}
          </div>
          <div className={styles.headerSubtitle}>
            {isRegister ? 'สร้างบัญชีใหม่เพื่อเข้าถึงระบบนักศึกษา' : 'เข้าสู่ระบบเพื่อจัดการข้อมูลหอพักของคุณ'}
          </div>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {isRegister ? (
          <>
            <label className={styles.label}>
              รหัสนักศึกษา
              <input
                name="studentId"
                className={styles.input}
                placeholder="เช่น 62010001"
                required
                type="text"
                value={formData.studentId}
                onChange={handleChange}
              />
            </label>

            <label className={styles.label}>
              ชื่อ – นามสกุล
              <input
                name="fullName"
                className={styles.input}
                placeholder="ชื่อจริง นามสกุล"
                required
                type="text"
                value={formData.fullName}
                onChange={handleChange}
              />
            </label>

            <label className={styles.label}>
              เพศ
              <select
                name="gender"
                className={styles.input}
                required
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">เลือกเพศ</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>
            </label>

            <label className={styles.label}>
              ชั้นปี
              <select
                name="year"
                className={styles.input}
                required
                value={formData.year}
                onChange={handleChange}
              >
                <option value="">เลือกชั้นปี</option>
                <option value="1">ปี 1</option>
                <option value="2">ปี 2</option>
                <option value="3">ปี 3</option>
                <option value="4">ปี 4</option>
              </select>
            </label>

            <label className={styles.label}>
              สาขาวิชา
              <input
                name="major"
                className={styles.input}
                placeholder="เช่น วิทยาการคอมพิวเตอร์"
                required
                type="text"
                value={formData.major}
                onChange={handleChange}
              />
            </label>

            <label className={styles.label}>
              คณะ
              <input
                name="faculty"
                className={styles.input}
                placeholder="เช่น คณะวิศวกรรมศาสตร์และวิทยาศาสตร์"
                required
                type="text"
                value={formData.faculty}
                onChange={handleChange}
              />
            </label>

            <label className={styles.label}>
              เบอร์โทรศัพท์
              <input
                name="phone"
                className={styles.input}
                placeholder="เช่น 0812345678"
                required
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </label>

            <label className={styles.label}>
              อีเมล
              <input
                name="email"
                className={styles.input}
                placeholder="example@sisaket.com"
                required
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>

            <label className={styles.label}>
              รหัสผ่าน
              <input
                name="password"
                className={styles.input}
                placeholder="•••••••••"
                required
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </label>

            <label className={styles.label}>
              ยืนยันรหัสผ่าน
              <input
                name="confirmPassword"
                className={styles.input}
                placeholder="•••••••••"
                required
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </label>
          </>
        ) : (
          <>
            <label className={styles.label}>
              อีเมล / รหัสนักศึกษา
              <input
                name="email"
                className={styles.input}
                placeholder="test@test.com หรือ 62010001"
                required
                type="text"
                value={formData.email}
                onChange={handleChange}
              />
            </label>

            <label className={styles.label}>
              รหัสผ่าน
              <input
                name="password"
                className={styles.input}
                placeholder="•••••••••"
                required
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </label>
          </>
        )}

        <button type="submit" className={styles.btnPrimary}>
          {isRegister ? 'ลงทะเบียน' : 'เข้าสู่ระบบ'}
        </button>
      </form>

      <div className={styles.modalFooter}>
        <a 
          href="#" 
          className={styles.link}
          onClick={(e) => {
            e.preventDefault();
            setIsRegister(!isRegister);
          }}
        >
          {isRegister ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'}
        </a>
        <span> | </span>
        <a href="/" className={styles.link}>กลับสู่หน้าแรก</a>
      </div>
        </div>
      </main>
    </div>
  );
}