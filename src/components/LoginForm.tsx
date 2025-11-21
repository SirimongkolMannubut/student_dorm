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
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("กรุณากรอกอีเมล/รหัสนักศึกษา และรหัสผ่าน");
      return;
    }
    // simple validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.includes('@') && !emailRegex.test(email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      setLoading(false);
      if (!resp.ok) {
        setError(data?.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        return;
      }
      // persist remember
      try {
        if (remember) {
          localStorage.setItem('login_remember', JSON.stringify({ email, remember: true }));
        } else {
          localStorage.removeItem('login_remember');
        }
      } catch (e) {}
      if (onSuccess) {
        onSuccess();
        return;
      }
      router.push('/dashboard');
    } catch (err) {
      setLoading(false);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
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
