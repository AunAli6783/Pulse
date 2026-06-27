'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import { ClipboardList, Clock, Pill, User, LayoutDashboard, Star, MessageSquare } from 'lucide-react'

const links = [
  { href: '/doctor/appointments', title: 'Appointments', desc: 'View all your appointments', icon: ClipboardList },
  { href: '/doctor/availability', title: 'Availability', desc: 'Set your weekly schedule', icon: Clock },
  { href: '/doctor/prescriptions', title: 'Prescriptions', desc: 'Write and view prescriptions', icon: Pill },
  { href: '/doctor/profile', title: 'Profile', desc: 'Update your details', icon: User },
]

export default function DoctorDashboard() {
  const { data: session } = useSession()
  const [todayApps, setTodayApps] = useState<any[]>([])
  const [reviews, setReviews] = useState<any>(null)

  useEffect(() => {
    fetch('/api/appointments').then((r) => r.json()).then((apps) => {
      const today = new Date().toISOString().split('T')[0]
      setTodayApps(apps.filter((a: any) => a.appointment_date?.startsWith(today)))
    })
    fetch('/api/reviews').then((r) => r.json()).then(setReviews)
  }, [])

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <LayoutDashboard size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Doctor Dashboard</h1>
        </div>
        <p style={{ color: '#8888aa', fontSize: '15px', marginBottom: '40px', marginLeft: '34px' }}>Welcome, {session?.user?.name}</p>

        {/* Stats & Reviews */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Star size={16} style={{ color: '#f59e0b' }} />
              <p style={{ color: '#8888aa', fontSize: '13px', fontWeight: '500' }}>Average Rating</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <p style={{ fontSize: '28px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>{reviews?.averageRating || 0}</p>
              <p style={{ color: '#555570', fontSize: '14px' }}>/ 5</p>
              <p style={{ color: '#555570', fontSize: '13px', marginLeft: '8px' }}>({reviews?.totalReviews || 0} reviews)</p>
            </div>
            {reviews && reviews.totalReviews > 0 && (
              <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={14} fill={n <= Math.round(reviews.averageRating) ? '#f59e0b' : 'none'} color="#f59e0b" style={{ opacity: n <= Math.round(reviews.averageRating) ? 1 : 0.3 }} />
                ))}
              </div>
            )}
          </div>
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <MessageSquare size={16} style={{ color: '#6366f1' }} />
              <p style={{ color: '#8888aa', fontSize: '13px', fontWeight: '500' }}>Recent Feedback</p>
            </div>
            {reviews?.reviews?.length > 0 ? (
              <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                {reviews.reviews.slice(0, 3).map((r: any) => (
                  <p key={r.id} style={{ color: '#8888aa', fontSize: '12px', padding: '4px 0', borderBottom: '1px solid rgba(42,42,58,0.4)' }}>
                    <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span> — {r.patient?.name}
                    {r.comment ? <span style={{ color: '#555570' }}>: "{r.comment.slice(0, 60)}{r.comment.length > 60 ? '...' : ''}"</span> : null}
                  </p>
                ))}
              </div>
            ) : (
              <p style={{ color: '#555570', fontSize: '13px' }}>No reviews yet.</p>
            )}
          </div>
        </div>

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
