'use client'

import { useEffect, useState } from 'react'
import DoctorCard from '@/components/DoctorCard'
import { Stethoscope } from 'lucide-react'

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/doctors').then((r) => r.json()).then(setDoctors)
  }, [])

  return (
    <div className="grid-bg" style={{ padding: '100px 24px', maxWidth: '1280px', margin: '0 auto', backgroundColor: '#0a0a0f', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1', letterSpacing: '2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}><Stethoscope size={16} /> Doctors</span>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-1.5px', marginBottom: '16px' }}>Our Specialists</h1>
        <p style={{ color: '#8888aa', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>Board-certified doctors across all specialties</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
        {doctors.map((doctor: any) => <DoctorCard key={doctor.id} doctor={doctor} />)}
      </div>
    </div>
  )
}
