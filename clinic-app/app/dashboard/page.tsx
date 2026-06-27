'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Calendar, Pill, Search, User, LayoutDashboard } from 'lucide-react'

const cards = [
  { href: '/dashboard/appointments', title: 'My Appointments', desc: 'View and manage your appointments', icon: Calendar },
  { href: '/dashboard/prescriptions', title: 'Prescriptions', desc: 'View your prescriptions', icon: Pill },
  { href: '/doctors', title: 'Find Doctors', desc: 'Browse and book with specialists', icon: Search },
  { href: '/dashboard/profile', title: 'My Profile', desc: 'Update your personal details', icon: User },
]

export default function PatientDashboard() {
  const { data: session } = useSession()
  const user = session?.user as any

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', background: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <LayoutDashboard size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Welcome, {user?.name}</h1>
        </div>
        <p style={{ color: '#8888aa', fontSize: '15px', marginBottom: '40px', marginLeft: '36px' }}>Patient Dashboard</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {cards.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '28px', transition: 'all 0.25s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(30,30,42,0.9)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,42,58,0.6)'; e.currentTarget.style.background = 'rgba(22,22,31,0.7)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <Icon size={32} style={{ color: '#818cf8', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#f0f0ff', marginBottom: '6px' }}>{item.title}</h3>
                  <p style={{ color: '#8888aa', fontSize: '14px', lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
