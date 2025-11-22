'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Check } from 'lucide-react';
import Link from 'next/link';

export default function ContractPage() {
  const [contractData, setContractData] = useState<any>(null);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      const today = new Date();
      
      setContractData({
        contractId: `DORM-${Date.now()}`,
        contractDate: today.toLocaleDateString('th-TH'),
        
        // ข้อมูลผู้เช่า
        studentName: user.fullName || '',
        studentId: user.studentId || '',
        faculty: user.faculty || '',
        major: user.major || '',
        phone: user.phone || '',
        address: user.address || '',
        
        // ข้อมูลห้อง
        roomNumber: 'A301',
        floor: '3',
        building: 'A',
        
        // ข้อมูลราคา
        pricePerTerm: 3500,
        priceTotal: 7000,
        deposit: 400,
        keyDeposit: 50,
        
        // ลายเซ็นดิจิทัล
        digitalSignature: user.digitalSignature || user.fullName || '',
        
        // ข้อมูลผู้ปกครอง
        parentName: user.parentName || '',
        parentPhone: user.parentPhone || ''
      });
    }
  }, []);

  const handleDownloadPDF = () => {
    alert('ดาวน์โหลด PDF สัญญาดิจิทัลสำเร็จ!');
  };

  const handleDigitalSign = () => {
    if (!isAgreed) {
      alert('กรุณายอมรับข้อตกลงก่อนลงนาม');
      return;
    }
    
    alert('ลงนามดิจิทัลสำเร็จ!\n\nสัญญามีผลบังคับใช้ทันที\nสามารถเข้าพักได้แล้ว');
    window.location.href = '/dashboard';
  };

  if (!contractData) return <div>Loading...</div>;

  return (
    <div className="contract-page">
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="landing-logo">
            <h1>SSKRU Dormitory System</h1>
          </div>
          <nav className="landing-nav">
            <Link href="/dashboard" className="nav-link">
              <ArrowLeft size={18} />
              กลับ Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="contract-main">
        <div className="contract-container">
          <div className="contract-header">
            <FileText size={32} />
            <h1>สัญญาเช่าห้องพักดิจิทัล</h1>
            <p>Digital Dormitory Rental Agreement</p>
            <div className="contract-meta">
              <span>เลขที่สัญญา: {contractData.contractId}</span>
              <span>วันที่: {contractData.contractDate}</span>
            </div>
          </div>

          <div className="contract-content">
            {/* ข้อมูลคู่สัญญา */}
            <section className="contract-section">
              <h3>📋 ข้อมูลคู่สัญญา</h3>
              <div className="party-info">
                <div className="lessor">
                  <h4>ผู้ให้เช่า</h4>
                  <p><strong>หอพักนักศึกษา มหาวิทยาลัยราชภัฏศรีสะเกษ</strong></p>
                  <p>319 หมู่ 8 ถนนไทยพันทา ตำบลโพธิ์ อำเภอเมือง จังหวัดศรีสะเกษ 33000</p>
                </div>
                <div className="lessee">
                  <h4>ผู้เช่า</h4>
                  <p><strong>{contractData.studentName}</strong></p>
                  <p>รหัส: {contractData.studentId}</p>
                  <p>{contractData.faculty} - {contractData.major}</p>
                  <p>โทร: {contractData.phone}</p>
                </div>
              </div>
            </section>

            {/* ข้อมูลห้อง */}
            <section className="contract-section">
              <h3>🏠 ข้อมูลห้องพัก</h3>
              <div className="room-details">
                <div className="detail-row">
                  <span>ห้องเลขที่:</span>
                  <strong>{contractData.roomNumber}</strong>
                </div>
                <div className="detail-row">
                  <span>ชั้น:</span>
                  <strong>{contractData.floor}</strong>
                </div>
                <div className="detail-row">
                  <span>อาคาร:</span>
                  <strong>{contractData.building}</strong>
                </div>
              </div>
            </section>

            {/* ข้อมูลราคา */}
            <section className="contract-section">
              <h3>💰 ค่าใช้จ่าย</h3>
              <div className="pricing-table">
                <div className="price-row">
                  <span>ค่าเช่าต่อภาค:</span>
                  <strong>{contractData.pricePerTerm.toLocaleString()} บาท</strong>
                </div>
                <div className="price-row">
                  <span>รวม 2 ภาค:</span>
                  <strong>{contractData.priceTotal.toLocaleString()} บาท</strong>
                </div>
                <div className="price-row">
                  <span>เงินประกัน:</span>
                  <strong>{contractData.deposit} บาท</strong>
                </div>
                <div className="price-row">
                  <span>ค่ากุญแจ:</span>
                  <strong>{contractData.keyDeposit} บาท</strong>
                </div>
                <div className="price-row total">
                  <span>รวมทั้งสิ้น:</span>
                  <strong>{(contractData.priceTotal + contractData.deposit + contractData.keyDeposit).toLocaleString()} บาท</strong>
                </div>
              </div>
            </section>

            {/* เงื่อนไขสำคัญ */}
            <section className="contract-section">
              <h3>📜 เงื่อนไขสำคัญ</h3>
              <div className="terms-list">
                <div className="term-item">
                  <Check size={16} />
                  <span>ใช้เป็นที่พักอาศัยนักศึกษาเท่านั้น</span>
                </div>
                <div className="term-item">
                  <Check size={16} />
                  <span>ปฏิบัติตามกฎระเบียบหอพักทุกข้อ</span>
                </div>
                <div className="term-item">
                  <Check size={16} />
                  <span>ค่าน้ำ 30 บาท/เดือน ค่าไฟ 5 บาท/หน่วย</span>
                </div>
                <div className="term-item">
                  <Check size={16} />
                  <span>แจ้งออกล่วงหน้า 30 วัน</span>
                </div>
                <div className="term-item">
                  <Check size={16} />
                  <span>ห้ามนำผู้อื่นเข้าพักโดยไม่ได้รับอนุญาต</span>
                </div>
              </div>
            </section>

            {/* ลายเซ็นดิจิทัล */}
            <section className="contract-section signature-section">
              <h3>✍️ ลายเซ็นดิจิทัล</h3>
              <div className="signatures">
                <div className="signature-box">
                  <h4>ผู้ให้เช่า</h4>
                  <div className="signature-display">นางเพ็ญพักตร์ สุมณฑา</div>
                  <p>หัวหน้างานพัฒนานักศึกษา</p>
                  <small>ลงนามดิจิทัล: {contractData.contractDate}</small>
                </div>
                <div className="signature-box">
                  <h4>ผู้เช่า</h4>
                  <div className="signature-display">{contractData.digitalSignature}</div>
                  <p>นักศึกษา รหัส {contractData.studentId}</p>
                  <small>รอลงนามดิจิทัล</small>
                </div>
              </div>
            </section>

            {/* ยอมรับข้อตกลง */}
            <section className="agreement-section">
              <div className="agreement-checkbox">
                <input 
                  type="checkbox" 
                  id="agreement"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                />
                <label htmlFor="agreement">
                  ข้าพเจ้าได้อ่านและเข้าใจเงื่อนไขทั้งหมดแล้ว ยอมรับที่จะปฏิบัติตามสัญญานี้ทุกประการ
                </label>
              </div>
            </section>

            {/* ปุ่มดำเนินการ */}
            <section className="contract-actions">
              <button className="download-btn" onClick={handleDownloadPDF}>
                <Download size={20} />
                ดาวน์โหลด PDF
              </button>
              <button 
                className={`sign-btn ${!isAgreed ? 'disabled' : ''}`}
                onClick={handleDigitalSign}
                disabled={!isAgreed}
              >
                <FileText size={20} />
                ลงนามดิจิทัล
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}