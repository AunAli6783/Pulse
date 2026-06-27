'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Calendar, Clock, FileText, Stethoscope } from 'lucide-react'

export default function BookAppointmentPage() {
  const { 'doctor-id': doctorId } = useParams<{ 'doctor-id': string }>()
  const router = useRouter()
  const [doctor, setDoctor] = useState<any>(null)
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => { fetch(`/api/doctors/${doctorId}`).then((r) => r.json()).then(setDoctor) }, [doctorId])
  useEffect(() => {
    if (!date) return
    setSelectedSlot('')
    fetch(`/api/availability/${doctorId}/${date}`).then((r) => r.json()).then((data) => setSlots(data.slots))
  }, [date, doctorId])

  const handleBook = async () => {
    if (!date || !selectedSlot) return
    const res = await fetch('/api/appointments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctor_id: Number(doctorId), appointment_date: date, appointment_time: selectedSlot, reason }),
    })
    if (res.ok) router.push('/dashboard/appointments')
  }

  if (!doctor) return <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}><p style={{ color: '#8888aa' }}>Loading...</p></div>

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', background: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Calendar size={22} style={{ color: '#6366f1' }} />
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Book Appointment</h1>
          </div>
          <p style={{ color: '#8888aa', fontSize: '14px', marginBottom: '28px', marginLeft: '32px' }}>with <span style={{ color: '#f0f0ff', fontWeight: '600' }}>{doctor.user.name}</span></p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}><Calendar size={14} /> Select Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
            </div>
            {slots.length > 0 && (
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '10px' }}><Clock size={14} /> Available Slots</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {slots.map((slot) => (
                    <button key={slot} onClick={() => setSelectedSlot(slot)}
                      style={{ padding: '10px 8px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: selectedSlot === slot ? '1px solid rgba(99,102,241,0.7)' : '1px solid rgba(42,42,58,0.8)', background: selectedSlot === slot ? 'rgba(99,102,241,0.2)' : 'rgba(22,22,31,0.5)', color: selectedSlot === slot ? '#818cf8' : '#8888aa', transition: 'all 0.2s' }}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {date && slots.length === 0 && <p style={{ color: '#555570', fontSize: '14px' }}>No available slots for this date.</p>}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}><FileText size={14} /> Reason (optional)</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
            </div>
            <button onClick={handleBook} disabled={!date || !selectedSlot}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (!date || !selectedSlot) ? 0.5 : 1, boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
              <Calendar size={18} /> Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
