import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

export default function StatsCard({ title, value, icon: Icon, href }: { title: string; value: string | number; icon?: LucideIcon; href?: string }) {
  const content = (
    <div style={{
      background: 'rgba(22,22,31,0.7)',
      border: '1px solid rgba(42,42,58,0.6)',
      borderRadius: '14px',
      padding: '24px',
      transition: 'all 0.25s ease',
      cursor: href ? 'pointer' : 'default',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        {Icon && <Icon size={18} style={{ color: '#6366f1' }} />}
        <p style={{ color: '#8888aa', fontSize: '13px', fontWeight: '500' }}>{title}</p>
      </div>
      <p style={{ fontSize: '28px', fontWeight: '800', color: '#f0f0ff', letterSpacing: '-0.5px' }}>{value}</p>
    </div>
  )

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
        {content}
      </Link>
    )
  }

  return content
}
