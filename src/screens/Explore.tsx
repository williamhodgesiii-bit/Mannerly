import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import { COUNTRIES, REGIONS } from '@/data/countries'
import { COURSE_MAP } from '@/data/content'
import { useHeldPermissions } from '@/state/entitlements'
import { courseUnlocked } from '@/lib/entitlements'
import { haptic } from '@/lib/haptics'

export default function Explore() {
  const navigate = useNavigate()
  const held = useHeldPermissions()
  const withCountries = REGIONS.filter((r) => r.countries.length)
  const soon = REGIONS.filter((r) => !r.countries.length)

  const open = (courseId: string) => { haptic('tap'); navigate(`/course/${courseId}`) }

  return (
    <div className="screen has-tabbar">
      <Header title="Explore" />
      <div className="screen--padded" style={{ paddingTop: 14 }}>
        <p className="subtitle" style={{ marginBottom: 8 }}>
          Learn how the world says please, thank you & welcome.
        </p>

        {withCountries.map((region) => (
          <section key={region.id} style={{ marginTop: 18 }}>
            <div className="section-title">{region.emoji} {region.name}</div>
            <div className="stack" style={{ gap: 12 }}>
              {region.countries.map((code, i) => {
                const c = COUNTRIES[code]
                const course = COURSE_MAP[c.courseId]
                const unlocked = course ? courseUnlocked(course, held) : false
                return (
                  <motion.button
                    key={code}
                    className="tile"
                    onClick={() => open(c.courseId)}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="tile-flag">{c.flag}</span>
                    <div className="grow">
                      <div className="tile-name">{c.name}</div>
                      <div className="tile-sub">{c.blurb}</div>
                    </div>
                    {unlocked ? <span className="tile-go">›</span> : <span className="lock-pill">Manners+</span>}
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
