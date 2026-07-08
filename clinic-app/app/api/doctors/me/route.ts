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
  const doctor = await prisma.doctor.findUnique({
    where: { user_id: userId },
    include: { user: { select: { name: true, email: true } } },
  })

  if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
  return NextResponse.json(doctor)
}
