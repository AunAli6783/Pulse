'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import StatusBadge from '@/components/ui/StatusBadge'
import { Calendar } from 'lucide-react'

function AppointmentsContent() {
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter') || 'all'
  const statusFilter = searchParams.get('status') || ''
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/appointments').then((r) => r.json()).then(setAppointments)
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const currentMonth = new Date().toISOString().slice(0, 7)

  const filtered = appointments.filter((a: any) => {
    if (statusFilter && a.status !== statusFilter) return false
    if (filter === 'today') return a.appointment_date?.startsWith(today)
    if (filter === 'month') return a.appointment_date?.startsWith(currentMonth)
    return true
  })

  const tabs = [
    { key: 'all', label: 'All', count: appointments.length },
    { key: 'today', label: 'Today', count: appointments.filter((a: any) => a.appointment_date?.startsWith(today)).length },
    { key: 'month', label: 'This Month', count: appointments.filter((a: any) => a.appointment_date?.startsWith(currentMonth)).length },
  ]

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <Calendar size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Appointments</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {tabs.map((t) => (
            <a key={t.key} href={`/admin/appointments?filter=${t.key}`}
              style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', cursor: 'pointer', background: filter === t.key ? 'rgba(99,102,241,0.2)' : 'rgba(22,22,31,0.7)', color: filter === t.key ? '#818cf8' : '#8888aa', border: filter === t.key ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(42,42,58,0.6)', transition: 'all 0.2s' }}>
              {t.label} ({t.count})
            </a>
          ))}
        </div>
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(10,10,15,0.5)' }}>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Patient</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Doctor</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Time</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center', color: '#555570', fontSize: '14px' }}>No appointments found.</td></tr>
              ) : (filtered.map((a: any) => (
                <tr key={a.id} style={{ borderTop: '1px solid rgba(42,42,58,0.5)' }}>
                  <td style={{ padding: '14px 20px', color: '#f0f0ff', fontWeight: '500', fontSize: '14px' }}>{a.patient?.name}</td>
                  <td style={{ padding: '14px 20px', color: '#8888aa', fontSize: '14px' }}>{a.doctor?.user?.name}</td>
                  <td style={{ padding: '14px 20px', color: '#8888aa', fontSize: '14px' }}>{new Date(a.appointment_date).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 20px', color: '#8888aa', fontSize: '14px' }}>{a.appointment_time}</td>
                  <td style={{ padding: '14px 20px' }}><StatusBadge status={a.status} /></td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function AdminAppointmentsPage() {
  return (
    <Suspense fallback={<div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#8888aa' }}>Loading...</p></div>}>
      <AppointmentsContent />
    </Suspense>
  )
}
