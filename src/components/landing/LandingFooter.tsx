'use client';

import { Mail, Phone } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-container">
        <div className="landing-footer-content">
          <div className="footer-section">
            <h3 className="footer-title">SSKRU Dormitory System</h3>
            <p className="footer-description">
              ระบบจัดการหอพักนักศึกษาที่ครบวงจรและทันสมัย
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">ติดต่อ</h4>
            <div className="footer-contact">
              <div className="contact-item">
                <Mail size={16} />
                <span>support@example.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>02-XXX-XXXX</span>
              </div>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">ข้อมูล</h4>
            <p className="footer-info">
              Version 1.0.0
              <br />
              © 2025 All rights reserved.
            </p>
          </div>
        </div>
        
        <div className="landing-footer-bottom">
          <p>© 2025 SSKRU Dormitory System — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

