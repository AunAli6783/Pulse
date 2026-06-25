'use client'

import { useEffect, useState } from 'react'

export default function AdminPatients() {
  const [patients, setPatients] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/doctors')
      .then(() => {})
    fetch('/api/appointments')
      .then((r) => r.json())
      .then((apps) => {
        const unique = new Map()
        apps.forEach((a: any) => {
          if (a.patient) unique.set(a.patient.email, a.patient)
        })
        setPatients(Array.from(unique.values()))
      })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Manage Patients</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Phone</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p: any) => (
              <tr key={p.email} className="border-t">
                <td className="px-6 py-4">{p.name}</td>
                <td className="px-6 py-4">{p.email}</td>
                <td className="px-6 py-4">{p.phone || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
