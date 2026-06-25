'use client'

import { useEffect, useState } from 'react'
import DoctorCard from '@/components/DoctorCard'

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/doctors')
      .then((r) => r.json())
      .then(setDoctors)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Doctors</h1>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors.map((doctor: any) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  )
}
