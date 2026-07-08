'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Lock, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div style={{ textAlign: 'center', color: '#f43f5e', padding: '40px' }}>
        <p style={{ fontSize: '16px', fontWeight: '600' }}>Invalid reset link</p>
        <Link href="/forgot-password" style={{ color: '#818cf8', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '16px' }}>
          <ArrowLeft size={14} /> Request a new one
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) setSuccess(true)
    else setError(data.error || 'Something went wrong')
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <CheckCircle size={48} style={{ color: '#22c55e', marginBottom: '16px' }} />
        <h2 style={{ color: '#f0f0ff', fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>Password Reset Successful</h2>
        <p style={{ color: '#8888aa', fontSize: '14px', marginBottom: '24px' }}>You can now log in with your new password.</p>
        <Link href="/login" style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f0f0ff', textAlign: 'center', marginBottom: '8px' }}>Reset Password</h1>
      <p style={{ color: '#8888aa', textAlign: 'center', fontSize: '14px', marginBottom: '32px' }}>Enter your new password</p>
      {error && <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>New Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555570' }} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 40px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} required />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555570' }} />
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 40px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} required />
          </div>
        </div>
        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '12px', background: loading ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', paddingTop: '80px', backgroundColor: '#0a0a0f' }}>
      <div style={{ background: 'rgba(22,22,31,0.9)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', backdropFilter: 'blur(12px)' }}>
        <Suspense fallback={<p style={{ color: '#8888aa', textAlign: 'center' }}>Loading...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
