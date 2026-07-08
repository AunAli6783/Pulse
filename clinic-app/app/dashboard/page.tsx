'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Calendar, Pill, Search, User, LayoutDashboard, Clock, CheckCircle, XCircle, Activity, FileText, TrendingUp, ArrowRight, DollarSign } from 'lucide-react'
import { to12h } from '@/lib/time'

export default function PatientDashboard() {
  const { data: session } = useSession()
  const user = session?.user as any
  const [appointments, setAppointments] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/appointments').then((r) => r.json()).then(setAppointments)
    fetch('/api/prescriptions').then((r) => r.json()).then(setPrescriptions)
    fetch('/api/medical-records').then((r) => r.json()).then(setRecords)
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
    { label: 'Medical Records', value: records.length, icon: FileText, color: '#f59e0b' },
  ]

  const cards = [
    { href: '/dashboard/appointments', title: 'My Appointments', desc: 'View and manage your appointments', icon: Calendar, color: '#818cf8' },
    { href: '/dashboard/prescriptions', title: 'Prescriptions', desc: 'View your prescriptions', icon: Pill, color: '#22d3a0' },
    { href: '/dashboard/records', title: 'Medical Records', desc: 'Upload and view medical records', icon: FileText, color: '#f59e0b' },
    { href: '/doctors', title: 'Find Doctors', desc: 'Browse and book with specialists', icon: Search, color: '#a78bfa' },
    { href: '/dashboard/payments', title: 'Payments', desc: 'View your payment history', icon: DollarSign, color: '#22d3a0' },
    { href: '/dashboard/profile', title: 'My Profile', desc: 'Update your personal details', icon: User, color: '#8888aa' },
  ]

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', background: 'rgba(99,102,241,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboard size={22} style={{ color: '#6366f1' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Welcome, {user?.name}</h1>
              <p style={{ color: '#8888aa', fontSize: '14px' }}>Patient Dashboard</p>
            </div>
          </div>
          <Link href="/dashboard/appointments" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', textDecoration: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
            <Calendar size={16} /> Book Appointment
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '36px' }}>
          {stats.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '14px', padding: '20px', transition: 'all 0.25s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.background = 'rgba(30,30,42,0.9)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,42,58,0.6)'; e.currentTarget.style.background = 'rgba(22,22,31,0.7)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '32px', height: '32px', background: `${s.color}15`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} style={{ color: s.color }} />
                  </div>
                  <p style={{ color: '#8888aa', fontSize: '12px', fontWeight: '500' }}>{s.label}</p>
                </div>
                <p style={{ fontSize: '28px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>{s.value}</p>
              </div>
            )
          })}
        </div>

        {/* Next Appointment + Quick Actions Row */}
        <div style={{ display: 'grid', gridTemplateColumns: nextAppt ? '1.5fr 1fr' : '1fr', gap: '20px', marginBottom: '36px' }}>
          {nextAppt && (
            <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(129,140,248,0.08))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Clock size={16} style={{ color: '#818cf8' }} />
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1px' }}>Next Appointment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(99,102,241,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={22} style={{ color: '#818cf8' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '700', color: '#f0f0ff', fontSize: '16px' }}>Dr. {nextAppt.doctor?.user?.name}</p>
                  <p style={{ fontSize: '13px', color: '#8888aa', marginTop: '2px' }}>{new Date(nextAppt.appointment_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {to12h(nextAppt.appointment_time)}</p>
                </div>
                <Link href="/dashboard/appointments" style={{ padding: '8px 16px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', textDecoration: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(99,102,241,0.2)', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.25)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)' }}>
                  View All <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                </Link>
              </div>
            </div>
          )}
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#555570', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Quick Actions</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[{ label: 'Find a Doctor', href: '/doctors', icon: Search }, { label: 'Upload Record', href: '/dashboard/records', icon: FileText }, { label: 'View Profile', href: '/dashboard/profile', icon: User }].map((a) => {
                const Icon = a.icon
                return (
                  <Link key={a.href} href={a.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', textDecoration: 'none', color: '#8888aa', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#f0f0ff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8888aa' }}>
                    <Icon size={16} style={{ color: '#6366f1' }} /> {a.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0ff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} style={{ color: '#6366f1' }} /> Quick Access
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          {cards.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px', transition: 'all 0.25s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(30,30,42,0.9)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,42,58,0.6)'; e.currentTarget.style.background = 'rgba(22,22,31,0.7)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ width: '40px', height: '40px', background: `${item.color}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <Icon size={20} style={{ color: item.color }} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff', marginBottom: '4px' }}>{item.title}</h3>
                  <p style={{ color: '#8888aa', fontSize: '13px', lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Recent Prescriptions */}
          {prescriptions.length > 0 && (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Pill size={16} style={{ color: '#22d3a0' }} /> Recent Prescriptions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {prescriptions.slice(0, 3).map((rx: any) => (
                  <div key={rx.id} style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '12px', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <p style={{ fontWeight: '600', color: '#f0f0ff', fontSize: '13px' }}>Dr. {rx.doctor?.user?.name}</p>
                      <p style={{ fontSize: '11px', color: '#555570' }}>{new Date(rx.appointment?.appointment_date).toLocaleDateString()}</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {JSON.parse(rx.medicines || '[]').map((med: any, i: number) => (
                        <span key={i} style={{ padding: '3px 8px', background: 'rgba(34,211,160,0.1)', borderRadius: '6px', fontSize: '11px', color: '#22d3a0' }}>
                          {med.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Records */}
          {records.length > 0 && (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} style={{ color: '#f59e0b' }} /> Recent Records
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {records.slice(0, 3).map((r: any) => (
                  <div key={r.id} style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: '600', color: '#f0f0ff', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</p>
                      <p style={{ fontSize: '11px', color: '#555570' }}>{r.record_type.replace('_', ' ')} · Dr. {r.doctor?.user?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
