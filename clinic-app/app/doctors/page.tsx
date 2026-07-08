'use client'

import { useEffect, useState } from 'react'
import DoctorCard from '@/components/DoctorCard'
import { Stethoscope, Search, Filter, X } from 'lucide-react'

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [specializations, setSpecializations] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [specFilter, setSpecFilter] = useState('')
  const [sort, setSort] = useState('name')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (specFilter) params.set('specialization', specFilter)
    if (sort) params.set('sort', sort)
    fetch(`/api/doctors?${params}`).then((r) => r.json()).then((d) => {
      setDoctors(d.doctors || d)
      if (d.specializations) setSpecializations(d.specializations)
    })
  }, [search, specFilter, sort])

  const inputStyle = {
    width: '100%', padding: '10px 14px 10px 36px', background: 'rgba(10,10,15,0.6)',
    border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
  }

  return (
    <div className="grid-bg" style={{ padding: '100px 24px', maxWidth: '1280px', margin: '0 auto', backgroundColor: '#0a0a0f', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1', letterSpacing: '2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}><Stethoscope size={16} /> Doctors</span>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-1.5px', marginBottom: '16px' }}>Our Specialists</h1>
        <p style={{ color: '#8888aa', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>Board-certified doctors across all specialties</p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555570' }} />
            <input placeholder="Search doctors..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
            {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555570', cursor: 'pointer', padding: '4px' }}><X size={14} /></button>}
          </div>
          <select value={specFilter} onChange={(e) => setSpecFilter(e.target.value)}
            style={{ padding: '10px 14px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none', cursor: 'pointer', minWidth: '160px' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'}>
            <option value="" style={{ background: '#16161f' }}>All Specialties</option>
            {specializations.map((s) => <option key={s} value={s} style={{ background: '#16161f' }}>{s}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            style={{ padding: '10px 14px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'}>
            <option value="name" style={{ background: '#16161f' }}>Name</option>
            <option value="fee_asc" style={{ background: '#16161f' }}>Fee: Low to High</option>
            <option value="fee_desc" style={{ background: '#16161f' }}>Fee: High to Low</option>
            <option value="experience" style={{ background: '#16161f' }}>Experience</option>
            <option value="rating" style={{ background: '#16161f' }}>Rating</option>
          </select>
        </div>
      </div>

      {doctors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8888aa' }}>
          <Search size={40} style={{ color: '#353550', marginBottom: '16px' }} />
          <p style={{ fontSize: '16px', fontWeight: '500' }}>No doctors match your search.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {doctors.map((doctor: any) => <DoctorCard key={doctor.id} doctor={doctor} />)}
        </div>
      )}
    </div>
  )
}
