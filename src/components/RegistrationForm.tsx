"use client";

import { useState } from "react";
import styles from "../app/login/login.module.css";

type Props = {
  onSuccess: (username: string) => void;
};

export default function RegistrationForm({ onSuccess }: Props) {
  const [formData, setFormData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
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

  const validateForm = () => {
    // ตรวจสอบรหัสผ่าน
    if (formData.password !== formData.confirmPassword) {
      return "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน";
    }

    // ตรวจสอบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "รูปแบบอีเมลไม่ถูกต้อง";
    }

    // ตรวจสอบเบอร์โทร (10 หลัก)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      return "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก";
    }

    // ตรวจสอบรหัสนักศึกษา (ตัวเลข)
    const studentIdRegex = /^[0-9]+$/;
    if (!studentIdRegex.test(formData.studentId)) {
      return "รหัสนักศึกษาต้องเป็นตัวเลขเท่านั้น";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ตรวจสอบ validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      console.log('Sending registration data:', formData); // Debug log
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status); // Debug log

      if (response.ok) {
        const result = await response.json();
        console.log('Registration successful:', result); // Debug log
        // Redirect to dashboard (token is set in cookie automatically)
        window.location.href = result.redirectTo || '/dashboard';
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
          pattern="[0-9]+"
          required
        />
      </label>
      <label className={styles.label}>
        ชื่อ
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={styles.input}
          placeholder="ชื่อจริง"
          required
        />
      </label>
      <label className={styles.label}>
        นามสกุล
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={styles.input}
          placeholder="นามสกุล"
          required
        />
      </label>
      <label className={styles.label}>
        เพศ
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">เลือกเพศ</option>
          <option value="male">ชาย</option>
          <option value="female">หญิง</option>
        </select>
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
          pattern="[0-9]{10}"
          maxLength={10}
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
