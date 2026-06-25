'use client'

import { useEffect, useState } from 'react'

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/appointments')
      .then((r) => r.json())
      .then(setAppointments)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">All Appointments</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Patient</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Doctor</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Time</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a: any) => (
              <tr key={a.id} className="border-t">
                <td className="px-6 py-4">{a.patient?.name}</td>
                <td className="px-6 py-4">{a.doctor?.user?.name}</td>
                <td className="px-6 py-4">{new Date(a.appointment_date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{a.appointment_time}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    a.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    a.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    a.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
