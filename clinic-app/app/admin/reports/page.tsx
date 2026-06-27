'use client'

import { useEffect, useState } from 'react'
import { BarChart3 } from 'lucide-react'

export default function AdminReports() {
  const [reports, setReports] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/reports').then((r) => r.json()).then(setReports)
  }, [])

  if (!reports) return <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0f', paddingTop: '64px' }}><p style={{ color: '#8888aa' }}>Loading...</p></div>

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <BarChart3 size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Reports & Analytics</h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff', marginBottom: '20px' }}>Monthly Revenue</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {reports.monthlyData?.map((m: any) => (
                <div key={m.month} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(10,10,15,0.3)', borderRadius: '8px' }}>
                  <span style={{ color: '#f0f0ff', fontSize: '14px', fontWeight: '500' }}>{m.month}</span>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ color: '#8888aa', fontSize: '13px' }}>{m.count} appts</span>
                    <span style={{ color: '#22d3a0', fontSize: '14px', fontWeight: '700' }}>${Number(m.revenue).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {(!reports.monthlyData || reports.monthlyData.length === 0) && (
                <p style={{ color: '#555570', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No completed appointments yet.</p>
              )}
            </div>
          </div>
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff', marginBottom: '20px' }}>Recent Appointments</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {reports.appointments?.slice(0, 10).map((a: any) => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(10,10,15,0.3)', borderRadius: '8px' }}>
                  <span style={{ color: '#f0f0ff', fontSize: '13px' }}>{a.patient?.name} → Dr. {a.doctor?.user?.name}</span>
                  <span style={{ color: '#8888aa', fontSize: '12px' }}>{new Date(a.appointment_date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
