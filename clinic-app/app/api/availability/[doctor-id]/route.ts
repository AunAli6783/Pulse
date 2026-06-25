import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ 'doctor-id': string }> }) {
  const { 'doctor-id': doctorId } = await params
  const availability = await prisma.availability.findMany({
    where: { doctor_id: Number(doctorId) },
  })
  return NextResponse.json(availability)
}
