import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    where: { is_active: true },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  })
  return NextResponse.json(doctors)
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
