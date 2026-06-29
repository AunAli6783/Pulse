'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Heart, LogOut, User, LayoutDashboard, ClipboardList, Pill, Clock, Users, Stethoscope, BarChart3, FileText } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const user = session?.user as any
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const dashboardHref = user?.role === 'patient' ? '/dashboard' : user?.role === 'doctor' ? '/doctor/dashboard' : '/admin/dashboard'

  const patientLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/appointments', label: 'Appointments', icon: ClipboardList },
    { href: '/dashboard/prescriptions', label: 'Prescriptions', icon: Pill },
    { href: '/dashboard/records', label: 'Records', icon: FileText },
  ]
  const doctorLinks = [
    { href: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/doctor/appointments', label: 'Appointments', icon: ClipboardList },
    { href: '/doctor/availability', label: 'Availability', icon: Clock },
    { href: '/doctor/prescriptions', label: 'Prescriptions', icon: Pill },
    { href: '/doctor/medical-records', label: 'Records', icon: FileText },
  ]
  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/appointments', label: 'Appointments', icon: ClipboardList },
    { href: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
    { href: '/admin/patients', label: 'Patients', icon: Users },
    { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  ]

  const roleLinks = user?.role === 'patient' ? patientLinks : user?.role === 'doctor' ? doctorLinks : adminLinks

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: scrolled ? 'rgba(10,10,15,0.92)' : 'rgba(10,10,15,0.6)', backdropFilter: 'blur(16px)', borderBottom: scrolled ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(42,42,58,0.4)', transition: 'all 0.3s ease' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
              <Heart size={18} color="white" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0ff', letterSpacing: '-0.3px' }}>Pulse</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <NavLink href="/doctors">Find Doctors</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            {session ? (
              <>
                {/* Role-specific links */}
                {roleLinks.map((link) => (
                  <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
                ))}
                <button onClick={() => signOut()} style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '4px' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(244,63,94,0.25)'; (e.target as HTMLElement).style.borderColor = '#f43f5e' }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(244,63,94,0.15)'; (e.target as HTMLElement).style.borderColor = 'rgba(244,63,94,0.3)' }}>
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink href="/#how-it-works">How It Works</NavLink>
                <NavLink href="/#specialties">Specialties</NavLink>
                <Link href="/login" style={{ color: '#8888aa', textDecoration: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = '#f0f0ff'}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = '#8888aa'}>
                  <User size={14} /> Login
                </Link>
                <Link href="/register" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', textDecoration: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', boxShadow: '0 0 20px rgba(99,102,241,0.3)', transition: 'all 0.2s ease' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{ color: '#8888aa', textDecoration: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s ease' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#f0f0ff'; el.style.background = 'rgba(99,102,241,0.1)' }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#8888aa'; el.style.background = 'transparent' }}>
      {children}
    </Link>
  )
}
