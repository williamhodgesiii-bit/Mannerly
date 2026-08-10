import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Mascot from '@/components/Mascot'
import { levelFor, useProgress } from '@/state/store'
import { totalLessonCount } from '@/data/content'
import { haptic } from '@/lib/haptics'

const AGE_LABEL: Record<string, string> = { kids: 'Kids · 5–7', tweens: 'Tweens · 8–12', teens: 'Teens · 13–17', adults: 'Adults · 18+' }

export default function Profile() {
  const navigate = useNavigate()
  const { xp, streak, completed, ageGroup, stampedCountries, reset } = useProgress()
  const doneCount = Object.keys(completed).length
  const lvl = levelFor(xp)
  const stamps = stampedCountries().length

  const stats = [
    { n: `🔥 ${streak}`, l: 'Streak' },
    { n: `⚡ ${xp}`, l: 'Total XP' },
    { n: `${doneCount}/${totalLessonCount}`, l: 'Lessons' },
    { n: `📔 ${stamps}`, l: 'Stamps' },
  ]

  const doReset = () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      haptic('error')
      reset()
      navigate('/onboarding', { replace: true })
    }
  }

  return (
    <div className="screen has-tabbar">
      <Header title="Me" />
      <div className="screen--padded" style={{ paddingTop: 14 }}>
        {/* identity */}
        <div className="center" style={{ gap: 6, marginBottom: 12 }}>
          <div style={{ background: 'var(--navy-100)', borderRadius: '50%', width: 108, height: 108, display: 'grid', placeItems: 'center' }}>
            <Mascot color="navy" size={92} pose="idle" bob={false} />
          </div>
          <h1 className="title" style={{ fontSize: 22 }}>Learner</h1>
          <span className="chip chip--teal">{lvl.current.icon} {lvl.current.name}</span>
        </div>

        {/* level bar */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="spread" style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 800 }}>{lvl.current.name}</span>
            <span className="kicker">{lvl.next ? `${lvl.pct}% to ${lvl.next.name}` : 'Max level'}</span>
          </div>
          <div className="track"><div className="fill" style={{ width: `${lvl.pct}%` }} /></div>
        </div>

        {/* stats grid */}
        <div className="passport-grid" style={{ marginBottom: 16 }}>
          {stats.map((s) => (
            <div key={s.l} className="card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 20 }}>{s.n}</div>
              <div className="kicker" style={{ marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Manners+ upsell */}
        <div className="card" style={{ padding: 18, marginBottom: 16, background: 'linear-gradient(135deg, var(--navy-500), var(--navy-600))', color: '#fff', border: 'none' }}>
          <div className="spread">
            <div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>Manners+ ⭐</div>
              <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9, marginTop: 2 }}>
                Every country, travel mode & more.
              </div>
            </div>
            <span style={{ fontWeight: 900 }}>$6.99<span style={{ fontSize: 12, opacity: 0.8 }}>/mo</span></span>
          </div>
          <button className="btn btn--gold" style={{ marginTop: 14 }} onClick={() => haptic('tap')}>
            Try 7 days free
          </button>
        </div>

        {/* settings */}
        <div className="section-title">Settings</div>
        <div className="stack" style={{ gap: 12 }}>
          <div className="tile" style={{ cursor: 'default' }}>
            <span className="tile-flag" style={{ fontSize: 22 }}>🎂</span>
            <div className="grow"><div className="tile-name">Age group</div><div className="tile-sub">{ageGroup ? AGE_LABEL[ageGroup] : 'Not set'}</div></div>
            <button className="chip" onClick={() => { haptic('tap'); navigate('/onboarding') }}>Change</button>
          </div>
          <button className="tile" onClick={doReset}>
            <span className="tile-flag" style={{ fontSize: 22 }}>♻️</span>
            <div className="grow"><div className="tile-name" style={{ color: 'var(--coral-600)' }}>Reset progress</div><div className="tile-sub">Start over from scratch</div></div>
          </button>
        </div>

        <p className="kicker" style={{ textAlign: 'center', marginTop: 22 }}>
          Mannerly · confidence in every culture
        </p>
      </div>
    </div>
  )
}
