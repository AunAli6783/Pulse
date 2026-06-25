import StatusBadge from './ui/StatusBadge'

interface Doctor {
  user: { name: string }
}

interface Appointment {
  id: number
  appointment_date: string
  appointment_time: string
  status: string
  reason: string | null
  doctor?: Doctor
  patient?: { name: string }
}

export default function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const date = new Date(appointment.appointment_date).toLocaleDateString()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium">
            {appointment.doctor?.user.name || appointment.patient?.name}
          </p>
          <p className="text-sm text-gray-500">
            {date} at {appointment.appointment_time}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>
      {appointment.reason && (
        <p className="text-sm text-gray-600 mt-1">{appointment.reason}</p>
      )}
    </div>
  )
}
