import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Mascot from '@/components/Mascot'
import { HOME_UNIT_ORDER, LESSON_MAP, UNIT_MAP } from '@/data/content'
import { levelFor, useProgress } from '@/state/store'
import { useProfiles } from '@/state/profiles'
import { useAccount } from '@/state/account'
import { avatarEmoji } from '@/data/avatars'
import { haptic } from '@/lib/haptics'

const ZIG = [0, 46, 66, 46, 0, -46, -66, -46]

export default function Home() {
  const navigate = useNavigate()
  const completed = useProgress((s) => s.completed)
  const xp = useProgress((s) => s.xp)
  const avatarId = useProgress((s) => s.avatarId)
  const lvl = levelFor(xp)

  const activeChildId = useProfiles((s) => s.activeChildId)
  const children = useProfiles((s) => s.children)
  const accountName = useAccount((s) => s.account?.displayName)
  const learnerName =
    children.find((c) => c.id === activeChildId)?.name ?? accountName ?? null

  // flatten core path in order
  const flat = useMemo(() => {
    const ids: string[] = []
    for (const uId of HOME_UNIT_ORDER) ids.push(...(UNIT_MAP[uId]?.lessonIds ?? []))
    return ids
  }, [])

  const currentIndex = useMemo(() => {
    const idx = flat.findIndex((id) => !completed[id])
    return idx === -1 ? flat.length : idx
  }, [flat, completed])

  const go = (id: string, locked: boolean) => {
    if (locked) { haptic('error'); return }
    haptic('tap')
    navigate(`/lesson/${id}`)
  }

  let counter = -1

  return (
    <div className="screen has-tabbar">
      <Header title="Mannerly" />
      <div className="screen--padded" style={{ paddingTop: 14 }}>
        {/* greeting */}
        <div className="row" style={{ gap: 10, marginBottom: 12 }}>
          <span className="home-hi-ava">{avatarEmoji(avatarId)}</span>
          <div>
            <div className="kicker">{learnerName ? `Welcome back, ${learnerName}` : 'Welcome back'}</div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Ready for today’s manner?</div>
          </div>
        </div>

        {/* level hero */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14, overflow: 'hidden' }}
        >
          <div style={{ fontSize: 40 }}>{lvl.current.icon}</div>
          <div className="grow">
            <div className="spread">
              <span style={{ fontWeight: 900, fontSize: 16 }}>{lvl.current.name}</span>
              <span className="kicker">{lvl.next ? `${lvl.pct}%` : 'Max'}</span>
            </div>
            <div className="track" style={{ marginTop: 8 }}>
              <motion.div className="fill" initial={{ width: 0 }} animate={{ width: `${lvl.pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
            </div>
            <span className="kicker" style={{ marginTop: 6, display: 'block' }}>
              {lvl.next ? `Next: ${lvl.next.name}` : 'Ambassador reached 🎉'}
            </span>
          </div>
          <div style={{ marginRight: -6 }}><Mascot color="teal" size={72} pose="cheer" /></div>
        </motion.div>

        {/* the path */}
        <div className="path">
          {HOME_UNIT_ORDER.map((uId) => {
            const unit = UNIT_MAP[uId]
            if (!unit) return null
            return (
              <div key={uId} style={{ width: '100%' }}>
                <div className={`unit-band band-${unit.color}`}>
                  <span className="u-icon">{unit.icon}</span>
                  <div>
                    <div className="u-title">{unit.title}</div>
                    {unit.subtitle && <div className="u-sub">{unit.subtitle}</div>}
                  </div>
                </div>

                {unit.lessonIds.map((id) => {
                  counter += 1
                  const lesson = LESSON_MAP[id]
                  const done = !!completed[id]
                  const isCurrent = counter === currentIndex
                  const locked = counter > currentIndex && !done
                  const offset = ZIG[counter % ZIG.length]
                  const cls = done ? 'node--done' : isCurrent ? 'node--current' : locked ? 'node--locked' : ''
                  return (
                    <motion.div
                      key={id}
                      className={`node ${cls}`}
                      style={{ left: offset }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    >
                      {isCurrent && <span className="node__label">START</span>}
                      {isCurrent && (
                        <motion.span
                          className="node__ring"
                          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.15, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      <button
                        className="node__btn"
                        onClick={() => go(id, locked)}
                        aria-label={lesson?.title ?? 'Lesson'}
                      >
                        {done ? '✓' : locked ? '🔒' : lesson?.icon}
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            )
          })}

          <motion.button
            className="btn btn--ghost"
            style={{ width: 'auto', marginTop: 18 }}
            onClick={() => { haptic('tap'); navigate('/explore') }}
            whileTap={{ scale: 0.97 }}
          >
            🌍 Explore country packs →
          </motion.button>
        </div>
      </div>
    </div>
  )
}
