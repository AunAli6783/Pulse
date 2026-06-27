'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import { ClipboardList, Clock, Pill, User, LayoutDashboard } from 'lucide-react'

const links = [
  { href: '/doctor/appointments', title: 'Appointments', desc: 'View all your appointments', icon: ClipboardList },
  { href: '/doctor/availability', title: 'Availability', desc: 'Set your weekly schedule', icon: Clock },
  { href: '/doctor/prescriptions', title: 'Prescriptions', desc: 'Write and view prescriptions', icon: Pill },
  { href: '/doctor/profile', title: 'Profile', desc: 'Update your details', icon: User },
]

export default function DoctorDashboard() {
  const { data: session } = useSession()
  const [todayApps, setTodayApps] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/appointments').then((r) => r.json()).then((apps) => {
      const today = new Date().toISOString().split('T')[0]
      setTodayApps(apps.filter((a: any) => a.appointment_date?.startsWith(today)))
    })
  }, [])

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', background: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <LayoutDashboard size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Doctor Dashboard</h1>
        </div>
        <p style={{ color: '#8888aa', fontSize: '15px', marginBottom: '40px', marginLeft: '34px' }}>Welcome, {session?.user?.name}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {links.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px', transition: 'all 0.25s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(30,30,42,0.9)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,42,58,0.6)'; e.currentTarget.style.background = 'rgba(22,22,31,0.7)' }}
                >
                  <Icon size={28} style={{ color: '#818cf8', marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff', marginBottom: '4px' }}>{item.title}</h3>
                  <p style={{ color: '#8888aa', fontSize: '13px' }}>{item.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0ff', marginBottom: '16px' }}>Today's Appointments</h2>
        {todayApps.length === 0 ? (
          <p style={{ color: '#555570', fontSize: '14px' }}>No appointments today.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {todayApps.map((appt: any) => (
              <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '12px', padding: '16px 20px' }}>
                <div>
                  <p style={{ fontWeight: '600', color: '#f0f0ff' }}>{appt.patient?.name}</p>
                  <p style={{ fontSize: '13px', color: '#8888aa', marginTop: '2px' }}>{appt.appointment_time}</p>
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
