'use client';

import { Eye, Download } from 'lucide-react';
import Header from '../../components/Header';

export default function DownloadDocumentPage() {
  const documents = [
    { id: 1, name: 'สัญญาเช่าหอพัก', description: 'ห้อง 101 อาคาร A' },
    { id: 2, name: 'ใบเสร็จค่าเช่าห้อง', description: 'เดือน พ.ย. 2568' },
    { id: 3, name: 'หนังสือยินยอมให้เปิดเผยข้อมูลผู้ปกครอง', description: 'นางสุดสาคร' },
    { id: 4, name: 'หนังสือยินยอมให้เปิดเผยข้อมูลผู้ปกครอง', description: 'นายสุจิต' },
    { id: 5, name: 'บัตรนักศึกษา / เอกสารผู้เช่า', description: '–' }
  ];

  return (
    <div style={{minHeight: '100vh', background: '#f8fafc'}}>
      <Header />
      
      <main style={{padding: '2rem 0'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem'}}>
          <div style={{textAlign: 'center', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', marginBottom: '2rem'}}>
            <h1 style={{fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem'}}>ดาวน์โหลดเอกสาร</h1>
            <p style={{color: '#64748b'}}>ตรวจสอบและดาวน์โหลดเอกสารต่างๆ</p>
          </div>

          <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #e2e8f0'}}>
                  <th style={{padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151'}}>เอกสาร</th>
                  <th style={{padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151'}}>รายละเอียด</th>
                  <th style={{padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151'}}>การกระทำ</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                    <td style={{padding: '1rem', fontWeight: '500', color: '#1e293b'}}>{doc.name}</td>
                    <td style={{padding: '1rem', color: '#64748b'}}>{doc.description}</td>
                    <td style={{padding: '1rem', textAlign: 'center'}}>
                      <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                        <button style={{display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#6366f1', color: 'white', padding: '0.5rem 0.75rem', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer'}}>
                          <Eye size={14} />
                          ตรวจเอกสาร
                        </button>
                        <button style={{display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#10b981', color: 'white', padding: '0.5rem 0.75rem', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer'}}>
                          <Download size={14} />
                          ดาวน์โหลด
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}