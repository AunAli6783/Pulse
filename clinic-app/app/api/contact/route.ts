import { NextResponse } from 'next/server'
import { safeSend } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()
    if (!name || !email || !message) return NextResponse.json({ error: 'All fields required' }, { status: 400 })

    await safeSend({
      to: process.env.EMAIL_USER || 'admin@pulseclinic.com',
      subject: `Contact Form — ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
