'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Stethoscope, DollarSign, Calendar, User as UserIcon, Star, MessageSquare } from 'lucide-react'

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()
  const [doctor, setDoctor] = useState<any>(null)

  useEffect(() => { fetch(`/api/doctors/${id}`).then((r) => r.json()).then(setDoctor) }, [id])

  if (!doctor) return <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0f', paddingTop: '64px' }}><p style={{ color: '#8888aa' }}>Loading...</p></div>

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} fill={i < Math.round(rating) ? '#f59e0b' : 'none'} color="#f59e0b" style={{ opacity: i < Math.round(rating) ? 1 : 0.3 }} />
    ))
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px', paddingTop: '120px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Doctor Info */}
        <div style={{ backgroundColor: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '40px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '32px', fontWeight: '700', color: '#818cf8' }}>{doctor.user.name.charAt(0)}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>{doctor.user.name}</h1>
                {doctor.averageRating ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245,158,11,0.12)', padding: '4px 12px', borderRadius: '100px' }}>
                    {renderStars(doctor.averageRating)}
                    <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '700', marginLeft: '4px' }}>{doctor.averageRating}</span>
                    <span style={{ color: '#555570', fontSize: '12px' }}>({doctor.reviews?.length || 0})</span>
                  </div>
                ) : null}
              </div>
              <p style={{ color: '#818cf8', fontWeight: '600', fontSize: '15px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><Stethoscope size={16} /> {doctor.specialization}</p>
              <p style={{ color: '#8888aa', fontSize: '14px', marginBottom: '4px' }}>{doctor.qualification}</p>
              <p style={{ color: '#8888aa', fontSize: '14px', marginBottom: '16px' }}>{doctor.experience} years experience</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(99,102,241,0.12)', color: '#818cf8', padding: '6px 14px', borderRadius: '100px', fontSize: '15px', fontWeight: '700' }}>
                <DollarSign size={14} /> {Number(doctor.fee).toFixed(2)} / visit
              </span>
            </div>
          </div>
          {doctor.bio && (
            <div style={{ marginTop: '28px', paddingTop: '28px', borderTop: '1px solid rgba(42,42,58,0.6)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff', marginBottom: '8px' }}>About</h2>
              <p style={{ color: '#8888aa', fontSize: '14px', lineHeight: '1.7' }}>{doctor.bio}</p>
            </div>
          )}
          <div style={{ marginTop: '32px' }}>
            {session && (session.user as any).role === 'patient' ? (
              <Link href={`/dashboard/book/${doctor.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', textDecoration: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}>
                <Calendar size={18} /> Book Appointment
              </Link>
            ) : !session ? (
              <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', textDecoration: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}>
                <UserIcon size={18} /> Login to Book
              </Link>
            ) : null}
          </div>
        </div>

        {/* Reviews */}
        <div style={{ backgroundColor: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0ff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} style={{ color: '#6366f1' }} /> Patient Reviews
            {doctor.reviews?.length ? <span style={{ color: '#555570', fontSize: '14px', fontWeight: '500' }}>({doctor.reviews.length})</span> : null}
          </h2>
          {!doctor.reviews || doctor.reviews.length === 0 ? (
            <p style={{ color: '#555570', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No reviews yet. Be the first to leave a review after booking!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {doctor.reviews.map((r: any) => (
                <div key={r.id} style={{ padding: '16px 20px', background: 'rgba(10,10,15,0.4)', borderRadius: '12px', border: '1px solid rgba(42,42,58,0.5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#f0f0ff', fontWeight: '600', fontSize: '14px' }}>{r.patient?.name}</span>
                      <div style={{ display: 'flex', gap: '2px' }}>{renderStars(r.rating)}</div>
                    </div>
                    <span style={{ color: '#555570', fontSize: '11px' }}>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  {r.comment && <p style={{ color: '#8888aa', fontSize: '13px', lineHeight: '1.6' }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
