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
      include: { doctor: { include: { user: { select: { name: true } } } }, payment: { select: { id: true, status: true, amount: true } } },
      orderBy: { appointment_date: 'desc' },
    })
  } else if (role === 'doctor') {
    const doctor = await prisma.doctor.findUnique({ where: { user_id: userId } })
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    appointments = await prisma.appointment.findMany({
      where: { doctor_id: doctor.id },
      include: { patient: { select: { id: true, name: true, email: true, phone: true, paid: true } }, payment: { select: { id: true, status: true, amount: true } } },
      orderBy: { appointment_date: 'desc' },
    })
  } else {
    appointments = await prisma.appointment.findMany({
      include: {
        patient: { select: { id: true, name: true, paid: true } },
        doctor: { include: { user: { select: { name: true } } } },
        payment: { select: { id: true, status: true, amount: true } },
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

  if (!appointment_date || !appointment_time) {
    return NextResponse.json({ error: 'Date and time are required' }, { status: 400 })
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/
  const timePattern = /^\d{2}:\d{2}$/
  if (!datePattern.test(appointment_date) || !timePattern.test(appointment_time)) {
    return NextResponse.json({ error: 'Invalid date or time format' }, { status: 400 })
  }

  const [y, m, d] = appointment_date.split('-').map(Number)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const apptDate = new Date(y, m - 1, d)
  if (apptDate < today) {
    return NextResponse.json({ error: 'Cannot book appointments in the past' }, { status: 400 })
  }

  const dayOfWeek = apptDate.toLocaleDateString('en-US', { weekday: 'short' })

  const allAvailability = await prisma.availability.findMany({
    where: {
      doctor_id: Number(doctor_id),
      day_of_week: { equals: dayOfWeek },
    },
  })

  if (allAvailability.length === 0) {
    return NextResponse.json({ error: 'Doctor not available on this day' }, { status: 400 })
  }

  const [timeH, timeM] = appointment_time.split(':').map(Number)
  const slotMinutes = timeH * 60 + timeM

  const isValidSlot = allAvailability.some((a) => {
    const [startH, startM] = a.start_time.split(':').map(Number)
    const [endH, endM] = a.end_time.split(':').map(Number)
    const startMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM
    return slotMinutes >= startMinutes && slotMinutes + a.slot_duration <= endMinutes
  })

  if (!isValidSlot) {
    return NextResponse.json({ error: 'Selected time is outside available slots' }, { status: 400 })
  }

  const existing = await prisma.appointment.findFirst({
    where: {
      doctor_id: Number(doctor_id),
      appointment_date: new Date(appointment_date + 'T00:00:00.000Z'),
      appointment_time,
      status: { notIn: ['cancelled'] },
    },
  })

  if (existing) {
    return NextResponse.json({ error: 'This time slot is already booked' }, { status: 409 })
  }

  const appointment = await prisma.appointment.create({
    data: {
      patient_id: patientId,
      doctor_id: Number(doctor_id),
      appointment_date: new Date(appointment_date + 'T00:00:00.000Z'),
      appointment_time,
      reason,
    },
  })

  return NextResponse.json(appointment)
}
