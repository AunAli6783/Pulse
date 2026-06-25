import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  const [patients, todayApps, monthApps, doctors, appointments] = await Promise.all([
    prisma.user.count({ where: { role: 'patient' } }),
    prisma.appointment.count({
      where: { appointment_date: { gte: today, lt: new Date(today.getTime() + 86400000) } },
    }),
    prisma.appointment.count({ where: { created_at: { gte: monthStart } } }),
    prisma.doctor.count(),
    prisma.appointment.findMany({
      where: { created_at: { gte: monthStart } },
      include: { doctor: true },
    }),
  ])

  const revenue = monthApps * 0
  const doctorFees = await prisma.doctor.findMany({ select: { id: true, fee: true } })
  const feeMap = new Map(doctorFees.map((d) => [d.id, Number(d.fee)]))
  const totalRevenue = appointments.reduce((sum, a) => sum + (feeMap.get(a.doctor_id) || 0), 0)

  const doctorCounts = appointments.reduce<Record<number, number>>((acc, a) => {
    acc[a.doctor_id] = (acc[a.doctor_id] || 0) + 1
    return acc
  }, {})

  const statusBreakdown = await prisma.appointment.groupBy({
    by: ['status'],
    _count: true,
  })

  return NextResponse.json({
    totalPatients: patients,
    todayAppointments: todayApps,
    monthlyAppointments: monthApps,
    totalDoctors: doctors,
    monthlyRevenue: totalRevenue,
    statusBreakdown: statusBreakdown.map((s) => ({ status: s.status, count: s._count })),
    topDoctors: Object.entries(doctorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5),
  })
}
