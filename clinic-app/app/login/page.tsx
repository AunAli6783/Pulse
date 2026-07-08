'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) setError('Invalid credentials')
    else router.push('/')
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', paddingTop: '80px', backgroundColor: '#0a0a0f' }}>
      <div style={{ background: 'rgba(22,22,31,0.9)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', backdropFilter: 'blur(12px)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', textAlign: 'center', marginBottom: '8px', letterSpacing: '-0.5px' }}>Welcome back</h1>
        <p style={{ color: '#8888aa', textAlign: 'center', fontSize: '14px', marginBottom: '32px' }}>Sign in to your account</p>
        {error && <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555570' }} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 40px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'}
                required />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555570' }} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 40px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'}
                required />
            </div>
            <div style={{ textAlign: 'right', marginTop: '4px' }}>
              <Link href="/forgot-password" style={{ color: '#818cf8', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</Link>
            </div>
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.3)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.5)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.3)'}>
            <LogIn size={18} /> Sign In
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#555570' }}>
          Don't have an account? <Link href="/register" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '500' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}
