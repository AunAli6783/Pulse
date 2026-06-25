const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')

async function main() {
  const adapter = new PrismaLibSql({ url: 'file:./dev.db' })
  const prisma = new PrismaClient({ adapter })

  const hash = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@clinic.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@clinic.com', password: hash, role: 'admin', phone: '1234567890' },
  })
  console.log('✓ Admin:', admin.email, '/ password: admin123')

  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@clinic.com' },
    update: {},
    create: { name: 'Dr. Smith', email: 'doctor@clinic.com', password: hash, role: 'doctor', phone: '9876543210' },
  })

  const existing = await prisma.doctor.findUnique({ where: { user_id: doctorUser.id } })
  if (!existing) {
    const doctor = await prisma.doctor.create({
      data: {
        user_id: doctorUser.id,
        specialization: 'Cardiologist',
        qualification: 'MBBS, MD',
        experience: 10,
        fee: 100,
        bio: 'Experienced cardiologist',
      },
    })
    await prisma.availability.createMany({
      data: [
        { doctor_id: doctor.id, day_of_week: 'Mon', start_time: '09:00', end_time: '17:00', slot_duration: 30 },
        { doctor_id: doctor.id, day_of_week: 'Wed', start_time: '09:00', end_time: '17:00', slot_duration: 30 },
        { doctor_id: doctor.id, day_of_week: 'Fri', start_time: '09:00', end_time: '13:00', slot_duration: 30 },
      ],
    })
    console.log('✓ Doctor:', doctorUser.name, '(Cardiologist)')
  }

  const patient = await prisma.user.upsert({
    where: { email: 'patient@clinic.com' },
    update: {},
    create: { name: 'John Doe', email: 'patient@clinic.com', password: hash, role: 'patient', phone: '5551234567' },
  })
  console.log('✓ Patient:', patient.email, '/ password: admin123')

  await prisma.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
