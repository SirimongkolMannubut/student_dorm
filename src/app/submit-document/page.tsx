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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.documentType || !formData.semester || selectedFiles.length === 0) {
      alert('กรุณากรอกข้อมูลและเลือกไฟล์ให้ครบถ้วน');
      return;
    }

    alert('ส่งเอกสารเรียบร้อยแล้ว\nระบบจะแจ้งผลการตรวจสอบภายใน 3-5 วันทำการ');
    
    setFormData({ documentType: '', semester: '', description: '' });
    setSelectedFiles([]);
  };

  return (
    <div style={{minHeight: '100vh', background: '#f8fafc'}}>
      <Header />
      
      <main style={{padding: '2rem 0'}}>
        <div style={{maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem'}}>
          <div style={{textAlign: 'center', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', marginBottom: '2rem'}}>
            <h1 style={{fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem'}}>ส่งเอกสาร</h1>
            <p style={{color: '#64748b'}}>อัปโหลดเอกสารเพื่อส่งให้เจ้าหน้าที่ตรวจสอบ</p>
          </div>

          <div style={{background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}}>
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
                <div style={{border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '2rem', textAlign: 'center', background: '#f8fafc'}}>
                  <Upload size={48} style={{color: '#64748b', margin: '0 auto 1rem'}} />
                  <p style={{color: '#64748b', marginBottom: '1rem'}}>คลิกเพื่อเลือกไฟล์หรือลากไฟล์มาวาง</p>
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
                    style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500'}}
                  >
                    <FileText size={20} />
                    เลือกไฟล์
                  </label>
                  <p style={{fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem'}}>รองรับไฟล์: PDF, DOC, DOCX, JPG, PNG (ขนาดไม่เกิน 10MB)</p>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div style={{marginBottom: '1.5rem'}}>
                  <h4 style={{fontWeight: '600', color: '#374151', marginBottom: '0.75rem'}}>ไฟล์ที่เลือก ({selectedFiles.length} ไฟล์)</h4>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    {selectedFiles.map((file, index) => (
                      <div key={index} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                          <FileText size={16} style={{color: '#166534'}} />
                          <span style={{fontSize: '0.875rem', color: '#166534', fontWeight: '500'}}>{file.name}</span>
                          <span style={{fontSize: '0.75rem', color: '#64748b'}}>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          style={{background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '0.25rem', cursor: 'pointer'}}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{textAlign: 'center'}}>
                <button
                  type="submit"
                  style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#10b981', color: 'white', padding: '1rem 2rem', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer'}}
                >
                  <Send size={20} />
                  ส่งเอกสาร
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}