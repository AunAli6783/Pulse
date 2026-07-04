import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'doctor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = Number((session.user as any).id)
  const doctor = await prisma.doctor.findUnique({ where: { user_id: userId } })
  if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })

  const availability = await prisma.availability.findMany({
    where: { doctor_id: doctor.id },
    orderBy: [{ day_of_week: 'asc' }, { start_time: 'asc' }],
  })
  return NextResponse.json(availability)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'doctor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { day_of_week, start_time, end_time, slot_duration } = await req.json()
  const userId = Number((session.user as any).id)
  const doctor = await prisma.doctor.findUnique({ where: { user_id: userId } })
  if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })

  const availability = await prisma.availability.create({
    data: { doctor_id: doctor.id, day_of_week, start_time, end_time, slot_duration: slot_duration || 30 },
  })
  return NextResponse.json(availability)
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'doctor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  const userId = Number((session.user as any).id)
  const doctor = await prisma.doctor.findUnique({ where: { user_id: userId } })
  if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })

  const entry = await prisma.availability.findFirst({
    where: { id: Number(id), doctor_id: doctor.id },
  })
  if (!entry) return NextResponse.json({ error: 'Availability not found' }, { status: 404 })

  await prisma.availability.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}
