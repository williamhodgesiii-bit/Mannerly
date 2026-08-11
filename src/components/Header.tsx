import { useNavigate } from 'react-router-dom'
import { type ReactNode, useEffect, useState } from 'react'
import Icon from '@/components/Icon'
import { useProgress } from '@/state/store'
import { useUI } from '@/state/ui'
import { useHeldPermissions } from '@/state/entitlements'
import { haptic } from '@/lib/haptics'

interface HeaderProps {
  title?: string
  left?: ReactNode
  back?: boolean
  stats?: boolean
}

export default function Header({ title, left, back = false, stats = true }: HeaderProps) {
  const navigate = useNavigate()
  const streak = useProgress((s) => s.streak)
  const currentCharge = useProgress((s) => s.currentCharge)
  const openCharge = useUI((s) => s.openCharge)
  const held = useHeldPermissions()
  const unlimited = held.has('MANNERLY_PLUS') || held.has('FAMILY') || held.has('SCHOOL_LICENSE')

  // refresh the charge readout as it regenerates
  const [, tick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 30_000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="appbar">
      <div className="row" style={{ gap: 10 }}>
        {back && (
          <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back">
            <Icon name="chevron-left" size={22} />
          </button>
        )}
        {left ? left : title && <span className="appbar__title">{title}</span>}
      </div>
      {stats && (
        <div className="row" style={{ gap: 14 }}>
          <span className="stat stat--streak" aria-label={`${streak} day streak`}>
            <Icon name="flame" size={18} /> {streak}
          </span>
          <button className="stat stat--charge" onClick={() => { haptic('tap'); openCharge() }} aria-label="Charge">
            <Icon name="bolt" size={18} /> {unlimited ? '∞' : currentCharge()}
          </button>
        </div>
      )}
    </header>
  )
}
