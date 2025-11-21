"use client";

import { useState } from "react";
import styles from "../app/login/login.module.css";

type Props = {
  onSuccess: (username: string) => void;
};

export default function RegistrationForm({ onSuccess }: Props) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess(formData.username);
      } else {
        const data = await response.json();
        setError(data.error || "เกิดข้อผิดพลาดในการลงทะเบียน");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="username" className={styles.label}>ชื่อผู้ใช้</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>อีเมล</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="firstName" className={styles.label}>ชื่อจริง</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="lastName" className={styles.label}>นามสกุล</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="phone" className={styles.label}>เบอร์โทรศัพท์</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="password" className={styles.label}>รหัสผ่าน</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>ยืนยันรหัสผ่าน</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
      </button>
    </form>
  );
}
