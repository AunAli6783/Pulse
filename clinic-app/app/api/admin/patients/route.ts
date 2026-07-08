import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const patients = await prisma.user.findMany({
    where: { role: 'patient' },
    select: { id: true, name: true, email: true, phone: true, paid: true, created_at: true },
    orderBy: { created_at: 'desc' },
  })

  return NextResponse.json(patients)
}
