'use client';

import { Sparkles } from 'lucide-react';

export default function Greeting() {
  return (
    <section className="dashboard-hero">
      <div className="dashboard-hero-background">
        <div className="hero-blur-circle hero-blur-1"></div>
        <div className="hero-blur-circle hero-blur-2"></div>
        <div className="hero-blur-circle hero-blur-3"></div>
      </div>
      <div className="dashboard-hero-container">
        <div className="dashboard-hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>ยินดีต้อนรับกลับมา</span>
          </div>
          <h1 className="dashboard-hero-title">
            Hello, Somchai 👋
          </h1>
          <p className="dashboard-hero-description">
            ข้อมูลหอพักของคุณในมุมมองรวดเร็ว
          </p>
        </div>
      </div>
    </section>
  );
}
