'use client'

import { useEffect, useState } from 'react'
import StatsCard from '@/components/dashboard/StatsCard'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
  }, [])

  if (!stats) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Patients" value={stats.totalPatients} />
        <StatsCard title="Today's Appointments" value={stats.todayAppointments} />
        <StatsCard title="Monthly Appointments" value={stats.monthlyAppointments} />
        <StatsCard title="Monthly Revenue" value={`$${Number(stats.monthlyRevenue).toFixed(2)}`} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Status Breakdown</h2>
          <div className="space-y-2">
            {stats.statusBreakdown?.map((s: any) => (
              <div key={s.status} className="flex justify-between items-center">
                <span className="capitalize">{s.status}</span>
                <span className="font-medium">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="space-y-3">
            {[
              { href: '/admin/doctors', label: 'Manage Doctors' },
              { href: '/admin/patients', label: 'Manage Patients' },
              { href: '/admin/appointments', label: 'All Appointments' },
              { href: '/admin/reports', label: 'Reports & Analytics' },
            ].map((link) => (
              <a key={link.href} href={link.href} className="block text-blue-600 hover:underline">{link.label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
