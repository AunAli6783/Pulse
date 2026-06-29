'use client'

import { useEffect, useState } from 'react'
import { FileText, Upload, Download, File, Image, FileSpreadsheet, Pill, Search } from 'lucide-react'

const typeIcons: Record<string, typeof File> = {
  lab_report: FileSpreadsheet,
  prescription_scan: Pill,
  xray: Image,
  other: File,
}

const typeColors: Record<string, string> = {
  lab_report: '#22d3a0',
  prescription_scan: '#818cf8',
  xray: '#f59e0b',
  other: '#8888aa',
}

export default function DoctorMedicalRecords() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/medical-records').then(r => r.json()).then(setRecords).finally(() => setLoading(false))
  }, [])

  const filtered = records.filter(r =>
    !search || r.patient?.name?.toLowerCase().includes(search.toLowerCase()) || r.title?.toLowerCase().includes(search.toLowerCase())
  )

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <FileText size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Patient Medical Records</h1>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555570' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by patient name or record title..."
            style={{ width: '100%', padding: '12px 16px 12px 40px', background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '12px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.6)'} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#555570' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(22,22,31,0.5)', borderRadius: '16px', border: '1px dashed rgba(42,42,58,0.6)' }}>
            <FileText size={40} style={{ color: '#353550', marginBottom: '16px' }} />
            <p style={{ color: '#555570', fontSize: '15px' }}>{records.length === 0 ? 'No records uploaded yet.' : 'No records match your search.'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((r) => {
              const Icon = typeIcons[r.record_type] || File
              const color = typeColors[r.record_type] || '#8888aa'
              return (
                <div key={r.id} style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', background: `${color}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <p style={{ fontWeight: '600', color: '#f0f0ff', fontSize: '14px' }}>{r.title}</p>
                      <span style={{ fontSize: '11px', padding: '2px 8px', background: `${color}20`, color, borderRadius: '100px', fontWeight: '500', textTransform: 'capitalize' }}>{r.record_type.replace('_', ' ')}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#555570' }}>
                      <span style={{ color: '#818cf8' }}>{r.patient?.name}</span> · {formatSize(r.file_size)} · {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button onClick={() => {
                      const a = document.createElement('a')
                      a.href = `data:${r.file_type};base64,${r.file_data}`
                      a.download = r.file_name
                      a.click()
                    }} style={{ padding: '8px', background: 'rgba(99,102,241,0.1)', border: 'none', borderRadius: '8px', color: '#818cf8', cursor: 'pointer', display: 'flex' }} title="Download">
                      <Download size={16} />
                    </button>
                    <button onClick={() => {
                      if (!r.file_data) return
                      const binary = atob(r.file_data)
                      const bytes = new Uint8Array(binary.length)
                      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
                      const blob = new Blob([bytes], { type: r.file_type })
                      window.open(URL.createObjectURL(blob), '_blank')
                    }} style={{ padding: '8px', background: 'rgba(99,102,241,0.1)', border: 'none', borderRadius: '8px', color: '#818cf8', cursor: 'pointer', display: 'flex' }} title="View">
                      <FileText size={16} />
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
