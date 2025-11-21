"use client";

import { useEffect, useState } from 'react';
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import styles from "../app/login/login.module.css";
import { useRouter } from "next/navigation";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function LoginModal({ visible, onClose }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [registeredUsername, setRegisteredUsername] = useState<string | null>(null);

  function handleSuccess() {
    onClose();
    router.push('/dashboard');
  }

  function handleRegistrationSuccess(username: string) {
    setRegisteredUsername(username);
    setMode('login');
  }

  function toggleMode() {
    setMode(mode === 'login' ? 'register' : 'login');
  }

  // close on ESC — effect runs every render but only attaches listener when visible
  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, visible]);

  if (!visible) return null;

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modalCard}>
        <button aria-label="ปิดหน้าต่าง" className={styles.modalCloseIcon} onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className={styles.modalHeader}>
          <div className={styles.logoBadge} aria-hidden>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className={styles.headerTitle}>{mode === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'}</div>
            <div className={styles.headerSubtitle}>
              {mode === 'login' ? 'ลงชื่อเข้าใช้เพื่อเข้าถึงระบบนักศึกษา' : 'สร้างบัญชีใหม่เพื่อเข้าถึงระบบนักศึกษา'}
            </div>
          </div>
        </div>

        {mode === 'login' ? (
          <LoginForm onSuccess={handleSuccess} initialUsername={registeredUsername || undefined} />
        ) : (
          <RegistrationForm onSuccess={handleRegistrationSuccess} />
        )}

        <div className={styles.modalFooter}>
          <a href="#" className={styles.link} onClick={toggleMode}>
            {mode === 'login' ? 'ลงทะเบียน' : 'เข้าสู่ระบบ'}
          </a>
          <span className={styles.linkSeparator}> | </span>
          <a href="/" className={styles.link} onClick={() => { onClose(); }}>กลับสู่หน้าแรก</a>
        </div>
      </div>
    </div>
  );
}

