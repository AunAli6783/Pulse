'use client'

import { useEffect, useState } from 'react'
import StatusBadge from '@/components/ui/StatusBadge'
import { ClipboardList } from 'lucide-react'

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/appointments').then((r) => r.json()).then(setAppointments)
  }, [])

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setAppointments((prev: any[]) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  const btnStyle = (bg: string, border: string, color: string) => ({
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    border: `1px solid ${border}`,
    background: bg,
    color,
    transition: 'all 0.2s',
  })

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', background: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <ClipboardList size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Appointments</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {appointments.map((appt: any) => (
            <div key={appt.id} style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: '600', color: '#f0f0ff', fontSize: '15px' }}>{appt.patient?.name}</p>
                  <p style={{ fontSize: '13px', color: '#8888aa', marginTop: '2px' }}>
                    {new Date(appt.appointment_date).toLocaleDateString()} at {appt.appointment_time}
                  </p>
                  {appt.reason && <p style={{ fontSize: '13px', color: '#8888aa', marginTop: '6px' }}>{appt.reason}</p>}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {appt.status === 'pending' && (
                    <button onClick={() => updateStatus(appt.id, 'confirmed')} style={btnStyle('rgba(99,102,241,0.15)', 'rgba(99,102,241,0.3)', '#818cf8')}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.25)'; e.currentTarget.style.borderColor = '#6366f1' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)' }}
                    >Confirm</button>
                  )}
                  {(appt.status === 'pending' || appt.status === 'confirmed') && (
                    <button onClick={() => updateStatus(appt.id, 'completed')} style={btnStyle('rgba(34,211,160,0.15)', 'rgba(34,211,160,0.3)', '#22d3a0')}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,211,160,0.25)'; e.currentTarget.style.borderColor = '#22d3a0' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,211,160,0.15)'; e.currentTarget.style.borderColor = 'rgba(34,211,160,0.3)' }}
                    >Complete</button>
                  )}
                  {appt.status === 'pending' && (
                    <button onClick={() => updateStatus(appt.id, 'cancelled')} style={btnStyle('rgba(244,63,94,0.15)', 'rgba(244,63,94,0.3)', '#f43f5e')}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.25)'; e.currentTarget.style.borderColor = '#f43f5e' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.15)'; e.currentTarget.style.borderColor = 'rgba(244,63,94,0.3)' }}
                    >Cancel</button>
                  )}
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <StatusBadge status={appt.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
