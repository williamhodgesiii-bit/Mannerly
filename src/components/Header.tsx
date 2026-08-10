import { useNavigate } from 'react-router-dom'
import { useProgress } from '@/state/store'

interface HeaderProps {
  title?: string
  back?: boolean
  stats?: boolean
}

export default function Header({ title, back = false, stats = true }: HeaderProps) {
  const navigate = useNavigate()
  const streak = useProgress((s) => s.streak)
  const xp = useProgress((s) => s.xp)

  return (
    <header className="appbar">
      <div className="row" style={{ gap: 10 }}>
        {back && (
          <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back">
            ←
          </button>
        )}
        {title && <span className="appbar__title">{title}</span>}
      </div>
      {stats && (
        <div className="row" style={{ gap: 16 }}>
          <span className="stat stat--streak" aria-label={`${streak} day streak`}>
            🔥 {streak}
          </span>
          <span className="stat stat--xp" aria-label={`${xp} XP`}>
            ⚡ {xp}
          </span>
        </div>
      )}
    </header>
  )
}
