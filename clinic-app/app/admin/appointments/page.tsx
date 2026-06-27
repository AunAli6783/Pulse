'use client'

import { useEffect, useState } from 'react'
import StatusBadge from '@/components/ui/StatusBadge'
import { Calendar } from 'lucide-react'

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/appointments').then((r) => r.json()).then(setAppointments)
  }, [])

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <Calendar size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>All Appointments</h1>
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
              {appointments.map((a: any) => (
                <tr key={a.id} style={{ borderTop: '1px solid rgba(42,42,58,0.5)' }}>
                  <td style={{ padding: '14px 20px', color: '#f0f0ff', fontWeight: '500', fontSize: '14px' }}>{a.patient?.name}</td>
                  <td style={{ padding: '14px 20px', color: '#8888aa', fontSize: '14px' }}>{a.doctor?.user?.name}</td>
                  <td style={{ padding: '14px 20px', color: '#8888aa', fontSize: '14px' }}>{new Date(a.appointment_date).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 20px', color: '#8888aa', fontSize: '14px' }}>{a.appointment_time}</td>
                  <td style={{ padding: '14px 20px' }}><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
