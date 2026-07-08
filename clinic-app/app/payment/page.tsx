'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CreditCard, CheckCircle, ArrowRight } from 'lucide-react'

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const userId = searchParams.get('userId')
  const [status, setStatus] = useState<'loading' | 'pending' | 'paid' | 'error'>('loading')
  const [paymentInfo, setPaymentInfo] = useState<{ amount: number; created_at: string } | null>(null)

  useEffect(() => {
    if (!userId) { setStatus('error'); return }
    fetch(`/api/payments/register?userId=${userId}`)
      .then(r => r.json())
      .then(d => {
        if (d.paid) { setStatus('paid'); return }
        setPaymentInfo(d)
        setStatus('pending')
      })
      .catch(() => setStatus('error'))
  }, [userId])

  const handlePay = async () => {
    setStatus('loading')
    try {
      const res = await fetch('/api/payments/register', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: Number(userId) }),
      })
      if (res.ok) setStatus('paid')
      else setStatus('error')
    } catch { setStatus('error') }
  }

  if (status === 'loading') {
    return (
      <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0f' }}>
        <div style={{ color: '#8888aa', fontSize: '16px' }}>Loading...</div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0f' }}>
        <div style={{ background: 'rgba(22,22,31,0.9)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '40px', maxWidth: '420px', textAlign: 'center' }}>
          <div style={{ color: '#f43f5e', fontSize: '40px', marginBottom: '16px' }}>!</div>
          <h2 style={{ color: '#f0f0ff', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Something went wrong</h2>
          <p style={{ color: '#8888aa', fontSize: '14px', marginBottom: '24px' }}>Invalid payment link. Please contact support.</p>
          <button onClick={() => router.push('/register')}
            style={{ padding: '12px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Back to Register
          </button>
        </div>
      </div>
    )
  }

  if (status === 'paid') {
    return (
      <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0f' }}>
        <div style={{ background: 'rgba(22,22,31,0.9)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '40px', maxWidth: '420px', textAlign: 'center' }}>
          <CheckCircle size={48} style={{ color: '#22c55e', marginBottom: '16px' }} />
          <h2 style={{ color: '#f0f0ff', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Payment Successful!</h2>
          <p style={{ color: '#8888aa', fontSize: '14px', marginBottom: '24px' }}>Your account is now active. You can log in and book appointments.</p>
          <button onClick={() => router.push('/login')}
            style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Login Now <ArrowRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: '#0a0a0f' }}>
      <div style={{ background: 'rgba(22,22,31,0.9)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', backdropFilter: 'blur(12px)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <CreditCard size={40} style={{ color: '#6366f1', marginBottom: '12px' }} />
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f0f0ff', marginBottom: '4px', letterSpacing: '-0.5px' }}>Registration Fee</h1>
          <p style={{ color: '#8888aa', fontSize: '14px' }}>One-time payment to activate your account</p>
        </div>

        <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ color: '#8888aa', fontSize: '13px', marginBottom: '4px' }}>Amount Due</p>
          <p style={{ fontSize: '36px', fontWeight: '800', color: '#f0f0ff' }}>Rs. {paymentInfo?.amount || 500}</p>
        </div>

        <button onClick={handlePay}
          style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.5)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.3)'}>
          <CreditCard size={18} /> Pay Now (Simulated)
        </button>

        <p style={{ color: '#555570', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
          This is a simulated payment for demo purposes. No real charge will be made.
        </p>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0f' }}>
      <div style={{ color: '#8888aa', fontSize: '16px' }}>Loading...</div>
    </div>}>
      <PaymentContent />
    </Suspense>
  )
}
