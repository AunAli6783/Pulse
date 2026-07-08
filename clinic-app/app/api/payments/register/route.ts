import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { id: Number(userId) }, select: { paid: true } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  if (user.paid) return NextResponse.json({ paid: true })

  const payment = await prisma.payment.findFirst({
    where: { patient_id: Number(userId), type: 'registration' },
    orderBy: { created_at: 'desc' },
  })

  return NextResponse.json({ paid: false, amount: payment?.amount || 500, created_at: payment?.created_at })
}

export async function PUT(req: Request) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const payment = await prisma.payment.findFirst({
      where: { patient_id: userId, type: 'registration', status: 'pending' },
    })

    if (!payment) return NextResponse.json({ error: 'No pending payment found' }, { status: 404 })

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'paid', payment_method: 'simulated', paid_at: new Date() },
    })

    await prisma.user.update({
      where: { id: userId },
      data: { paid: true },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
