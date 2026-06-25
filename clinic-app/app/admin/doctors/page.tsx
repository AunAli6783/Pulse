'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/doctors')
      .then((r) => r.json())
      .then(setDoctors)
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this doctor?')) return
    await fetch(`/api/doctors/${id}`, { method: 'DELETE' })
    setDoctors((prev: any[]) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Doctors</h1>
        <Link href="/admin/doctors/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Doctor
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Specialization</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Experience</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Fee</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc: any) => (
              <tr key={doc.id} className="border-t">
                <td className="px-6 py-4">{doc.user?.name}</td>
                <td className="px-6 py-4">{doc.specialization}</td>
                <td className="px-6 py-4">{doc.experience} yrs</td>
                <td className="px-6 py-4">${Number(doc.fee).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
