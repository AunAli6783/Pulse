'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function PatientDashboard() {
  const { data: session } = useSession()
  const user = session?.user as any

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
      <p className="text-gray-500 mb-8">Patient Dashboard</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { href: '/dashboard/appointments', title: 'My Appointments', desc: 'View and manage your appointments' },
          { href: '/dashboard/prescriptions', title: 'Prescriptions', desc: 'View your prescriptions' },
          { href: '/doctors', title: 'Find Doctors', desc: 'Browse and book with specialists' },
          { href: '/dashboard/profile', title: 'My Profile', desc: 'Update your personal details' },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
