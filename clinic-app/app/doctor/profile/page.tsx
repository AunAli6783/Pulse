'use client'

import { useSession } from 'next-auth/react'

export default function DoctorProfile() {
  const { data: session } = useSession()
  const user = session?.user as any

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-4">
          <div><label className="text-sm text-gray-500">Name</label><p className="font-medium">{user?.name}</p></div>
          <div><label className="text-sm text-gray-500">Email</label><p className="font-medium">{user?.email}</p></div>
          <div><label className="text-sm text-gray-500">Role</label><p className="font-medium capitalize">{user?.role}</p></div>
        </div>
      </div>
    </div>
  )
}
