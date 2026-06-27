export default function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, React.CSSProperties> = {
    pending: { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' },
    confirmed: { background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' },
    completed: { background: 'rgba(34,211,160,0.15)', color: '#22d3a0', border: '1px solid rgba(34,211,160,0.3)' },
    cancelled: { background: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' },
  }

  const style = colors[status] || { background: 'rgba(136,136,170,0.1)', color: '#8888aa', border: '1px solid rgba(136,136,170,0.2)' }

  return (
    <span style={{
      ...style,
      padding: '4px 12px',
      borderRadius: '100px',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.3px',
      display: 'inline-block',
    }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
