'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Calendar, Clock, FileText, Stethoscope, MapPin, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react'
import { to12h, to24h, HOURS12, MINUTES } from '@/lib/time'

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function BookAppointmentPage() {
  const { 'doctor-id': doctorId } = useParams<{ 'doctor-id': string }>()
  const router = useRouter()
  const [doctor, setDoctor] = useState<any>(null)
  const [schedule, setSchedule] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [slots, setSlots] = useState<string[]>([])
  const [selectedHour, setSelectedHour] = useState<number | ''>('')
  const [selectedMinute, setSelectedMinute] = useState<number | ''>('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/doctors/${doctorId}`).then((r) => r.json()).then(setDoctor)
    fetch(`/api/availability/${doctorId}`).then((r) => r.json()).then(setSchedule)
  }, [doctorId])

  const availableDays = new Set(schedule.map((s: any) => s.day_of_week))

  const [dateLimit, setDateLimit] = useState(60)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dates: { dateStr: string; date: Date; dayName: string; dayShort: string; available: boolean }[] = []
  for (let i = 0; i < dateLimit; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const dayShort = DAYS_SHORT[d.getDay()]
    const available = availableDays.has(dayShort)
    dates.push({
      dateStr: formatDate(d),
      date: d,
      dayName: DAYS_FULL[d.getDay()],
      dayShort,
      available,
    })
  }

  const selectDate = async (dateStr: string) => {
    setSelectedDate(dateStr)
    setSelectedHour('')
    setSelectedMinute('')
    setSlots([])
    setLoading(true)
    const res = await fetch(`/api/availability/${doctorId}/${dateStr}`)
    const data = await res.json()
    setSlots(data.slots || [])
    setLoading(false)
  }

  const validHours = [...new Set(slots.map((s) => {
    const h = parseInt(s.split(':')[0])
    return h === 0 ? 12 : h > 12 ? h - 12 : h
  }))].sort((a, b) => a - b)

  const validMinutes = slots
    .filter((s) => {
      const h = parseInt(s.split(':')[0])
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      return hour12 === selectedHour
    })
    .map((s) => parseInt(s.split(':')[1]))
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => a - b)

  const hourPeriod = (time: string) => {
    const h = parseInt(time.split(':')[0])
    return h < 12 ? 'AM' : 'PM'
  }

  const slotTime = () => {
    if (!selectedDate || selectedHour === '' || selectedMinute === '') return ''
    return slots.find((s) => {
      const h = parseInt(s.split(':')[0])
      const m = parseInt(s.split(':')[1])
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      return hour12 === selectedHour && m === selectedMinute
    }) || ''
  }

  const [userPaid, setUserPaid] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/user/me').then((r) => r.json()).then((d) => setUserPaid(d.paid))
  }, [])

  const handleBook = async () => {
    const time = slotTime()
    if (!selectedDate || !time) return
    const res = await fetch('/api/appointments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctor_id: Number(doctorId), appointment_date: selectedDate, appointment_time: time, reason }),
    })
    if (res.ok) router.push('/dashboard/appointments')
  }

  const selectedDateObj = dates.find((d) => d.dateStr === selectedDate)

  const Select = ({ value, onChange, options, placeholder }: { value: number | string; onChange: (v: any) => void; options: { value: number | string; label: string }[]; placeholder?: string }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', padding: '12px 12px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
      onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'}>
      {placeholder && <option value="" style={{ background: '#16161f' }}>{placeholder}</option>}
      {options.map((o) => <option key={String(o.value)} value={o.value} style={{ background: '#16161f' }}>{o.label}</option>)}
    </select>
  )

  if (!doctor) return <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0f' }}><p style={{ color: '#8888aa' }}>Loading...</p></div>

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Doctor info header */}
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '24px 32px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(129,140,248,0.15))', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={26} style={{ color: '#818cf8' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Dr. {doctor.user.name}</h1>
              <p style={{ color: '#8888aa', fontSize: '14px', marginTop: '2px' }}>{doctor.specialization} · {doctor.experience} yrs exp</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#22d3a0', fontSize: '18px', fontWeight: '700' }}>Rs. {doctor.fee}</p>
            <p style={{ color: '#555570', fontSize: '12px' }}>per visit</p>
          </div>
        </div>

        {/* Payment status banner */}
        <div style={{
          background: userPaid ? 'rgba(34,197,94,0.08)' : 'rgba(244,63,94,0.08)',
          border: `1px solid ${userPaid ? 'rgba(34,197,94,0.25)' : 'rgba(244,63,94,0.25)'}`,
          borderRadius: '14px', padding: '14px 20px', marginBottom: '28px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          {userPaid ? <ShieldCheck size={20} style={{ color: '#22c55e', flexShrink: 0 }} /> : <CreditCard size={20} style={{ color: '#f43f5e', flexShrink: 0 }} />}
          <div style={{ flex: 1 }}>
            {userPaid === null ? (
              <p style={{ color: '#8888aa', fontSize: '13px' }}>Checking payment status...</p>
            ) : userPaid ? (
              <>
                <p style={{ color: '#22c55e', fontSize: '13px', fontWeight: '600' }}>Registration Fee Paid ✓</p>
                <p style={{ color: '#8888aa', fontSize: '12px', marginTop: '2px' }}>Your account is active. Consultation fee of Rs. {doctor.fee} will be collected at the clinic.</p>
              </>
            ) : (
              <>
                <p style={{ color: '#f43f5e', fontSize: '13px', fontWeight: '600' }}>Registration Fee Pending</p>
                <p style={{ color: '#8888aa', fontSize: '12px', marginTop: '2px' }}>Please pay the registration fee of Rs. 500 to activate your account and book appointments.</p>
              </>
            )}
          </div>
          {userPaid === false && (
            <a href="/payment"
              style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 0 15px rgba(99,102,241,0.3)' }}>
              Pay Now
            </a>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
          {/* Left: Date list */}
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} style={{ color: '#6366f1' }} /> Select a Date
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '460px', overflowY: 'auto', paddingRight: '4px' }}>
              {dates.map((d) => {
                const isSelected = d.dateStr === selectedDate
                const daySlots = schedule.filter((s: any) => s.day_of_week === d.dayShort)
                const timeRange = daySlots.length > 0
                  ? `${to12h(daySlots[0].start_time)} — ${to12h(daySlots[0].end_time)}`
                  : ''
                return (
                  <button
                    key={d.dateStr}
                    onClick={() => d.available && selectDate(d.dateStr)}
                    disabled={!d.available}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px',
                      background: isSelected ? 'rgba(99,102,241,0.15)' : 'rgba(10,10,15,0.4)',
                      border: isSelected ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(42,42,58,0.5)',
                      borderRadius: '12px', cursor: d.available ? 'pointer' : 'not-allowed',
                      opacity: d.available ? 1 : 0.35, transition: 'all 0.2s', textAlign: 'left',
                    }}
                    onMouseEnter={e => { if (d.available && !isSelected) { e.currentTarget.style.background = 'rgba(42,42,58,0.5)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)' } }}
                    onMouseLeave={e => { if (d.available && !isSelected) { e.currentTarget.style.background = 'rgba(10,10,15,0.4)'; e.currentTarget.style.borderColor = 'rgba(42,42,58,0.5)' } }}
                  >
                    {/* Date badge */}
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      background: isSelected ? 'rgba(99,102,241,0.25)' : 'rgba(22,22,31,0.6)',
                      border: isSelected ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(42,42,58,0.4)',
                    }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: isSelected ? '#818cf8' : '#555570', textTransform: 'uppercase' }}>{d.dayShort}</span>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: isSelected ? '#f0f0ff' : '#8888aa', lineHeight: '1' }}>{d.date.getDate()}</span>
                    </div>
                    {/* Date info */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: isSelected ? '#f0f0ff' : '#c0c0d0' }}>
                        {d.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                      </p>
                      {d.available && timeRange && (
                        <p style={{ fontSize: '12px', color: isSelected ? '#818cf8' : '#8888aa', marginTop: '2px' }}>
                          {daySlots.length} slot range · {timeRange}
                        </p>
                      )}
                      {!d.available && (
                        <p style={{ fontSize: '12px', color: '#353550', marginTop: '2px' }}>Not available</p>
                      )}
                    </div>
                    {isSelected && <CheckCircle size={18} style={{ color: '#818cf8', flexShrink: 0 }} />}
                  </button>
                )
              })}
            </div>
            <button onClick={() => setDateLimit((p) => p + 60)}
              style={{ width: '100%', marginTop: '12px', padding: '10px', background: 'rgba(99,102,241,0.1)', border: '1px dashed rgba(99,102,241,0.3)', borderRadius: '10px', color: '#818cf8', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.2)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)' }}>
              Show 60 more dates
            </button>
          </div>

          {/* Right: Booking form */}
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '24px' }}>
            {!selectedDate ? (
              <div style={{ textAlign: 'center', padding: '48px 16px', color: '#555570' }}>
                <Calendar size={40} style={{ color: '#353550', marginBottom: '16px' }} />
                <p style={{ fontSize: '14px', fontWeight: '500' }}>Pick a date from the list to see available times.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#8888aa', marginBottom: '2px' }}>Selected Date</p>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0ff' }}>
                    {selectedDateObj?.dayName}, {selectedDateObj?.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                {loading ? (
                  <p style={{ color: '#8888aa', fontSize: '14px', textAlign: 'center', padding: '24px' }}>Loading available times...</p>
                ) : slots.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px', color: '#555570' }}>
                    <Clock size={32} style={{ color: '#353550', marginBottom: '12px' }} />
                    <p style={{ fontSize: '14px' }}>No available slots for this date.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '10px' }}><Clock size={14} /> Select Time</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', alignItems: 'end' }}>
                        <Select value={selectedHour} onChange={(v) => { setSelectedHour(Number(v)); setSelectedMinute('') }}
                          options={validHours.map((h) => ({ value: h, label: `${h}:00` }))} placeholder="Hour" />
                        <Select value={selectedMinute} onChange={(v) => setSelectedMinute(Number(v))}
                          options={validMinutes.map((m) => ({ value: m, label: String(m).padStart(2, '0') }))} placeholder="Min" />
                        <div style={{ padding: '12px 16px', color: '#8888aa', fontSize: '14px', fontWeight: '600', minWidth: '44px', textAlign: 'center' }}>
                          {slotTime() ? hourPeriod(slotTime()) : ''}
                        </div>
                      </div>
                      {selectedHour !== '' && selectedMinute !== '' && (
                        <p style={{ color: '#22d3a0', fontSize: '13px', fontWeight: '600', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle size={14} /> {selectedHour}:{String(selectedMinute).padStart(2, '0')} {slotTime() ? hourPeriod(slotTime()) : ''}
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}><FileText size={14} /> Reason (optional)</label>
                      <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
                        style={{ width: '100%', padding: '12px 16px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                        onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
                    </div>

                    <button onClick={handleBook} disabled={selectedHour === '' || selectedMinute === ''}
                      style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (selectedHour === '' || selectedMinute === '') ? 0.5 : 1, boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
                      <Calendar size={18} /> Book Appointment
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
