'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function AvailabilityPage() {
  const [form, setForm] = useState({ day_of_week: 'Mon', start_time: '09:00', end_time: '17:00', slot_duration: 30 })
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setMsg(res.ok ? 'Availability saved!' : 'Failed to save')
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', background: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <Clock size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Set Availability</h1>
        </div>
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '36px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Day of Week</label>
              <select value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'}
              >
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Start Time</label>
                <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>End Time</label>
                <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Slot Duration (minutes)</label>
              <input type="number" value={form.slot_duration} onChange={(e) => setForm({ ...form, slot_duration: Number(e.target.value) })} min={15} step={15}
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'}
              />
            </div>
            <button type="submit"
              style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.5)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.3)'}
            >
              Save
            </button>
          </form>
          {msg && <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: msg === 'Availability saved!' ? '#22d3a0' : '#f43f5e' }}>{msg}</p>}
        </div>
      </div>
    </div>
  )
}
