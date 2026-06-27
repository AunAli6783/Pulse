'use client'

import { useSession } from 'next-auth/react'
import { User } from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()
  const user = session?.user as any

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', background: '#0a0a0f', padding: '100px 24px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <User size={24} style={{ color: '#6366f1' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>My Profile</h1>
        </div>
        <div style={{ background: 'rgba(22,22,31,0.7)', border: '1px solid rgba(42,42,58,0.6)', borderRadius: '20px', padding: '36px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555570', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Name</label>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#f0f0ff', marginTop: '4px' }}>{user?.name}</p>
            </div>
            <div style={{ borderTop: '1px solid rgba(42,42,58,0.6)', paddingTop: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555570', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Email</label>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#f0f0ff', marginTop: '4px' }}>{user?.email}</p>
            </div>
            <div style={{ borderTop: '1px solid rgba(42,42,58,0.6)', paddingTop: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555570', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Role</label>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#f0f0ff', marginTop: '4px', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
