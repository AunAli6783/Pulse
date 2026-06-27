'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, ExternalLink, Send, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', background: '#0a0a0f', padding: '120px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1', letterSpacing: '2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            <MessageSquare size={16} /> Get in Touch
          </span>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-1px', marginBottom: '12px' }}>Contact Us</h1>
          <p style={{ color: '#8888aa', fontSize: '15px', maxWidth: '480px', margin: '0 auto' }}>Have a question or feedback? We'd love to hear from you.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
            <Mail size={24} style={{ color: '#6366f1', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f0f0ff', marginBottom: '6px' }}>Email</h3>
            <a href="mailto:rajaaunalikhan3@gmail.com" style={{ color: '#8888aa', fontSize: '14px', textDecoration: 'none' }}>rajaaunalikhan3@gmail.com</a>
          </div>
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
            <Phone size={24} style={{ color: '#6366f1', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f0f0ff', marginBottom: '6px' }}>Phone</h3>
            <p style={{ color: '#8888aa', fontSize: '14px' }}>+92 320 9486621</p>
          </div>
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
            <MapPin size={24} style={{ color: '#6366f1', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f0f0ff', marginBottom: '6px' }}>Location</h3>
            <p style={{ color: '#8888aa', fontSize: '14px' }}>Lahore, Pakistan</p>
          </div>
        </div>

        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '36px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0ff', marginBottom: '24px' }}>Send a Message</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} required
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
            </div>
            <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', padding: '12px 28px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
              <Send size={16} /> Send Message
            </button>
          </form>
          {sent && (
            <p style={{ marginTop: '16px', color: '#22d3a0', fontSize: '14px', fontWeight: '500' }}>✓ Message sent successfully! We'll get back to you soon.</p>
          )}
        </div>

        {/* Developer */}
        <div style={{ textAlign: 'center', padding: '24px', borderRadius: '14px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <p style={{ color: '#8888aa', fontSize: '14px', marginBottom: '12px' }}>This project was built by</p>
          <p style={{ color: '#f0f0ff', fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>Raja Aun Ali Khan</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="https://rajaaunali.netlify.app" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#818cf8', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
              <ExternalLink size={16} /> Portfolio
            </a>
            <a href="https://www.linkedin.com/in/raja-aun-ali-khan/" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#818cf8', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
              <ExternalLink size={16} /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
