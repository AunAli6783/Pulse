'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [resetLink, setResetLink] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) { setSent(true); setResetLink(data.resetLink) }
    else setError(data.error || 'Something went wrong')
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', paddingTop: '80px', backgroundColor: '#0a0a0f' }}>
      <div style={{ background: 'rgba(22,22,31,0.9)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', backdropFilter: 'blur(12px)' }}>
        {!sent ? (
          <>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f0f0ff', textAlign: 'center', marginBottom: '8px' }}>Forgot Password</h1>
            <p style={{ color: '#8888aa', textAlign: 'center', fontSize: '14px', marginBottom: '32px' }}>Enter your email to reset your password</p>
            {error && <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555570' }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px 12px 40px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'} required />
                </div>
              </div>
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '12px', background: loading ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={48} style={{ color: '#22c55e', marginBottom: '16px' }} />
            <h2 style={{ color: '#f0f0ff', fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>Check Your Email</h2>
            <p style={{ color: '#8888aa', fontSize: '14px', marginBottom: '16px' }}>If an account exists with that email, a password reset link has been sent.</p>
            {resetLink && (
              <>
                <p style={{ color: '#555570', fontSize: '12px', marginBottom: '8px' }}>Dev mode — fallback link:</p>
                <div style={{ background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px', wordBreak: 'break-all' }}>
                  <a href={resetLink} style={{ color: '#818cf8', fontSize: '13px', textDecoration: 'none' }}>{resetLink}</a>
                </div>
              </>
            )}
            {!resetLink && <div style={{ marginBottom: '24px' }} />}
            <Link href="/login" style={{ color: '#818cf8', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        )}
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#555570' }}>
          Remember your password? <Link href="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '500' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
