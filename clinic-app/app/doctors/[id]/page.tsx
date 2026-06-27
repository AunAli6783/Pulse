'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Stethoscope, DollarSign, Calendar, User as UserIcon } from 'lucide-react'

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()
  const [doctor, setDoctor] = useState<any>(null)

  useEffect(() => { fetch(`/api/doctors/${id}`).then((r) => r.json()).then(setDoctor) }, [id])

  if (!doctor) return <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0f', paddingTop: '64px' }}><p style={{ color: '#8888aa' }}>Loading...</p></div>

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px', paddingTop: '120px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '32px', fontWeight: '700', color: '#818cf8' }}>{doctor.user.name.charAt(0)}</span>
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f0f0ff', marginBottom: '4px', letterSpacing: '-0.5px' }}>{doctor.user.name}</h1>
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
      </div>
    </div>
  )
}
