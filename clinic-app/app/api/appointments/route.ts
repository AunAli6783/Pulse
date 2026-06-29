import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as any
  const role = user.role
  const userId = Number(user.id)

  let appointments
  if (role === 'patient') {
    appointments = await prisma.appointment.findMany({
      where: { patient_id: userId },
      include: { doctor: { include: { user: { select: { name: true } } } } },
      orderBy: { appointment_date: 'desc' },
    })
  } else if (role === 'doctor') {
    const doctor = await prisma.doctor.findUnique({ where: { user_id: userId } })
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    appointments = await prisma.appointment.findMany({
      where: { doctor_id: doctor.id },
      include: { patient: { select: { id: true, name: true, email: true, phone: true } } },
      orderBy: { appointment_date: 'desc' },
    })
  } else {
    appointments = await prisma.appointment.findMany({
      include: {
        patient: { select: { id: true, name: true } },
        doctor: { include: { user: { select: { name: true } } } },
      },
      orderBy: { appointment_date: 'desc' },
    })
  }

  return NextResponse.json(appointments)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'patient') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { doctor_id, appointment_date, appointment_time, reason } = await req.json()
  const patientId = Number((session.user as any).id)

  const appointment = await prisma.appointment.create({
    data: {
      patient_id: patientId,
      doctor_id: Number(doctor_id),
      appointment_date: new Date(appointment_date),
      appointment_time,
      reason,
    },
  })

  return NextResponse.json(appointment)
}
