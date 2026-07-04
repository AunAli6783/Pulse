'use client'

import { useEffect, useState } from 'react'
import { Clock, Trash2, Plus } from 'lucide-react'
import { HOURS12, MINUTES, to24h, to12h } from '@/lib/time'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const ORDERED_DAYS: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }

export default function AvailabilityPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [form, setForm] = useState({
    day_of_week: 'Mon',
    startHour: 9, startMinute: 0, startPeriod: 'AM',
    endHour: 5, endMinute: 0, endPeriod: 'PM',
    slot_duration: 30,
  })
  const [msg, setMsg] = useState('')

  const fetchEntries = async () => {
    const res = await fetch('/api/availability')
    if (res.ok) {
      const data = await res.json()
      setEntries(data)
    }
  }

  useEffect(() => { fetchEntries() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        day_of_week: form.day_of_week,
        start_time: to24h(form.startHour, form.startMinute, form.startPeriod),
        end_time: to24h(form.endHour, form.endMinute, form.endPeriod),
        slot_duration: form.slot_duration,
      }),
    })
    if (res.ok) {
      setMsg('Availability saved!')
      fetchEntries()
    } else {
      setMsg('Failed to save')
    }
  }

  const handleDelete = async (id: number) => {
    const res = await fetch('/api/availability', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setMsg('Slot removed')
      fetchEntries()
    }
  }

  const grouped = DAYS.map((day) => ({
    day,
    slots: entries.filter((e) => e.day_of_week === day).sort((a: any, b: any) => a.start_time.localeCompare(b.start_time)),
  }))

  const Select = ({ value, onChange, options }: { value: number | string; onChange: (v: any) => void; options: { value: number | string; label: string }[] }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', padding: '10px 8px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '8px', color: '#f0f0ff', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
      onFocus={e => e.target.style.borderColor = '#6366f1'}
      onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'}
    >
      {options.map((o) => <option key={String(o.value)} value={o.value}>{o.label}</option>)}
    </select>
  )

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <Clock size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Set Availability</h1>
        </div>

        {/* Existing availability */}
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff', marginBottom: '16px' }}>Current Schedule</h2>
          {entries.length === 0 ? (
            <p style={{ color: '#555570', fontSize: '14px', textAlign: 'center', padding: '24px' }}>
              No availability set. Add your first time slot below.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
              {grouped.map(({ day, slots }) => (
                <div key={day} style={{ background: 'rgba(10,10,15,0.4)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(42,42,58,0.5)' }}>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: slots.length > 0 ? '#818cf8' : '#555570', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {day}
                  </p>
                  {slots.length === 0 ? (
                    <p style={{ fontSize: '12px', color: '#353550', fontStyle: 'italic' }}>Not available</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {slots.map((slot: any) => (
                        <div key={slot.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(22,22,31,0.5)', borderRadius: '8px', border: '1px solid rgba(42,42,58,0.4)' }}>
                          <span style={{ color: '#f0f0ff', fontSize: '13px', fontWeight: '500' }}>
                            {to12h(slot.start_time)} — {to12h(slot.end_time)}
                            <span style={{ color: '#8888aa', marginLeft: '8px', fontSize: '11px' }}>({slot.slot_duration} min)</span>
                          </span>
                          <button onClick={() => handleDelete(slot.id)}
                            style={{ padding: '4px 8px', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '6px', color: '#f43f5e', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.25)'; e.currentTarget.style.borderColor = '#f43f5e' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.15)'; e.currentTarget.style.borderColor = 'rgba(244,63,94,0.3)' }}
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add new slot */}
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '36px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} style={{ color: '#22d3a0' }} /> Add Time Slot
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Day of Week</label>
              <select value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'}
              >
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '10px' }}>Start Time</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                  <Select value={form.startHour} onChange={(v) => setForm({ ...form, startHour: Number(v) })}
                    options={HOURS12.map(h => ({ value: h, label: String(h) }))} />
                  <Select value={form.startMinute} onChange={(v) => setForm({ ...form, startMinute: Number(v) })}
                    options={MINUTES.map(m => ({ value: m, label: String(m).padStart(2, '0') }))} />
                  <Select value={form.startPeriod} onChange={(v) => setForm({ ...form, startPeriod: v })}
                    options={[{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '10px' }}>End Time</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                  <Select value={form.endHour} onChange={(v) => setForm({ ...form, endHour: Number(v) })}
                    options={HOURS12.map(h => ({ value: h, label: String(h) }))} />
                  <Select value={form.endMinute} onChange={(v) => setForm({ ...form, endMinute: Number(v) })}
                    options={MINUTES.map(m => ({ value: m, label: String(m).padStart(2, '0') }))} />
                  <Select value={form.endPeriod} onChange={(v) => setForm({ ...form, endPeriod: v })}
                    options={[{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]} />
                </div>
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
              style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #22d3a0, #10b981)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 0 20px rgba(34,211,160,0.3)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(34,211,160,0.5)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(34,211,160,0.3)'}
            >
              <Plus size={18} /> Add Slot
            </button>
          </form>
          {msg && <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: msg === 'Failed to save' ? '#f43f5e' : '#22d3a0' }}>{msg}</p>}
        </div>
      </div>
    </div>
  )
}
