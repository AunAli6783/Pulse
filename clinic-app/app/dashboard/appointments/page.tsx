'use client'

import { useEffect, useState } from 'react'
import AppointmentCard from '@/components/AppointmentCard'
import { Calendar } from 'lucide-react'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => { fetch('/api/appointments').then((r) => r.json()).then(setAppointments) }, [])

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <Calendar size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>My Appointments</h1>
        </div>
        {appointments.length === 0 ? (
          <p style={{ color: '#555570', textAlign: 'center', padding: '60px 0', fontSize: '15px' }}>No appointments yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {appointments.map((appt: any) => <AppointmentCard key={appt.id} appointment={appt} />)}
          </div>
        )}
      </div>
    </div>
  )
}
