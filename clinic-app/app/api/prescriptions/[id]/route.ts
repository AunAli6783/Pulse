import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const prescription = await prisma.prescription.findUnique({
    where: { id: Number(id) },
    include: {
      doctor: { include: { user: { select: { name: true } } } },
      patient: { select: { name: true } },
      appointment: { select: { appointment_date: true } },
    },
  })
  if (!prescription) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(prescription)
}
