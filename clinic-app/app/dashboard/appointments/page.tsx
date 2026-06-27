'use client'

import { useEffect, useState } from 'react'
import AppointmentCard from '@/components/AppointmentCard'
import { Calendar, Star, X, MessageSquare, Send, Info, CircleHelp } from 'lucide-react'

const statusDescriptions: Record<string, string> = {
  upcoming: 'Confirmed future appointments. Your doctor is ready to see you.',
  completed: 'Past appointments that have been fulfilled. You can leave a rating.',
  cancelled: 'Appointments that were cancelled. Book a new slot if needed.',
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [reviewing, setReviewing] = useState<any>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [reviewedIds, setReviewedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetch('/api/appointments').then((r) => r.json()).then(async (apps) => {
      setAppointments(apps)
      const ids = new Set<number>()
      for (const a of apps) {
        if (a.status === 'completed') {
          const res = await fetch(`/api/reviews?appointment_id=${a.id}`)
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            ids.add(a.id)
          }
        }
      }
      setReviewedIds(ids)
    })
  }, [])

  const today = new Date().toISOString().split('T')[0]

  const filtered = appointments.filter((a: any) => {
    if (filter === 'upcoming') return a.appointment_date >= today && a.status !== 'cancelled' && a.status !== 'completed'
    if (filter === 'completed') return a.status === 'completed'
    if (filter === 'cancelled') return a.status === 'cancelled'
    return true
  })

  const cancelAppointment = async (id: number) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
    if (res.ok) {
      setAppointments((prev: any[]) => prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)))
    }
  }

  const submitReview = async () => {
    if (rating === 0 || !reviewing) return
    setError('')
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctor_id: reviewing.doctor_id, appointment_id: reviewing.id, rating, comment }),
    })
    const data = await res.json()
    if (res.ok) {
      setSubmitted(true)
      setReviewedIds((prev) => new Set(prev).add(reviewing.id))
      setTimeout(() => { setReviewing(null); setSubmitted(false); setRating(0); setComment('') }, 1500)
    } else {
      setError(data.error || 'Failed to submit review. Please try again.')
    }
  }

  const tabs = [
    { key: 'all', label: 'All', count: appointments.length },
    { key: 'upcoming', label: 'Upcoming', count: appointments.filter((a: any) => a.appointment_date >= today && a.status !== 'cancelled' && a.status !== 'completed').length },
    { key: 'completed', label: 'Completed', count: appointments.filter((a: any) => a.status === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: appointments.filter((a: any) => a.status === 'cancelled').length },
  ]

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Calendar size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>My Appointments</h1>
        </div>
        <p style={{ color: '#555570', fontSize: '13px', marginBottom: '24px', marginLeft: '34px' }}>
          View, manage, and review your appointments
        </p>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', background: filter === t.key ? 'rgba(99,102,241,0.2)' : 'rgba(22,22,31,0.7)', color: filter === t.key ? '#818cf8' : '#8888aa', border: filter === t.key ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(42,42,58,0.6)', transition: 'all 0.2s' }}>
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Status Description */}
        {filter !== 'all' && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
            <Info size={16} style={{ color: '#818cf8', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ color: '#8888aa', fontSize: '13px', lineHeight: '1.5' }}>{statusDescriptions[filter]}</p>
          </div>
        )}

        {filtered.length === 0 ? (
          <p style={{ color: '#555570', textAlign: 'center', padding: '60px 0', fontSize: '15px' }}>
            {filter === 'all' ? 'No appointments yet.' : `No ${filter} appointments.`}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered.map((appt: any) => (
              <div key={appt.id}>
                <AppointmentCard appointment={appt} />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
                  {appt.status === 'pending' && (
                    <button onClick={() => cancelAppointment(appt.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(244,63,94,0.12)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.25)'; e.currentTarget.style.borderColor = '#f43f5e' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.12)'; e.currentTarget.style.borderColor = 'rgba(244,63,94,0.3)' }}>
                      <X size={14} /> Cancel
                    </button>
                  )}
                  {appt.status === 'completed' && !reviewedIds.has(appt.id) && (
                    <button onClick={() => { setReviewing(appt); setRating(0); setComment('') }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.25)'; e.currentTarget.style.borderColor = '#f59e0b' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.12)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)' }}>
                      <Star size={14} /> Rate
                    </button>
                  )}
                  {appt.status === 'completed' && reviewedIds.has(appt.id) && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#22d3a0', fontSize: '12px', fontWeight: '500', padding: '6px 14px' }}>
                      <Star size={14} fill="#22d3a0" /> Reviewed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => { if (!submitted) setReviewing(null) }}>
          <div style={{ background: '#16161f', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '20px', padding: '32px', maxWidth: '420px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} style={{ color: '#6366f1' }} /> Rate Your Visit
              </h3>
              <button onClick={() => setReviewing(null)} style={{ background: 'none', border: 'none', color: '#555570', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <p style={{ color: '#8888aa', fontSize: '13px', marginBottom: '20px' }}>
              How was your appointment with <strong style={{ color: '#f0f0ff' }}>Dr. {reviewing.doctor?.user?.name}</strong>?
            </p>
            {submitted ? (
              <p style={{ color: '#22d3a0', fontSize: '15px', fontWeight: '600', textAlign: 'center', padding: '20px' }}>✓ Review submitted!</p>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setRating(n)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                      <Star size={28} fill={n <= rating ? '#f59e0b' : 'none'} color="#f59e0b" style={{ transition: 'all 0.15s', transform: n <= rating ? 'scale(1.1)' : 'scale(1)' }} />
                    </button>
                  ))}
                </div>
                <textarea placeholder="Share your experience (optional)" value={comment} onChange={(e) => setComment(e.target.value)} rows={3}
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none', resize: 'vertical', marginBottom: '12px' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
                {error && (
                  <p style={{ color: '#f43f5e', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>{error}</p>
                )}
                <button onClick={submitReview} disabled={rating === 0}
                  style={{ width: '100%', padding: '12px', background: rating === 0 ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: rating === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Send size={16} /> Submit Review
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
