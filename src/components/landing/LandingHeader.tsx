'use client';

import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { useLoginModal } from '../LoginModalContext';

export default function LandingHeader() {
  const { open } = useLoginModal();
  return (
    <header className="landing-header">
      <div className="landing-header-container">
        <div className="landing-logo">
          <h1>SSKRU Dormitory System</h1>
        </div>
        <nav className="landing-nav">
          <Link href="#features" className="nav-link">
            ฟีเจอร์
          </Link>
          <Link href="#about" className="nav-link">
            เกี่ยวกับ
          </Link>
          <button type="button" className="nav-link btn-nav" onClick={() => open()}>
            <LogIn size={18} />
            เข้าสู่ระบบ
          </button>
        </nav>
      </div>
    </header>
  );
}

