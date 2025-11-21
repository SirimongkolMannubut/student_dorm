"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../app/login/login.module.css";

type Props = {
  onSuccess?: () => void;
};

export default function LoginForm({ onSuccess }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("กรุณากรอกอีเมล/รหัสนักศึกษา และรหัสผ่าน");
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
        <input
          className={styles.input}
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@sisaket-charity.com หรือ 62010001"
          autoComplete="username"
        />
      </label>

      <label className={styles.label}>
        รหัสผ่าน
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="•••••••••"
          autoComplete="current-password"
        />
      </label>

      <div className={styles.rememberRow}>
        <label className={styles.rememberLabel}>
          <input type="checkbox" /> จดจำฉัน
        </label>
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      <div className={styles.utils}>
        <a href="#" className={styles.link} onClick={(e) => e.preventDefault()}>
          ลืมรหัสผ่าน?
        </a>
        <a href="/" className={styles.link}>กลับสู่หน้าแรก</a>
      </div>
    </form>
  );
}
