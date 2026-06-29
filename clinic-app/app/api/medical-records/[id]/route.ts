import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as any
  const userId = Number(user.id)
  const id = Number((await params).id)

  const record = await prisma.medicalRecord.findUnique({ where: { id } })
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (user.role === 'patient' && record.patient_id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (user.role === 'doctor') {
    const doctor = await prisma.doctor.findUnique({ where: { user_id: userId } })
    if (!doctor || record.doctor_id !== doctor.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  await prisma.medicalRecord.delete({ where: { id } })
  return NextResponse.json({ message: 'Deleted' })
}
