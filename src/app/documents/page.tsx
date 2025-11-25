'use client';

import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import Header from '../../components/Header';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const response = await fetch('/api/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#f8fafc'}}>
      <Header />
      <main style={{padding: '2rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem'}}>
          <h1 style={{fontSize: '2rem', fontWeight: '700', marginBottom: '2rem'}}>เอกสารของฉัน</h1>
          
          {loading ? (
            <div>กำลังโหลด...</div>
          ) : documents.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px'}}>
              <p>ยังไม่มีเอกสาร</p>
            </div>
          ) : (
            <div style={{display: 'grid', gap: '1rem'}}>
              {documents.map((doc) => (
                <div key={doc._id} style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem'}}>
                    <div>
                      <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem'}}>
                        {doc.documentType}
                      </h3>
                      <p style={{color: '#64748b'}}>ภาคเรียน: {doc.semester}</p>
                      {doc.description && <p style={{color: '#64748b', marginTop: '0.5rem'}}>{doc.description}</p>}
                    </div>
                    <span style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      background: doc.status === 'approved' ? '#d1fae5' : doc.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                      color: doc.status === 'approved' ? '#065f46' : doc.status === 'rejected' ? '#991b1b' : '#92400e'
                    }}>
                      {doc.status === 'pending' && 'รอตรวจสอบ'}
                      {doc.status === 'approved' && 'อนุมัติแล้ว'}
                      {doc.status === 'rejected' && 'ปฏิเสธ'}
                    </span>
                  </div>
                  
                  {doc.status === 'approved' && (
                    <div style={{
                      padding: '1rem',
                      background: '#d1fae5',
                      border: '1px solid #a7f3d0',
                      borderRadius: '8px',
                      marginTop: '1rem'
                    }}>
                      <p style={{fontWeight: '600', color: '#065f46'}}>✓ เอกสารได้รับการอนุมัติแล้ว</p>
                    </div>
                  )}
                  
                  {doc.status === 'rejected' && doc.rejectReason && (
                    <div style={{
                      padding: '1rem',
                      background: '#fee2e2',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      marginTop: '1rem'
                    }}>
                      <p style={{fontWeight: '600', color: '#991b1b', marginBottom: '0.5rem'}}>เหตุผลที่ปฏิเสธ:</p>
                      <p style={{color: '#991b1b'}}>{doc.rejectReason}</p>
                    </div>
                  )}
                  
                  {doc.fileUrls && doc.fileUrls.length > 0 && (
                    <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                      {doc.fileUrls.map((url, i) => (
                        <a key={i} href={url} target="_blank" style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          background: '#3b82f6',
                          color: 'white',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '0.875rem'
                        }}>
                          <FileText size={16} />
                          ไฟล์ {i + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
