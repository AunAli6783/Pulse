const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')

async function main() {
  const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./dev.db' })
  const prisma = new PrismaClient({ adapter })

  const hash = await bcrypt.hash('admin123', 12)

  // ── Admin ──
  await prisma.user.upsert({
    where: { email: 'admin@clinic.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@clinic.com', password: hash, role: 'admin', phone: '+92-51-1234567' },
  })
  console.log('✓ Admin: admin@clinic.com / admin123')

  // ── Patient ──
  await prisma.user.upsert({
    where: { email: 'patient@clinic.com' },
    update: {},
    create: { name: 'Ali Ahmed', email: 'patient@clinic.com', password: hash, role: 'patient', phone: '+92-300-1112233' },
  })
  console.log('✓ Patient: patient@clinic.com / admin123')

  // ── Doctors ──
  const doctors = [
    {
      name: 'Dr. Abdul Bari Khan',
      email: 'abdulbari@clinic.com',
      phone: '+92-21-34567890',
      specialization: 'Cardiologist',
      qualification: 'MBBS, FCPS (Cardiology), FACC',
      experience: 28,
      fee: 1500,
      bio: 'Founder of Indus Hospital & Health Network. Pioneer of accessible cardiac care in Pakistan. Performed over 15,000 successful cardiac procedures.',
      availability: [
        { day_of_week: 'Mon', start_time: '09:00', end_time: '13:00', slot_duration: 30 },
        { day_of_week: 'Tue', start_time: '09:00', end_time: '13:00', slot_duration: 30 },
        { day_of_week: 'Thu', start_time: '14:00', end_time: '17:00', slot_duration: 30 },
      ],
    },
    {
      name: 'Dr. Adeebul Hasan Rizvi',
      email: 'adeebrizvi@clinic.com',
      phone: '+92-21-34567891',
      specialization: 'Urologist',
      qualification: 'MBBS, FRCS (Edinburgh), FCPS (Hon)',
      experience: 42,
      fee: 2000,
      bio: 'Founder of Sindh Institute of Urology and Transplantation (SIUT). Renowned for pioneering kidney transplantation and free dialysis services in Pakistan.',
      availability: [
        { day_of_week: 'Mon', start_time: '10:00', end_time: '14:00', slot_duration: 30 },
        { day_of_week: 'Wed', start_time: '10:00', end_time: '14:00', slot_duration: 30 },
        { day_of_week: 'Fri', start_time: '09:00', end_time: '12:00', slot_duration: 30 },
      ],
    },
    {
      name: 'Dr. Asma Humayun',
      email: 'asmahumayun@clinic.com',
      phone: '+92-51-2345678',
      specialization: 'Dermatologist',
      qualification: 'MBBS, FCPS (Dermatology), MCPS',
      experience: 16,
      fee: 1200,
      bio: 'Consultant Dermatologist at Shifa International Hospital. Specializes in laser treatments, vitiligo surgery, and pediatric dermatology.',
      availability: [
        { day_of_week: 'Mon', start_time: '09:00', end_time: '15:00', slot_duration: 30 },
        { day_of_week: 'Wed', start_time: '09:00', end_time: '15:00', slot_duration: 30 },
        { day_of_week: 'Thu', start_time: '09:00', end_time: '13:00', slot_duration: 30 },
      ],
    },
    {
      name: 'Dr. Nadeem Ahmed Sheikh',
      email: 'nadeemsheikh@clinic.com',
      phone: '+92-21-34987654',
      specialization: 'Neurologist',
      qualification: 'MBBS, FRCP (Neurology), FCPS',
      experience: 20,
      fee: 1800,
      bio: 'Senior Neurologist at Aga Khan University Hospital. Expert in stroke management, epilepsy, and movement disorders. Published 50+ research papers.',
      availability: [
        { day_of_week: 'Tue', start_time: '09:00', end_time: '16:00', slot_duration: 30 },
        { day_of_week: 'Thu', start_time: '09:00', end_time: '16:00', slot_duration: 30 },
        { day_of_week: 'Fri', start_time: '09:00', end_time: '13:00', slot_duration: 30 },
      ],
    },
    {
      name: 'Dr. Muhammad Irfan',
      email: 'muhammadirfan@clinic.com',
      phone: '+92-42-35712345',
      specialization: 'Orthopedic Surgeon',
      qualification: 'MBBS, FCPS (Ortho), FRCS (Glasgow)',
      experience: 22,
      fee: 1600,
      bio: 'Consultant Orthopaedic Surgeon at Jinnah Postgraduate Medical Centre. Specializes in joint replacement, arthroscopy, and trauma surgery.',
      availability: [
        { day_of_week: 'Mon', start_time: '09:00', end_time: '14:00', slot_duration: 30 },
        { day_of_week: 'Wed', start_time: '09:00', end_time: '14:00', slot_duration: 30 },
        { day_of_week: 'Sat', start_time: '09:00', end_time: '12:00', slot_duration: 30 },
      ],
    },
    {
      name: 'Dr. Faisal Sultan',
      email: 'faisalsultan@clinic.com',
      phone: '+92-42-35905000',
      specialization: 'Internal Medicine',
      qualification: 'MBBS, FACP, FCPS (Medicine)',
      experience: 18,
      fee: 1300,
      bio: 'Former CEO of Shaukat Khanum Memorial Cancer Hospital. Internist and infectious disease specialist. Led Pakistan\'s COVID-19 response efforts.',
      availability: [
        { day_of_week: 'Mon', start_time: '10:00', end_time: '16:00', slot_duration: 30 },
        { day_of_week: 'Tue', start_time: '10:00', end_time: '16:00', slot_duration: 30 },
        { day_of_week: 'Wed', start_time: '10:00', end_time: '14:00', slot_duration: 30 },
      ],
    },
    {
      name: 'Dr. Javed Akram',
      email: 'javedakram@clinic.com',
      phone: '+92-51-9108100',
      specialization: 'Endocrinologist',
      qualification: 'MBBS, FRCP (London), FACP, FCPS',
      experience: 30,
      fee: 1700,
      bio: 'Ex-Vice Chancellor of PIMS. Pioneering diabetes researcher in Pakistan. Established the country\'s first dedicated diabetes clinic.',
      availability: [
        { day_of_week: 'Tue', start_time: '09:00', end_time: '13:00', slot_duration: 30 },
        { day_of_week: 'Thu', start_time: '09:00', end_time: '13:00', slot_duration: 30 },
        { day_of_week: 'Fri', start_time: '14:00', end_time: '17:00', slot_duration: 30 },
      ],
    },
    {
      name: 'Dr. Rizwana Chaudhri',
      email: 'rizwanachaudhri@clinic.com',
      phone: '+92-51-5464455',
      specialization: 'Gynecologist',
      qualification: 'MBBS, FCPS (Obstetrics & Gynaecology), MRCOG',
      experience: 19,
      fee: 1400,
      bio: 'Professor of Obstetrics & Gynaecology at Rawalpindi Medical University. Specializes in high-risk pregnancies, laparoscopic surgery, and reproductive health.',
      availability: [
        { day_of_week: 'Mon', start_time: '10:00', end_time: '15:00', slot_duration: 30 },
        { day_of_week: 'Wed', start_time: '10:00', end_time: '15:00', slot_duration: 30 },
        { day_of_week: 'Fri', start_time: '09:00', end_time: '13:00', slot_duration: 30 },
      ],
    },
    {
      name: 'Dr. Shabnam Rizvi',
      email: 'shabnamrizvi@clinic.com',
      phone: '+92-21-35866971',
      specialization: 'Ophthalmologist',
      qualification: 'MBBS, FCPS (Ophthalmology), FICO',
      experience: 14,
      fee: 1100,
      bio: 'Consultant Ophthalmologist at LRBT. Expert in cataract surgery, glaucoma management, and pediatric ophthalmology. Performed 5,000+ sight-restoring surgeries.',
      availability: [
        { day_of_week: 'Tue', start_time: '09:00', end_time: '14:00', slot_duration: 30 },
        { day_of_week: 'Thu', start_time: '09:00', end_time: '14:00', slot_duration: 30 },
        { day_of_week: 'Sat', start_time: '10:00', end_time: '14:00', slot_duration: 30 },
      ],
    },
    {
      name: 'Dr. Muhammad Ali Jan',
      email: 'muhammadalijan@clinic.com',
      phone: '+92-42-99205432',
      specialization: 'Pediatrician',
      qualification: 'MBBS, FCPS (Pediatrics), MRCPCH',
      experience: 17,
      fee: 1000,
      bio: 'Senior Pediatrician at The Children\'s Hospital Lahore. Specializes in neonatal care, pediatric infectious diseases, and childhood nutrition.',
      availability: [
        { day_of_week: 'Mon', start_time: '09:00', end_time: '15:00', slot_duration: 30 },
        { day_of_week: 'Tue', start_time: '09:00', end_time: '15:00', slot_duration: 30 },
        { day_of_week: 'Wed', start_time: '09:00', end_time: '13:00', slot_duration: 30 },
        { day_of_week: 'Thu', start_time: '09:00', end_time: '13:00', slot_duration: 30 },
      ],
    },
    {
      name: 'Dr. Aamir Zaman',
      email: 'aamirzaman@clinic.com',
      phone: '+92-91-9212345',
      specialization: 'Psychiatrist',
      qualification: 'MBBS, FCPS (Psychiatry), Dip. Psychotherapy',
      experience: 13,
      fee: 1200,
      bio: 'Consultant Psychiatrist at Lady Reading Hospital Peshawar. Specializes in anxiety disorders, depression, and addiction medicine.',
      availability: [
        { day_of_week: 'Mon', start_time: '10:00', end_time: '16:00', slot_duration: 30 },
        { day_of_week: 'Wed', start_time: '10:00', end_time: '16:00', slot_duration: 30 },
        { day_of_week: 'Fri', start_time: '10:00', end_time: '14:00', slot_duration: 30 },
      ],
    },
    {
      name: 'Dr. Farah Naaz',
      email: 'farahnaaz@clinic.com',
      phone: '+92-21-35862341',
      specialization: 'ENT Specialist',
      qualification: 'MBBS, FCPS (ENT), DLO',
      experience: 15,
      fee: 1100,
      bio: 'ENT Surgeon at Dow University Hospital. Expertise in endoscopic sinus surgery, cochlear implants, and head & neck cancer surgery.',
      availability: [
        { day_of_week: 'Tue', start_time: '09:00', end_time: '14:00', slot_duration: 30 },
        { day_of_week: 'Thu', start_time: '09:00', end_time: '14:00', slot_duration: 30 },
        { day_of_week: 'Sat', start_time: '09:00', end_time: '13:00', slot_duration: 30 },
      ],
    },
  ]

  for (const doc of doctors) {
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {},
      create: {
        name: doc.name,
        email: doc.email,
        password: hash,
        role: 'doctor',
        phone: doc.phone,
      },
    })

    const existing = await prisma.doctor.findUnique({ where: { user_id: user.id } })
    let doctor: any
    if (!existing) {
      doctor = await prisma.doctor.create({
        data: {
          user_id: user.id,
          specialization: doc.specialization,
          qualification: doc.qualification,
          experience: doc.experience,
          fee: doc.fee,
          bio: doc.bio,
        },
      })
      await prisma.availability.createMany({
        data: doc.availability.map((a) => ({
          doctor_id: doctor.id,
          day_of_week: a.day_of_week,
          start_time: a.start_time,
          end_time: a.end_time,
          slot_duration: a.slot_duration,
        })),
      })
      console.log(`✓ ${doc.name} (${doc.specialization}) — Rs. ${doc.fee}`)
    } else {
      doctor = existing
      console.log(`  ${doc.name} already exists, skipping`)
    }
  }

  // ── Sample Reviews ──
  const patientUser = await prisma.user.findUnique({ where: { email: 'patient@clinic.com' } })
  const allDoctors = await prisma.doctor.findMany({ take: 5 })
  const reviewComments = [
    'Excellent doctor, very thorough in examination. Highly recommended!',
    'Great experience. The doctor listened to all my concerns patiently.',
    'Very professional and knowledgeable. Made me feel comfortable throughout.',
    'Good doctor but the waiting time was a bit long.',
    'Amazing treatment! I saw results within a week.',
    'Very kind and understanding. Explained everything in detail.',
    'One of the best doctors I have visited. Very experienced.',
    'Satisfied with the treatment. Will visit again if needed.',
  ]

  for (let i = 0; i < allDoctors.length; i++) {
    const doc = allDoctors[i]
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 60) - 5)

    const appt = await prisma.appointment.create({
      data: {
        patient_id: patientUser!.id,
        doctor_id: doc.id,
        appointment_date: pastDate,
        appointment_time: '10:00',
        status: 'completed',
        reason: 'Regular checkup',
      },
    })

    const existingReview = await prisma.review.findUnique({ where: { appointment_id: appt.id } })
    if (!existingReview) {
      await prisma.review.create({
        data: {
          patient_id: patientUser!.id,
          doctor_id: doc.id,
          appointment_id: appt.id,
          rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
          comment: reviewComments[i % reviewComments.length],
        },
      })
    }
  }
  console.log('✓ Sample reviews added')

  await prisma.$disconnect()
  console.log('\n✅ Seed complete! Use password "admin123" for all accounts.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
