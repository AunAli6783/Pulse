'use client'

import { useEffect, useState } from 'react'
import { Pill, Plus } from 'lucide-react'

export default function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    appointment_id: '', patient_id: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
    instructions: '',
  })

  useEffect(() => {
    fetch('/api/prescriptions').then((r) => r.json()).then(setPrescriptions)
    fetch('/api/appointments').then((r) => r.json()).then((apps) => setAppointments(apps.filter((a: any) => a.status === 'completed')))
  }, [])

  const addMedicine = () => setForm({ ...form, medicines: [...form.medicines, { name: '', dosage: '', frequency: '', duration: '' }] })
  const updateMedicine = (i: number, field: string, value: string) => {
    const meds = [...form.medicines]
    meds[i] = { ...meds[i], [field]: value }
    setForm({ ...form, medicines: meds })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/prescriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setShowForm(false)
      fetch('/api/prescriptions').then((r) => r.json()).then(setPrescriptions)
    }
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', background: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Pill size={24} style={{ color: '#6366f1' }} />
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>Prescriptions</h1>
          </div>
          <button onClick={() => setShowForm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
            <Plus size={16} /> New Prescription
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '16px', padding: '28px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0ff', marginBottom: '20px' }}>Write Prescription</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Appointment</label>
                <select value={form.appointment_id} onChange={(e) => {
                  const appt = appointments.find((a: any) => a.id === Number(e.target.value))
                  setForm({ ...form, appointment_id: e.target.value, patient_id: appt?.patient_id || '' })
                }} style={{ width: '100%', padding: '12px 16px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'}
                  required>
                  <option value="">Select appointment</option>
                  {appointments.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.patient?.name} - {new Date(a.appointment_date).toLocaleDateString()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '8px' }}>Medicines</label>
                {form.medicines.map((med, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <input placeholder="Name" value={med.name} onChange={(e) => updateMedicine(i, 'name', e.target.value)}
                      style={{ padding: '10px 12px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '8px', color: '#f0f0ff', fontSize: '13px', outline: 'none' }} />
                    <input placeholder="Dosage" value={med.dosage} onChange={(e) => updateMedicine(i, 'dosage', e.target.value)}
                      style={{ padding: '10px 12px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '8px', color: '#f0f0ff', fontSize: '13px', outline: 'none' }} />
                    <input placeholder="Frequency" value={med.frequency} onChange={(e) => updateMedicine(i, 'frequency', e.target.value)}
                      style={{ padding: '10px 12px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '8px', color: '#f0f0ff', fontSize: '13px', outline: 'none' }} />
                    <input placeholder="Duration" value={med.duration} onChange={(e) => updateMedicine(i, 'duration', e.target.value)}
                      style={{ padding: '10px 12px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '8px', color: '#f0f0ff', fontSize: '13px', outline: 'none' }} />
                  </div>
                ))}
                <button type="button" onClick={addMedicine} style={{ color: '#818cf8', background: 'none', border: 'none', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '4px' }}><Plus size={14} /> Add Medicine</button>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#8888aa', marginBottom: '6px' }}>Instructions</label>
                <textarea value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} rows={3}
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(10,10,15,0.6)', border: '1px solid rgba(42,42,58,0.8)', borderRadius: '10px', color: '#f0f0ff', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'rgba(42,42,58,0.8)'}
                />
              </div>
              <button type="submit"
                style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-start', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
                Save Prescription
              </button>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {prescriptions.map((rx: any) => (
            <div key={rx.id} style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '14px', padding: '20px' }}>
              <p style={{ fontWeight: '600', color: '#f0f0ff' }}>Patient: {rx.patient?.name}</p>
              <p style={{ fontSize: '13px', color: '#8888aa', marginTop: '2px' }}>{new Date(rx.created_at).toLocaleDateString()}</p>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {JSON.parse(rx.medicines).map((med: any, i: number) => (
                  <p key={i} style={{ fontSize: '13px', color: '#8888aa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Pill size={12} style={{ color: '#818cf8' }} /> {med.name} — {med.dosage}, {med.frequency} ({med.duration})
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
