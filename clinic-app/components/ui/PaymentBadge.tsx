export default function PaymentBadge({ status, compact }: { status: string; compact?: boolean }) {
  const colors: Record<string, { bg: string; color: string }> = {
    paid: { bg: 'rgba(34,211,160,0.15)', color: '#22d3a0' },
    pending: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
    refunded: { bg: 'rgba(244,63,94,0.15)', color: '#f43f5e' },
  }
  const c = colors[status] || { bg: 'rgba(136,136,170,0.15)', color: '#8888aa' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: compact ? '2px 8px' : '4px 10px',
      borderRadius: '100px', fontSize: compact ? '11px' : '12px',
      fontWeight: '600', background: c.bg, color: c.color, textTransform: 'capitalize',
    }}>
      {status}
    </span>
  )
}
