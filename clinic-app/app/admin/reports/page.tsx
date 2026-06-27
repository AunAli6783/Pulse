'use client'

import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Users, Stethoscope, Calendar, Download, X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function AdminReports() {
  const [reports, setReports] = useState<any>(null)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/reports').then((r) => r.json()).then(setReports)
  }, [])

  if (!reports) return <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0f', paddingTop: '64px' }}><p style={{ color: '#8888aa' }}>Loading...</p></div>

  const exportCSV = (data: any[], filename: string, headers: string[], mapRow: (item: any) => string[]) => {
    const rows = data.map(mapRow)
    const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${v}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${filename}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const patientAppointments = selectedPatient
    ? reports.appointments.filter((a: any) => a.patient_id === selectedPatient.id)
    : []

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={24} style={{ color: '#6366f1' }} />
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Reports & Analytics</h1>
          </div>
          <button onClick={() => exportCSV(reports.appointments, 'all-appointments', ['Patient', 'Doctor', 'Date', 'Time', 'Status', 'Reason'], (a: any) => [a.patient?.name || '', a.doctor?.user?.name || '', new Date(a.appointment_date).toLocaleDateString(), a.appointment_time, a.status, a.reason || ''])}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Revenue Chart */}
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff' }}><TrendingUp size={16} style={{ color: '#6366f1', marginRight: '8px' }} /> Monthly Revenue</h2>
              <button onClick={() => exportCSV(reports.monthlyData, 'monthly-revenue', ['Month', 'Appointments', 'Revenue'], (m: any) => [m.month, m.count.toString(), m.revenue.toFixed(2)])}
                style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
                <Download size={14} /> CSV
              </button>
            </div>
            {reports.monthlyData?.length > 0 ? (
              <div style={{ width: '100%', height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[...reports.monthlyData].reverse()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,42,58,0.6)" />
                    <XAxis dataKey="month" tick={{ fill: '#555570', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#555570', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ background: '#1e1e2a', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '8px', color: '#f0f0ff', fontSize: '13px' }}
                      labelStyle={{ color: '#8888aa' }}
                    />
                    <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p style={{ color: '#555570', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>No completed appointments yet.</p>
            )}
          </div>

          {/* Revenue Table */}
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff', marginBottom: '16px' }}>Monthly Breakdown</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '260px', overflowY: 'auto' }}>
              {reports.monthlyData?.map((m: any) => (
                <div key={m.month} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(10,10,15,0.3)', borderRadius: '8px' }}>
                  <span style={{ color: '#f0f0ff', fontSize: '13px', fontWeight: '500' }}>{m.month}</span>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ color: '#8888aa', fontSize: '12px' }}>{m.count} apps</span>
                    <span style={{ color: '#22d3a0', fontSize: '13px', fontWeight: '700' }}>${Number(m.revenue).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {(!reports.monthlyData || reports.monthlyData.length === 0) && (
                <p style={{ color: '#555570', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No data yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Doctor Performance */}
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff' }}><Stethoscope size={16} style={{ color: '#6366f1', marginRight: '8px' }} /> Doctor Performance</h2>
            <button onClick={() => exportCSV(reports.doctorPerformance, 'doctor-performance', ['Doctor', 'Specialization', 'Total Appointments', 'Completed', 'Revenue'], (d: any) => [d.name, d.specialization, d.total.toString(), d.completed.toString(), d.revenue.toFixed(2)])}
              style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
              <Download size={14} /> CSV
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(10,10,15,0.5)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: '600', color: '#8888aa', fontSize: '12px', letterSpacing: '0.5px' }}>Doctor</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: '600', color: '#8888aa', fontSize: '12px', letterSpacing: '0.5px' }}>Specialization</th>
                  <th style={{ textAlign: 'center', padding: '10px 16px', fontWeight: '600', color: '#8888aa', fontSize: '12px', letterSpacing: '0.5px' }}>Appointments</th>
                  <th style={{ textAlign: 'center', padding: '10px 16px', fontWeight: '600', color: '#8888aa', fontSize: '12px', letterSpacing: '0.5px' }}>Completed</th>
                  <th style={{ textAlign: 'center', padding: '10px 16px', fontWeight: '600', color: '#8888aa', fontSize: '12px', letterSpacing: '0.5px' }}>Completion %</th>
                  <th style={{ textAlign: 'right', padding: '10px 16px', fontWeight: '600', color: '#8888aa', fontSize: '12px', letterSpacing: '0.5px' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {reports.doctorPerformance?.map((doc: any, i: number) => (
                  <tr key={doc.id} style={{ borderTop: '1px solid rgba(42,42,58,0.5)' }}>
                    <td style={{ padding: '10px 16px', color: '#f0f0ff', fontWeight: '500', fontSize: '13px' }}>{doc.name}</td>
                    <td style={{ padding: '10px 16px', color: '#8888aa', fontSize: '13px' }}>{doc.specialization}</td>
                    <td style={{ padding: '10px 16px', color: '#f0f0ff', fontSize: '13px', textAlign: 'center' }}>{doc.total}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                      <span style={{ color: doc.completed > 0 ? '#22d3a0' : '#555570', fontSize: '13px', fontWeight: '600' }}>{doc.completed}</span>
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                      <span style={{ color: '#8888aa', fontSize: '13px' }}>{doc.total > 0 ? Math.round(doc.completed / doc.total * 100) : 0}%</span>
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: '#22d3a0', fontWeight: '700', fontSize: '13px' }}>${doc.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient History */}
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff' }}><Users size={16} style={{ color: '#6366f1', marginRight: '8px' }} /> Patient History</h2>
            <button onClick={() => exportCSV(reports.patients, 'patient-history', ['Name', 'Email', 'Phone', 'Total Appointments'], (p: any) => [p.name, p.email, p.phone || '', p.totalAppointments.toString()])}
              style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
              <Download size={14} /> CSV
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(10,10,15,0.5)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: '600', color: '#8888aa', fontSize: '12px', letterSpacing: '0.5px' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: '600', color: '#8888aa', fontSize: '12px', letterSpacing: '0.5px' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: '600', color: '#8888aa', fontSize: '12px', letterSpacing: '0.5px' }}>Phone</th>
                  <th style={{ textAlign: 'center', padding: '10px 16px', fontWeight: '600', color: '#8888aa', fontSize: '12px', letterSpacing: '0.5px' }}>Appointments</th>
                  <th style={{ textAlign: 'center', padding: '10px 16px', fontWeight: '600', color: '#8888aa', fontSize: '12px', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.patients?.map((p: any) => (
                  <tr key={p.id} style={{ borderTop: '1px solid rgba(42,42,58,0.5)' }}>
                    <td style={{ padding: '10px 16px', color: '#f0f0ff', fontWeight: '500', fontSize: '13px' }}>{p.name}</td>
                    <td style={{ padding: '10px 16px', color: '#8888aa', fontSize: '13px' }}>{p.email}</td>
                    <td style={{ padding: '10px 16px', color: '#8888aa', fontSize: '13px' }}>{p.phone || '-'}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', color: '#f0f0ff', fontSize: '13px' }}>{p.totalAppointments}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                      <button onClick={() => setSelectedPatient(p)}
                        style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                        View History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Appointments */}
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0ff' }}><Calendar size={16} style={{ color: '#6366f1', marginRight: '8px' }} /> Recent Appointments</h2>
            <button onClick={() => exportCSV(reports.appointments.slice(0, 50), 'recent-appointments', ['Patient', 'Doctor', 'Date', 'Time', 'Status', 'Reason'], (a: any) => [a.patient?.name || '', a.doctor?.user?.name || '', new Date(a.appointment_date).toLocaleDateString(), a.appointment_time, a.status, a.reason || ''])}
              style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
              <Download size={14} /> CSV
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
            {reports.appointments?.slice(0, 20).map((a: any) => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(10,10,15,0.3)', borderRadius: '8px' }}>
                <div>
                  <span style={{ color: '#f0f0ff', fontSize: '13px' }}>{a.patient?.name}</span>
                  <span style={{ color: '#555570', fontSize: '12px', marginLeft: '8px' }}>→ Dr. {a.doctor?.user?.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#8888aa', fontSize: '12px' }}>{new Date(a.appointment_date).toLocaleDateString()}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize',
                    background: a.status === 'completed' ? 'rgba(34,211,160,0.15)' : a.status === 'cancelled' ? 'rgba(244,63,94,0.15)' : a.status === 'confirmed' ? 'rgba(99,102,241,0.15)' : 'rgba(245,158,11,0.15)',
                    color: a.status === 'completed' ? '#22d3a0' : a.status === 'cancelled' ? '#f43f5e' : a.status === 'confirmed' ? '#818cf8' : '#f59e0b',
                  }}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient History Modal */}
        {selectedPatient && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
            onClick={() => setSelectedPatient(null)}>
            <div style={{ background: '#16161f', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '20px', padding: '32px', maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0ff' }}>{selectedPatient.name}</h3>
                  <p style={{ color: '#8888aa', fontSize: '13px', marginTop: '2px' }}>{selectedPatient.email} {selectedPatient.phone && `· ${selectedPatient.phone}`}</p>
                </div>
                <button onClick={() => setSelectedPatient(null)} style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#f43f5e', display: 'flex', alignItems: 'center' }}>
                  <X size={16} />
                </button>
              </div>
              <p style={{ color: '#555570', fontSize: '13px', marginBottom: '16px' }}>{patientAppointments.length} appointment(s)</p>
              {patientAppointments.length === 0 ? (
                <p style={{ color: '#555570', fontSize: '14px', textAlign: 'center', padding: '24px' }}>No appointments found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {patientAppointments.map((a: any) => (
                    <div key={a.id} style={{ padding: '12px 16px', background: 'rgba(10,10,15,0.4)', borderRadius: '10px', border: '1px solid rgba(42,42,58,0.5)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ color: '#f0f0ff', fontSize: '13px', fontWeight: '600' }}>Dr. {a.doctor?.user?.name}</span>
                        <span style={{
                          padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', textTransform: 'capitalize',
                          background: a.status === 'completed' ? 'rgba(34,211,160,0.15)' : a.status === 'cancelled' ? 'rgba(244,63,94,0.15)' : a.status === 'confirmed' ? 'rgba(99,102,241,0.15)' : 'rgba(245,158,11,0.15)',
                          color: a.status === 'completed' ? '#22d3a0' : a.status === 'cancelled' ? '#f43f5e' : a.status === 'confirmed' ? '#818cf8' : '#f59e0b',
                        }}>{a.status}</span>
                      </div>
                      <p style={{ color: '#8888aa', fontSize: '12px' }}>{new Date(a.appointment_date).toLocaleDateString()} at {a.appointment_time} · {a.doctor.specialization}</p>
                      {a.reason && <p style={{ color: '#555570', fontSize: '12px', marginTop: '4px' }}>{a.reason}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
