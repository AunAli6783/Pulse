'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Calendar, Pill, Search, User, LayoutDashboard, Clock, CheckCircle, XCircle, Activity } from 'lucide-react'

export default function PatientDashboard() {
  const { data: session } = useSession()
  const user = session?.user as any
  const [appointments, setAppointments] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/appointments').then((r) => r.json()).then(setAppointments)
    fetch('/api/prescriptions').then((r) => r.json()).then(setPrescriptions)
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const upcoming = appointments.filter((a: any) => a.appointment_date >= today && a.status !== 'cancelled' && a.status !== 'completed')
  const completed = appointments.filter((a: any) => a.status === 'completed')
  const cancelled = appointments.filter((a: any) => a.status === 'cancelled')
  const nextAppt = upcoming.sort((a: any, b: any) => a.appointment_date.localeCompare(b.appointment_date))[0]

  const stats = [
    { label: 'Total Appointments', value: appointments.length, icon: Activity, color: '#818cf8' },
    { label: 'Upcoming', value: upcoming.length, icon: Clock, color: '#22d3a0' },
    { label: 'Completed', value: completed.length, icon: CheckCircle, color: '#22d3a0' },
    { label: 'Cancelled', value: cancelled.length, icon: XCircle, color: '#f43f5e' },
  ]

  const cards = [
    { href: '/dashboard/appointments', title: 'My Appointments', desc: 'View and manage your appointments', icon: Calendar },
    { href: '/dashboard/prescriptions', title: 'Prescriptions', desc: 'View your prescriptions', icon: Pill },
    { href: '/doctors', title: 'Find Doctors', desc: 'Browse and book with specialists', icon: Search },
    { href: '/dashboard/profile', title: 'My Profile', desc: 'Update your personal details', icon: User },
  ]

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <LayoutDashboard size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Welcome, {user?.name}</h1>
        </div>
        <p style={{ color: '#8888aa', fontSize: '15px', marginBottom: '32px', marginLeft: '36px' }}>Patient Dashboard</p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '32px' }}>
          {stats.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '14px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Icon size={16} style={{ color: s.color }} />
                  <p style={{ color: '#8888aa', fontSize: '12px', fontWeight: '500' }}>{s.label}</p>
                </div>
                <p style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>{s.value}</p>
              </div>
            )
          })}
        </div>

        {/* Next Appointment */}
        {nextAppt && (
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px', padding: '20px 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(99,102,241,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={20} style={{ color: '#818cf8' }} />
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Next Appointment</p>
                <p style={{ fontWeight: '600', color: '#f0f0ff' }}>Dr. {nextAppt.doctor?.user?.name}</p>
                <p style={{ fontSize: '13px', color: '#8888aa' }}>{new Date(nextAppt.appointment_date).toLocaleDateString()} at {nextAppt.appointment_time}</p>
              </div>
            </div>
            <Link href="/dashboard/appointments" style={{ padding: '8px 18px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', textDecoration: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(99,102,241,0.3)' }}>
              View All
            </Link>
          </div>
        )}

        {/* Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
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

        {/* Recent Prescriptions */}
        {prescriptions.length > 0 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0ff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Pill size={18} style={{ color: '#6366f1' }} /> Recent Prescriptions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {prescriptions.slice(0, 2).map((rx: any) => (
                <div key={rx.id} style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '12px', padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <p style={{ fontWeight: '600', color: '#f0f0ff', fontSize: '14px' }}>Dr. {rx.doctor?.user?.name}</p>
                    <p style={{ fontSize: '12px', color: '#555570' }}>{new Date(rx.appointment?.appointment_date).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {JSON.parse(rx.medicines).map((med: any, i: number) => (
                      <span key={i} style={{ padding: '4px 10px', background: 'rgba(99,102,241,0.1)', borderRadius: '6px', fontSize: '12px', color: '#818cf8' }}>
                        {med.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
