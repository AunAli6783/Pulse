'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function BookAppointmentPage() {
  const { 'doctor-id': doctorId } = useParams<{ 'doctor-id': string }>()
  const { data: session } = useSession()
  const router = useRouter()
  const [doctor, setDoctor] = useState<any>(null)
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    fetch(`/api/doctors/${doctorId}`)
      .then((r) => r.json())
      .then(setDoctor)
  }, [doctorId])

  useEffect(() => {
    if (!date) return
    setSelectedSlot('')
    fetch(`/api/availability/${doctorId}/${date}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots))
  }, [date, doctorId])

  const handleBook = async () => {
    if (!date || !selectedSlot) return
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctor_id: Number(doctorId),
        appointment_date: date,
        appointment_time: selectedSlot,
        reason,
      }),
    })
    if (res.ok) {
      router.push('/dashboard/appointments')
    }
  }

  if (!doctor) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold mb-2">Book Appointment</h1>
        <p className="text-gray-500 mb-6">with {doctor.user.name}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {slots.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Slots</label>
              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition ${
                      selectedSlot === slot
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 hover:border-blue-500'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {date && slots.length === 0 && (
            <p className="text-gray-500 text-sm">No available slots for this date.</p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleBook}
            disabled={!date || !selectedSlot}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  )
}
