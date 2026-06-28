'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { User, Save, Eye, EyeOff } from 'lucide-react'

export default function ProfilePage() {
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

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }
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
    const data = await res.json()
    if (res.ok) {
      setMessage('Profile updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setTimeout(() => window.location.reload(), 1000)
    } else {
      setMessage(data.error || 'Failed to update profile')
    }
    setSaving(false)
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <User size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>My Profile</h1>
        </div>
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '36px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Name */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555570', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', marginTop: '6px', padding: '10px 14px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '15px', fontWeight: '500', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
            </div>
            {/* Email */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555570', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', marginTop: '6px', padding: '10px 14px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '15px', fontWeight: '500', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
            </div>
            {/* Role (read-only) */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555570', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Role</label>
              <p style={{ marginTop: '6px', fontSize: '15px', fontWeight: '500', color: '#8888aa', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
            {/* Divider */}
            <div style={{ borderTop: '1px solid rgba(42,42,58,0.6)', paddingTop: '24px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555570', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Change Password (optional)</label>
              {/* Current password */}
              <div style={{ position: 'relative', marginTop: '12px' }}>
                <input type={showCurrent ? 'text' : 'password'} placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 40px 10px 14px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
                <button onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555570', cursor: 'pointer', padding: '4px' }}>
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* New password */}
              <div style={{ position: 'relative', marginTop: '10px' }}>
                <input type={showNew ? 'text' : 'password'} placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 40px 10px 14px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} />
                <button onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555570', cursor: 'pointer', padding: '4px' }}>
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {/* Message */}
            {message && (
              <p style={{ color: message === 'Profile updated successfully' ? '#22d3a0' : '#f43f5e', fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>
                {message}
              </p>
            )}
            {/* Save button */}
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
