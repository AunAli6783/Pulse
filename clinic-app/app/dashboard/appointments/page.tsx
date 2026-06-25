'use client'

import { useEffect, useState } from 'react'
import AppointmentCard from '@/components/AppointmentCard'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/appointments')
      .then((r) => r.json())
      .then(setAppointments)
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Appointments</h1>
      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments yet.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt: any) => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
        </div>
      )}
    </div>
  )
}
