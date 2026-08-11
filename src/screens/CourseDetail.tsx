import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Mascot from '@/components/Mascot'
import Icon from '@/components/Icon'
import { COURSE_MAP, LESSON_MAP, UNIT_MAP } from '@/data/content'
import { COUNTRIES } from '@/data/countries'
import { useProgress } from '@/state/store'
import { useUI } from '@/state/ui'
import { useHeldPermissions } from '@/state/entitlements'
import { courseUnlocked, unlockHint } from '@/lib/entitlements'
import { haptic } from '@/lib/haptics'

export default function CourseDetail() {
  const { courseId = '' } = useParams()
  const navigate = useNavigate()
  const course = COURSE_MAP[courseId]
  const completed = useProgress((s) => s.completed)
  const activeCourseId = useProgress((s) => s.activeCourseId)
  const setActive = useProgress((s) => s.setActiveCourse)
  const currentCharge = useProgress((s) => s.currentCharge)
  const spendCharge = useProgress((s) => s.spendCharge)
  const openCharge = useUI((s) => s.openCharge)
  const held = useHeldPermissions()
  const unlimited = held.has('MANNERLY_PLUS') || held.has('FAMILY') || held.has('SCHOOL_LICENSE')

  if (!course) {
    return (
      <div className="screen screen--padded center">
        <p className="empty">Course not found.</p>
        <button className="btn" onClick={() => navigate('/explore')}>Explore</button>
      </div>
    )
  }

  const country = course.country ? COUNTRIES[course.country] : null
  const unlocked = courseUnlocked(course, held)
  let globalIdx = -1

  const open = (id: string, locked: boolean) => {
    if (locked) { haptic('error'); return }
    if (!unlimited && currentCharge() <= 0) { haptic('error'); openCharge(); return }
    if (!unlimited) spendCharge()
    haptic('tap')
    navigate(`/lesson/${id}`)
  }

  const learnThis = () => { haptic('success'); setActive(course.id); navigate('/') }

  return (
    <div className="screen has-tabbar">
      <Header back title={course.title} />
      <div className="screen--padded" style={{ paddingTop: 14 }}>
        {/* hero */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14, overflow: 'hidden' }}
        >
          <div style={{ fontSize: 46 }}>{course.icon}</div>
          <div className="grow">
            <div style={{ fontWeight: 900, fontSize: 20 }}>{country ? country.hello : 'Global Core'}</div>
            <div className="subtitle">{course.blurb}</div>
          </div>
          <Mascot color="teal" size={64} pose="wave" />
        </motion.div>

        {!unlocked && (
          <div className="card" style={{ padding: 14, marginTop: 12, display: 'flex', gap: 10, alignItems: 'center', background: 'var(--gold-100)', border: '1px solid var(--gold-400)' }}>
            <Icon name="star" size={20} color="var(--gold-600)" />
            <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--gold-600)' }}>
              First lesson free — {unlockHint(course).toLowerCase()}
            </span>
          </div>
        )}

        {unlocked && (
          activeCourseId === course.id ? (
            <div className="card" style={{ padding: 14, marginTop: 12, display: 'flex', gap: 10, alignItems: 'center', background: 'var(--teal-100)', border: '1px solid var(--teal-400)' }}>
              <Icon name="check-badge" size={20} color="var(--teal-600)" />
              <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--teal-600)' }}>You’re learning this world</span>
            </div>
          ) : (
            <button className="btn" style={{ marginTop: 12 }} onClick={learnThis}>
              <Icon name="learn" size={18} color="#fff" /> Learn this world
            </button>
          )
        )}

        {course.unitIds.map((uId) => {
          const unit = UNIT_MAP[uId]
          if (!unit) return null
          return (
            <section key={uId} style={{ marginTop: 18 }}>
              <div className="section-title">{unit.icon} {unit.title}</div>
              <div className="stack" style={{ gap: 12 }}>
                {unit.lessonIds.map((id) => {
                  globalIdx += 1
                  const lesson = LESSON_MAP[id]
                  const done = !!completed[id]
                  const locked = !unlocked && globalIdx > 0 && !done
                  return (
                    <motion.button
                      key={id}
                      className="tile"
                      onClick={() => open(id, locked)}
                      whileTap={{ scale: locked ? 1 : 0.98 }}
                      style={{ opacity: locked ? 0.7 : 1 }}
                    >
                      <span className="tile-flag" style={{ fontSize: 26 }}>
                        {done ? <Icon name="check" size={24} color="var(--teal-500)" strokeWidth={2.6} />
                          : locked ? <Icon name="lock" size={22} color="var(--muted)" />
                            : lesson?.icon}
                      </span>
                      <div className="grow">
                        <div className="tile-name">{lesson?.title}</div>
                        <div className="tile-sub">{lesson?.situation}</div>
                      </div>
                      {done ? <span className="chip chip--teal">Done</span>
                        : locked ? <span className="lock-pill">Manners+</span>
                          : <span className="tile-go">›</span>}
                    </motion.button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
