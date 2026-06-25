export type Role = 'patient' | 'doctor' | 'admin'

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

export interface User {
  id: number
  name: string
  email: string
  role: Role
  phone: string | null
  created_at: Date
}

export interface Doctor {
  id: number
  user_id: number
  user?: User
  specialization: string
  qualification: string
  experience: number
  fee: number
  bio: string | null
  avatar: string | null
  is_active: boolean
}

export interface Availability {
  id: number
  doctor_id: number
  day_of_week: DayOfWeek
  start_time: string
  end_time: string
  slot_duration: number
}

export interface Appointment {
  id: number
  patient_id: number
  patient?: User
  doctor_id: number
  doctor?: Doctor & { user?: User }
  appointment_date: string
  appointment_time: string
  status: AppointmentStatus
  reason: string | null
  notes: string | null
  created_at: Date
}

export interface Prescription {
  id: number
  appointment_id: number
  appointment?: Appointment
  doctor_id: number
  doctor?: Doctor & { user?: User }
  patient_id: number
  patient?: User
  medicines: Medicine[]
  instructions: string | null
  created_at: Date
}

export interface Medicine {
  name: string
  dosage: string
  frequency: string
  duration: string
}
