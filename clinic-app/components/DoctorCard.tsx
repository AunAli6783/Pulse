import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'

interface Doctor {
  id: number
  user: { name: string; email: string }
  specialization: string
  experience: number
  fee: number
}

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Link href={`/doctors/${doctor.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-blue-600">
            {doctor.user.name.charAt(0)}
          </span>
        </div>
        <h3 className="font-semibold text-lg">{doctor.user.name}</h3>
        <p className="text-gray-500 text-sm">{doctor.specialization}</p>
        <p className="text-gray-400 text-sm">{doctor.experience} years exp.</p>
        <p className="text-blue-600 font-medium mt-2">${Number(doctor.fee).toFixed(2)}</p>
      </div>
    </Link>
  )
}
