import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'patient') redirect('/login')

  const userId = Number((session.user as any)?.id)
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { paid: true } })
  if (user && !user.paid) redirect(`/payment?userId=${userId}`)

  return <>{children}</>
}
