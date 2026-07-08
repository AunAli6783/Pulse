'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Stethoscope, Plus, Trash2, Edit3 } from 'lucide-react'

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/doctors').then((r) => r.json()).then((d) => setDoctors(d.doctors || d))
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this doctor?')) return
    await fetch(`/api/doctors/${id}`, { method: 'DELETE' })
    setDoctors((prev: any[]) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Stethoscope size={24} style={{ color: '#6366f1' }} />
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Manage Doctors</h1>
          </div>
          <Link href="/admin/doctors/add"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', textDecoration: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
            <Plus size={16} /> Add Doctor
          </Link>
        </div>
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(10,10,15,0.5)' }}>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Specialization</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Experience</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Fee</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc: any, i: number) => (
                <tr key={doc.id} style={{ borderTop: '1px solid rgba(42,42,58,0.5)' }}>
                  <td style={{ padding: '14px 20px', color: '#f0f0ff', fontWeight: '500', fontSize: '14px' }}>{doc.user?.name}</td>
                  <td style={{ padding: '14px 20px', color: '#8888aa', fontSize: '14px' }}>{doc.specialization}</td>
                  <td style={{ padding: '14px 20px', color: '#8888aa', fontSize: '14px' }}>{doc.experience} yrs</td>
                  <td style={{ padding: '14px 20px', color: '#818cf8', fontWeight: '600', fontSize: '14px' }}>Rs. {Number(doc.fee).toFixed(0)}</td>
                  <td style={{ padding: '14px 20px', display: 'flex', gap: '8px' }}>
                    <Link href={`/admin/doctors/${doc.id}/edit`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.25)'; e.currentTarget.style.borderColor = '#6366f1' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)' }}
                    ><Edit3 size={12} /> Edit</Link>
                    <button onClick={() => handleDelete(doc.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(244,63,94,0.12)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.25)'; e.currentTarget.style.borderColor = '#f43f5e' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.12)'; e.currentTarget.style.borderColor = 'rgba(244,63,94,0.3)' }}
                    ><Trash2 size={12} /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
