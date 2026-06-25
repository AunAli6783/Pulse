'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user as any

  useEffect(() => {
    if (!session) return
    if (user.role === 'patient') router.push('/dashboard')
    else if (user.role === 'doctor') router.push('/doctor/dashboard')
    else if (user.role === 'admin') router.push('/admin/dashboard')
  }, [session, user, router])

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6">Your Health, Our Priority</h1>
          <p className="text-xl mb-8 text-blue-100">
            Book appointments with top doctors in minutes
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              Get Started
            </Link>
            <Link
              href="/doctors"
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10"
            >
              Find Doctors
            </Link>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Find a Doctor', desc: 'Browse specialists and check availability' },
            { title: 'Book Online', desc: 'Pick a time slot that works for you' },
            { title: 'Get Treated', desc: 'Visit the clinic and get the care you need' },
          ].map((step, i) => (
            <div key={i} className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">{i + 1}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
