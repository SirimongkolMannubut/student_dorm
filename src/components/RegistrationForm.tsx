"use client";

import { useState } from "react";
import styles from "../app/login/login.module.css";

type Props = {
  onSuccess: (username: string) => void;
};

export default function RegistrationForm({ onSuccess }: Props) {
  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    email: "",
    year: "",
    major: "",
    faculty: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        const result = await response.json();
        localStorage.setItem('user', JSON.stringify(result.user));
        window.location.href = '/dashboard';
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
      <label className={styles.label}>
        รหัสนักศึกษา
        <input
          type="text"
          id="studentId"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          className={styles.input}
          placeholder="เช่น 62010001"
          required
        />
      </label>
      <label className={styles.label}>
        ชื่อ – นามสกุล
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={styles.input}
          placeholder="ชื่อจริง นามสกุล"
          required
        />
      </label>
      <label className={styles.label}>
        ชั้นปี
        <select
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          className={styles.input}
          required
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
          type="text"
          id="major"
          name="major"
          value={formData.major}
          onChange={handleChange}
          className={styles.input}
          placeholder="เช่น วิทยาการคอมพิวเตอร์"
          required
        />
      </label>
      <label className={styles.label}>
        คณะ
        <input
          type="text"
          id="faculty"
          name="faculty"
          value={formData.faculty}
          onChange={handleChange}
          className={styles.input}
          placeholder="เช่น คณะวศิลปศาสตร์และวิทยาศาสตร์"
          required
        />
      </label>
      <label className={styles.label}>
        เบอร์โทรศัพท์
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={styles.input}
          placeholder="เช่น 0812345678"
          required
        />
      </label>
      <label className={styles.label}>
        อีเมล
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          placeholder="example@sisaket.com"
          required
        />
      </label>
      <label className={styles.label}>
        รหัสผ่าน
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
          placeholder="•••••••••"
          required
        />
      </label>
      <label className={styles.label}>
        ยืนยันรหัสผ่าน
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={styles.input}
          placeholder="•••••••••"
          required
        />
      </label>
      {error && <div className={styles.error}>{error}</div>}
      <button type="submit" className={styles.btnPrimary} disabled={loading}>
        {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
      </button>
    </form>
  );
}
