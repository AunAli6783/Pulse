'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Heart, Stethoscope, Brain, Bone, Eye, Smile, Baby, Activity,
  Search, Calendar, Pill, Shield, Zap, Smartphone, UserCheck,
  ArrowRight, CheckCircle
} from 'lucide-react'

const specialties = [
  { icon: Heart, label: 'Cardiology' },
  { icon: Brain, label: 'Neurology' },
  { icon: Bone, label: 'Orthopedics' },
  { icon: Eye, label: 'Ophthalmology' },
  { icon: Smile, label: 'Dentistry' },
  { icon: Stethoscope, label: 'General' },
  { icon: Baby, label: 'Pediatrics' },
  { icon: Activity, label: 'Dermatology' },
]

const stats = [
  { value: '500+', label: 'Doctors' },
  { value: '50K+', label: 'Patients' },
  { value: '98%', label: 'Satisfaction' },
  { value: '24/7', label: 'Support' },
]

const steps = [
  { num: '01', icon: Search, title: 'Find a Doctor', desc: 'Search by specialty, location, or availability. Browse verified profiles and patient reviews.', color: '#6366f1' },
  { num: '02', icon: Calendar, title: 'Book Online', desc: 'Pick a date and time slot that works for you. Instant confirmation, no waiting on hold.', color: '#22d3a0' },
  { num: '03', icon: Pill, title: 'Get Treated', desc: 'Visit the clinic and receive the care you need. Track your health history in one place.', color: '#f59e0b' },
]

