import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const doctor = await prisma.doctor.findUnique({
    where: { id: Number(id) },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      availability: true,
    },
  })
  if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(doctor)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await req.json()
  const doctor = await prisma.doctor.update({ where: { id: Number(id) }, data })
  return NextResponse.json(doctor)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const doctor = await prisma.doctor.findUnique({ where: { id: Number(id) } })
  if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.doctor.delete({ where: { id: Number(id) } })
  await prisma.user.delete({ where: { id: doctor.user_id } })
  return NextResponse.json({ message: 'Deleted' })
}
