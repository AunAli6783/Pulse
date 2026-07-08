import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST() {
  return NextResponse.json({ message: 'Logout via next-auth signOut' })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  return NextResponse.json(session.user)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const userId = Number((session.user as any).id)
  const { name, email, phone, currentPassword, newPassword } = await req.json()

  const updateData: Record<string, any> = {}

  if (name) updateData.name = name
  if (email) updateData.email = email
  if (phone !== undefined) updateData.phone = phone
  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 })
    }
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }
    updateData.password = await bcrypt.hash(newPassword, 12)
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: { id: true, name: true, email: true, role: true },
  })

  return NextResponse.json(updated)
}
