'use client'

import Link from 'next/link'
import { Activity, ExternalLink, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(42,42,58,0.5)', background: 'rgba(10,10,15,0.95)', padding: '48px 24px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        {/* Brand */}
        <div>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} color="white" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0ff', letterSpacing: '-0.3px' }}>Pulse</span>
          </Link>
          <p style={{ color: '#555570', fontSize: '13px', lineHeight: '1.6', maxWidth: '220px' }}>
            Book appointments with top doctors in minutes. Trusted by 50,000+ patients across Pakistan.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f0f0ff', marginBottom: '16px', letterSpacing: '0.3px' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Home', href: '/' },
              { label: 'Find Doctors', href: '/doctors' },
              { label: 'How It Works', href: '/#how-it-works' },
              { label: 'Specialties', href: '/#specialties' },
              { label: 'Contact', href: '/contact' },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ color: '#555570', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#f0f0ff'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#555570'}>{l.label}</Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f0f0ff', marginBottom: '16px', letterSpacing: '0.3px' }}>Contact</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#555570', fontSize: '13px' }}>
              <Mail size={14} style={{ color: '#6366f1' }} />
              <a href="mailto:rajaaunalikhan3@gmail.com" style={{ color: '#555570', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#f0f0ff'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#555570'}>rajaaunalikhan3@gmail.com</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#555570', fontSize: '13px' }}>
              <Phone size={14} style={{ color: '#6366f1' }} />
              <span>+92 320 9486621</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#555570', fontSize: '13px' }}>
              <MapPin size={14} style={{ color: '#6366f1', marginTop: '2px' }} />
              <span>Lahore, Pakistan</span>
            </div>
          </div>
        </div>

        {/* Developer */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f0f0ff', marginBottom: '16px', letterSpacing: '0.3px' }}>Developer</h4>
          <p style={{ color: '#555570', fontSize: '13px', marginBottom: '12px' }}>Built by Raja Aun Ali Khan</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="https://rajaaunali.netlify.app" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#818cf8', textDecoration: 'none', fontSize: '13px', fontWeight: '500', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#a78bfa'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = '#818cf8'}>
              <ExternalLink size={14} /> Portfolio
            </a>
            <a href="https://www.linkedin.com/in/raja-aun-ali-khan/" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#818cf8', textDecoration: 'none', fontSize: '13px', fontWeight: '500', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#a78bfa'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = '#818cf8'}>
              <ExternalLink size={14} /> LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid rgba(42,42,58,0.5)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ color: '#333348', fontSize: '13px' }}>© 2026 Pulse. All rights reserved.</p>
        <p style={{ color: '#333348', fontSize: '13px' }}>
          Built by{' '}
          <a href="https://rajaaunali.netlify.app" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', textDecoration: 'none' }}>Raja Aun Ali Khan</a>
        </p>
      </div>
    </footer>
  )
}
