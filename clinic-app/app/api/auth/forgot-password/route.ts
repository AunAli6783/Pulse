import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendPasswordReset } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'No account found with this email' }, { status: 404 })

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000)

    await prisma.user.update({
      where: { email },
      data: { reset_token: token, reset_token_expires: expires },
    })

    const hasEmail = !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS)

    if (hasEmail) {
      await sendPasswordReset(email, token)
    }

    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`

    return NextResponse.json({
      message: hasEmail ? 'Password reset link sent to your email' : 'Password reset link generated',
      resetLink: hasEmail ? '' : resetLink,
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
