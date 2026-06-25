'use client'

import { useEffect, useState } from 'react'

export default function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    appointment_id: '',
    patient_id: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
    instructions: '',
  })

  useEffect(() => {
    fetch('/api/prescriptions')
      .then((r) => r.json())
      .then(setPrescriptions)
    fetch('/api/appointments')
      .then((r) => r.json())
      .then((apps) => setAppointments(apps.filter((a: any) => a.status === 'completed')))
  }, [])

  const addMedicine = () => {
    setForm({ ...form, medicines: [...form.medicines, { name: '', dosage: '', frequency: '', duration: '' }] })
  }

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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Prescriptions</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          New Prescription
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Write Prescription</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Appointment</label>
              <select
                value={form.appointment_id}
                onChange={(e) => {
                  const appt = appointments.find((a: any) => a.id === Number(e.target.value))
                  setForm({ ...form, appointment_id: e.target.value, patient_id: appt?.patient_id || '' })
                }}
                className="w-full border rounded-lg px-4 py-2"
                required
              >
                <option value="">Select appointment</option>
                {appointments.map((a: any) => (
                  <option key={a.id} value={a.id}>
                    {a.patient?.name} - {new Date(a.appointment_date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Medicines</label>
              {form.medicines.map((med, i) => (
                <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                  <input placeholder="Name" value={med.name} onChange={(e) => updateMedicine(i, 'name', e.target.value)} className="border rounded px-2 py-1" />
                  <input placeholder="Dosage" value={med.dosage} onChange={(e) => updateMedicine(i, 'dosage', e.target.value)} className="border rounded px-2 py-1" />
                  <input placeholder="Frequency" value={med.frequency} onChange={(e) => updateMedicine(i, 'frequency', e.target.value)} className="border rounded px-2 py-1" />
                  <input placeholder="Duration" value={med.duration} onChange={(e) => updateMedicine(i, 'duration', e.target.value)} className="border rounded px-2 py-1" />
                </div>
              ))}
              <button type="button" onClick={addMedicine} className="text-blue-600 text-sm hover:underline">+ Add Medicine</button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Instructions</label>
              <textarea value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} rows={3} className="w-full border rounded-lg px-4 py-2" />
            </div>

            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Save Prescription
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {prescriptions.map((rx: any) => (
          <div key={rx.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="font-medium">Patient: {rx.patient?.name}</p>
            <p className="text-sm text-gray-500">{new Date(rx.created_at).toLocaleDateString()}</p>
            <div className="mt-3">
              {JSON.parse(rx.medicines).map((med: any, i: number) => (
                <p key={i} className="text-sm text-gray-600">{med.name} — {med.dosage}, {med.frequency} ({med.duration})</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
