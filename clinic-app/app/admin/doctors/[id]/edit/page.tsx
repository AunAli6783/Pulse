'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Stethoscope, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminEditDoctor() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [qualification, setQualification] = useState('')
  const [experience, setExperience] = useState('')
  const [fee, setFee] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    fetch(`/api/doctors/${id}`).then((r) => r.json()).then((doc) => {
      setName(doc.user?.name || '')
      setEmail(doc.user?.email || '')
      setPhone(doc.user?.phone || '')
      setSpecialization(doc.specialization || '')
      setQualification(doc.qualification || '')
      setExperience(String(doc.experience || ''))
      setFee(String(doc.fee || ''))
      setBio(doc.bio || '')
      setLoading(false)
    })
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const res = await fetch(`/api/doctors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ specialization, qualification, experience: Number(experience), fee: Number(fee), bio }),
    })
    if (res.ok) {
      await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      })
      setMessage('Doctor updated successfully')
      setTimeout(() => router.push('/admin/doctors'), 1000)
    } else {
      const data = await res.json()
      setMessage(data.error || 'Failed to update')
    }
    setSaving(false)
  }

  const inputStyle = {
    width: '100%', marginTop: '6px', padding: '10px 14px', background: 'rgba(10,10,15,0.6)',
    border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
  }
  const labelStyle = { fontSize: '12px', fontWeight: '600', color: '#555570', textTransform: 'uppercase' as const, letterSpacing: '0.8px' }

  if (loading) return <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0f' }}><p style={{ color: '#8888aa' }}>Loading...</p></div>

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <Link href="/admin/doctors" style={{ color: '#8888aa', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', textDecoration: 'none' }}><ArrowLeft size={16} /> Back</Link>
          <Stethoscope size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Edit Doctor</h1>
        </div>
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '36px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div><label style={labelStyle}>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} /></div>
            <div><label style={labelStyle}>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} /></div>
            <div><label style={labelStyle}>Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} /></div>
            <div><label style={labelStyle}>Specialization</label>
              <input value={specialization} onChange={(e) => setSpecialization(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} /></div>
            <div><label style={labelStyle}>Qualification</label>
              <input value={qualification} onChange={(e) => setQualification(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Experience (years)</label>
                <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} /></div>
              <div><label style={labelStyle}>Fee (Rs.)</label>
                <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} /></div>
            </div>
            <div><label style={labelStyle}>Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4}
                style={{ ...inputStyle, resize: 'vertical' as const }}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} /></div>
            {message && (
              <p style={{ color: message.includes('successfully') ? '#22d3a0' : '#f43f5e', fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>{message}</p>
            )}
            <button onClick={handleSave} disabled={saving}
              style={{ width: '100%', padding: '12px', background: saving ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
