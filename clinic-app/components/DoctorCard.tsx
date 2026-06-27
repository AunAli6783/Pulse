import Link from 'next/link'
import { useState } from 'react'
import { Stethoscope, DollarSign } from 'lucide-react'

interface Doctor {
  id: number; user: { name: string; email: string }; specialization: string; experience: number; fee: number
}

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/doctors/${doctor.id}`} style={{ textDecoration: 'none' }}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? 'rgba(30,30,42,0.9)' : 'rgba(22,22,31,0.7)', border: hovered ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px', transition: 'all 0.25s ease', boxShadow: hovered ? '0 8px 30px rgba(99,102,241,0.15)' : 'none' }}>
        <div style={{ width: '56px', height: '56px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '22px', fontWeight: '700', color: '#818cf8' }}>{doctor.user.name.charAt(0)}</span>
        </div>
        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#f0f0ff', marginBottom: '4px' }}>{doctor.user.name}</h3>
        <p style={{ color: '#8888aa', fontSize: '13px', marginBottom: '4px' }}>{doctor.specialization}</p>
        <p style={{ color: '#555570', fontSize: '13px', marginBottom: '12px' }}>{doctor.experience} years exp.</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(99,102,241,0.12)', color: '#818cf8', padding: '4px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: '600' }}>
          <DollarSign size={12} /> {Number(doctor.fee).toFixed(2)}
        </div>
      </div>
    </Link>
  )
}
