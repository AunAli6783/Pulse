import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status, payment_method } = await req.json()
  const user = session.user as any

  const payment = await prisma.payment.findUnique({ where: { id: Number(id) } })
  if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })

  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can update payments' }, { status: 401 })
  }

  const updated = await prisma.payment.update({
    where: { id: Number(id) },
    data: {
      status: status || payment.status,
      payment_method: payment_method || payment.payment_method,
      paid_at: status === 'paid' ? new Date() : payment.paid_at,
    },
  })

  return NextResponse.json(updated)
}
