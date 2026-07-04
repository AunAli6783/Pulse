import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ 'doctor-id': string; date: string }> }) {
  const { 'doctor-id': doctorId, date } = await params

  const availability = await prisma.availability.findMany({
    where: { doctor_id: Number(doctorId) },
  })

  const [y, m, d] = date.split('-').map(Number)
  const dateObj = new Date(y, m - 1, d)
  const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' })
  const daySlots = availability.filter(
    (a) => a.day_of_week.toLowerCase() === dayOfWeek.toLowerCase()
  )
  if (daySlots.length === 0) return NextResponse.json({ slots: [] })

  const booked = await prisma.appointment.findMany({
    where: {
      doctor_id: Number(doctorId),
      appointment_date: new Date(date + 'T00:00:00.000Z'),
      status: { notIn: ['cancelled'] },
    },
    select: { appointment_time: true },
  })

  const bookedTimes = new Set(booked.map((b) => b.appointment_time))
  const slots = new Set<string>()

  for (const ds of daySlots) {
    const [startH, startM] = ds.start_time.split(':').map(Number)
    const [endH, endM] = ds.end_time.split(':').map(Number)
    const duration = ds.slot_duration

    let current = startH * 60 + startM
    const end = endH * 60 + endM

    while (current + duration <= end) {
      const h = Math.floor(current / 60)
      const mm = current % 60
      const time = `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
      if (!bookedTimes.has(time)) {
        slots.add(time)
      }
      current += duration
    }
  }

  return NextResponse.json({ slots: Array.from(slots).sort() })
}
