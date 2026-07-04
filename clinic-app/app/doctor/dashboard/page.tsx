'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import { ClipboardList, Clock, Pill, User, LayoutDashboard, Star, MessageSquare, FileText, Calendar, Users, TrendingUp, ArrowRight } from 'lucide-react'
import { to12h } from '@/lib/time'

const links = [
  { href: '/doctor/appointments', title: 'Appointments', desc: 'View all your appointments', icon: ClipboardList, color: '#818cf8' },
  { href: '/doctor/availability', title: 'Availability', desc: 'Set your weekly schedule', icon: Clock, color: '#22d3a0' },
  { href: '/doctor/prescriptions', title: 'Prescriptions', desc: 'Write and view prescriptions', icon: Pill, color: '#f59e0b' },
  { href: '/doctor/medical-records', title: 'Medical Records', desc: 'View patient medical records', icon: FileText, color: '#a78bfa' },
  { href: '/doctor/profile', title: 'Profile', desc: 'Update your details', icon: User, color: '#8888aa' },
]

export default function DoctorDashboard() {
  const { data: session } = useSession()
  const [upcomingApps, setUpcomingApps] = useState<any[]>([])
  const [allApps, setAllApps] = useState<any[]>([])
  const [reviews, setReviews] = useState<any>(null)
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/appointments').then((r) => r.json()).then((apps) => {
      setAllApps(apps)
      const today = new Date().toISOString().split('T')[0]
      const upcoming = apps
        .filter((a: any) => a.appointment_date >= today && a.status !== 'cancelled' && a.status !== 'completed')
        .sort((a: any, b: any) => a.appointment_date.localeCompare(b.appointment_date) || a.appointment_time.localeCompare(b.appointment_time))
      setUpcomingApps(upcoming)
    })
    fetch('/api/reviews').then((r) => r.json()).then(setReviews)
    fetch('/api/medical-records').then((r) => r.json()).then(setRecords)
  }, [])

  const completed = allApps.filter((a: any) => a.status === 'completed')
  const pending = allApps.filter((a: any) => a.status === 'pending' || a.status === 'confirmed')
  const uniquePatients = new Set(allApps.map((a: any) => a.patient?.id)).size

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
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Doctor Dashboard</h1>
              <p style={{ color: '#8888aa', fontSize: '14px' }}>Welcome, {session?.user?.name}</p>
            </div>
          </div>
          <Link href="/doctor/appointments" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', textDecoration: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
            <Calendar size={16} /> View All Appointments
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', marginBottom: '32px' }}>
          {[
            { label: 'Total Appointments', value: allApps.length, icon: ClipboardList, color: '#818cf8' },
            { label: 'Pending', value: pending.length, icon: Clock, color: '#f59e0b' },
            { label: 'Completed', value: completed.length, icon: Calendar, color: '#22d3a0' },
            { label: 'Total Patients', value: uniquePatients, icon: Users, color: '#a78bfa' },
            { label: 'Medical Records', value: records.length, icon: FileText, color: '#f43f5e' },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '14px', padding: '18px', transition: 'all 0.25s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.background = 'rgba(30,30,42,0.9)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,42,58,0.6)'; e.currentTarget.style.background = 'rgba(22,22,31,0.7)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Icon size={14} style={{ color: s.color }} />
                  <p style={{ color: '#8888aa', fontSize: '11px', fontWeight: '500' }}>{s.label}</p>
                </div>
                <p style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>{s.value}</p>
              </div>
            )
          })}
        </div>

        {/* Rating + Feedback Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '36px' }}>
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Star size={16} style={{ color: '#f59e0b' }} />
              <p style={{ color: '#8888aa', fontSize: '13px', fontWeight: '500' }}>Average Rating</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <p style={{ fontSize: '32px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>{reviews?.averageRating || 0}</p>
              <p style={{ color: '#555570', fontSize: '14px' }}>/ 5</p>
              <p style={{ color: '#555570', fontSize: '13px', marginLeft: '4px' }}>({reviews?.totalReviews || 0} reviews)</p>
            </div>
            {reviews && reviews.totalReviews > 0 && (
              <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={16} fill={n <= Math.round(reviews.averageRating) ? '#f59e0b' : 'none'} color="#f59e0b" style={{ opacity: n <= Math.round(reviews.averageRating) ? 1 : 0.3 }} />
                ))}
              </div>
            )}
          </div>
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <MessageSquare size={16} style={{ color: '#6366f1' }} />
              <p style={{ color: '#8888aa', fontSize: '13px', fontWeight: '500' }}>Recent Feedback</p>
            </div>
            {reviews?.reviews?.length > 0 ? (
              <div style={{ maxHeight: '140px', overflowY: 'auto' }}>
                {reviews.reviews.slice(0, 4).map((r: any) => (
                  <div key={r.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(42,42,58,0.4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ color: '#f59e0b', fontSize: '12px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      <span style={{ color: '#f0f0ff', fontSize: '13px', fontWeight: '500' }}>{r.patient?.name}</span>
                    </div>
                    {r.comment && <p style={{ color: '#8888aa', fontSize: '12px', lineHeight: '1.4' }}>"{r.comment.slice(0, 80)}{r.comment.length > 80 ? '...' : ''}"</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#555570', fontSize: '13px' }}>No reviews yet.</p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0ff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} style={{ color: '#6366f1' }} /> Quick Access
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {links.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '22px', transition: 'all 0.25s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(30,30,42,0.9)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,42,58,0.6)'; e.currentTarget.style.background = 'rgba(22,22,31,0.7)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ width: '38px', height: '38px', background: `${item.color}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <Icon size={18} style={{ color: item.color }} />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f0f0ff', marginBottom: '4px' }}>{item.title}</h3>
                  <p style={{ color: '#8888aa', fontSize: '12px' }}>{item.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Upcoming Appointments */}
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} style={{ color: '#6366f1' }} /> Upcoming Appointments
            </h2>
            {upcomingApps.length > 0 && (
              <span style={{ fontSize: '13px', padding: '4px 12px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', borderRadius: '100px', fontWeight: '600' }}>
                {upcomingApps.length} {upcomingApps.length === 1 ? 'appointment' : 'appointments'}
              </span>
            )}
          </div>
          {upcomingApps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#555570' }}>
              <Calendar size={32} style={{ color: '#353550', marginBottom: '12px' }} />
              <p style={{ fontSize: '14px' }}>No upcoming appointments.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '540px', overflowY: 'auto' }}>
              {upcomingApps.map((appt: any) => {
                const dateStr = new Date(appt.appointment_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                return (
                  <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10,10,15,0.5)', border: '1px solid rgba(42,42,58,0.5)', borderRadius: '12px', padding: '14px 18px', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(42,42,58,0.5)'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', background: 'rgba(99,102,241,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} style={{ color: '#818cf8' }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: '600', color: '#f0f0ff', fontSize: '14px' }}>{appt.patient?.name}</p>
                        <p style={{ fontSize: '12px', color: '#8888aa', marginTop: '2px' }}>{dateStr} · {to12h(appt.appointment_time)}</p>
                      </div>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
