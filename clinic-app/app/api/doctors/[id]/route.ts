import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const doctor = await prisma.doctor.findUnique({
    where: { id: Number(id) },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      availability: true,
      reviews: {
        include: { patient: { select: { name: true } } },
        orderBy: { created_at: 'desc' },
      },
    },
  })
  if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const ratings = doctor.reviews.map((r) => r.rating)
  const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

  return NextResponse.json({ ...doctor, averageRating: Math.round(averageRating * 10) / 10 })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const data = await req.json()

  const userId = Number((session.user as any).id)
  const userRole = (session.user as any).role
  const doctor = await prisma.doctor.findUnique({ where: { id: Number(id) } })
  if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (userRole !== 'admin' && doctor.user_id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updated = await prisma.doctor.update({ where: { id: Number(id) }, data })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const doctor = await prisma.doctor.findUnique({ where: { id: Number(id) } })
  if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.doctor.delete({ where: { id: Number(id) } })
  await prisma.user.delete({ where: { id: doctor.user_id } })
  return NextResponse.json({ message: 'Deleted' })
}
