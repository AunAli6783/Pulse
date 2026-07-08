import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

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

    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`

    return NextResponse.json({
      message: 'Password reset link generated',
      resetLink,
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
