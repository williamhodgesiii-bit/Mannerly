import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Icon from '@/components/Icon'
import { COUNTRIES, REGIONS } from '@/data/countries'
import { COURSE_MAP, courseLessonIds } from '@/data/content'
import { useProgress } from '@/state/store'
import { useHeldPermissions } from '@/state/entitlements'
import { courseUnlocked } from '@/lib/entitlements'
import { haptic } from '@/lib/haptics'

export default function Explore() {
  const navigate = useNavigate()
  const held = useHeldPermissions()
  const completed = useProgress((s) => s.completed)
  const active = useProgress((s) => s.activeCourseId)
  const setActive = useProgress((s) => s.setActiveCourse)

  const withCountries = REGIONS.filter((r) => r.countries.length)
  const soon = REGIONS.filter((r) => !r.countries.length)

  const pick = (courseId: string) => {
    const course = COURSE_MAP[courseId]
    if (!course) return
    if (!courseUnlocked(course, held)) { haptic('tap'); navigate(`/course/${courseId}`); return }
    haptic('success')
    setActive(courseId)
    navigate('/')
  }

  const progressOf = (courseId: string) => {
    const ids = courseLessonIds(courseId)
    return { done: ids.filter((id) => completed[id]).length, total: ids.length }
  }

  return (
    <div className="screen has-tabbar">
      <Header title="Explore" />
      <div className="screen--padded" style={{ paddingTop: 14 }}>
        <p className="subtitle" style={{ marginBottom: 8 }}>
          Pick a world. Learn how it says please, thank you & welcome.
        </p>

        {withCountries.map((region) => (
          <section key={region.id} style={{ marginTop: 18 }}>
            <div className="section-title">{region.emoji} {region.name}</div>
            <div className="stack" style={{ gap: 12 }}>
              {region.countries.map((code, i) => {
                const c = COUNTRIES[code]
                const course = COURSE_MAP[c.courseId]
                const unlocked = course ? courseUnlocked(course, held) : false
                const isActive = c.courseId === active
                const p = progressOf(c.courseId)
                return (
                  <motion.button
                    key={code}
                    className={`tile tile--themed ${isActive ? 'tile--active' : ''}`}
                    style={{ ['--theme' as string]: c.theme }}
                    onClick={() => pick(c.courseId)}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="tile-flag tile-flag--themed">{c.flag}</span>
                    <div className="grow">
                      <div className="tile-name">{c.name}</div>
                      <div className="tile-sub">
                        {unlocked ? (p.done > 0 ? `${p.done}/${p.total} done` : c.blurb) : c.blurb}
                      </div>
                    </div>
                    {isActive ? <span className="chip chip--teal">Learning</span>
                      : unlocked ? <Icon name="chevron-right" size={20} color="var(--muted)" />
                        : <span className="lock-pill">Manners+</span>}
                  </motion.button>
                )
              })}
            </div>
          </section>
        ))}

        {soon.length > 0 && (
          <section style={{ marginTop: 22 }}>
            <div className="section-title">More coming soon</div>
            <div className="pill-row">
              {soon.map((r) => (
                <span key={r.id} className="chip chip--muted">{r.emoji} {r.name}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
