'use client';

import { useState } from 'react';
import { Upload, Send, FileText, X } from 'lucide-react';
import Header from '../../components/Header';

export default function SubmitDocumentPage() {
  const [formData, setFormData] = useState({
    documentType: '',
    semester: '',
    description: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.documentType || !formData.semester || selectedFiles.length === 0) {
      setError('กรุณากรอกข้อมูลและเลือกไฟล์ให้ครบถ้วน');
      return;
    }

    setLoading(true);
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      const data = new FormData();
      data.append('documentType', formData.documentType);
      data.append('semester', formData.semester);
      data.append('description', formData.description);
      selectedFiles.forEach(file => data.append('files', file));

      const response = await fetch('/api/documents/submit', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ documentType: '', semester: '', description: '' });
        setSelectedFiles([]);
      } else {
        setError('เกิดข้อผิดพลาดในการส่งเอกสาร');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการส่งเอกสาร');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#f5f5f5'}}>
      <Header />
      
      <main style={{padding: '2rem 0'}}>
        <div style={{maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem'}}>
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', marginBottom: '1.5rem', borderLeft: '4px solid #2563eb'}}>
            <h1 style={{fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem'}}>ส่งเอกสาร</h1>
            <p style={{color: '#6b7280', fontSize: '0.875rem'}}>อัปโหลดเอกสารเพื่อส่งให้เจ้าหน้าที่ตรวจสอบ</p>
          </div>

          <div style={{background: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #e5e7eb'}}>
            <form onSubmit={handleSubmit}>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem'}}>
                <div>
                  <label style={{display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.875rem', marginBottom: '0.5rem'}}>ประเภทเอกสาร</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({...formData, documentType: e.target.value})}
                    style={{width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem'}}
                  >
                    <option value="">เลือกประเภทเอกสาร</option>
                    <option value="คำร้องขอเข้าพักหอพัก">คำร้องขอเข้าพักหอพัก</option>
                    <option value="แบบฟอร์มข้อมูลผู้เช่า">แบบฟอร์มข้อมูลผู้เช่า</option>
                    <option value="คำร้องขอย้ายห้อง">คำร้องขอย้ายห้อง</option>
                    <option value="คำร้องขอต่อสัญญาเช่า">คำร้องขอต่อสัญญาเช่า</option>
                    <option value="เอกสารอื่นๆ">เอกสารอื่นๆ</option>
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.875rem', marginBottom: '0.5rem'}}>ภาคเรียน</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                    style={{width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem'}}
                  >
                    <option value="">เลือกภาคเรียน</option>
                    <option value="1 / 2568">1 / 2568</option>
                    <option value="2 / 2568">2 / 2568</option>
                    <option value="3 / 2568">3 / 2568</option>
                  </select>
                </div>
              </div>

              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.875rem', marginBottom: '0.5rem'}}>รายละเอียดเพิ่มเติม</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="อธิบายรายละเอียดเพิ่มเติม (ถ้ามี)"
                  rows={3}
                  style={{width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', resize: 'vertical'}}
                />
              </div>

              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', fontWeight: '600', color: '#374151', fontSize: '0.875rem', marginBottom: '0.5rem'}}>ไฟล์เอกสาร</label>
                <div style={{border: '2px solid #e5e7eb', borderRadius: '8px', padding: '1rem', background: 'white'}}>
                  <div style={{textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '6px', marginBottom: selectedFiles.length > 0 ? '1rem' : '0'}}>
                    <Upload size={10} style={{color: '#9ca3af', margin: '0 auto 0.5rem'}} />
                    <p style={{color: '#6b7280', marginBottom: '0.75rem', fontSize: '0.8rem'}}>คลิกเพื่อเลือกไฟล์</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      style={{display: 'none'}}
                      id="fileInput"
                    />
                    <label
                      htmlFor="fileInput"
                      style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.8rem'}}
                    >
                      <FileText size={14} />
                      เลือกไฟล์
                    </label>
                    <p style={{fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.5rem'}}>PDF, DOC, DOCX, JPG, PNG (สูงสุด 10MB)</p>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div>
                      <p style={{fontSize: '0.75rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem'}}>ไฟล์ที่เลือก ({selectedFiles.length})</p>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                        {selectedFiles.map((file, index) => (
                          <div key={index} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden'}}>
                              <FileText size={14} style={{color: '#16a34a', flexShrink: 0}} />
                              <span style={{fontSize: '0.75rem', color: '#166534', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{file.name}</span>
                              <span style={{fontSize: '0.7rem', color: '#64748b', flexShrink: 0}}>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              style={{background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '0.25rem', cursor: 'pointer', flexShrink: 0, marginLeft: '0.5rem'}}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div style={{padding: '1rem', background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '8px', color: '#991b1b', marginBottom: '1rem'}}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{padding: '1.5rem', background: '#d1fae5', border: '2px solid #10b981', borderRadius: '8px', marginBottom: '1rem'}}>
                  <h3 style={{color: '#065f46', marginBottom: '0.5rem'}}>✓ ส่งเอกสารสำเร็จ!</h3>
                  <p style={{color: '#047857', marginBottom: '1rem'}}>รอแอดมินตรวจสอบที่หน้าจัดการนักศึกษา</p>
                  <button
                    onClick={() => setSuccess(false)}
                    style={{background: '#10b981', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'}}
                  >
                    ส่งเอกสารเพิ่ม
                  </button>
                </div>
              )}

              <div style={{textAlign: 'right', paddingTop: '1rem', borderTop: '1px solid #e5e7eb'}}>
                <button
                  type="submit"
                  disabled={loading || success}
                  style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: loading || success ? '#9ca3af' : '#2563eb', color: 'white', padding: '0.625rem 1.5rem', border: 'none', borderRadius: '6px', fontWeight: '500', fontSize: '0.875rem', cursor: loading || success ? 'not-allowed' : 'pointer'}}
                >
                  <Send size={16} />
                  {loading ? 'กำลังส่ง...' : 'ส่งเอกสาร'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}