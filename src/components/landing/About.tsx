'use client';

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-content">
          <h2 className="about-title">เกี่ยวกับระบบ</h2>
          <p className="about-description">
            SSKRU Dormitory System เป็นระบบจัดการหอพักนักศึกษามหาวิทยาลัยราชภัฏศรีสะเกษ
            อำนวยความสะดวกในการจองห้อง ชำระค่าเช่า และติดตามสถานะหอพักอย่างมีประสิทธิภาพ
            ระบบครอบคลุมการจัดการห้องพัก การชำระเงิน การแจ้งซ่อม และการส่งประกาศต่างๆ
          </p>
          <div className="about-stats">
            <div className="about-stat">
              <div className="stat-number">150+</div>
              <div className="stat-label">ห้องพัก</div>
            </div>
            <div className="about-stat">
              <div className="stat-number">142+</div>
              <div className="stat-label">ผู้พักอาศัย</div>
            </div>
            <div className="about-stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">บริการออนไลน์</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

