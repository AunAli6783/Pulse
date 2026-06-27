'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import StatsCard from '@/components/dashboard/StatsCard'
import { Stethoscope, Users, Calendar, BarChart3 } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then(setStats)
  }, [])

  if (!stats) return <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0f', paddingTop: '64px' }}><p style={{ color: '#8888aa' }}>Loading...</p></div>

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px', marginBottom: '32px' }}>Admin Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <StatsCard title="Total Patients" value={stats.totalPatients} icon={Users} />
          <StatsCard title="Today's Appointments" value={stats.todayAppointments} icon={Calendar} />
          <StatsCard title="Monthly Appointments" value={stats.monthlyAppointments} icon={Calendar} />
          <StatsCard title="Monthly Revenue" value={`$${Number(stats.monthlyRevenue).toFixed(2)}`} icon={BarChart3} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff', marginBottom: '16px' }}>Status Breakdown</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.statusBreakdown?.map((s: any) => (
                <div key={s.status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(10,10,15,0.3)', borderRadius: '8px' }}>
                  <span style={{ color: '#f0f0ff', fontWeight: '500', textTransform: 'capitalize', fontSize: '14px' }}>{s.status}</span>
                  <span style={{ color: '#818cf8', fontWeight: '700', fontSize: '16px' }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff', marginBottom: '16px' }}>Quick Links</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { href: '/admin/doctors', label: 'Manage Doctors', icon: Stethoscope },
                { href: '/admin/patients', label: 'Manage Patients', icon: Users },
                { href: '/admin/appointments', label: 'All Appointments', icon: Calendar },
                { href: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
              ].map((link) => {
                const Icon = link.icon
                return (
                  <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(10,10,15,0.3)', color: '#8888aa', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#f0f0ff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(10,10,15,0.3)'; e.currentTarget.style.color = '#8888aa' }}
                    >
                      <Icon size={18} />
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>{link.label}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
