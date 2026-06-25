'use client'

import { useEffect, useState } from 'react'

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/prescriptions')
      .then((r) => r.json())
      .then(setPrescriptions)
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Prescriptions</h1>
      {prescriptions.length === 0 ? (
        <p className="text-gray-500">No prescriptions yet.</p>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx: any) => (
            <div key={rx.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-medium">Dr. {rx.doctor?.user?.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(rx.appointment?.appointment_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Medicines</h4>
                {JSON.parse(rx.medicines).map((med: any, i: number) => (
                  <div key={i} className="text-sm text-gray-600 mb-1">
                    {med.name} — {med.dosage}, {med.frequency} ({med.duration})
                  </div>
                ))}
              </div>
              {rx.instructions && (
                <div className="mt-3 text-sm text-gray-600">
                  <strong>Instructions:</strong> {rx.instructions}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
