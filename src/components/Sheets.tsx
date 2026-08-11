import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '@/components/Icon'
import { CHARGE_MAX, useProgress } from '@/state/store'
import { useUI } from '@/state/ui'
import { useEntitlements, useHeldPermissions } from '@/state/entitlements'
import { courseUnlocked } from '@/lib/entitlements'
import { COURSE_MAP, courseLessonIds } from '@/data/content'
import { COUNTRIES, REGIONS } from '@/data/countries'
import { haptic } from '@/lib/haptics'

function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            className="sheet sheet--modal"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            exit={{ y: '110%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="sheet__grip" />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function fmt(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000))
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}

/* ---------- world switcher ---------- */
function WorldMenu() {
  const navigate = useNavigate()
  const open = useUI((s) => s.worldMenuOpen)
  const close = useUI((s) => s.closeWorldMenu)
  const active = useProgress((s) => s.activeCourseId)
  const completed = useProgress((s) => s.completed)
  const setActive = useProgress((s) => s.setActiveCourse)
  const held = useHeldPermissions()

  const progressOf = (courseId: string) => {
    const ids = courseLessonIds(courseId)
    return { done: ids.filter((id) => completed[id]).length, total: ids.length }
  }

  const pick = (courseId: string) => {
    const course = COURSE_MAP[courseId]
    if (!course) return
    if (!courseUnlocked(course, held)) { haptic('tap'); close(); navigate(`/course/${courseId}`); return }
    haptic('tap'); setActive(courseId); close(); navigate('/')
  }

  const core = COURSE_MAP['core']
  const coreProg = progressOf('core')

  return (
    <Sheet open={open} onClose={close}>
      <div className="sheet__title">Choose a world</div>
      <div className="world-list">
        {/* Global Core */}
        <button className={`world-row ${active === 'core' ? 'world-row--active' : ''}`} onClick={() => pick('core')}>
          <span className="world-flag"><Icon name="globe" size={26} color="var(--navy-600)" /></span>
          <div className="grow">
            <div className="world-name">{core?.title}</div>
            <div className="world-sub">{coreProg.done}/{coreProg.total} · free</div>
          </div>
          {active === 'core' ? <span className="world-tag world-tag--on">Active</span> : <Icon name="chevron-right" size={18} color="var(--muted)" />}
        </button>

        {REGIONS.filter((r) => r.countries.length).map((region) => (
          <div key={region.id}>
            <div className="world-region">{region.emoji} {region.name}</div>
            {region.countries.map((code) => {
              const c = COUNTRIES[code]
              const course = COURSE_MAP[c.courseId]
              if (!course) return null
              const unlocked = courseUnlocked(course, held)
              const p = progressOf(c.courseId)
              const isActive = c.courseId === active
              return (
                <button
                  key={code}
                  className={`world-row ${isActive ? 'world-row--active' : ''}`}
                  style={{ ['--theme' as string]: c.theme }}
                  onClick={() => pick(c.courseId)}
                >
                  <span className="world-flag world-flag--themed">{c.flag}</span>
                  <div className="grow">
                    <div className="world-name">{c.name}</div>
                    <div className="world-sub">{unlocked ? `${p.done}/${p.total} done` : c.blurb}</div>
                  </div>
                  {isActive ? <span className="world-tag world-tag--on">Active</span>
                    : unlocked ? <Icon name="chevron-right" size={18} color="var(--muted)" />
                      : <span className="lock-pill">Manners+</span>}
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <button className="sheet__later" onClick={close}>Close</button>
    </Sheet>
  )
}

/* ---------- charge ---------- */
function ChargeSheet() {
  const open = useUI((s) => s.chargeOpen)
  const close = useUI((s) => s.closeCharge)
  const currentCharge = useProgress((s) => s.currentCharge)
  const msToNext = useProgress((s) => s.msToNextCharge)
  const refill = useProgress((s) => s.refillCharge)
  const grant = useEntitlements((s) => s.grant)
  const held = useHeldPermissions()
  const unlimited = held.has('MANNERLY_PLUS') || held.has('FAMILY') || held.has('SCHOOL_LICENSE')
  const [, tick] = useState(0)

  useEffect(() => {
    if (!open) return
    const t = setInterval(() => tick((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [open])

  const charge = unlimited ? CHARGE_MAX : currentCharge()
  const next = msToNext()

  return (
    <Sheet open={open} onClose={close}>
      <div className="sheet__title"><Icon name="bolt" size={20} color="var(--gold-500)" /> Charge</div>
      <div className="bolts">
        {Array.from({ length: CHARGE_MAX }, (_, i) => (
          <span key={i} className={`bolt ${unlimited || i < charge ? 'bolt--on' : ''}`}>
            <Icon name="bolt" size={20} />
          </span>
        ))}
      </div>
      {unlimited ? (
        <p className="sheet__text">You have <b>unlimited</b> charge with your plan.</p>
      ) : charge >= CHARGE_MAX ? (
        <p className="sheet__text">Full charge. Go learn something!</p>
      ) : (
        <p className="sheet__text">Each lesson uses one bolt. Next in <b>{next != null ? fmt(next) : '—'}</b>.</p>
      )}
      {!unlimited && (
        <div className="stack" style={{ gap: 10, marginTop: 6 }}>
          <button className="btn btn--gold" onClick={() => { haptic('success'); refill() }}>Refill now</button>
          <button className="btn" onClick={() => { haptic('success'); grant('MANNERLY_PLUS', 'web'); close() }}>Go unlimited with Manners+</button>
        </div>
      )}
      <button className="sheet__later" onClick={close}>Close</button>
    </Sheet>
  )
}

/** Mount once (in App) so any screen can open these. */
export default function Sheets() {
  return (
    <>
      <WorldMenu />
      <ChargeSheet />
    </>
  )
}
