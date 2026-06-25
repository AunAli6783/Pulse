import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ 'doctor-id': string; date: string }> }) {
  const { 'doctor-id': doctorId, date } = await params

  const availability = await prisma.availability.findMany({
    where: { doctor_id: Number(doctorId) },
  })

  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
  const daySlots = availability.find(
    (a) => a.day_of_week.toLowerCase() === dayOfWeek.toLowerCase()
  )
  if (!daySlots) return NextResponse.json({ slots: [] })

  const booked = await prisma.appointment.findMany({
    where: {
      doctor_id: Number(doctorId),
      appointment_date: new Date(date),
      status: { notIn: ['cancelled'] },
    },
    select: { appointment_time: true },
  })

  const bookedTimes = new Set(booked.map((b) => b.appointment_time))
  const slots = []
  const [startH, startM] = daySlots.start_time.split(':').map(Number)
  const [endH, endM] = daySlots.end_time.split(':').map(Number)
  const duration = daySlots.slot_duration

  let current = startH * 60 + startM
  const end = endH * 60 + endM

  while (current + duration <= end) {
    const h = Math.floor(current / 60)
    const m = current % 60
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    if (!bookedTimes.has(time)) {
      slots.push(time)
    }
    current += duration
  }

  return NextResponse.json({ slots })
}
