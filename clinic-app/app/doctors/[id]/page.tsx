'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()
  const [doctor, setDoctor] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/doctors/${id}`)
      .then((r) => r.json())
      .then(setDoctor)
  }, [id])

  if (!doctor) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-blue-600">
              {doctor.user.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{doctor.user.name}</h1>
            <p className="text-blue-600 font-medium mb-1">{doctor.specialization}</p>
            <p className="text-gray-500 mb-1">{doctor.qualification}</p>
            <p className="text-gray-500 mb-1">{doctor.experience} years experience</p>
            <p className="text-lg font-semibold text-blue-600">${Number(doctor.fee).toFixed(2)} / visit</p>
          </div>
        </div>
        {doctor.bio && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">About</h2>
            <p className="text-gray-600">{doctor.bio}</p>
          </div>
        )}
        {session && (session.user as any).role === 'patient' && (
          <Link
            href={`/dashboard/book/${doctor.id}`}
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Book Appointment
          </Link>
        )}
        {!session && (
          <Link
            href="/login"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Login to Book
          </Link>
        )}
      </div>
    </div>
  )
}
