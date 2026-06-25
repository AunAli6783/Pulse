import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
