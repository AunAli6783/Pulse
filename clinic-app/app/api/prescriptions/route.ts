import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as any
  const userId = Number(user.id)

  if (user.role === 'patient') {
    const prescriptions = await prisma.prescription.findMany({
      where: { patient_id: userId },
      include: {
        doctor: { include: { user: { select: { name: true } } } },
        appointment: { select: { appointment_date: true } },
      },
      orderBy: { created_at: 'desc' },
    })
    return NextResponse.json(prescriptions)
  }

  if (user.role === 'doctor') {
    const doctor = await prisma.doctor.findUnique({ where: { user_id: userId } })
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    const prescriptions = await prisma.prescription.findMany({
      where: { doctor_id: doctor.id },
      include: { patient: { select: { name: true } }, appointment: { select: { appointment_date: true } } },
      orderBy: { created_at: 'desc' },
    })
    return NextResponse.json(prescriptions)
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'doctor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { appointment_id, patient_id, medicines, instructions } = await req.json()
  const userId = Number((session.user as any).id)
  const doctor = await prisma.doctor.findUnique({ where: { user_id: userId } })
  if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })

  const prescription = await prisma.prescription.create({
    data: {
      appointment_id: Number(appointment_id),
      doctor_id: doctor.id,
      patient_id: Number(patient_id),
      medicines: JSON.stringify(medicines),
      instructions,
    },
  })

  return NextResponse.json(prescription)
}
