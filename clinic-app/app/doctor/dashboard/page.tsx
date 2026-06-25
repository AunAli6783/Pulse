'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function DoctorDashboard() {
  const { data: session } = useSession()
  const [todayApps, setTodayApps] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/appointments')
      .then((r) => r.json())
      .then((apps) => {
        const today = new Date().toISOString().split('T')[0]
        setTodayApps(apps.filter((a: any) => a.appointment_date?.startsWith(today)))
      })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome, {session?.user?.name}</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { href: '/doctor/appointments', title: 'Appointments', desc: 'View all your appointments' },
          { href: '/doctor/availability', title: 'Availability', desc: 'Set your weekly schedule' },
          { href: '/doctor/prescriptions', title: 'Prescriptions', desc: 'Write and view prescriptions' },
          { href: '/doctor/profile', title: 'Profile', desc: 'Update your details' },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
      {todayApps.length === 0 ? (
        <p className="text-gray-500">No appointments today.</p>
      ) : (
        <div className="space-y-3">
          {todayApps.map((appt: any) => (
            <div key={appt.id} className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{appt.patient?.name}</p>
                <p className="text-sm text-gray-500">{appt.appointment_time}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                appt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
