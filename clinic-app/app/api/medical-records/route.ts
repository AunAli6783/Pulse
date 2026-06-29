import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as any
  const role = user.role
  const userId = Number(user.id)

  if (role === 'patient') {
    const records = await prisma.medicalRecord.findMany({
      where: { patient_id: userId },
      include: { doctor: { include: { user: { select: { name: true } } } } },
      orderBy: { created_at: 'desc' },
    })
    return NextResponse.json(records)
  }

  if (role === 'doctor') {
    const doctor = await prisma.doctor.findUnique({ where: { user_id: userId } })
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    const records = await prisma.medicalRecord.findMany({
      where: { doctor_id: doctor.id },
      include: { patient: { select: { name: true } }, doctor: { include: { user: { select: { name: true } } } } },
      orderBy: { created_at: 'desc' },
    })
    return NextResponse.json(records)
  }

  if (role === 'admin') {
    const records = await prisma.medicalRecord.findMany({
      include: { patient: { select: { name: true } }, doctor: { include: { user: { select: { name: true } } } } },
      orderBy: { created_at: 'desc' },
    })
    return NextResponse.json(records)
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as any
  const userId = Number(user.id)

  const formData = await req.formData()
  const file = formData.get('file') as File
  const title = formData.get('title') as string
  const recordType = formData.get('record_type') as string
  const description = formData.get('description') as string
  const doctorIdInput = formData.get('doctor_id') ? Number(formData.get('doctor_id')) : null
  const appointmentId = formData.get('appointment_id') ? Number(formData.get('appointment_id')) : null

  if (!file || !title) {
    return NextResponse.json({ error: 'File and title are required' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const base64 = buffer.toString('base64')

  let doctorId: number
  let targetPatientId: number

  if (user.role === 'patient') {
    targetPatientId = userId
    if (doctorIdInput) {
      doctorId = doctorIdInput
    } else {
      const lastAppt = await prisma.appointment.findFirst({
        where: { patient_id: userId, status: 'completed' },
        orderBy: { created_at: 'desc' },
      })
      if (!lastAppt) return NextResponse.json({ error: 'No doctor found. Please specify a doctor.' }, { status: 400 })
      doctorId = lastAppt.doctor_id
    }
  } else if (user.role === 'doctor') {
    const doctor = await prisma.doctor.findUnique({ where: { user_id: userId } })
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    doctorId = doctor.id
    targetPatientId = doctorIdInput || userId
  } else {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const record = await prisma.medicalRecord.create({
    data: {
      patient_id: targetPatientId,
      doctor_id: doctorId,
      appointment_id: appointmentId,
      record_type: recordType || 'other',
      title,
      description: description || null,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      file_data: base64,
    },
  })

  return NextResponse.json(record, { status: 201 })
}
