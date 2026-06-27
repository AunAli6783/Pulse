'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddDoctorPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    specialization: '', qualification: '', experience: '', fee: '', bio: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, experience: Number(form.experience), fee: form.fee }),
    })
    if (res.ok) router.push('/admin/doctors')
    else { const d = await res.json(); setError(d.error || 'Failed to create doctor') }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', background: 'rgba(10,10,15,0.6)',
    border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px',
    color: '#f0f0ff', fontSize: '14px', outline: 'none',
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', background: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', marginBottom: '32px', letterSpacing: '-0.5px' }}>Add Doctor</h1>
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '36px' }}>
          {error && <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Specialization</label>
              <input type="text" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Qualification</label>
              <input type="text" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Experience (years)</label>
                <input type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Fee ($)</label>
                <input type="number" step="0.01" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} required />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
            </div>
            <button type="submit"
              style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.5)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.3)'}
            >
              Create Doctor
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
