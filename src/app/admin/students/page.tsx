'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Check, X, Eye, FileText } from 'lucide-react';
import AdminHeader from '../../../components/AdminHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import '../../../styles/admin.css';

export default function StudentsPage() {
  const [filter, setFilter] = useState('all');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedGeneralDocs, setSelectedGeneralDocs] = useState([]);
  const [showGeneralModal, setShowGeneralModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDocStatus = async (documentId, status, rejectReason = '') => {
    try {
      const response = await fetch('/api/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, status, rejectReason })
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchStudents();
      }
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const viewDocument = (doc) => {
    setSelectedDoc(doc);
    setShowModal(true);
  };

  const viewGeneralDocs = (docs) => {
    setSelectedGeneralDocs(docs);
    setShowGeneralModal(true);
  };

  const updateGeneralDocStatus = async (docId, status, rejectReason = '') => {
    try {
      const response = await fetch('/api/documents/general', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId, status, rejectReason })
      });
      
      if (response.ok) {
        setShowGeneralModal(false);
        fetchStudents();
      }
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const filteredStudents = students.filter(student => 
    filter === 'all' || student.status === filter
  );

  if (loading) {
    return (
      <div className="admin-page">
        <AdminHeader />
        <main className="admin-main">
          <div className="admin-container">
            <div>Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="admin-page">
      <AdminHeader />
      
      <main className="admin-main">
        <div className="admin-container">
          <div className="page-header">
            <div className="header-with-back">
              <button className="back-btn" onClick={() => window.history.back()}>
                ← กลับ
              </button>
              <h1><Users size={24} /> จัดการนักศึกษา</h1>
            </div>
            <p>ดูข้อมูล อนุมัติ ปฏิเสธการสมัครของนักศึกษา</p>
          </div>

          <div className="filters-section">
            <div className="search-box">
              <Search size={20} />
              <input type="text" placeholder="ค้นหานักศึกษา..." />
            </div>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                ทั้งหมด
              </button>
              <button 
                className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                รออนุมัติ
              </button>
              <button 
                className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
                onClick={() => setFilter('approved')}
              >
                อนุมัติแล้ว
              </button>
              <button 
                className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                onClick={() => setFilter('rejected')}
              >
                ปฏิเสธ
              </button>
            </div>
          </div>

          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>รหัสนักศึกษา</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>เบอร์โทร</th>
                  <th>เอกสารสมัคร</th>
                  <th>เอกสารทั่วไป</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student._id}>
                    <td>{student.studentId || '-'}</td>
                    <td>{student.firstName} {student.lastName}</td>
                    <td>{student.phone}</td>
                    <td>
                      {student.document ? (
                        <span className={`status-badge ${student.document.status}`}>
                          {student.document.status === 'pending' && 'รอตรวจสอบ'}
                          {student.document.status === 'approved' && 'อนุมัติแล้ว'}
                          {student.document.status === 'rejected' && 'ปฏิเสธ'}
                        </span>
                      ) : (
                        <span className="status-badge">ยังไม่ส่ง</span>
                      )}
                    </td>
                    <td>
                      {student.generalDocuments?.length > 0 ? (
                        <span className="status-badge pending">{student.generalDocuments.length} รายการ</span>
                      ) : (
                        <span className="status-badge">-</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        {student.document && (
                          <button 
                            className="action-btn view"
                            onClick={() => viewDocument(student.document)}
                            title="ดูเอกสารสมัคร"
                          >
                            <FileText size={16} />
                          </button>
                        )}
                        {student.generalDocuments?.length > 0 && (
                          <button 
                            className="action-btn view"
                            onClick={() => viewGeneralDocs(student.generalDocuments)}
                            title="ดูเอกสารทั่วไป"
                            style={{background: '#f59e0b'}}
                          >
                            <Eye size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showGeneralModal && selectedGeneralDocs.length > 0 && (
            <div className="modal-overlay" onClick={() => setShowGeneralModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '900px', maxHeight: '80vh', overflow: 'auto'}}>
                <h2 style={{marginBottom: '20px', color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px'}}>
                  เอกสารทั่วไป ({selectedGeneralDocs.length} รายการ)
                </h2>
                {selectedGeneralDocs.map((doc, idx) => (
                  <div key={doc._id} style={{
                    marginBottom: '20px',
                    padding: '20px',
                    background: '#f8fafc',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                      <h3 style={{color: '#3b82f6', margin: 0}}>เอกสาร #{idx + 1}</h3>
                      <span className={`status-badge ${doc.status}`} style={{fontSize: '14px', padding: '6px 12px'}}>
                        {doc.status === 'pending' ? 'รอตรวจสอบ' : doc.status === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}
                      </span>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
                      <div>
                        <p style={{margin: '5px 0', color: '#64748b', fontSize: '14px'}}>ประเภทเอกสาร</p>
                        <p style={{margin: '5px 0', color: '#1e293b', fontWeight: '600'}}>{doc.documentType}</p>
                      </div>
                      <div>
                        <p style={{margin: '5px 0', color: '#64748b', fontSize: '14px'}}>ภาคเรียน</p>
                        <p style={{margin: '5px 0', color: '#1e293b', fontWeight: '600'}}>{doc.semester}</p>
                      </div>
                    </div>
                    {doc.description && (
                      <div style={{marginBottom: '15px'}}>
                        <p style={{margin: '5px 0', color: '#64748b', fontSize: '14px'}}>รายละเอียด</p>
                        <p style={{margin: '5px 0', color: '#1e293b', padding: '10px', background: 'white', borderRadius: '6px'}}>{doc.description}</p>
                      </div>
                    )}
                    {doc.fileUrls?.length > 0 && (
                      <div style={{marginBottom: '15px'}}>
                        <p style={{margin: '5px 0 10px 0', color: '#64748b', fontSize: '14px'}}>ไฟล์แนบ</p>
                        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                          {doc.fileUrls.map((url, i) => (
                            <a key={i} href={url} target="_blank" style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '8px 16px',
                              background: '#3b82f6',
                              color: 'white',
                              borderRadius: '6px',
                              textDecoration: 'none',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}>
                              <FileText size={16} />
                              ดาวน์โหลดไฟล์ {i + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    {doc.status === 'pending' && (
                      <div style={{display: 'flex', gap: '10px', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e2e8f0'}}>
                        <button 
                          className="btn-approve" 
                          onClick={() => updateGeneralDocStatus(doc._id, 'approved')}
                          style={{flex: 1, padding: '10px', fontSize: '14px', fontWeight: '600'}}
                        >
                          ✓ อนุมัติเอกสาร
                        </button>
                        <button 
                          className="btn-reject" 
                          onClick={() => {
                            const reason = prompt('เหตุผลที่ปฏิเสธ (นักศึกษาจะเห็นข้อความนี้):');
                            if (reason) updateGeneralDocStatus(doc._id, 'rejected', reason);
                          }}
                          style={{flex: 1, padding: '10px', fontSize: '14px', fontWeight: '600'}}
                        >
                          ✕ ปฏิเสธเอกสาร
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button 
                  className="btn-secondary" 
                  onClick={() => setShowGeneralModal(false)} 
                  style={{width: '100%', padding: '12px', fontSize: '16px', fontWeight: '600'}}
                >
                  ปิด
                </button>
              </div>
            </div>
          )}

          {showModal && selectedDoc && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>เอกสารนักศึกษา</h2>
                <div style={{ marginTop: '20px' }}>
                  {selectedDoc.idCardUrl && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong>บัตรประชาชน:</strong><br/>
                      <img src={selectedDoc.idCardUrl} alt="ID Card" style={{ maxWidth: '300px', marginTop: '10px' }} />
                    </div>
                  )}
                  {selectedDoc.houseRegistrationUrl && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong>ทะเบียนบ้าน:</strong><br/>
                      <img src={selectedDoc.houseRegistrationUrl} alt="House Registration" style={{ maxWidth: '300px', marginTop: '10px' }} />
                    </div>
                  )}
                  {selectedDoc.transcriptUrl && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong>ใบ Transcript:</strong><br/>
                      <img src={selectedDoc.transcriptUrl} alt="Transcript" style={{ maxWidth: '300px', marginTop: '10px' }} />
                    </div>
                  )}
                </div>
                <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  {selectedDoc.status === 'pending' && (
                    <>
                      <button 
                        className="btn-approve"
                        onClick={() => updateDocStatus(selectedDoc._id, 'approved')}
                      >
                        อนุมัติ
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => {
                          const reason = prompt('เหตุผลที่ปฏิเสธ:');
                          if (reason) updateDocStatus(selectedDoc._id, 'rejected', reason);
                        }}
                      >
                        ปฏิเสธ
                      </button>
                    </>
                  )}
                  <button className="btn-secondary" onClick={() => setShowModal(false)}>
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}