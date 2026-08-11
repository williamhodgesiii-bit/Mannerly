import { useNavigate } from 'react-router-dom'
import Icon from '@/components/Icon'
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
            <Icon name="chevron-left" size={22} />
          </button>
        )}
        {title && <span className="appbar__title">{title}</span>}
      </div>
      {stats && (
        <div className="row" style={{ gap: 14 }}>
          <span className="stat stat--streak" aria-label={`${streak} day streak`}>
            <Icon name="flame" size={18} /> {streak}
          </span>
          <span className="stat stat--xp" aria-label={`${xp} XP`}>
            <Icon name="bolt" size={18} /> {xp}
          </span>
        </div>
      )}
    </header>
  )
}
