'use client'

import { useEffect, useState } from 'react'
import { DollarSign, Calendar, CreditCard, CheckCircle, Clock } from 'lucide-react'
import { to12h } from '@/lib/time'
import PaymentBadge from '@/components/ui/PaymentBadge'

export default function PatientPayments() {
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/payments').then((r) => r.json()).then(setPayments)
  }, [])

  const totalPaid = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const totalPending = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0)

  const statBox = (label: string, value: string, icon: any, color: string) => {
    const Icon = icon
    return (
      <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '14px', padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Icon size={14} style={{ color }} />
          <p style={{ color: '#8888aa', fontSize: '11px', fontWeight: '500' }}>{label}</p>
        </div>
        <p style={{ fontSize: '22px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>{value}</p>
      </div>
    )
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <DollarSign size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Payment History</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
          {statBox('Total Paid', `$${totalPaid.toFixed(2)}`, CheckCircle, '#22d3a0')}
          {statBox('Pending', `$${totalPending.toFixed(2)}`, Clock, '#f59e0b')}
          {statBox('Total Payments', String(payments.length), CreditCard, '#818cf8')}
        </div>

        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', overflow: 'hidden' }}>
          {payments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#555570' }}>
              <DollarSign size={36} style={{ color: '#353550', marginBottom: '12px' }} />
              <p style={{ fontSize: '14px' }}>No payment records yet.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(10,10,15,0.5)' }}>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Doctor</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#8888aa', fontSize: '13px', letterSpacing: '0.5px' }}>Method</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.id} style={{ borderTop: '1px solid rgba(42,42,58,0.5)' }}>
                    <td style={{ padding: '14px 20px', color: '#f0f0ff', fontWeight: '500', fontSize: '14px' }}>{p.doctor?.user?.name}</td>
                    <td style={{ padding: '14px 20px', color: '#8888aa', fontSize: '13px' }}>
                      {new Date(p.appointment?.appointment_date).toLocaleDateString()} {to12h(p.appointment?.appointment_time)}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#22d3a0', fontWeight: '700', fontSize: '14px' }}>${p.amount.toFixed(2)}</td>
                    <td style={{ padding: '14px 20px' }}><PaymentBadge status={p.status} /></td>
                    <td style={{ padding: '14px 20px', color: '#8888aa', fontSize: '13px', textTransform: 'capitalize' }}>{p.payment_method || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
