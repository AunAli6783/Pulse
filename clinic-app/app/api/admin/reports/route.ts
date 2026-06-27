import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const appointments = await prisma.appointment.findMany({
    include: {
      doctor: { include: { user: { select: { name: true } } } },
      patient: { select: { id: true, name: true, email: true, phone: true } },
    },
    orderBy: { appointment_date: 'desc' },
  })

  const completed = appointments.filter((a) => a.status === 'completed')

  const monthlyMap = new Map<string, { count: number; revenue: number }>()
  for (const a of completed) {
    const month = new Date(a.appointment_date).toISOString().slice(0, 7)
    const existing = monthlyMap.get(month) || { count: 0, revenue: 0 }
    existing.count++
    existing.revenue += Number(a.doctor.fee)
    monthlyMap.set(month, existing)
  }

  const monthlyData = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 12)

  // Doctor performance
  const doctorMap = new Map<number, { name: string; specialization: string; total: number; completed: number; revenue: number }>()
  for (const a of appointments) {
    const id = a.doctor_id
    const existing = doctorMap.get(id) || { name: a.doctor.user.name, specialization: a.doctor.specialization, total: 0, completed: 0, revenue: 0 }
    existing.total++
    if (a.status === 'completed') { existing.completed++; existing.revenue += Number(a.doctor.fee) }
    doctorMap.set(id, existing)
  }
  const doctorPerformance = Array.from(doctorMap.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.total - a.total)

  // Patient history
  const patientMap = new Map<number, { name: string; email: string; phone: string | null; totalAppointments: number }>()
  for (const a of appointments) {
    const id = a.patient_id
    if (!a.patient) continue
    const existing = patientMap.get(id) || { name: a.patient.name, email: a.patient.email, phone: a.patient.phone, totalAppointments: 0 }
    existing.totalAppointments++
    patientMap.set(id, existing)
  }
  const patients = Array.from(patientMap.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.totalAppointments - a.totalAppointments)

  return NextResponse.json({ appointments, monthlyData, doctorPerformance, patients })
}
