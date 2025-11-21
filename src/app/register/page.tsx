"use client";

import { UserPlus } from "lucide-react";
import styles from "../login/login.module.css";
import RegistrationForm from "../../components/RegistrationForm";

export default function RegisterPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardMedia}>
          <div className={styles.mediaDecor} />
          <div>
            <div className={styles.brandTitle}>SSKRU Dormitory System</div>
            <div className={styles.brandSubtitle}>
              ระบบจัดการหอพักนักศึกษาอย่างเป็นทางการ — จองห้อง ชำระค่าเช่า และติดตามสถานะแบบครบวงจร
            </div>
          </div>
        </div>

        <div className={styles.cardContent}>
          <div className={styles.formHeader}>
            <UserPlus size={28} />
            <div>
              <div className={styles.formTitle}>ลงทะเบียน</div>
              <div className={styles.subtitle}>สร้างบัญชีใหม่เพื่อเข้าถึงระบบหอพัก</div>
            </div>
          </div>

          <RegistrationForm onSuccess={() => window.location.href = '/login'} />
        </div>
      </div>
    </main>
  );
}
