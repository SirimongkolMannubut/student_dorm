"use client";

import LoginForm from "./LoginForm";
import styles from "../app/login/login.module.css";
import { useRouter } from "next/navigation";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function LoginModal({ visible, onClose }: Props) {
  const router = useRouter();
  if (!visible) return null;

  function handleSuccess() {
    onClose();
    router.push('/dashboard');
  }

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modalCard}>
        <LoginForm onSuccess={handleSuccess} />
        <div className={styles.modalFooter}>
          <button className={styles.modalClose} onClick={onClose}>ปิด</button>
        </div>
      </div>
    </div>
  );
}
