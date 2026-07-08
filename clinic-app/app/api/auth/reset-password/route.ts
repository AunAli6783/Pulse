import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })

    const user = await prisma.user.findFirst({
      where: { reset_token: token, reset_token_expires: { gt: new Date() } },
    })
    if (!user) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 12)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, reset_token: null, reset_token_expires: null },
    })

    return NextResponse.json({ message: 'Password reset successful' })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
