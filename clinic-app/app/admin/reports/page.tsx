'use client'

import { useEffect, useState } from 'react'

export default function AdminReports() {
  const [reports, setReports] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/reports')
      .then((r) => r.json())
      .then(setReports)
  }, [])

  if (!reports) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Reports & Analytics</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <div className="space-y-2">
            {reports.monthlyData?.map((m: any) => (
              <div key={m.month} className="flex justify-between items-center py-1">
                <span>{m.month}</span>
                <span className="font-medium">${Number(m.revenue).toFixed(2)} ({m.count} appts)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Appointments</h2>
          <div className="space-y-3">
            {reports.appointments?.slice(0, 10).map((a: any) => (
              <div key={a.id} className="flex justify-between text-sm">
                <span>{a.patient?.name} → Dr. {a.doctor?.user?.name}</span>
                <span className="text-gray-500">{new Date(a.appointment_date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
