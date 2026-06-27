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
    <div style={{
      background: 'rgba(22,22,31,0.7)',
      border: '1px solid rgba(42,42,58,0.6)',
      borderRadius: '14px',
      padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <p style={{ fontWeight: '600', color: '#f0f0ff', fontSize: '15px' }}>
            {appointment.doctor?.user.name || appointment.patient?.name}
          </p>
          <p style={{ fontSize: '13px', color: '#8888aa', marginTop: '2px' }}>
            {date} at {appointment.appointment_time}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>
      {appointment.reason && (
        <p style={{ fontSize: '13px', color: '#8888aa', marginTop: '8px' }}>{appointment.reason}</p>
      )}
    </div>
  )
}
