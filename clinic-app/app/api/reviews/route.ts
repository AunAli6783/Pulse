import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const doctorId = searchParams.get('doctor_id')
  const appointmentId = searchParams.get('appointment_id')

  if (appointmentId) {
    const review = await prisma.review.findMany({
      where: { appointment_id: Number(appointmentId) },
    })
    return NextResponse.json(review)
  }

  if (doctorId) {
    const reviews = await prisma.review.findMany({
      where: { doctor_id: Number(doctorId) },
      include: { patient: { select: { name: true } } },
      orderBy: { created_at: 'desc' },
    })
    const avg = await prisma.review.aggregate({
      where: { doctor_id: Number(doctorId) },
      _avg: { rating: true },
      _count: true,
    })
    return NextResponse.json({ reviews, averageRating: avg._avg.rating || 0, totalReviews: avg._count })
  }

  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as any
  if (user.role === 'doctor') {
    const doctor = await prisma.doctor.findUnique({ where: { user_id: Number(user.id) } })
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    const reviews = await prisma.review.findMany({
      where: { doctor_id: doctor.id },
      include: { patient: { select: { name: true } } },
      orderBy: { created_at: 'desc' },
    })
    const avg = await prisma.review.aggregate({
      where: { doctor_id: doctor.id },
      _avg: { rating: true },
      _count: true,
    })
    return NextResponse.json({ reviews, averageRating: avg._avg.rating || 0, totalReviews: avg._count })
  }

  if (user.role === 'admin') {
    const reviews = await prisma.review.findMany({
      include: { patient: { select: { name: true } }, doctor: { include: { user: { select: { name: true } } } } },
      orderBy: { created_at: 'desc' },
    })
    return NextResponse.json(reviews)
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'patient') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { doctor_id, appointment_id, rating, comment } = await req.json()
  const patientId = Number((session.user as any).id)

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
  }

  const existing = await prisma.review.findUnique({ where: { appointment_id: Number(appointment_id) } })
  if (existing) return NextResponse.json({ error: 'Already reviewed' }, { status: 409 })

  const review = await prisma.review.create({
    data: {
      patient_id: patientId,
      doctor_id: Number(doctor_id),
      appointment_id: Number(appointment_id),
      rating: Number(rating),
      comment,
    },
  })

  return NextResponse.json(review)
}
