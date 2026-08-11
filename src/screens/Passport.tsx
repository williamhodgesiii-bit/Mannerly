import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Icon, { type IconName } from '@/components/Icon'
import { countryList } from '@/data/countries'
import { courseLessonIds } from '@/data/content'
import { useProgress } from '@/state/store'

export default function Passport() {
  const stamped = useProgress((s) => s.stampedCountries())
  const completed = useProgress((s) => s.completed)
  const xp = useProgress((s) => s.xp)
  const streak = useProgress((s) => s.streak)
  const countries = countryList()
  const got = new Set(stamped)
  const doneCount = Object.keys(completed).length

  const ach: { id: string; name: string; icon: IconName; earned: boolean }[] = [
    { id: 'first', name: 'First Steps', icon: 'sprout', earned: doneCount >= 1 },
    { id: 'ten', name: 'Ten Lessons', icon: 'check-badge', earned: doneCount >= 10 },
    { id: 'streak3', name: '3-Day Streak', icon: 'flame', earned: streak >= 3 },
    { id: 'streak7', name: 'Week Strong', icon: 'spark', earned: streak >= 7 },
    { id: 'stamp1', name: 'First Stamp', icon: 'passport', earned: got.size >= 1 },
    { id: 'stamp3', name: 'Globetrotter', icon: 'globe', earned: got.size >= 3 },
    { id: 'stampAll', name: 'World Citizen', icon: 'trophy', earned: got.size >= countries.length },
    { id: 'xp200', name: 'Ambassador', icon: 'star', earned: xp >= 200 },
  ]
  const earnedCount = ach.filter((a) => a.earned).length

  return (
    <div className="screen has-tabbar">
      <Header title="Passport" />
      <div className="screen--padded" style={{ paddingTop: 14 }}>
        <div className="card" style={{ padding: 16, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="level-badge level-badge--teal" style={{ width: 48, height: 48, borderRadius: 15 }}><Icon name="passport" size={26} color="#fff" /></div>
          <div className="grow">
            <div style={{ fontWeight: 900, fontSize: 17 }}>Manners Passport</div>
            <div className="subtitle">A stamp for every country you learn.</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 900, fontSize: 22, color: 'var(--teal-500)' }}>{got.size}</div>
            <div className="kicker">of {countries.length}</div>
          </div>
        </div>

        <div className="passport-grid">
          {countries.map((c, i) => {
            const has = got.has(c.code)
            const ids = courseLessonIds(c.courseId)
            const cdone = ids.filter((id) => completed[id]).length
            const complete = ids.length > 0 && cdone === ids.length
            return (
              <motion.div
                key={c.code}
                className={`stamp ${has ? 'stamp--got' : ''}`}
                style={{ ['--theme' as string]: c.theme }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 240, damping: 18 }}
              >
                {has && (
                  <motion.span className="stamp__seal" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 8 }} transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.1 + i * 0.04 }}>
                    <Icon name={complete ? 'trophy' : 'check'} size={14} color="#fff" strokeWidth={2.6} />
                  </motion.span>
                )}
                <span className="stamp-flag">{c.flag}</span>
                <span className="stamp-name">{c.name}</span>
                <span className="stamp-prog">{has ? `${cdone}/${ids.length}` : 'Locked'}</span>
              </motion.div>
            )
          })}
        </div>

        <div className="spread" style={{ margin: '24px 0 10px' }}>
          <div className="section-title" style={{ margin: 0 }}>Achievements</div>
          <span className="kicker">{earnedCount}/{ach.length}</span>
        </div>
        <div className="ach-grid">
          {ach.map((a, i) => (
            <motion.div
              key={a.id}
              className={`ach ${a.earned ? 'ach--on' : ''}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <span className="ach-badge"><Icon name={a.icon} size={22} color={a.earned ? '#fff' : 'var(--muted)'} /></span>
              <span className="ach-name">{a.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
