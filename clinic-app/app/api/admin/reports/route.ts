import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const appointments = await prisma.appointment.findMany({
    include: {
      doctor: { include: { user: { select: { name: true } } } },
    },
    orderBy: { appointment_date: 'desc' },
  })

  const completedByMonth = await prisma.appointment.findMany({
    where: { status: 'completed' },
    include: { doctor: { select: { fee: true } } },
  })

  const monthlyMap = new Map<string, { count: number; revenue: number }>()
  for (const a of completedByMonth) {
    const month = new Date(a.appointment_date).toISOString().slice(0, 7)
    const existing = monthlyMap.get(month) || { count: 0, revenue: 0 }
    existing.count++
    existing.revenue += Number(a.doctor.fee)
    monthlyMap.set(month, existing)
  }

  const monthlyData = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 12)

  return NextResponse.json({ appointments, monthlyData })
}
