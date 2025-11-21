"use client";

import { LogIn } from "lucide-react";
import styles from "./login.module.css";
import LoginForm from "../../components/LoginForm";

export default function LoginPage() {
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
            <LogIn size={28} />
            <div>
              <div className={styles.formTitle}>เข้าสู่ระบบ</div>
              <div className={styles.subtitle}>เข้าสู่ระบบเพื่อจัดการข้อมูลหอพักของคุณ</div>
            </div>
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
