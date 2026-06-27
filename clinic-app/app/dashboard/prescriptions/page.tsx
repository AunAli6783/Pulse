'use client'

import { useEffect, useState } from 'react'
import { Pill } from 'lucide-react'

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])

  useEffect(() => { fetch('/api/prescriptions').then((r) => r.json()).then(setPrescriptions) }, [])

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <Pill size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>My Prescriptions</h1>
        </div>
        {prescriptions.length === 0 ? (
          <p style={{ color: '#555570', textAlign: 'center', padding: '60px 0', fontSize: '15px' }}>No prescriptions yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {prescriptions.map((rx: any) => (
              <div key={rx.id} style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontWeight: '600', color: '#f0f0ff' }}>Dr. {rx.doctor?.user?.name}</p>
                    <p style={{ fontSize: '13px', color: '#8888aa', marginTop: '2px' }}>{new Date(rx.appointment?.appointment_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(42,42,58,0.6)', paddingTop: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f0f0ff', marginBottom: '12px' }}>Medicines</h4>
                  {JSON.parse(rx.medicines).map((med: any, i: number) => (
                    <div key={i} style={{ fontSize: '13px', color: '#8888aa', marginBottom: '6px', padding: '8px 12px', background: 'rgba(10,10,15,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Pill size={14} style={{ color: '#818cf8', flexShrink: 0 }} />
                      {med.name} — {med.dosage}, {med.frequency} ({med.duration})
                    </div>
                  ))}
                </div>
                {rx.instructions && (
                  <div style={{ marginTop: '12px', fontSize: '13px', color: '#8888aa' }}>
                    <strong style={{ color: '#f0f0ff' }}>Instructions:</strong> {rx.instructions}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
