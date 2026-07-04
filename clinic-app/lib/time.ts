export function to12h(time: string): string {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

export function to24h(hour: number, minute: number, period: string): string {
  let h = hour
  if (period === 'AM' && h === 12) h = 0
  if (period === 'PM' && h < 12) h += 12
  return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export const HOURS12 = Array.from({ length: 12 }, (_, i) => i + 1)
export const MINUTES = [0, 15, 30, 45]
