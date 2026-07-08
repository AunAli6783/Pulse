'use client'

import { useEffect, useState, useRef } from 'react'
import { FileText, Upload, Trash2, Download, File, Image, FileSpreadsheet, Pill, Loader2 } from 'lucide-react'

const typeIcons: Record<string, typeof File> = {
  'lab_report': FileSpreadsheet,
  'prescription_scan': Pill,
  'xray': Image,
  'other': File,
}

const typeColors: Record<string, string> = {
  'lab_report': '#22d3a0',
  'prescription_scan': '#818cf8',
  'xray': '#f59e0b',
  'other': '#8888aa',
}

export default function PatientRecords() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [doctors, setDoctors] = useState<any[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    fetch('/api/medical-records').then(r => r.json()).then(setRecords).finally(() => setLoading(false))
    fetch('/api/doctors').then(r => r.json()).then((d) => setDoctors(d.doctors || d))
  }, [])

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/medical-records', { method: 'POST', body: fd })
    if (res.ok) {
      const record = await res.json()
      setRecords(prev => [record, ...prev])
      formRef.current?.reset()
    }
    setUploading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this record?')) return
    const res = await fetch(`/api/medical-records/${id}`, { method: 'DELETE' })
    if (res.ok) setRecords(prev => prev.filter(r => r.id !== id))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <FileText size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Medical Records</h1>
        </div>

        {/* Upload Form */}
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '28px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={16} style={{ color: '#818cf8' }} /> Upload New Record
          </h2>
          <form ref={formRef} onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Title *</label>
                <input name="title" required type="text" style={{ width: '100%', padding: '10px 14px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Record Type</label>
                <select name="record_type" style={{ width: '100%', padding: '10px 14px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'}>
                  <option value="lab_report">Lab Report</option>
                  <option value="prescription_scan">Prescription</option>
                  <option value="xray">X-Ray / Scan</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Description</label>
              <textarea name="description" rows={2} style={{ width: '100%', padding: '10px 14px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Doctor</label>
                <select name="doctor_id" style={{ width: '100%', padding: '10px 14px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'}>
                  <option value="">Auto (last doctor)</option>
                  {doctors.map((d: any) => (
                    <option key={d.id} value={d.id}>Dr. {d.user?.name} — {d.specialization}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>File *</label>
                <input name="file" required type="file" style={{ width: '100%', padding: '8px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '13px', cursor: 'pointer' }} />
              </div>
            </div>
            <button type="submit" disabled={uploading} style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: uploading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: uploading ? 'not-allowed' : 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
              {uploading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Uploading...</> : <><Upload size={16} /> Upload</>}
            </button>
          </form>
        </div>

        {/* Records List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#555570' }}>Loading...</div>
        ) : records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(22,22,31,0.5)', borderRadius: '16px', border: '1px dashed rgba(42,42,58,0.6)' }}>
            <FileText size={40} style={{ color: '#353550', marginBottom: '16px' }} />
            <p style={{ color: '#555570', fontSize: '15px' }}>No medical records yet. Upload your first record above.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {records.map((r) => {
              const Icon = typeIcons[r.record_type] || File
              const color = typeColors[r.record_type] || '#8888aa'
              return (
                <div key={r.id} style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '42px', height: '42px', background: `${color}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <p style={{ fontWeight: '600', color: '#f0f0ff', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</p>
                      <span style={{ fontSize: '11px', padding: '2px 8px', background: `${color}20`, color, borderRadius: '100px', fontWeight: '500', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{r.record_type.replace('_', ' ')}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#555570' }}>
                      Dr. {r.doctor?.user?.name} · {formatSize(r.file_size)} · {new Date(r.created_at).toLocaleDateString()}
                      {r.description ? <span style={{ color: '#8888aa' }}> · {r.description.slice(0, 60)}</span> : null}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => {
                      const a = document.createElement('a')
                      a.href = `data:${r.file_type};base64,${r.file_data}`
                      a.download = r.file_name
                      a.click()
                    }} style={{ padding: '8px', background: 'rgba(99,102,241,0.1)', border: 'none', borderRadius: '8px', color: '#818cf8', cursor: 'pointer', display: 'flex' }}
                      title="Download">
                      <Download size={16} />
                    </button>
                    <button onClick={() => {
                      if (!r.file_data) return
                      const binary = atob(r.file_data)
                      const bytes = new Uint8Array(binary.length)
                      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
                      const blob = new Blob([bytes], { type: r.file_type })
                      window.open(URL.createObjectURL(blob), '_blank')
                    }} style={{ padding: '8px', background: 'rgba(99,102,241,0.1)', border: 'none', borderRadius: '8px', color: '#818cf8', cursor: 'pointer', display: 'flex' }}
                      title="View">
                      <FileText size={16} />
                    </button>
                    <button onClick={() => handleDelete(r.id)} style={{ padding: '8px', background: 'rgba(244,63,94,0.1)', border: 'none', borderRadius: '8px', color: '#f43f5e', cursor: 'pointer', display: 'flex' }}
                      title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
