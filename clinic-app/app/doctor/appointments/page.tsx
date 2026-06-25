'use client'

import { useEffect, useState } from 'react'

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/appointments')
      .then((r) => r.json())
      .then(setAppointments)
  }, [])

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setAppointments((prev: any[]) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Appointments</h1>
      <div className="space-y-4">
        {appointments.map((appt: any) => (
          <div key={appt.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{appt.patient?.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(appt.appointment_date).toLocaleDateString()} at {appt.appointment_time}
                </p>
                {appt.reason && <p className="text-sm text-gray-600 mt-1">{appt.reason}</p>}
              </div>
              <div className="flex gap-2">
                {appt.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(appt.id, 'confirmed')}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                )}
                {(appt.status === 'pending' || appt.status === 'confirmed') && (
                  <button
                    onClick={() => updateStatus(appt.id, 'completed')}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Complete
                  </button>
                )}
                {appt.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(appt.id, 'cancelled')}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            <div className="mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                appt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                appt.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
