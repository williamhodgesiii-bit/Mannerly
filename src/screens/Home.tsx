import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Mascot from '@/components/Mascot'
import Avatar from '@/components/Avatar'
import Icon, { type IconName } from '@/components/Icon'
import { COURSE_MAP, DEFAULT_COURSE, LESSON_MAP, UNIT_MAP, courseLessonIds } from '@/data/content'
import { COUNTRIES } from '@/data/countries'
import { levelFor, useProgress } from '@/state/store'
import { useUI } from '@/state/ui'
import { useHeldPermissions } from '@/state/entitlements'
import { useProfiles } from '@/state/profiles'
import { useAccount } from '@/state/account'
import { haptic } from '@/lib/haptics'

const ZIG = [0, 46, 66, 46, 0, -46, -66, -46]

const UNIT_ICON: Record<string, IconName> = {
  'core-basics': 'check-badge',
  'core-talk': 'chat',
  'core-table': 'utensils',
  'core-screens': 'phone',
  'core-world': 'globe',
}

export default function Home() {
  const navigate = useNavigate()
  const completed = useProgress((s) => s.completed)
  const xp = useProgress((s) => s.xp)
  const avatarId = useProgress((s) => s.avatarId)
  const activeCourseId = useProgress((s) => s.activeCourseId)
  const currentCharge = useProgress((s) => s.currentCharge)
  const spendCharge = useProgress((s) => s.spendCharge)
  const openWorldMenu = useUI((s) => s.openWorldMenu)
  const openCharge = useUI((s) => s.openCharge)
  const held = useHeldPermissions()
  const unlimited = held.has('MANNERLY_PLUS') || held.has('FAMILY') || held.has('SCHOOL_LICENSE')
  const lvl = levelFor(xp)

  const activeChildId = useProfiles((s) => s.activeChildId)
  const children = useProfiles((s) => s.children)
  const accountName = useAccount((s) => s.account?.displayName)
  const learnerName = children.find((c) => c.id === activeChildId)?.name ?? accountName ?? null

  const course = COURSE_MAP[activeCourseId] ?? COURSE_MAP[DEFAULT_COURSE]
  const country = course.country ? COUNTRIES[course.country] : null
  const theme = country?.theme ?? 'var(--navy-600)'
  const units = course.unitIds.map((id) => UNIT_MAP[id]).filter(Boolean)

  const courseIds = useMemo(() => courseLessonIds(course.id), [course.id])
  const done = courseIds.filter((id) => completed[id]).length
  const pct = courseIds.length ? Math.round((done / courseIds.length) * 100) : 0

  const flat = useMemo(() => units.flatMap((u) => u!.lessonIds), [units])
  const currentIndex = useMemo(() => {
    const idx = flat.findIndex((id) => !completed[id])
    return idx === -1 ? flat.length : idx
  }, [flat, completed])

  const start = (id: string, locked: boolean) => {
    if (locked) { haptic('error'); return }
    if (!unlimited && currentCharge() <= 0) { haptic('error'); openCharge(); return }
    if (!unlimited) spendCharge()
    haptic('tap')
    navigate(`/lesson/${id}`)
  }

  let counter = -1

  return (
    <div className="screen has-tabbar">
      <Header
        left={
          <button className="world-switch" onClick={() => { haptic('tap'); openWorldMenu() }}>
            <span className="world-switch__flag">
              {country ? country.flag : <Icon name="globe" size={20} color="var(--navy-600)" />}
            </span>
            <span className="world-switch__name">{country ? country.name : 'Global Core'}</span>
            <Icon name="chevron-right" size={14} className="world-switch__chev" />
          </button>
        }
      />
      <div className="screen--padded" style={{ paddingTop: 12 }}>
        {/* greeting */}
        <div className="row" style={{ gap: 10, marginBottom: 12 }}>
          <Avatar id={avatarId} size={44} />
          <div>
            <div className="kicker">{learnerName ? `Welcome back, ${learnerName}` : 'Welcome back'}</div>
            <div style={{ fontWeight: 900, fontSize: 17 }}>Ready for today’s manner?</div>
          </div>
        </div>

        {/* themed world hero */}
        <motion.div
          className="world-hero"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ ['--theme' as string]: theme }}
        >
          <div className="world-hero__flag">
            {country ? country.flag : <Icon name="globe" size={34} color="#fff" />}
          </div>
          <div className="grow">
            <div className="world-hero__hello">{country ? country.hello : 'Everyday manners'}</div>
            <div className="world-hero__name">{course.title}</div>
            <div className="track" style={{ marginTop: 8 }}>
              <motion.div className="fill" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
            </div>
            <div className="kicker" style={{ marginTop: 6 }}>{done}/{courseIds.length} · {lvl.current.name}</div>
          </div>
          <div style={{ marginRight: -4 }}><Mascot color="teal" size={62} pose="cheer" /></div>
        </motion.div>

        {/* the path */}
        <div className="path">
          {units.map((unit) => (
            <div key={unit!.id} style={{ width: '100%' }}>
              <div className={`unit-band band-${unit!.color}`}>
                <span className="u-icon">
                  {UNIT_ICON[unit!.id] ? <Icon name={UNIT_ICON[unit!.id]} size={26} /> : unit!.icon}
                </span>
                <div>
                  <div className="u-title">{unit!.title}</div>
                  {unit!.subtitle && <div className="u-sub">{unit!.subtitle}</div>}
                </div>
              </div>

              {unit!.lessonIds.map((id) => {
                counter += 1
                const lesson = LESSON_MAP[id]
                const isDone = !!completed[id]
                const isCurrent = counter === currentIndex
                const locked = counter > currentIndex && !isDone
                const offset = ZIG[counter % ZIG.length]
                const cls = isDone ? 'node--done' : isCurrent ? 'node--current' : locked ? 'node--locked' : ''
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
                      <motion.span className="node__ring" animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.15, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
                    )}
                    <button className="node__btn" onClick={() => start(id, locked)} aria-label={lesson?.title ?? 'Lesson'}>
                      {isDone ? <Icon name="check" size={30} color="#fff" strokeWidth={2.6} />
                        : locked ? <Icon name="lock" size={24} />
                          : lesson?.icon}
                    </button>
                  </motion.div>
                )
              })}
            </div>
          ))}

          <motion.button
            className="btn btn--ghost"
            style={{ width: 'auto', marginTop: 18 }}
            onClick={() => { haptic('tap'); openWorldMenu() }}
            whileTap={{ scale: 0.97 }}
          >
            <Icon name="globe" size={18} /> Switch world
          </motion.button>
        </div>
      </div>
    </div>
  )
}
