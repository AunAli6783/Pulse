import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendAppointmentUpdate } from '@/lib/email'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status } = await req.json()
  const user = session.user as any

  if (user.role === 'doctor' || user.role === 'admin') {
    const appointment = await prisma.appointment.update({
      where: { id: Number(id) },
      data: { status },
      include: { doctor: { include: { user: { select: { name: true, email: true } } } }, patient: { select: { name: true, email: true } } },
    })

    sendAppointmentUpdate(appointment.patient.email, appointment.patient.name, appointment.doctor.user.name, appointment.appointment_date.toISOString(), status)

    if (status === 'completed') {
      const existing = await prisma.payment.findUnique({
        where: { appointment_id: Number(id) },
      })
      if (!existing) {
        await prisma.payment.create({
          data: {
            appointment_id: Number(id),
            patient_id: appointment.patient_id,
            doctor_id: appointment.doctor_id,
            amount: appointment.doctor.fee,
            status: 'pending',
          },
        })
      }
    }

    return NextResponse.json(appointment)
  }

  if (user.role === 'patient' && status === 'cancelled') {
    const appointment = await prisma.appointment.update({
      where: { id: Number(id), patient_id: Number(user.id) },
      data: { status: 'cancelled' },
    })
    return NextResponse.json(appointment)
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const user = session.user as any

  const appointment = await prisma.appointment.findUnique({ where: { id: Number(id) } })
  if (!appointment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (user.role === 'patient' && appointment.patient_id === Number(user.id)) {
    await prisma.appointment.update({
      where: { id: Number(id) },
      data: { status: 'cancelled' },
    })
    return NextResponse.json({ message: 'Cancelled' })
  }

  if (user.role === 'admin') {
    await prisma.appointment.delete({ where: { id: Number(id) } })
    return NextResponse.json({ message: 'Deleted' })
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
