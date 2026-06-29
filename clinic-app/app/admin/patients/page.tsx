'use client'

import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'

export default function AdminPatients() {
  const [patients, setPatients] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/appointments').then((r) => r.json()).then((apps) => {
      const unique = new Map()
      apps.forEach((a: any) => { if (a.patient) unique.set(a.patient.id, a.patient) })
      setPatients(Array.from(unique.values()))
    })
  }, [])

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <Users size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Manage Patients</h1>
        </div>
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(10,10,15,0.5)' }}>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Phone</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p: any) => (
                <tr key={p.id} style={{ borderTop: '1px solid rgba(42,42,58,0.5)' }}>
                  <td style={{ padding: '14px 20px', color: '#f0f0ff', fontWeight: '500', fontSize: '14px' }}>{p.name}</td>
                  <td style={{ padding: '14px 20px', color: '#8888aa', fontSize: '14px' }}>{p.email}</td>
                  <td style={{ padding: '14px 20px', color: '#8888aa', fontSize: '14px' }}>{p.phone || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
