'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';

interface Document {
  id: number;
  title: string;
  semester: string;
  submitDate: string;
  reviewDate?: string;
  status: 'approved' | 'pending' | 'rejected';
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: 1488,
        title: 'คำร้องขอเข้าพักหอพัก',
        semester: '1 / 2568',
        submitDate: '23-02-2568 18:29:31',
        reviewDate: '24-02-2568 11:35:24',
        status: 'approved'
      },
      {
        id: 3675,
        title: 'แบบฟอร์มข้อมูลผู้เช่า',
        semester: '1 / 2568',
        submitDate: '10-06-2568 10:24:54',
        reviewDate: '18-06-2568 10:45:08',
        status: 'approved'
      },
      {
        id: 6352,
        title: 'คำร้องขอต่อสัญญาเช่า',
        semester: '2 / 2568',
        submitDate: '11-09-2568 12:52:26',
        reviewDate: '26-09-2568 10:40:29',
        status: 'approved'
      }
    ];
    setDocuments(mockDocuments);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} style={{color: '#10b981'}} />;
      case 'pending':
        return <Clock size={16} style={{color: '#f59e0b'}} />;
      case 'rejected':
        return <XCircle size={16} style={{color: '#ef4444'}} />;
      default:
        return <Clock size={16} style={{color: '#94a3b8'}} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'อนุมัติแล้ว';
      case 'pending': return 'รอตรวจสอบ';
      case 'rejected': return 'ไม่อนุมัติ';
      default: return 'ไม่ทราบสถานะ';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#dcfce7';
      case 'pending': return '#fef3c7';
      case 'rejected': return '#fee2e2';
      default: return '#f1f5f9';
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#f8fafc'}}>
      <Header />
      
      <main style={{padding: '2rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem'}}>
          <div style={{textAlign: 'center', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', marginBottom: '2rem'}}>

            <h1 style={{fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem'}}>เอกสารที่ส่งแล้ว</h1>
            <p style={{color: '#64748b'}}>ตรวจสอบสถานะเอกสารที่ส่งไปแล้ว</p>
          </div>

          <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}}>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{borderBottom: '2px solid #e2e8f0'}}>
                    <th style={{padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem'}}>ID</th>
                    <th style={{padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem'}}>รายการเอกสาร</th>
                    <th style={{padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem'}}>วันที่ส่ง</th>
                    <th style={{padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem'}}>วันที่ตรวจ</th>
                    <th style={{padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem'}}>สถานะ</th>
                    <th style={{padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '0.875rem'}}>การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                      <td style={{padding: '1rem', fontWeight: '500', color: '#1e293b'}}>{doc.id}</td>
                      <td style={{padding: '1rem'}}>
                        <div>
                          <div style={{fontWeight: '500', color: '#1e293b', marginBottom: '0.25rem'}}>{doc.title}</div>
                          <div style={{fontSize: '0.75rem', color: '#64748b'}}>{doc.semester}</div>
                        </div>
                      </td>
                      <td style={{padding: '1rem', fontSize: '0.875rem', color: '#64748b'}}>{doc.submitDate}</td>
                      <td style={{padding: '1rem', fontSize: '0.875rem', color: '#64748b'}}>{doc.reviewDate || '-'}</td>
                      <td style={{padding: '1rem'}}>
                        <div style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '500', background: getStatusColor(doc.status), color: doc.status === 'approved' ? '#166534' : doc.status === 'pending' ? '#92400e' : '#dc2626'}}>
                          {getStatusIcon(doc.status)}
                          {getStatusText(doc.status)}
                        </div>
                      </td>
                      <td style={{padding: '1rem', textAlign: 'center'}}>
                        <button style={{display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#3b82f6', color: 'white', padding: '0.5rem 0.75rem', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer'}}>
                          <Eye size={14} />
                          ดูไฟล์ที่ส่ง
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}