const features = [
  { icon: Shield, title: 'Secure & Private', desc: 'Your health data is encrypted and never shared without consent.' },
  { icon: Zap, title: 'Instant Booking', desc: 'Book appointments in under 60 seconds with real-time availability.' },
  { icon: Smartphone, title: 'Digital Records', desc: 'Access prescriptions, reports, and history anytime, anywhere.' },
  { icon: UserCheck, title: 'Verified Doctors', desc: 'All physicians are board-certified and background-checked.' },
]

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user as any
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    if (!session) return
    if (user?.role === 'patient') router.push('/dashboard')
    else if (user?.role === 'doctor') router.push('/doctor/dashboard')
    else if (user?.role === 'admin') router.push('/admin/dashboard')
  }, [session, user, router])

  return (
    <div className="grid-bg" style={{ paddingTop: '64px', backgroundColor: '#0a0a0f', minHeight: '100vh' }}>
      <section className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '80px 24px' }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '8%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '900px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className={visible ? 'animate-fade-up' : ''} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '100px', padding: '6px 16px', marginBottom: '32px', fontSize: '13px', color: '#818cf8', fontWeight: '500', letterSpacing: '0.5px' }}>
            <CheckCircle size={14} />
            Trusted by 50,000+ patients across Pakistan
          </div>
          <h1 className={visible ? 'animate-fade-up delay-100' : ''} style={{ fontSize: 'clamp(42px, 8vw, 82px)', fontWeight: '900', lineHeight: '1.05', letterSpacing: '-3px', marginBottom: '28px', opacity: 0 }}>
            <span style={{ color: '#f0f0ff' }}>Your Health,</span><br />
            <span className="gradient-text-accent">Our Priority.</span>
          </h1>
          <p className={visible ? 'animate-fade-up delay-200' : ''} style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#8888aa', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 48px', opacity: 0 }}>
            Book appointments with top doctors in minutes. No sign-up hassle, no long waits — just seamless healthcare at your fingertips.
          </p>
          <div className={visible ? 'animate-fade-up delay-300' : ''} style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', opacity: 0, marginBottom: '64px' }}>
            <Link href="/register" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', textDecoration: 'none', padding: '14px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', boxShadow: '0 0 40px rgba(99,102,241,0.4)', transition: 'all 0.25s ease', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link href="/doctors" style={{ background: 'rgba(255,255,255,0.05)', color: '#f0f0ff', textDecoration: 'none', padding: '14px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.12)', transition: 'all 0.25s ease' }}>
              Browse Doctors
            </Link>
          </div>
          <div className={visible ? 'animate-fade-up delay-400' : ''} style={{ display: 'flex', gap: '0', justifyContent: 'center', flexWrap: 'wrap', opacity: 0, border: '1px solid rgba(42,42,58,0.8)', borderRadius: '16px', background: 'rgba(22,22,31,0.6)', backdropFilter: 'blur(12px)', overflow: 'hidden', maxWidth: '600px', margin: '0 auto' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ flex: 1, padding: '20px 16px', textAlign: 'center', borderRight: i < stats.length - 1 ? '1px solid rgba(42,42,58,0.8)' : 'none', minWidth: '110px' }}>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#555570', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="specialties" style={{ padding: '100px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>Specialties</span>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-1.5px', marginBottom: '16px' }}>Browse by Specialty</h2>
          <p style={{ color: '#8888aa', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>Find the right specialist for your needs across all major medical fields.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
          {specialties.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '100px', border: '1px solid rgba(42,42,58,0.8)', background: 'rgba(22,22,31,0.7)', color: '#8888aa', fontSize: '14px', fontWeight: '500', cursor: 'default', transition: 'all 0.2s ease' }}>
                <Icon size={18} />
                {s.label}
              </div>
            )
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/doctors" style={{ color: '#6366f1', textDecoration: 'none', fontSize: '14px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            View all specialties <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section id="how-it-works" style={{ padding: '100px 24px', background: 'rgba(16,16,24,0.6)', borderTop: '1px solid rgba(42,42,58,0.5)', borderBottom: '1px solid rgba(42,42,58,0.5)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>Process</span>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-1.5px' }}>How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {steps.map((step, i) => <StepCard key={i} step={step} />)}
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>Why Pulse</span>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-1.5px' }}>Built for your peace of mind</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {features.map((f, i) => <FeatureCard key={i} feature={f} />)}
        </div>
      </section>

      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(167,139,250,0.1))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '24px', padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-1.5px', marginBottom: '20px', position: 'relative' }}>Ready to take control of your health?</h2>
          <p style={{ color: '#8888aa', fontSize: '16px', marginBottom: '40px', position: 'relative' }}>Join thousands of patients who trust Pulse for their healthcare needs.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <Link href="/register" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', textDecoration: 'none', padding: '14px 36px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', boxShadow: '0 0 40px rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link href="/doctors" style={{ color: '#8888aa', textDecoration: 'none', padding: '14px 36px', borderRadius: '12px', fontSize: '16px', fontWeight: '500', border: '1px solid rgba(255,255,255,0.1)' }}>
              Browse Doctors
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function StepCard({ step }: { step: typeof steps[0] }) {
  const [hovered, setHovered] = useState(false)
  const Icon = step.icon
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? 'rgba(30,30,42,0.9)' : 'rgba(22,22,31,0.7)', border: hovered ? `1px solid ${step.color}40` : '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '36px 28px', transition: 'all 0.3s ease', boxShadow: hovered ? `0 8px 40px ${step.color}20` : 'none', cursor: 'default' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div style={{ width: '52px', height: '52px', background: `${step.color}18`, border: `1px solid ${step.color}30`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color }}><Icon size={24} /></div>
        <span style={{ fontSize: '13px', fontWeight: '700', color: step.color, opacity: 0.5, letterSpacing: '1px', fontFamily: 'monospace' }}>{step.num}</span>
      </div>
      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#f0f0ff', marginBottom: '12px' }}>{step.title}</h3>
      <p style={{ fontSize: '14px', color: '#8888aa', lineHeight: '1.7' }}>{step.desc}</p>
      <div style={{ width: hovered ? '48px' : '24px', height: '2px', background: step.color, borderRadius: '2px', marginTop: '24px', transition: 'width 0.3s ease' }} />
    </div>
  )
}

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const [hovered, setHovered] = useState(false)
  const Icon = feature.icon
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? 'rgba(30,30,42,0.9)' : 'rgba(22,22,31,0.5)', border: hovered ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '28px', transition: 'all 0.25s ease', cursor: 'default' }}>
      <div style={{ width: '52px', height: '52px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', marginBottom: '16px' }}><Icon size={24} /></div>
      <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#f0f0ff', marginBottom: '10px' }}>{feature.title}</h3>
      <p style={{ fontSize: '14px', color: '#8888aa', lineHeight: '1.65' }}>{feature.desc}</p>
    </div>
  )
}
