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

  let payments
  if (role === 'patient') {
    payments = await prisma.payment.findMany({
      where: { patient_id: userId },
      include: {
        appointment: { select: { appointment_date: true, appointment_time: true, status: true } },
        doctor: { include: { user: { select: { name: true } } } },
      },
      orderBy: { created_at: 'desc' },
    })
  } else if (role === 'doctor') {
    const doctor = await prisma.doctor.findUnique({ where: { user_id: userId } })
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    payments = await prisma.payment.findMany({
      where: { doctor_id: doctor.id },
      include: {
        appointment: { select: { appointment_date: true, appointment_time: true, status: true } },
        patient: { select: { name: true, email: true } },
      },
      orderBy: { created_at: 'desc' },
    })
  } else {
    payments = await prisma.payment.findMany({
      include: {
        appointment: { select: { appointment_date: true, appointment_time: true, status: true } },
        patient: { select: { name: true } },
        doctor: { include: { user: { select: { name: true } } } },
      },
      orderBy: { created_at: 'desc' },
    })
  }

  return NextResponse.json(payments)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { appointment_id, amount } = await req.json()
  const user = session.user as any

  const appointment = await prisma.appointment.findUnique({
    where: { id: Number(appointment_id) },
    include: { doctor: true },
  })
  if (!appointment) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })

  if (user.role !== 'admin' && appointment.doctor_id !== Number(user.id) && user.role !== 'doctor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payment = await prisma.payment.create({
    data: {
      appointment_id: Number(appointment_id),
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      amount: amount || appointment.doctor.fee,
      status: 'pending',
    },
  })

  return NextResponse.json(payment)
}
