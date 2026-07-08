import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const specialization = searchParams.get('specialization') || ''
  const sort = searchParams.get('sort') || 'name'

  const where: any = { is_active: true }
  if (search) where.user = { name: { contains: search } }
  if (specialization) where.specialization = specialization

  let orderBy: any = {}
  if (sort === 'fee_asc') orderBy.fee = 'asc'
  else if (sort === 'fee_desc') orderBy.fee = 'desc'
  else if (sort === 'experience') orderBy.experience = 'desc'
  else orderBy = { user: { name: 'asc' } }

  const doctors = await prisma.doctor.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      reviews: { select: { rating: true } },
    },
    orderBy,
  })

  const specializations = await prisma.doctor.findMany({
    where: { is_active: true },
    select: { specialization: true },
    distinct: ['specialization'],
    orderBy: { specialization: 'asc' },
  })

  const result = doctors.map((doc) => {
    const ratings = doc.reviews.map((r) => r.rating)
    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
    const { reviews, ...rest } = doc
    return { ...rest, averageRating: Math.round(avgRating * 10) / 10, totalReviews: ratings.length }
  })

  if (sort === 'rating') result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))

  return NextResponse.json({ doctors: result, specializations: specializations.map((s) => s.specialization) })
}

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, specialization, qualification, experience, fee, bio } = await req.json()
    const hashed = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { name, email, password: hashed, phone, role: 'doctor' },
    })

    const doctor = await prisma.doctor.create({
      data: {
        user_id: user.id,
        specialization,
        qualification,
        experience,
        fee: parseFloat(fee),
        bio,
      },
    })

    return NextResponse.json(doctor)
  } catch {
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 })
  }
}
