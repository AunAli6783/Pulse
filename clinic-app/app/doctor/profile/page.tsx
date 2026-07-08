'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { User, Save, Eye, EyeOff, Stethoscope, BookOpen, Award, DollarSign, Camera } from 'lucide-react'

export default function DoctorProfile() {
  const { data: session } = useSession()
  const user = session?.user as any

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const [specialization, setSpecialization] = useState('')
  const [qualification, setQualification] = useState('')
  const [experience, setExperience] = useState('')
  const [fee, setFee] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [doctorId, setDoctorId] = useState<number | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }
    fetch('/api/doctors/me').then(r => r.json()).then(d => {
      if (d.id) {
        setDoctorId(d.id)
        setSpecialization(d.specialization || '')
        setQualification(d.qualification || '')
        setExperience(String(d.experience || ''))
        setFee(String(d.fee || ''))
        setBio(d.bio || '')
        setAvatar(d.avatar || '')
      }
    })
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const body: Record<string, any> = { name, email }
    if (newPassword) {
      body.currentPassword = currentPassword
      body.newPassword = newPassword
    }
    const res = await fetch('/api/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const data = await res.json()
      setMessage(data.error || 'Failed to update profile')
      setSaving(false)
      return
    }

    if (doctorId) {
      const docData: any = { specialization, qualification, experience: Number(experience), fee: Number(fee), bio }
      if (avatarFile) {
        const reader = new FileReader()
        reader.readAsDataURL(avatarFile)
        await new Promise<void>((resolve) => { reader.onload = () => { docData.avatar = reader.result; resolve() } })
      }
      await fetch(`/api/doctors/${doctorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData),
      })
    }

    setMessage('Profile updated successfully')
    setCurrentPassword('')
    setNewPassword('')
    setTimeout(() => window.location.reload(), 1000)
    setSaving(false)
  }

  const inputStyle = {
    width: '100%', marginTop: '6px', padding: '10px 14px', background: 'rgba(10,10,15,0.6)',
    border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff',
    fontSize: '15px', fontWeight: '500', outline: 'none', boxSizing: 'border-box' as const,
  }

  const labelStyle = { fontSize: '12px', fontWeight: '600', color: '#555570', textTransform: 'uppercase' as const, letterSpacing: '0.8px' }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <User size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>My Profile</h1>
        </div>
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '36px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div><label style={labelStyle}>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} /></div>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(99,102,241,0.15)', border: '2px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {avatar ? <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <User size={28} style={{ color: '#818cf8' }} />}
              </div>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#818cf8', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                <Camera size={14} /> {avatar ? 'Change Photo' : 'Upload Photo'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) { setAvatarFile(file); setAvatar(URL.createObjectURL(file)) }
                }} />
              </label>
            </div>
            <div><label style={labelStyle}>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} /></div>
            <div><label style={labelStyle}>Role</label>
              <p style={{ marginTop: '6px', fontSize: '15px', fontWeight: '500', color: '#8888aa', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>

            <div style={{ borderTop: '1px solid rgba(42,42,58,0.6)', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f0f0ff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Stethoscope size={16} style={{ color: '#6366f1' }} /> Professional Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div><label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}><BookOpen size={13} /> Specialization</label>
                  <input value={specialization} onChange={(e) => setSpecialization(e.target.value)} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} /></div>
                <div><label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}><Award size={13} /> Qualification</label>
                  <input value={qualification} onChange={(e) => setQualification(e.target.value)} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div><label style={labelStyle}>Experience (years)</label>
                    <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#6366f1'}
                      onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} /></div>
                  <div><label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}><DollarSign size={13} /> Fee (Rs.)</label>
                    <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#6366f1'}
                      onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} /></div>
                </div>
                <div><label style={labelStyle}>Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4}
                    style={{ ...inputStyle, resize: 'vertical' as const }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} /></div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(42,42,58,0.6)', paddingTop: '24px' }}>
              <label style={labelStyle}>Change Password (optional)</label>
              <div style={{ position: 'relative', marginTop: '12px' }}>
                <input type={showCurrent ? 'text' : 'password'} placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 40px 10px 14px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
                <button onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555570', cursor: 'pointer', padding: '4px' }}>
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
              <div style={{ position: 'relative', marginTop: '10px' }}>
                <input type={showNew ? 'text' : 'password'} placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 40px 10px 14px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
                <button onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555570', cursor: 'pointer', padding: '4px' }}>
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>

            {message && (
              <p style={{ color: message === 'Profile updated successfully' ? '#22d3a0' : '#f43f5e', fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>
                {message}
              </p>
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
