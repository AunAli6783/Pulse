import nodemailer from 'nodemailer'

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  })
  return transporter
}

function getFrom() {
  return process.env.EMAIL_USER || 'noreply@pulseclinic.com'
}

function getAppUrl() {
  return process.env.NEXTAUTH_URL || 'http://localhost:3000'
}

export async function safeSend(mail: nodemailer.SendMailOptions) {
  try {
    const t = getTransporter()
    if (!t) { console.log('[EMAIL] SMTP not configured — set EMAIL_HOST/EMAIL_USER/EMAIL_PASS in .env'); return }
    console.log('[EMAIL] Sending to:', mail.to)
    const info = await t.sendMail(mail)
    console.log('[EMAIL] Sent:', info.messageId)
  } catch (e: any) {
    console.log('[EMAIL] Failed:', e.message || e)
  }
}

export function sendPasswordReset(email: string, token: string) {
  const link = `${getAppUrl()}/reset-password?token=${token}`
  safeSend({
    from: getFrom(),
    to: email,
    subject: 'Password Reset — Pulse Clinic',
    html: `<p>Click <a href="${link}">here</a> to reset your password. This link expires in 1 hour.</p>`,
  })
}

export function sendWelcome(email: string, name: string) {
  safeSend({
    from: getFrom(),
    to: email,
    subject: 'Welcome to Pulse Clinic',
    html: `<p>Hi ${name},</p><p>Your account has been created. Please complete your registration fee payment to start booking appointments.</p><p><a href="${getAppUrl()}/payment">Pay Registration Fee</a></p>`,
  })
}

export function sendBookingConfirmation(email: string, name: string, doctorName: string, date: string, time: string) {
  safeSend({
    from: getFrom(),
    to: email,
    subject: 'Appointment Booked — Pulse Clinic',
    html: `<p>Hi ${name},</p><p>Your appointment with <strong>${doctorName}</strong> has been booked.</p><p>Date: ${new Date(date).toLocaleDateString()}<br/>Time: ${time}</p>`,
  })
}

export function sendDoctorNotification(email: string, doctorName: string, patientName: string, date: string, time: string) {
  safeSend({
    from: getFrom(),
    to: email,
    subject: 'New Appointment — Pulse Clinic',
    html: `<p>Hi ${doctorName},</p><p>A new appointment has been booked by <strong>${patientName}</strong>.</p><p>Date: ${new Date(date).toLocaleDateString()}<br/>Time: ${time}</p>`,
  })
}

export function sendAppointmentUpdate(email: string, name: string, doctorName: string, date: string, status: string) {
  safeSend({
    from: getFrom(),
    to: email,
    subject: `Appointment ${status} — Pulse Clinic`,
    html: `<p>Hi ${name},</p><p>Your appointment with <strong>${doctorName}</strong> on ${new Date(date).toLocaleDateString()} has been <strong>${status}</strong>.</p>`,
  })
}

export function sendPasswordChangeNotification(email: string, name: string) {
  safeSend({
    from: getFrom(),
    to: email,
    subject: 'Password Changed — Pulse Clinic',
    html: `<p>Hi ${name},</p><p>Your password has been changed successfully.</p><p>If you did not make this change, please contact support immediately.</p>`,
  })
}

export function sendPaymentReceipt(email: string, name: string, amount: number, type: string) {
  safeSend({
    from: getFrom(),
    to: email,
    subject: 'Payment Receipt — Pulse Clinic',
    html: `<p>Hi ${name},</p><p>Your payment of <strong>Rs. ${amount}</strong> for ${type} has been received.</p>`,
  })
}
