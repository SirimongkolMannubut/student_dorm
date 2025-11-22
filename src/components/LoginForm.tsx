"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "../app/login/login.module.css";

type Props = {
  onSuccess?: () => void;
  initialUsername?: string;
};

export default function LoginForm({ onSuccess, initialUsername }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (initialUsername) {
      setEmail(initialUsername);
    } else {
      try {
        const saved = localStorage.getItem('login_remember');
        if (saved) {
          const obj = JSON.parse(saved);
          if (obj?.email) setEmail(obj.email);
          if (obj?.remember) setRemember(true);
        }
      } catch (e) {
        // ignore
      }
    }
  }, [initialUsername]);
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("กรุณากรอกอีเมล/รหัสนักศึกษา และรหัสผ่าน");
      return;
    }
    
    setLoading(true);
    
    // จำลองการเข้าสู่ระบบ
    setTimeout(() => {
      let userData;
      
      // ตรวจสอบว่าเป็น admin หรือนักศึกษา
      if (email === 'admin@sskru.ac.th' && password === 'admin123') {
        userData = {
          role: 'admin',
          fullName: 'ผู้ดูแลระบบ',
          email: 'admin@sskru.ac.th'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/admin');
      } else {
        // นักศึกษา - ใช้ข้อมูลจำลอง
        userData = {
          studentId: email.includes('@') ? '661048827' : email,
          fullName: 'น.ส.สมคิด พลหาญ',
          email: email.includes('@') ? email : `${email}@sskru.ac.th`,
          year: '3',
          major: 'วิทยาการคอมพิวเตอร์',
          faculty: 'คณะวิทยาศาสตร์และเทคโนโลยี',
          phone: '0812345678',
          roomStatus: 'none',
          role: 'student'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/dashboard');
        }
      }
      
      // บันทึกการจดจำ
      if (remember) {
        localStorage.setItem('login_remember', JSON.stringify({ email, remember: true }));
      } else {
        localStorage.removeItem('login_remember');
      }
      
      setLoading(false);
    }, 1000);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}

      <label className={styles.label}>
        อีเมล / รหัสนักศึกษา
        <div className={styles.inputGroup}>
          <span className={styles.inputIcon} aria-hidden>👤</span>
        <input
          className={styles.input}
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@sisaket-charity.com หรือ 62010001"
          autoComplete="username"
        />
        </div>
      </label>

      <label className={styles.label}>
        รหัสผ่าน
        <div className={styles.inputGroup}>
          <span className={styles.inputIcon} aria-hidden>🔒</span>
        <input
          className={styles.input}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="•••••••••"
          autoComplete="current-password"
          aria-label="รหัสผ่าน"
        />
          <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(s => !s)} aria-label="แสดง/ซ่อนรหัสผ่าน">
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </label>

      <div className={styles.rememberRow}>
        <label className={styles.rememberLabel}>
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <span>จดจำฉัน</span>
        </label>
      </div>

      <button type="submit" className={styles.btnPrimary} disabled={loading}>
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      <div className={styles.utils}>
        <a href="#" className={styles.link} onClick={(e) => e.preventDefault()}>
          ลืมรหัสผ่าน?
        </a>
      </div>
    </form>
  );
}
